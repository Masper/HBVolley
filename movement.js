const dudeMovement = {
    calculatePosition() {
		this.boundaryCheck();
		this.applyGravity(); 
        this.applyMovementTicks();
        
        this.x += this.vector.dx;
		this.y += this.vector.dy;
    },
    boundaryCheck() {
		if (this.isLeft) {
			if (this.x >= WIDTH/2 - this.radius) {
				this.x = WIDTH/2 - this.radius;
			}
			if (this.x <= 0) {
				this.x = 0; 
				this.jumping = false;
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
	},
    applyMovementTicks() {
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
    },
    applyGravity() {	
		if (this.y >= GROUND_LEVEL) {
			this.vector.dy -= GRAVITY; 
		}
		else {
			this.vector.dy = 0; 
			this.y = GROUND_LEVEL;
		}
	}
}

const ballMovement = {
    calculatePosition() {
        this.boundaryCheck(); 
		this.enforceMaxSpeed();

		this.x += this.vector.dx;
		this.y += this.vector.dy;

		this.vector.dy -= GRAVITY; 
    },
    boundaryCheck() {
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

		// Dampen the bouncing on the floor (not applicable for regular game)
		if (this.vector.dy < 1 && this.vector.dy > 0)  {
			this.vector.dy = 0;
		}
    },
    enforceMaxSpeed() {
		let speed = Math.sqrt(this.vector.dx * this.vector.dx + this.vector.dy * this.vector.dy);

		if (speed >= MAX_SPEED_BALL) {
			let x = Math.abs(this.vector.dx);
			let y = Math.abs(this.vector.dy);

			let grade = (x/(x+y));
			if (this.vector.dx > 0) {
				this.vector.dx = MAX_SPEED_BALL * grade;
			} else {
				this.vector.dx = MAX_SPEED_BALL * grade * -1;
			}

			if (this.vector.dy > 0) {
				this.vector.dy = MAX_SPEED_BALL * (1 - grade);
			} else {
				this.vector.dy = MAX_SPEED_BALL * (1 - grade) * -1;
			}
        }
    }   	
}