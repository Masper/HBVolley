class GameObject {
	constructor(context, x,y) {
		this.x = x;
		this.y = y; 
		this.vector = {dx: 0, dy:0};
		this.context = context; 
	}
}

class GameObjectBuilder {
	constructor(context) {
		this.context = context; 
	}

	setX(x) {
		this.x = x;
		return this; 
	}

	setY(y) {
		this.y = y; 
		return this; 
	}

	setType(type) {
		this.type = type; 
		return this; 
	}

	setIsHuman(isHuman) {
		this.isHuman = isHuman;
		return this; 
	}

	setIsLeft(isLeft) {
		this.isLeft = isLeft; 
		return this; 
	}
	
	setControls(controls) {
		this.controls = controls; 
		return this; 
	}

	setAi(ai) {
		this.ai = ai; 
		return this; 
	}

	build() {
		var gameObject;

		if (this.type === GAMEOBJECT.BALL) {
			gameObject = (new Ball(this.context, this.x,this.y));

			Object.assign(gameObject, ballDrawLogic);
			Object.assign(gameObject, ballMovement);
		} 
		
		else if (this.type === GAMEOBJECT.DUDE) {
			gameObject = new Dude(this.context, this.x,this.y, this.isLeft);

			Object.assign(gameObject, dudeDrawLogic);
			Object.assign(gameObject, dudeMovement);

			if (this.isHuman) {
				if (this.isLeft) {
					Object.assign(gameObject, controls.LEFT);
				} else {
					Object.assign(gameObject, controls.RIGHT); 
				}
			} else {
				gameObject.setAi(this.ai);
			}		
		}
		
		else if (this.type === GAMEOBJECT.OBSTACLE) {
			gameObject = new Obstacle(this.context, this.x,this.y);
			Object.assign(gameObject, obstacleDrawLogic);
		}

		gameObject.type = this.type; 
		console.log("Creating: " + this.type);	

		return gameObject;			
	}
}

class Ball extends GameObject {
	constructor(context, x, y) {
		super(context, x,y);
		this.colour = BALL_COLOUR;
		this.radius = BALL_RADIUS; 
        this.hitGround = 0;
	}
	
	bounce(x, vectorDude) {
		let y = 1 + x;

		if (x > 0 ) {
			y = 1 - x;
		}

		let momentum = Math.abs(this.vector.dx) + Math.abs(this.vector.dy); 

		if (APPLY_FRICTION_BOUNCE) {
			this.vector.dx = momentum * -x * DUDE_FRICTION;
			this.vector.dy = momentum * y * DUDE_FRICTION;
		} else {
			this.vector.dx = momentum * -x;
			this.vector.dy = momentum * y;
		}

		this.vector.dy += 0.25 * vectorDude.dy; 
		this.vector.dx += 0.25 * vectorDude.dx;
	}

	bounceWithDirection(direction) {
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
}

class Dude extends GameObject{
	constructor(context, x, y, isLeft, ai) {
		super(context, x,y);
		this.AI = ai;
		this.isLeft = isLeft;
		this.isLeft ? this.colour = DUDE_COLOUR : this.colour = DEBUG_COLOUR; 
		this.vector = {dx: 0, dy:0};
		this.radius = DUDE_RADIUS;
		this.direction = DIRECTION.STOP;
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

	callJump() {
		if (this.vector.dy == 0 || this.y == 0) {
			this.vector.dy = INITAL_JUMP_VELOCITY;
		}
	}

	setAi(Ai) {
		this.AI = Ai; 
	}

	aiMove(ballx, bally, ballvector) {
		if (!this.AI) {
			return; 
		}

		if (this.isLeft) {
			this.direction = this.AI.decideDirection(ballx, bally, this.x, this.y, ballvector, true);
			if (this.AI.decideJump(ballx, bally, this.x, this.y, ballvector, true)) {
				this.callJump();
			}
		} else {
			this.direction = this.AI.decideDirection(ballx, bally, this.x, this.y, ballvector, false);
			if (this.AI.decideJump(ballx, bally, this.x, this.y, ballvector, false)) {
				this.callJump();
			}
		}
	}
}

class Obstacle extends GameObject{
	constructor(context, x,y) {
		super(context, x,y);
		this.height = HEIGHT_BARRIER + GROUND_LEVEL; 
		this.width = WIDTH_BARRIER;
		this.colour = BARRIER_COLOUR; 
	}

	calculatePosition() {
	}
}