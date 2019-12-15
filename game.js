const DIRECTION = {
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	STOP: 'STOP',
	UP: 'UP'
};

const MODE = {
	ONE_PLAYER_MODE: 'ONE_PLAYER_MODE',
	TWO_PLAYER_MODE: 'TWO_PLAYER_MODE'
}

const BALL_RADIUS = 15;
const DUDE_RADIUS = 70;

const BALL_COLOUR = '#FF5733'; 
const DUDE_COLOUR = '#f9e711';
const DEBUG_COLOUR = '#E116C0';
const BARRIER_COLOUR = '#AB5733'; 

const WIDTH = 750;
const HEIGHT = 500;

const MENU_FONT = "50px 'Lilita One";
const MENU_FONT_COLOUR = '#FFFF00'
const MENU_FONT_COLOUR_ACTIVE = '#E116C0';

const WIDTH_BARRIER = 5;
const HEIGHT_BARRIER = 125;

const FRAME_SPEED_MS = 8;
const STEP_DISTANCE_PX = 1;
const HORIZONTAL_MOMENTUM = 3; 
const MOVEMENT_TICKS = 10; 
const GRAVITY = 0.08;
const INITAL_JUMP_VELOCITY = 6; 

// Not all momentum is returned 
const GROUND_FRICTION = -0.86; 
const WALL_FRICTION = -1; 

class Ball {
	constructor(context, x, y) {
		this.x = x;
		this.y = y;
		this.context = context; 
		this.colour = BALL_COLOUR;
		this.radius = BALL_RADIUS; 
		this.vector = {dx: 0, dy:0};
		this._draw();
	}
	
	_bounce(x, vector) {
		let y = 1+x;

		if (x > 0 ) {
			y = 1-x;
		}

		let momentum = Math.abs(this.vector.dx) + Math.abs(this.vector.dy); 

		// No friction applied here
		this.vector.dx = momentum * -x;
		this.vector.dy = momentum * y;

		this.vector.dx += 0.1 * vector.dx;
		this.vector.dy += 0.1 * vector.dy; 
	}

	_bounceWithDirection(direction) {
		if (direction === DIRECTION.UP) {
			this.vector.dy *= -1; 
		}

		if (direction === DIRECTION.LEFT) {
			this.vector.dx = Math.abs(this.vector.dx)*-1;
		}

		if (direction === DIRECTION.RIGHT) {
			this.vector.dx = Math.abs(this.vector.dx);
		}
	}

	_draw() {
		this.context.beginPath();
		this.context.arc(this.x, HEIGHT - this.y, this.radius, 0, 2 * Math.PI, false);
		this.context.fillStyle = this.colour; 
		this.context.fill();
	}

	_calculatePosition() {
		if (this.x <= this.radius / 2) {
			this.x = this.radius / 2;
			this.vector.dx *= WALL_FRICTION;
		}

		if (this.x > WIDTH - this.radius/2) {
			this.x = WIDTH - this.radius/2;
			this.vector.dx *= WALL_FRICTION;
		} 

		if (this.y <= this.radius ) {
			this.y = this.radius ;
			this.vector.dy *= GROUND_FRICTION;
			this.vector.dx *= -1 * GROUND_FRICTION;
		}

		// Dampen the bouncing
		if (this.vector.dy < 1 && this.vector.dy > 0)  {
			this.vector.dy = 0;
		}

		this.x += this.vector.dx;
		this.y += this.vector.dy;
		this.vector.dy -= GRAVITY; 
	}	
}

class Dude {
	constructor(context, isPlayer) {
		this.isPlayer = isPlayer; 
		isPlayer ? this._initPlayer() : this._initEnemy();	
		this.vector = {dx: 0, dy:0};
		this.context = context;
		this.radius = DUDE_RADIUS;
		this._draw();
	}

	_initPlayer() {
		this.colour = DUDE_COLOUR;
		this.x = WIDTH * 1/3
	}

	_initEnemy() {
		this.colour = DEBUG_COLOUR; 
		this.x = WIDTH * 2/3;
	}

	_draw() {
		this.context.beginPath();
      	this.context.arc(this.x, HEIGHT - this.y, this.radius,  Math.PI, 2 * Math.PI, false);
      	this.context.fillStyle = this.colour; 
      	this.context.fill();
		this._drawDudeEye();    
	}

	_drawDudeEye() {
		this.context.beginPath();
		if (this.isPlayer) {
      	this.context.arc(this.state === DIRECTION.LEFT ? this.x - this.radius/3: this.x + this.radius/3, HEIGHT - this.radius/1.8- this.y, this.radius/9, 0, 2 * Math.PI, false);
		}
		else{
			this.context.arc(this.state === DIRECTION.RIGHT ? this.x + this.radius/3: this.x - this.radius/3, HEIGHT - this.radius/1.8- this.y, this.radius/9, 0, 2 * Math.PI, false);

		}
		  this.context.fillStyle = '#000000';
      	this.context.fill();
	}

