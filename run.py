import flask
import secrets
import keyboard
import pyperclip
import flask_socketio
import socket as soap

# Settings
PORT = 5000
PWD_BYTES = 2

# Load app
app = flask.Flask(__name__, static_folder = 'app/', static_url_path = '')
password = secrets.token_hex(PWD_BYTES).upper()
socket = flask_socketio.SocketIO(app)

@app.route('/')
def serve():
    return flask.send_file('app/index.html')

@socket.on('message')
def handle(message):
    token, key = message.split('|')

    if token.upper() != password:
        print('Invalid token received:', message)

    print('Pressing:', key)
    pyperclip.copy(key)
    keyboard.press_and_release('ctrl+v')

# Get local IP
conn = soap.socket(soap.AF_INET, soap.SOCK_DGRAM)
conn.connect(('1.1.1.1', 80))
ip = conn.getsockname()[0]
conn.close()

print(f'┌ mKBD 0.1')
print(f'│ Running on \x1b[2m{ip}:{PORT}\x1b[0m')
print(f'│ Password: \x1b[2m{password}\x1b[0m')
print(f'└ Press Ctrl+C to shut down')

socket.run(app, '0.0.0.0', PORT, debug = False)

# EOF