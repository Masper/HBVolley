const IP_ADDRESS = 'http://127.0.0.1'
const PORT = '3000'

class IOConnection {

	constructor() {
		this.playerId;
		this.stack = [];
	}

	connect() {
		this.socket = io.connect(IP_ADDRESS + ":" + PORT);
		this.socket.on('connect', this.onConnect);
		this.socket.on('message', this.onMessage);
	}

	onMessage(message) {
		console.log(message); 
	}

	joinRoom() {
		this.socket.emit('joined');
	}

	onConnect = (socket) => {
		console.log("IO connected...")
	}
}   