	_goDirection(direction) {
		if (this.state === direction) {
			this.ticks += MOVEMENT_TICKS;
		}
		else {
			this.ticks = MOVEMENT_TICKS;
		}

		this.state = direction; 
	}

	_callJump() {
		this.jumpCall = true; 
	}

	_calculatePosition() {
		if (this.zombie) {
			return; 
		}
		if (this.state === DIRECTION.LEFT) {
			if (this.vector.dy == 0) {
				this.ticks -= 1;
			}
			this.vector.dx = -1 * HORIZONTAL_MOMENTUM;
		}
		else if (this.state === DIRECTION.RIGHT) {
			if (this.vector.dy == 0) {
				this.ticks -= 1;
			}
			this.vector.dx = 1 * HORIZONTAL_MOMENTUM;
		}

		if (this.ticks == 0) {
			this.state = DIRECTION.STOP;
			this.vector.dx = 0;
		}

		if (this.jumpCall) {
			this.jumpCall = false; 
			if (this.vector.dy == 0 || this.y == 0) {
				this.vector.dy = INITAL_JUMP_VELOCITY;
			} 
		}

		this.x += this.vector.dx;
		this.y += this.vector.dy;

		if (this.isPlayer) {
			if (this.x >= WIDTH/2 - this.radius) {
				this.x = WIDTH/2 - this.radius;
			}
			if (this.x <= 0) {
				this.x = 0; 
			}
		}
		else {
			if (this.x <= WIDTH/2 + this.radius) {
				this.x = WIDTH/2 + this.radius;
			}
			if (this.x >= WIDTH) {
				this.x = WIDTH; 
			}
		}

		if (this.y >= 0) {
			this.vector.dy -= GRAVITY; 
		}
		else {
			this.vector.dy = 0; 
			this.y = 0;
		}
	}

}

class Obstacle {
	constructor(context) {
		this.x = WIDTH/2;
		this.y = HEIGHT - HEIGHT_BARRIER;
		this.height = HEIGHT_BARRIER; 
		this.width = WIDTH_BARRIER;
		this.context = context;
		this.colour = BARRIER_COLOUR; 
	}

	_calculatePosition() {
	}

	_draw() {
		this.context.beginPath();
		this.context.fillStyle = this.colour; 
		this.context.fillRect(this.x, this.y, this.width, this.height);
      	this.context.stroke();
	}
}

class Menu {
	constructor (context, ioConnection) {
		this.ioConnection = ioConnection;
		this.context = context; 
		this.show = true; 
		this.menuFont = MENU_FONT; 
		this.items = [];
		// because the font won't always load
		setTimeout(() => this._openingVisual(), 1000);
		this._setControls();

	}

	_drawMenuItems() {
		this.context.clearRect(0, 0, WIDTH, HEIGHT);
		this.context.font = MENU_FONT;
		console.log("here" + this.items.length);

		for (let i = 0; i < this.items.length; i++) {	
			let item = this.items[i];
			if (item.active) {
				this.context.fillStyle = MENU_FONT_COLOUR_ACTIVE;
			}
			else {
				this.context.fillStyle = MENU_FONT_COLOUR;
			}
	
			this.context.fillText(item.text, WIDTH * 0.3, HEIGHT * item.location); 
		}
	}

	_setControls() {
		window.onkeydown = event => {
			if (event.key === 'ArrowDown') {
				this._changeActive(DIRECTION.UP)
			} else if (event.key === 'ArrowUp') {
				this._changeActive(DIRECTION.DOWN); 
			} else if (event.key === 'Enter') {
			this._startGame();
			}
		}
	}

	_startGame() {
		// should be callback for gamerunner
		let game = new Game(this.context, this.ioConnection);
		game.run();
	}

	_changeActive(direction) {
		let active = this.items.find(e => e.active);
		let index = this.items.indexOf(active);
		this.items.forEach(e => e.active = false);

		direction === DIRECTION.UP ? index +=1 : index -=1; 

		if (index < 0) {
			index = this.items.length-1;
		}
		if (index == this.items.length) {
			index = 0;
		}

		this.items[index].active = true; 
		this._drawMenuItems();
		}

	_openingVisual() { 
		this.context.clearRect(0, 0, WIDTH, HEIGHT);
		this.items.push(
			{
			'text' : 'SINGLE PLAYER GAME',
			'location' : 0.3,
			'active' :  true
		  }
		)
		this.items.push(
			{
			'text' : 'TWO PLAYER GAME',
			'location' :0.5,
			'active' : false
			}
		)

		this._drawMenuItems();
	}
}

class GameRunner {	
	constructor(ioConnection) {
		this._initCanvas();
		// reference to IO because no callback yet
		this.menu = new Menu(this.context, ioConnection);
		//this.game = new Game(this.context, ioConnection); 
	}

	_initCanvas() {
		const canvas = document.getElementsByTagName('canvas')[0];
		canvas.width = WIDTH;
  		canvas.height = HEIGHT;
  		this.context = canvas.getContext('2d');
	}

