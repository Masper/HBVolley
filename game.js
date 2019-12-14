const STATES = {
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	STOP: 'STOP'
};

const BALL_RADIUS = 25;
const DUDE_RADIUS = 100;

const WIDTH = 750;
const HEIGHT = 500;

const FRAME_SPEED_MS = 10;
const STEP_DISTANCE_PX = 5;

class Ball {

	constructor(context, x, y) {
		this.x = x;
		this.y = y;
		this.context = context; 
		this._drawBall();
	}
	
	_drawBall() {
		this.context.beginPath();
		this.context.arc(this.x, HEIGHT - this.y, BALL_RADIUS, 0, 2 * Math.PI, false);
		this.context.fillStyle = '#FF5733';
		this.context.fill();
	}

	_calculatePosition() {
		this.y -= STEP_DISTANCE_PX;
	}
}

class Dude {

	constructor(context) {
		this.x = 250;
		this.y = 0;
		this.state = STATES.STOP;
		this.jumping = false;
		this.goingUp = false;
		this.context = context;
		this.colour = '#f9e711';
		this._drawDude();
	}

	_drawDude() {
		this.context.beginPath();
      	this.context.arc(this.x, HEIGHT - this.y, DUDE_RADIUS,  Math.PI, 2 * Math.PI, false);
      	this.context.fillStyle = this.colour; 
      	this.context.fill();
		this._drawDudeEye();    
	}

	_drawDudeEye() {
		this.context.beginPath();
      	this.context.arc(this.state === STATES.LEFT ? this.x - 30 : this.x + 30, HEIGHT - 60 - this.y, 16, 0, 2 * Math.PI, false);
      	this.context.fillStyle = '#000000';
      	this.context.fill();
	}

	_calculatePosition() {
		if (this.jumping && this.y === 0) {
			this.y += STEP_DISTANCE_PX;
		} else if (this.jumping && this.goingUp) {
			if (this.y < 100) {
				this.y += STEP_DISTANCE_PX;
			} else {
				this.goingUp = false;
				this.y -= STEP_DISTANCE_PX;
			}
		} else if (this.jumping && !this.goingUp) {
			if (this.y > 0) {
				this.y -= 10;
			} else {
				this.jumping = false;
			}
		}

		if (this.state === STATES.RIGHT && this.x < WIDTH) {
			this.x += STEP_DISTANCE_PX;
		} else if (this.state === STATES.LEFT && this.x > 0) {
			this.x -= STEP_DISTANCE_PX;
		}
	}
}

class Game {

	constructor() {
		this._initCanvas();
		this.ball = new Ball(this.context, 250, 500);
		this.dude = new Dude(this.context);
  		this._setControls();
	}

	_initCanvas() {
		const canvas = document.getElementsByTagName('canvas')[0];
  		canvas.width = WIDTH;
  		canvas.height = HEIGHT;
  		this.context = canvas.getContext('2d');
	}

	_setControls() {
		window.onkeydown = event => {
			if (event.key === 'ArrowRight') {
				this.dude.state = STATES.RIGHT;
			} else if (event.key === 'ArrowLeft') {
				this.dude.state = STATES.LEFT;
			} else if (event.key === 'ArrowUp') {
				this.dude.jumping = true;
				this.dude.goingUp = true;
			} else {
				this.dude.state = STATES.STOP;
			}
		}
	}

	_detectCollision() {
	var dx = this.dude.x - this.ball.x;
	var dy = this.dude.y - this.ball.y;
	var distance = Math.sqrt(dx * dx + dy * dy);

	if (distance < DUDE_RADIUS + BALL_RADIUS) {
 	 	  this.dude.colour = '#8FFF00';
		}
	}
			
	run() {
		setInterval(() => {
			this.dude._calculatePosition();
			this.ball._calculatePosition(); 	
			this._detectCollision()	
			this.context.clearRect(0, 0, WIDTH, HEIGHT);
			this.dude._drawDude();
			this.ball._drawBall();
		}, FRAME_SPEED_MS);
	}

}