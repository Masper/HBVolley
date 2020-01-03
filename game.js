class GameRunner {	
	constructor(ioConnection) {
		this._initCanvas();
		// reference to IO because no callback yet
		this.menu = new Menu(this.context, ioConnection);
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
	constructor(context, IOConnection, gameMode) {
		this.context = context; 
		this.mode = gameMode; 
		this._initIO(IOConnection); 
		this._initGameObjects();
		this.score = {'left' : 0, 'right' : 0};
	}

	run() {
		this.gameRun = setInterval(() => {
			this.state = STATE.RUNNING;
			kd.tick(); 
			this.applyMoves(); 
			this.calculatePositions();
			this.detectCollisions();

			if (this.mode === MODE.ONE_PLAYER_MODE) {
				let ball = this.gameObjects.ball;
				this.gameObjects.dude2.aiMove(ball.x,ball.y,ball.vector);
			}
			if (this.IOConnection && this.mode === MODE.MULTI_PLAYER_MODE) {
				this._transmitStatesBallAndDude(); 
				this._receiveStateDude2();	
			}

			this.drawGameState(); 		

		}, FRAME_SPEED_MS);
	}

	applyMoves() {
		this.gameObjects.dude1.setDirection();

		if (this.mode === MODE.ONE_PLAYER_MODE) {
			let ball = this.gameObjects.ball;
			this.gameObjects.dude2.aiMove(ball.x,ball.y,ball.vector);
		}	
		else {
			this.gameObjects.dude2.setDirection();		
		}

		this.gameObjects.dude1.applyDirection();
		this.gameObjects.dude2.applyDirection(); 
	}

	_initIO(IOConnection) {
		this.IOConnection = IOConnection;
		this.receivingTransmission = true;
	}

	_initiateAi() {
		if (this.mode === MODE.ONE_PLAYER_MODE) {
			this.gameObjects.dude2.blessWithAi(new AI());
		}
	}

	_initGameObjects() {
		this.gameObjects = {};
		this.gameObjects.ball = new Ball(this.context, WIDTH/4, HEIGHT*0.8);
		this.gameObjects.dude1 = new Dude(this.context, true);
		this.gameObjects.dude2 = new Dude(this.context, false);
		this.gameObjects.obstacle = new Obstacle(this.context);
		
		this._initiateAi();
	}

	detectCollisionBarrier() {
		let circle={
			x:this.gameObjects.ball.x,
			y:this.gameObjects.ball.y,
			r:this.gameObjects.ball.radius
		}
		
		let rect={
			x:this.gameObjects.obstacle.x,
			y:0,
			w:this.gameObjects.obstacle.width,
			h:this.gameObjects.obstacle.height
		}

		if(circle.x >= (rect.x - circle.r) && circle.x <= (rect.x + rect.w + circle.r) && circle.y >=  (rect.y - circle.r) && circle.y <= rect.y + rect.h + circle.r) {
			return true;
		}
	}

	_transmitStatesBallAndDude() {
		let ball = {
			"name" : 'ball',
			"x" : this.gameObjects.ball.x,
			"y" : this.gameObjects.ball.y
		}

		let dude = {
			"name" : "dude",
			"x" : this.gameObjects.dude1.x,
			"y" : this.gameObjects.dude1.y
		}

		this.IOConnection.transmit(ball);
		this.IOConnection.transmit(dude);
	}

	_setEyeVisual(dude, dx, dy, distance) 	{
		if (distance > 355 ) {
		dude.dilation = 1.15; 
		}	else if (distance > 10) {
			dude.dilation = 0.95; 
		}	else {
			dude.dilation = 1.10;
		}

		if (dx < -400 ) {
			dude.amtlookright = 4;
		}	else if  (dx < -300 ) {
			dude.amtlookright = 3;
		}	else if (dx < -200) {
			dude.amtlookright = 2;
		}	else if (dx < -20) {
			dude.amtlookright =  1;
		}	else if (dx < 0) {
			dude.amtlookright = 0; 
		}	else if (dx < 100) {
			dude.amtlookright = -1; 
		}	else if (dx < 200) {
			dude.amtlookright = -2; 
		}	else  {
			dude.amtlookright = -3;
		}

		if (dy < -400 ) {
			dude.amtlookup = 4;
		}	else if (dy < -300 ) {
			dude.amtlookup = 3;
		}	else if (dy < -200) {
			dude.amtlookup = 2;
		}	else if (dy < -20) {
			dude.amtlookup =  1;
		}	else if (dy < 0) {
			dude.amtlookup = 0; 
		}	else if (dy < 25) {
			dude.amtlookup = -1; 
		}	else  {
			dude.amtlookup = -2;
		}
	}

	_detectCollisionBallDudes() {
		let dudes = []
		dudes.push(this.gameObjects.dude1);
		dudes.push(this.gameObjects.dude2);
		let ball = this.gameObjects.ball; 

		for (let i = 0; i<dudes.length; i++) {	
			let dude = dudes[i];
			let dx = dude.x - ball.x;
			let dy = dude.y - ball.y;
			let distance = Math.sqrt(dx * dx + dy * dy);

			this._setEyeVisual(dude, dx, dy, distance);		

			if (distance < dude.radius + ball.radius) {
				let underneath = false;
				if (dy > ball.radius) {
					underneath = true; 
				}
				let cosinus = (dude.x - ball.x) / (dude.radius + ball.radius);
				ball._bounce(cosinus, dude.vector, underneath);
				return true; 
			}
		}
	}

	_detectCollisionBallObstacle() {
		let ball = this.gameObjects.ball;  
		let obstacle = this.gameObjects.obstacle;

		if (this.detectCollisionBarrier()) {
			if (ball.y + BALL_RADIUS > obstacle.y) {
				ball._bounceWithDirection(DIRECTION.UP);	
				return true; 
			}

			if (ball.x < obstacle.x) {
				ball._bounceWithDirection(DIRECTION.LEFT);
				return true; 
			}

			if (ball.x > obstacle.x) {
				ball._bounceWithDirection(DIRECTION.RIGHT);
				return true; 
			}
		}
	}

	detectCollisions() {
		let col1 = this._detectCollisionBallDudes();
		let col2 = this._detectCollisionBallObstacle();	

		if(col1 && col2) {
				this.gameObjects.ball._bounceWithDirection(DIRECTION.UP);
		}

	}

	_calculateReflection() {
		let dx = (this.gameObjects.dude1.x - this.gameObjects.ball.x) / (this.gameObjects.dude1.radius + this.gameObjects.ball.radius);
		this.gameObjects.ball._bounce(dx, this.gameObjects.dude1.vector);
	}

	_receiveStateDude2() {
		if (this.receivingTransmission) {
			let transmission =  this.IOConnection.getInput();
			if (transmission != null) {
				this.gameObjects.dude2.x = 2/3 * transmission.x;
				this.gameObjects.dude2.y = transmission.y;
			}
		}		
	}

	_detectEnding() {
		if (this.gameObjects.ball.hitGround > 0 ) {
			if (this._updateScore()) {
				this._initGameObjects();
			}
			else {
				return true; 
			}
		}
	}

	_restartGame() { 
		this._initGameObjects();
		this._resetScore();
		this.run()
	}

	_resetScore() {
		this.score.left = 0;
		this.score.right = 0;
		this.lastScorerWidth = 1; 
	}

	_updateScore() {
		if (this.gameObjects.ball.x < WIDTH/2) {
			this.score.right++;
			this.lastScorerWidth = 3; 
		} else {
			this.score.left++;
			this.lastScorerWidth = 1; 
		}

		if (this.score.left < 3 && this.score.right < 3) {
			return true; 
		}
		return false;
	}

	_drawScore() {
		let score = this.score;
		this.context.fillStyle = MENU_FONT_COLOUR_ACTIVE;
		this.context.fillText(score.left + " : " + score.right, WIDTH * 0.45, HEIGHT * 0.1); 
	}

	_drawEnding() {
		let text; 
		if (this.score.left == 3) {
			this.context.fillStyle = DUDE_COLOUR; 
			text = "Left";
		}
		if (this.score.right == 3) {
			this.context.fillStyle = DEBUG_COLOUR; 
			text = "Right";
		}

		this.context.fillText(text + " dude WINS!", WIDTH * 0.25, HEIGHT * 0.4); 
		this.context.fillText("Press [enter] for restart", WIDTH * 0.35, HEIGHT * 0.6);

		this.stop();
	}

	stop() {
		clearInterval(this.gameRun);
		this.state = STATE.STOPPED; 
		kd.ENTER.press = () => {
			 this._restartGame()
		}
	}

	drawGameState() {
		this.context.clearRect(0, 0, WIDTH, HEIGHT);

			if (this._detectEnding()) {
				this._drawEnding();
			}	
			this._drawScore();

			this.gameObjects.dude1._draw();
			this.gameObjects.dude2._draw();
			this.gameObjects.ball._draw();
			this.gameObjects.obstacle._draw();
	}

	calculatePositions() {
		this.gameObjects.dude1.calculatePosition();
		this.gameObjects.dude2.calculatePosition();
		this.gameObjects.ball.calculatePosition();
	}
}