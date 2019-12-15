const IP_ADDRESS = 'http://127.0.0.1'
const PORT = '3000'

class IOConnection {

	constructor() {
		this.socket = io.connect(IP_ADDRESS + ":" + PORT);
		this.socket.on('connect', this.onConnect);
		this.socket.on('message', this.onMessage)
	}

	onMessage = (message) => {
		console.log("Message received: " + message);
	}

	onConnect = (event) => {
		this.doSend("Hi servert..");
	}
	
	doSend(message) {
		this.socket.emit('message', message);
	}

	transmit(object) {
		this.socket.emit(object.name,{'x' : object.x, 'y' : object.y});
	}
}   