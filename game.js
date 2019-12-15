const DIRECTION = {
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	STOP: 'STOP'
};

const BALL_RADIUS = 15;
const DUDE_RADIUS = 70;

const BALL_COLOUR = '#FF5733'; 
const DUDE_COLOUR = '#f9e711';
const DEBUG_COLOUR = '#E116C0';
const BARRIER_COLOUR = '#AB5733'; 

const WIDTH = 750;
const HEIGHT = 500;

const WIDTH_BARRIER = 5;
const HEIGHT_BARRIER = 125;

const FRAME_SPEED_MS = 8;
const STEP_DISTANCE_PX = 1;
const HORIZONTAL_MOMENTUM = 4; 
const MOVEMENT_TICKS = 35; 
const GRAVITY = 0.08;
const INITAL_JUMP_VELOCITY = 6; 

// Not all momentum is returned 
const GROUND_FRICTION = -0.86; 
const WALL_FRICTION = -1; 

class Ball {

	constructor(context, x, y) {
		this.x = x;
		this.y = y;
		this.vector = {x: 0, y:0};
		this.context = context; 
		this.colour = BALL_COLOUR;
		this.radius = BALL_RADIUS; 
		this._draw();
	}
	
	_bounce(x, vector) {
		let y = 1+x;

		if (x > 0 ) {
			y = 1-x;
		}

		let momentum = Math.abs(this.vector.x) + Math.abs(this.vector.y); 

		// No friction applied here
		this.vector.x = momentum * -x;
		this.vector.y = momentum * y;

		this.vector.x += 0.1 * vector.x;
		this.vector.y += 0.1 * vector.y; 
	}

	_reverse(withBounce) {
		this.vector.x *= WALL_FRICTION; 
		if (withBounce) {
			this.vector.y *= WALL_FRICTION;
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
			this.vector.x *= WALL_FRICTION;
		}

		if (this.x > WIDTH - this.radius/2) {
			this.x = WIDTH - this.radius/2;
			this.vector.x *= WALL_FRICTION;
		} 

		if (this.y <= this.radius ) {
			this.y = this.radius ;
			this.vector.y *= GROUND_FRICTION;
			this.vector.x *= -1 * GROUND_FRICTION;
		}

		// Dampen the bouncing
		if (this.vector.y < 1 && this.vector.y > 0)  {
			this.vector.y = 0;
		}

		this.x += this.vector.x;
		this.y += this.vector.y;
		this.vector.y -= GRAVITY; 
	}	
}

class Dude {

	constructor(context) {
		this.x = 250;
		this.y = 0;
		this.vector = {x: 0, y:0};
		this.context = context;
		this.colour = DUDE_COLOUR;
		this.radius = DUDE_RADIUS;
		this._draw();
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
      	this.context.arc(this.state === DIRECTION.LEFT ? this.x - this.radius/3: this.x + this.radius/3, HEIGHT - this.radius/1.8- this.y, this.radius/9, 0, 2 * Math.PI, false);
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
		if (this.state === DIRECTION.LEFT) {
			if (this.vector.y == 0) {
				this.ticks -= 1;
			}
			this.vector.x = -1 * HORIZONTAL_MOMENTUM;
		}
		else if (this.state === DIRECTION.RIGHT) {
			if (this.vector.y == 0) {
				this.ticks -= 1;
			}
			this.vector.x = 1 * HORIZONTAL_MOMENTUM;
		}

		if (this.ticks == 0) {
			this.state = DIRECTION.STOP;
			this.vector.x = 0;
		}

		if (this.jumpCall) {
			this.jumpCall = false; 
			if (this.vector.y == 0 || this.y == 0) {
				this.vector.y = INITAL_JUMP_VELOCITY;
			} 
		}

		this.x += this.vector.x;
		this.y += this.vector.y;

		if (this.x <= 0) {
			this.x = 0;
		} 

		if (this.x >= WIDTH) {
			this.x = WIDTH;
		}

		if (this.y >= 0) {
			this.vector.y -= GRAVITY; 
		}
		else {
			this.vector.y = 0; 
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


class Game {

	constructor(IOConnection) {
		this._initCanvas();
		this._addIOConnection(IOConnection); 
		this._initGameObjects() 
  		this._setControls();
	}

	_initCanvas() {
		const canvas = document.getElementsByTagName('canvas')[0];
		canvas.width = WIDTH;
  		canvas.height = HEIGHT;
  		this.context = canvas.getContext('2d');
	}

	_addIOConnection(IOConnection) {
		this.IOConnection = IOConnection;
	}

	_initGameObjects() {
		this.gameObjects = [];
		this.gameObjects.push(new Ball(this.context, 250, 500));
		this.gameObjects.push(new Dude(this.context));
		this.gameObjects.push(new Obstacle(this.context));
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
			if (event.key === 'ArrowRight') {
				this._dude()._goDirection(DIRECTION.RIGHT);
			} else if (event.key === 'ArrowLeft') {
				this._dude()._goDirection(DIRECTION.LEFT);
			} else if (event.key === 'ArrowUp') {
				this._dude()._callJump(); 
			} 
		}
	}

	_detectCollisionBarrier(){
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

	_transmitGameState() {
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

	_detectCollision() {
		let dx = this._dude().x - this._ball().x;
		let dy = this._dude().y - this._ball().y;
		let distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < this._dude().radius + this._ball().radius) {
				this._calculateReflection();
		}
		
		if (this._detectCollisionBarrier()) {
			let withBounce = false;

			if (this._ball().y > this._obstacle().y + 0.8*this._ball().radius) {
				withBounce = true; 
			}

			this._ball()._reverse(withBounce);
		}	
	}
			
	_calculateReflection() {
		let dx = (this._dude().x - this._ball().x) / (this._dude().radius + this._ball().radius);
		this._ball()._bounce(dx, this._dude().vector);
	}

	run() {
		setInterval(() => {
			this._detectCollision();
			this.gameObjects.forEach(a => a._calculatePosition());
			this.context.clearRect(0, 0, WIDTH, HEIGHT);	
			this.gameObjects.forEach(a => a._draw());
			this._transmitGameState(); 
		}, FRAME_SPEED_MS);
	}

}