	run() {

	}

}


class Game {

	constructor(context, IOConnection) {
		this.context = context; 
		this.menu = new Menu(this.context);
		this.receivingTransmission = false;
		this._addIOConnection(IOConnection); 
		this.mode = MODE.TWO_PLAYER_MODE; 
		this._initGameObjects() 
		this._setControls();
	}

	_addIOConnection(IOConnection) {
		this.IOConnection = IOConnection;
		this.receivingTransmission = true;
	}

	_initGameObjects() {
		this.gameObjects = [];
		this.gameObjects.push(new Ball(this.context, 250, 500));
		this.gameObjects.push(new Dude(this.context, true));
		this.gameObjects.push(new Obstacle(this.context));
		this.gameObjects.push(new Dude(this.context, false))
	}

	_dude2() {
		return this.gameObjects[3];
	}

	_dude() {
		return this.gameObjects[1];
	}

	_ball() {
		return this.gameObjects[0];
	}

	_obstacle() {
		return this.gameObjects[2];
	}

	_setControls() {
		window.onkeydown = event => {
			let dude = this._dude();
			let dude2 = this._dude2();
			if (event.key === 'ArrowRight') {
				dude._goDirection(DIRECTION.RIGHT);
			} else if (event.key === 'ArrowLeft') {
				dude._goDirection(DIRECTION.LEFT);
			} else if (event.key === 'ArrowUp') {
				dude._callJump(); 
			} else if (event.key === 'd' && this.mode === MODE.TWO_PLAYER_MODE) {
				dude2._goDirection(DIRECTION.RIGHT);
			} else if (event.key === 'w' && this.mode === MODE.TWO_PLAYER_MODE) {
				dude2._callJump();
			} else if (event.key === 'a' && this.mode === MODE.TWO_PLAYER_MODE) {
				dude2._goDirection(DIRECTION.LEFT);
			}
		}
	}

	_detectCollisionBarrier() {
		// Le copy-paste stack

		let circle={
			x:this._ball().x,
			y:this._ball().y,
			r:this._ball().radius
		}
		let rect={
			x:this._obstacle().x,
			y:0,
			w:this._obstacle().width,
			h:this._obstacle().height
		}

		if(circle.x >= (rect.x - circle.r) && circle.x <= (rect.x + rect.w + circle.r) && circle.y >=  (rect.y - circle.r) && circle.y <= rect.y + rect.h + circle.r) {
			return true;
		}
	}

	_transmitStatesBallAndDude() {
		let ball = {
			"name" : 'ball',
			"x" : this._ball().x,
			"y" : this._ball().y
		}

		let dude = {
			"name" : "dude",
			"x" : this._dude().x,
			"y" : this._dude().y
		}

		this.IOConnection.transmit(ball);
		this.IOConnection.transmit(dude);
	}

	_detectCollisionBallDudes() {
		// Is based on a sphere dude

		let dudes = []
		dudes.push(this._dude());
		dudes.push(this._dude2());
		let ball = this._ball(); 

		for (let i = 0; i<dudes.length; i++) {	
			let dude = dudes[i];
			let dx = dude.x - ball.x;
			let dy = dude.y - ball.y;
			let distance = Math.sqrt(dx * dx + dy * dy);
	
			if (distance < dude.radius + ball.radius) {
				let dx = (dude.x - ball.x) / (dude.radius + ball.radius);
				ball._bounce(dx, dude.vector);
			}
		}
	}

	_detectCollisionBallObstacle() {
		let ball = this._ball();  
		let obstacle = this._obstacle();

		if (this._detectCollisionBarrier()) {

			if (ball.y > obstacle.y) {
				ball._bounceWithDirection(DIRECTION.UP);
			}

			if (ball.x < obstacle.x) {
				ball._bounceWithDirection(DIRECTION.LEFT);
			}

			if (ball.x > obstacle.x) {
				ball._bounceWithDirection(DIRECTION.RIGHT);
			}
		}
	}

	_detectCollision() {
		this._detectCollisionBallDudes();
		this._detectCollisionBallObstacle();	
}
			
	_calculateReflection() {
		let dx = (this._dude().x - this._ball().x) / (this._dude().radius + this._ball().radius);
		this._ball()._bounce(dx, this._dude().vector);
	}

	_receiveStateDude2() {
		if (this.receivingTransmission) {
			let transmission =  this.IOConnection.getInput();
			if (transmission != null) {
				this._dude2().x = 2/3 * transmission.x;
				this._dude2().y = transmission.y;
			}
		}		
	}

	run() {
		setInterval(() => {
			this._detectCollision();
			this.gameObjects.forEach(a => a._calculatePosition());
			if (this.IOConnection) {
				this._transmitStatesBallAndDude(); 
				this._receiveStateDude2();	
			}
			this.context.clearRect(0, 0, WIDTH, HEIGHT);	
			this.gameObjects.forEach(a => a._draw());
		}, FRAME_SPEED_MS);
	}

}