class AI {
	constructor(inverse) {
		this.inverse = inverse; 
		}

	decideJump(ballx, bally, dudex, dudey, ballvector) {
		if (this.inverse) { 
			dudex = 0.5 * WIDTH +  dudex + 30;
			ballx = 0.5 * WIDTH +  ballx; 
			ballvector.dx  = -1* ballvector.dx; 
		}
		
		if (dudey - GROUND_LEVEL != 0) {
			return false;
		}
		if (ballvector.dx <6 && ballx < WIDTH/2) {
			return false
		}
		if ((ballx - dudex < 10 || ballx - dudex > -10) && bally - GROUND_LEVEL < 100 ) {
			return true; 
		} 

		if (bally - GROUND_LEVEL < 100 && ballx > WIDTH/2) {
			return false;
		}

		if (ballx > WIDTH / 2 -50) {
			return true; 
		}
	}

	decideDirection(ballx, bally, dudex, dudey, ballvector) {
		if (this.inverse) { 
			dudex = 0.52 * WIDTH +  dudex + 25;
			ballx = 0.5 * WIDTH +  ballx - 10; 
			ballvector.dx  = -1* ballvector.dx; 
		}
		
		if (ballvector.dy < 0 && ballx > WIDTH /2 && ballx +14 < dudex) {
			return DIRECTION.LEFT;
		}

		if (ballvector.dy <0 && bally -GROUND_LEVEL < 150 && ballx + 20 < dudex) {
			return DIRECTION.RIGHT;
		}

		if (ballvector.dx > 4 && ballx > WIDTH - 100)
			return DIRECTION.LEFT;

		if (ballvector.dy > 5 && ballx + 20 < dudex) {
			return DIRECTION.RIGHT;
		}	
		if (ballvector.dx > 5 && ballx +100> WIDTH / 2 && (ballx + 40 < dudex)) {
			return DIRECTION.RIGHT;
		}
		if (ballvector.dx < 1 && ballx < WIDTH/2) {
			return DIRECTION.STOP;
		}
		if (ballx + 40 > dudex) {
			return DIRECTION.RIGHT;
		}
		else if (ballx > WIDTH/2 && ballx -10 < dudex) {
			return DIRECTION.LEFT;
		}
		else if (ballx < WIDTH*0.2) {
			return this._goToDirection(dudex, WIDTH*0.4);
		}
		else if (ballx <WIDTH*0.3) {
			console.log("AI: Random move");
			return this._randomMove();
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
		if (this.inverse) { 
			dudex = WIDTH - dudex; 
			x = WIDTH -x;
		}
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
		else if (Math.random() > 0.5) {
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