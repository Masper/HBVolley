class Ball {
	constructor(context, x, y) {
        this.context = context; 
		this.x = x;
		this.y = y;
		this.colour = BALL_COLOUR;
		this.radius = BALL_RADIUS; 
		this.vector = {dx: 0, dy:0};
        this.hitGround = 0;
        this._draw();
	}
	
	_bounce(x, vector, underneath) {
		let y = 1 + x;

		if (x > 0 ) {
			y = 1 - x;
		}

		let momentum = Math.abs(this.vector.dx) + Math.abs(this.vector.dy); 

		if (APPLY_FRICTION_BOUNCE) {
			this.vector.dx = momentum * -x * DUDE_FRICTION;
			this.vector.dy = momentum * y * DUDE_FRICTION;
		} 
		else {
			this.vector.dx = momentum * -x;
			this.vector.dy = momentum * y;
		}

		if (vector.dy > 0 ) {
			this.vector.dy += 1.6 * vector.dy; 
		}

		this.vector.dx += 1.2 * vector.dx;

		if (underneath) {
			this.vector.dy = Math.abs(this.vector.dy) * -1;
		}

		// accelerate ball more when speeds close together 
		if (vector.y > 0 && vector.y > this.vector.dy + 7 && !underneath) {
			this.vector.dy += 3;
		}
		if (vector.x > 0 && vector.x > this.vector.dx + 7) {
			this.vector.dx += 3;
		}
		if (vector.x < 0 && vector.x  < this.vector.dx - 7) {
			this.vector.dx += 3; 
		}
	}

	_bounceWithDirection(direction) {
		if (direction === DIRECTION.UP) {
			this.vector.dy = Math.abs(this.vector.dy);
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
		this.context.arc(this.x, HEIGHT - this.y, this.radius + 3, 0, 2 * Math.PI, false);
		this.context.fillStyle = '#000000';
		this.context.fill();

		this.context.beginPath();
		this.context.arc(this.x, HEIGHT - this.y, this.radius, 0, 2 * Math.PI, false);
		this.context.fillStyle = this.colour; 
		this.context.fill();
	}

	_maxSpeedCheck() {
		if (Math.abs(this.vector.dx) > MAX_SPEED_BALL) {
			if (this.vector.dx > 0) {
				this.vector.dx = MAX_SPEED_BALL;
			}
			else this.vector.dx = MAX_SPEED_BALL * -1;
		}

		if (Math.abs(this.vector.dy) > MAX_SPEED_BALL) {
			if (this.vector.dy > 0) {
				this.vector.dy = MAX_SPEED_BALL;
			}
			else this.vector.dy = MAX_SPEED_BALL * -1;
		}

		if ((Math.abs(this.vector.dy)+ Math.abs(this.vector.dx))*1.5 > MAX_SPEED_BALL) {
			this.vector.dy *= 0.8;
			this.vector.dx *= 0.8;
		}
	}

	calculatePosition() {
		if (this.x <= this.radius / 2) {
			this.x = this.radius / 2;
			this.vector.dx *= WALL_FRICTION;
		}

		if (this.x >= WIDTH - this.radius / 2) {
			this.x = WIDTH - this.radius / 2;
			this.vector.dx *= WALL_FRICTION;
		} 

		if (this.y <= this.radius) {
			this.hitGround += 1; 
			this.y = this.radius;
			this.vector.dy *= GROUND_FRICTION;
			this.vector.dx *= -1 * GROUND_FRICTION;
		}

		// Dampen the bouncing on the floor (not applicable for game)
		if (this.vector.dy < 1 && this.vector.dy > 0)  {
			this.vector.dy = 0;
		}

		this._maxSpeedCheck();

		this.x += this.vector.dx;
		this.y += this.vector.dy;
		this.vector.dy -= GRAVITY; 
	}	
}

class Dude {
	constructor(context, isPlayer) {
        this.context = context;
		this.isPlayer = isPlayer; 
		isPlayer ? this._initPlayer() : this._initEnemy();	
		this.vector = {dx: 0, dy:0};
		this.radius = DUDE_RADIUS;
		this.direction = DIRECTION.STOP;
		this._draw();
	}

	_initPlayer() {
		this.colour = DUDE_COLOUR;
		this.x = 1*WIDTH/4
	}

	_initEnemy() {
		this.colour = DEBUG_COLOUR; 
		this.x = 3*WIDTH/4
	}

	blessWithAi(ai) {
		this.AI = ai;
	}

	_draw() {		  
		this.context.beginPath();
		this.context.arc(this.x, HEIGHT - this.y  , this.radius+3,  Math.PI, 2 * Math.PI, false);
		this.context.fillStyle = '#000000';
		this.context.fill();

		this.context.beginPath();
      	this.context.arc(this.x, HEIGHT - this.y, this.radius ,  Math.PI, 2 * Math.PI, false);
      	this.context.fillStyle = this.colour; 
		this.context.fill();
	
		this.context.beginPath();
		this.context.moveTo(this.x - this.radius - 3, HEIGHT  - this.y - 1);
		this.context.lineTo(this.x + this.radius + 3, HEIGHT  - this.y - 1);
		this.context.lineWidth = 3;
		this.context.stroke();

		this._drawDudeEye();    
	}

	_drawDudeEye() {
		let k; 
		this.isPlayer ? k = 1 : k = -1; 
		this.context.beginPath();
       	this.context.arc(this.x + k * this.radius/3, HEIGHT - this.radius/1.8 - this.y, this.radius/6.9, 0, 2 * Math.PI, false);
		this.context.fillStyle = '#000000';
		this.context.fill();
		this._drawInnereye();
		this._drawBlink();
	}

	_drawBlink() {
		if (this.blink == 0 || !this.blink) {
			let a = Math.random();
			if (a < 0.001) {
				this.blink = 0.01;
                return;
            }
		}

		if (this.blink < 25 && this.blink > 0) {
			this.blink += 1.5; 
			let k; 
			this.isPlayer ? k = 1 : k = -1;
			this.context.beginPath();
			this.context.rect(this.x + k * this.radius/5.9,	HEIGHT - this.radius/1.4 - this.y, k * 30, this.blink);
			this.context.fillStyle = this.colour; 
			this.context.fill();
        }
        
		if (this.blink >= 25 ) {
			this.blink = 0; 
		}
	}

	_drawInnereye() {
		let k; 
		this.isPlayer ? k = 1 : k = -1; 

		// white
		this.context.beginPath();
		this.context.arc(this.x + k * this.radius/3, HEIGHT - this.radius/1.8- this.y, this.radius/8, 0, 2 * Math.PI, false);
		this.context.fillStyle = '#E4EBEC';
		this.context.fill();

        // blue
		this.context.beginPath();
		this.context.arc(this.x + this.amtlookright + k * this.radius/3, HEIGHT - this.radius/1.8- this.y - this.amtlookup, this.radius/17, 0, 2 * Math.PI, false);
		this.context.fillStyle = '#11D0F2';
		this.context.fill();

		// black
		this.context.beginPath();
		this.context.arc(this.x + this.amtlookright + k * this.radius/3, HEIGHT - this.radius/1.8- this.y - this.amtlookup, this.radius/26 * this.dilation, 0, 2 * Math.PI, false);
		this.context.fillStyle = '#000000';
		this.context.fill();
	}

	setDirection() {
		if (this.isPlayer) {
		kd.RIGHT.down = () => {
		this.direction = DIRECTION.RIGHT;
		}
		
		kd.RIGHT.up = () => {
		this.direction = DIRECTION.STOP;
		}

		kd.LEFT.down = () => {
		this.direction = DIRECTION.LEFT;
	   }

	   kd.LEFT.up = () => {
		this.direction = DIRECTION.STOP;
	   }

	   kd.UP.down = () => {
		   this._callJump(); 
	   }
	}

		if (!this.isPlayer && !this.AI) {
		kd.D.down = () => {
			this.direction = DIRECTION.RIGHT;
		}
			
		kd.D.up = () => {
			this.direction = DIRECTION.STOP;
		}
	
		kd.A.down = () => {
			this.direction = DIRECTION.LEFT;
		 }
	
		 kd.A.up = () => {
			this.direction = DIRECTION.STOP;
		 }

		 kd.W.down = () => {
			this._callJump(); 
		}
	   }
	}

	applyDirection() {
		if (this.direction === DIRECTION.LEFT) {
	
			this.vector.dx -= HORIZONTAL_MOMENTUM; 
			if (this.vector.dx * -1 > MAX_SPEED_DUDE) {
				this.vector.dx = -1 * MAX_SPEED_DUDE;
			}
		}
		else if (this.direction === DIRECTION.RIGHT) {

			this.vector.dx += HORIZONTAL_MOMENTUM; 
			if (this.vector.dx > MAX_SPEED_DUDE) {
				this.vector.dx = MAX_SPEED_DUDE;
			}
		}
		else if (this.direction === DIRECTION.STOP) {
			this.vector.dx = 0; 
		}
	}
	
	calculatePosition() {
		this.x += this.vector.dx;
		this.y += this.vector.dy;

		this._boundaryCheck();
		this._applyGravity(); 
		this._applyTicks();
	}

	_applyTicks() {
		if (this.vector.dx > 0) {
			this.vector.dx -= MOVEMENT_TICKS_SIZE; 
			if (this.vector.dx < 0) {
				this.vector.dx = 0; 
				this.direction = DIRECTION.STOP; 

			}
		}
		else if (this.vector.dx < 0) {
			this.vector.dx += MOVEMENT_TICKS_SIZE; 
			if (this.vector.dx > 0) {
				this.vector.dx = 0; 
				this.direction = DIRECTION.STOP; 
			}
		}
	}

	_callJump() {
		if (this.vector.dy == 0 || this.y == 0) {
			this.vector.dy = INITAL_JUMP_VELOCITY;
		}
	}

	aiMove(ballx, bally, ballvector) {
		let jump;
		let direction; 

		if (this.AI) {
			direction = this.AI.decideDirection(ballx, bally, this.x, this.y, ballvector);
			jump = this.AI.decideJump(ballx, bally, this.x, this.y, ballvector); 
		}
		if (jump) {
			this._callJump();
		}
		if (direction) {
			this.direction = direction; 
		}
	}

	_boundaryCheck() {
		if (this.isPlayer) {
			if (this.x >= WIDTH/2 - this.radius) {
				this.x = WIDTH/2 - this.radius;
			}
			if (this.x <= 0) {
				this.x = 0; 
			}
		}
		else {
			if (this.x <= WIDTH/2 + this.radius + WIDTH_BARRIER) {
				this.x = WIDTH/2 + this.radius + WIDTH_BARRIER;
			}
			if (this.x >= WIDTH) {
				this.x = WIDTH; 
			}
		}
	}

	_applyGravity() {	
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
        this.context = context;
		this.x = WIDTH / 2;
		this.y = HEIGHT - HEIGHT_BARRIER;
		this.height = HEIGHT_BARRIER; 
		this.width = WIDTH_BARRIER;
		this.colour = BARRIER_COLOUR; 
	}

	calculatePosition() {
	}

	_draw() {
		this.context.beginPath();
		this.context.fillStyle = this.colour; 
		this.context.fillRect(this.x, this.y, this.width, this.height);
      	this.context.stroke();
	}
}