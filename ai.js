class AI {
	constructor() {
		this.lastMovement; 
		this.ticks = PARKINSON_PREVENTION;
	}

	decideJump(ballx, bally, dudex, dudey, ballvector) {
		if (dudey != 0) {
			return false;
		}
		if (ballvector.dx <5 && ballx < WIDTH/2) {
			return false
		}
		if ((ballx - dudex < 10 || ballx - dudex > -10) && bally < 100) {
			return true; 
		} 

		if (bally < 100 && ballx > WIDTH/2) {
			return false;
		}

		if (ballx > WIDTH / 2 -50) {
			return true; 
		}
	}

	decideDirection(ballx, bally, dudex, dudey, ballvector) {
		this.ticks--;
		if (this.ticks > 0) {
			return; 
		}
		
		this.ticks = PARKINSON_PREVENTION;

		if (ballvector.dx < 1 && ballx < WIDTH/2) {
			return DIRECTION.STOP;
		}
		if (ballx + 10 > dudex) {
			return DIRECTION.RIGHT;
		}
		else if (ballx > WIDTH/2 && ballx -20 < dudex) {
			return DIRECTION.LEFT;
		}
		else if (ballx < WIDTH*0.1) {
			return this._goToDirection(dudex, WIDTH*0.6);
		}
		else if (ballx <WIDTH*0.2) {
			return this._goToDirection(dudex, WIDTH*0.56);
		}
		else if (ballx <WIDTH*0.3) {
			return this._goToDirection(dudex, WIDTH*0.6);
		}
		else if (ballx <WIDTH*0.4) {
			return this._goToDirection(dudex, WIDTH*0.62);
		}
		else if (ballx < WIDTH/2) {
			let direction = this._goToDirection(dudex, WIDTH*0.65);
			return direction;
		} 
	}

	_goToDirection(dudex, x) {
			if (x  > dudex) {
				return DIRECTION.RIGHT;
			}
			else if (x == dudex) {
				return DIRECTION.STOP;
			}
			else {
				return DIRECTION.LEFT; 
			}
		}

	_randomMove() {
		if (Math.random() > 0.11) {
			return DIRECTION.STOP;
		}
		else if (Math.random() > 0.02) {
			return DIRECTION.LEFT;
		}
		else return DIRECTION.RIGHT;
	}

	_returnMid(dudex, dudey) {
		if (dudex < 2/3* WIDTH) {
			return DIRECTION.RIGHT;
		}
		if (dudex > 3/4* WIDTH) {
			return DIRECTION.LEFT; 
		}
	}
}