// PiKBD webapp

// TODO - Parse language from URL
const LANGUAGE = 'russian'

const password = prompt('Enter host password:')
const socket = io()

const toggle = document.querySelector('h1')
const tip = document.querySelector('#tip')

toggle.onclick = () => {
    // Toggle caps

    toggle.classList.toggle('on')
    for (const key of document.querySelectorAll('p')) {
        [key.innerHTML, key.dataset.alt] = 
        [key.dataset.alt, key.innerHTML]
    }
}

const close_tips = () => {
    for (const key of document.querySelectorAll('.key'))
        key.classList.remove('touch')
}

fetch(LANGUAGE + '.kbd').then(async response => {
    // Build keyboard

    for (const line of (await response.text()).split('\n')) {

        const [content, pron] = line.split('|')
        const [letter, ...variants] = content.trim().split(/\s+/).map(t => t.split(','))

        // Create key
        const wrap = document.createElement('div')
        wrap.classList.add('key')

        let variants_html = ''
        for (const letter of variants)
            variants_html += `<p data-alt="${letter[0]}">${letter[1]}</p>`
        
        wrap.innerHTML = `
            <p data-alt="${letter[0]}" data-p="${pron.trim()}">${letter[1]}</p>
            <div class="tip">
                <p data-alt="${letter[0]}" data-p="${pron.trim()}">${letter[1]}</p>
                ${variants_html}
            </div>
        `

        document.body.appendChild(wrap)
    }

    // Bind keys
    for (const key of document.querySelectorAll('p')) {key.onclick = () => {

        // Lazy touch gesture implementation
        if (key.parentElement.parentElement === document.body)
            return close_tips() || key.parentElement.classList.toggle('touch')

        // Send key event
        socket.send(password + '|' + key.innerHTML)
        close_tips()
    }}
})