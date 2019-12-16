const IP_ADDRESS = 'http://127.0.0.1'
const PORT = '3000'

class IOConnection {

	constructor() {
	}

	connect() {
		this.socket = io.connect(IP_ADDRESS + ":" + PORT);
		this.socket.on('connect', this.onConnect);
		this.socket.on('message', this.onMessage);
		this.socket.on('dude', this.onDude);
		this.stack = [];
	}

	onMessage = (message) => {
		console.log("Message received: " + message);
	}

	onConnect = (event) => {
		this.doSend("Hi servert..");
	}

	onDude = (message) => {
		this.stack.push(message);
	}

	getInput = () => {
		if (this.stack.length == 0) {
			return null; 
		}
		return this.stack.pop();
	}
	
	doSend(message) {
		this.socket.emit('message', message);
	}

	transmit(object) {
		this.socket.emit(object.name,{'x' : object.x, 'y' : object.y});
	}
}   