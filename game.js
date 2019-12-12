const STATES = {
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	STOP: 'STOP'
};

const WIDTH = 750;
const HEIGHT = 500;

const FRAME_SPEED_MS = 10;
const STEP_DISTANCE_PX = 5;

class Game {

	constructor() {
  		this.state = STATES.STOP;
  		this.x = 0;
  		this.y = 0;
  		this.jumping = false;
  		this.goingUp = false;
		this._initCanvas();
  		this._setControls();
  		this._drawDude(0);
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
				this.state = STATES.RIGHT;
			} else if (event.key === 'ArrowLeft') {
				this.state = STATES.LEFT;
			} else if (event.key === 'ArrowUp') {
				this.jumping = true;
				this.goingUp = true;
			} else {
				this.state = STATES.STOP;
			}
		}
	}
			
	_drawDude() {
		this.context.beginPath();
      	this.context.arc(this.x, HEIGHT - this.y, 100, Math.PI, 2 * Math.PI, false);
      	this.context.fillStyle = '#f9e711';
      	this.context.fill();
		this._drawDudeEye();    
	}

	_drawDudeEye() {
		this.context.beginPath();
      	this.context.arc(this.state === STATES.LEFT ? this.x - 30 : this.x + 30, HEIGHT - 60 - this.y, 16, 0, 2 * Math.PI, false);
      	this.context.fillStyle = '#000000';
      	this.context.fill();
	}

	run() {
		setInterval(() => {
			this.context.clearRect(0, 0, WIDTH, HEIGHT);

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

			this._drawDude();
		}, FRAME_SPEED_MS);
	}

}