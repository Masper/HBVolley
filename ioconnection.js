const IP_ADDRESS = 'http://127.0.0.1'
const PORT = '3000'

class IOConnection {

	constructor() {
		this.playerId;
	}

	connect() {
		this.socket = io.connect(IP_ADDRESS + ":" + PORT);
		this.socket.on('connect', this.onConnect);
		this.socket.on('welcome', this.onWelcome);
		this.socket.on('startgame', this.onStart);
		this.stack = [];
	}

	onWelcome = (data) => {
		console.log(data.message + " | " + data.id + "position " + data.position); 
		this.socket.emit('i am client', {data: 'foo!', id: data.id});
		this.playerId = data.id; 
	}

	sendReady = (callback) => {
		channel = 'ready' + this.playerId; 
		console.log("channel");
		this.socket.emit(channel, "yes!");
		this.callback = callback;
		callback("yo");
	}

	getRoom = (number, callback) => {
		this.callback = callback; 
	}

	onStart = (data) => {
		console.log("datga");
		this.callback("GOGOGOGO");
	}

	onConnect = (event) => {
		console.log("IO connected...")
	}
}   