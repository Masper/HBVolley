var input = {'x':null,'y':0};


class GameRunner {	
	constructor(ioConnection) {
		this.initCanvas();
		this.menu = new Menu(this.context, ioConnection);

		canvas.addEventListener('touchstart', this.touchStart, false);
		canvas.addEventListener('touchmove', this.touchMove, false);
		canvas.addEventListener('touchcancel', this.touchHandler, false);
		canvas.addEventListener('touchend', this.touchHandler, false);
	}

	initCanvas() {
		this.canvas = document.getElementsByTagName('canvas')[0];

		if (this.canvas.getContext) {
			this.context = this.canvas.getContext('2d');

			this.resizeScreen();
		}
	}

	resizeScreen() {
		this.canvas = document.getElementsByTagName('canvas')[0];
		canvas = this.canvas;
		this.context = this.canvas.getContext('2d');

		this.canvas.width =  1200;
		this.canvas.height = 800;
		
		HEIGHT = 800;
		WIDTH  = 1200;
		console.log(HEIGHT, WIDTH);
		console.log(this.canvas.width, this.canvas.height);

	 }

	
	 touchStart(e) {	 
            e = e.touches[0];
            var rect = canvas.getBoundingClientRect()

            var coordinate = {
                x: (e.clientX - rect.left) / (rect.right - rect.left ) * canvas.width ,
                y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
            };

		if (this.clickTimer == null) {
			this.clickTimer = setTimeout(function () {
				this.clickTimer = null;	
				input.x = coordinate.x; 
				input.y = coordinate.y; 
			}, 300)
		} else {
			clearTimeout(this.clickTimer);
			this.clickTimer = null;
			input.jump = true; 
		}
	}

	touchMove(e) {
		if(e.touches && e.touches[0] != null && e.touches[0] != undefined) {
			e = e.touches[0];
            var rect = canvas.getBoundingClientRect()

            var coordinate = {
                x: (e.clientX - rect.left) / (rect.right - rect.left ) * canvas.width ,
                y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
			};
			
			input.x = coordinate.x; 
			input.y = coordinate.y; 
		}
	}
		
	touchHandler(e) {
		var touch = e.touches[0]
		if(e.touches && touch != null && touch != undefined) {
			e = e.touches[0];
            var rect = canvas.getBoundingClientRect()

            var coordinate = {
                x: (e.clientX - rect.left) / (rect.right - rect.left ) * canvas.width ,
                y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
			};
			
			input.x = coordinate.x; 
			input.y = coordinate.y; 	
		}
	}
}


canvas = null; 

class Game {
	constructor(context, IOConnection, gameMode) {
		this.context = context; 
		this.mode = gameMode; 
		this.initIO(IOConnection); 
		this.initGameObjects();
		this.score = {'left' : 0, 'right' : 0};
	}

	run() {
		this.gameRun = setInterval(() => {
			this.state = STATE.RUNNING;
			kd.tick();
			this.applyMoves(); 
			this.calculatePositions();	
			this.detectCollisions();
			this.drawGameState();	 
			this.detectEnding();
		}, FRAME_SPEED_MS);
	}

	applyMoves() {
		let ball = this.gameObjects.ball;

		if (this.mode === MODE.ONE_PLAYER_MODE) {
			this.gameObjects.dude1.setDirection();
			if (input.x !=0) {
				this.gameObjects.dude1.moveToDirection(input.x);
			}
			if (input.jump) {
				this.gameObjects.dude1.callJump(); 
				input.jump = false; 
			}
			this.gameObjects.dude2.aiMove(ball.x,ball.y,ball.vector);
		}	
		else if (this.mode === MODE.TWO_PLAYER_MODE) {
			this.gameObjects.dude1.setDirection();
			this.gameObjects.dude2.setDirection();		
		}
		else if (this.mode === MODE.AI_BATTLE_MODE) {
			this.gameObjects.dude1.aiMove(ball.x,ball.y,ball.vector);
			this.gameObjects.dude2.aiMove(ball.x,ball.y,ball.vector);
		}

		this.gameObjects.dude1.applyDirection();
		this.gameObjects.dude2.applyDirection(); 
	}

	initIO(IOConnection) {
		this.IOConnection = IOConnection;
		this.receivingTransmission = true;
	}

	initGameObjects() {
		this.gameObjects = {};

		this.gameObjects.ball = new GameObjectBuilder(this.context)
		.setType(GAMEOBJECT.BALL)
		.setX(WIDTH*0.25)
		.setY(HEIGHT*0.8)
		.build();

		this.gameObjects.dude1 = new GameObjectBuilder(this.context)
		.setType(GAMEOBJECT.DUDE)
		.setX(WIDTH*0.25)
		.setY(0)
		.setIsLeft(true)
		.setIsHuman(this.mode === MODE.AI_BATTLE_MODE ? false : true)
		.setAi(this.mode === MODE.AI_BATTLE_MODE ? new AI(true) : null)
		.build();

		this.gameObjects.dude2 = new GameObjectBuilder(this.context)
		.setType(GAMEOBJECT.DUDE)
		.setX(WIDTH*0.75)
		.setY(0)
		.setIsLeft(false)
		.setIsHuman(this.mode === MODE.TWO_PLAYER_MODE ? true : false)
		.setAi(this.mode === MODE.TWO_PLAYER_MODE ? null : new AI(false))
		.build();

		this.gameObjects.obstacle = new GameObjectBuilder(this.context)
		.setType(GAMEOBJECT.OBSTACLE)
		.setX(WIDTH*0.5)
		.setY(HEIGHT - HEIGHT_BARRIER - GROUND_LEVEL)
		.build();
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

	transmitStatesBallAndDude() {
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

	setEyeVisual(dude, dx, dy, distance) 	{
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

	detectCollisionBallDudes() {
		let dudes = []
		dudes.push(this.gameObjects.dude1);
		dudes.push(this.gameObjects.dude2);
		let ball = this.gameObjects.ball; 

		for (let i = 0; i < dudes.length; i++) {	
			let dude = dudes[i];
			let dx = dude.x - ball.x;
			let dy = dude.y - ball.y;
			let distance = Math.sqrt(dx * dx + dy * dy);

			this.setEyeVisual(dude, dx, dy, distance);		

			if (distance <= dude.radius + ball.radius) {
				let cosinus = (dude.x - ball.x) / (dude.radius + ball.radius);
				ball.bounce(cosinus, dude.vector);
				return true; 
			}
		}
	}

	detectCollisionBallObstacle() {
		let ball = this.gameObjects.ball;  
		let obstacle = this.gameObjects.obstacle;

		if (this.detectCollisionBarrier()) {
			if (ball.y + BALL_RADIUS >= obstacle.y) {
				ball.bounceWithDirection(DIRECTION.UP);	
				return true; 
			}

			if (ball.x <= obstacle.x) {
				ball.bounceWithDirection(DIRECTION.LEFT);
				return true; 
			}

			if (ball.x > obstacle.x) {
				ball.bounceWithDirection(DIRECTION.RIGHT,);
				return true; 
			}
		}
	}

	detectCollisions() {
		let col1 = this.detectCollisionBallDudes();
		let col2 = this.detectCollisionBallObstacle();	

		if(col1 && col2) {
			this.gameObjects.ball.bounceWithDirection(DIRECTION.UP);
		}
	}


	detectEnding() {
		if (this.gameObjects.ball.hitGround > 0 ) {
			input.x = 0; 
			input.y = 0;
			if (this.updateScore()) {
				this.initGameObjects();
			}
			else {
				this.drawGameState();
				this.drawEnding(); 
				this.stop();
			}
		}
	}

	restartGame() { 
		this.initGameObjects();
		this.resetScore();
		this.run()
	}

	resetScore() {
		this.score.left = 0;
		this.score.right = 0;
		this.lastScorerWidth = 1; 
	}

	updateScore() {
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

	drawScore() {
		let score = this.score;
		this.context.fillStyle = MENU_FONT_COLOUR_ACTIVE;
		this.context.strokeStyle = "white";
        this.context.lineWidth = 2;
		this.context.fillText(score.left + " : " + score.right, WIDTH * 0.45, HEIGHT * 0.1); 
		this.context.strokeText(score.left + " : " + score.right, WIDTH * 0.45, HEIGHT * 0.1);
	}

	drawEnding() {
		let text; 
		if (this.score.left == 3) {
			this.context.fillStyle = DUDE_COLOUR; 
			text = "Left";
		}
		if (this.score.right == 3) {
			this.context.fillStyle = DEBUG_COLOUR; 
			text = "Right";
		}

		this.context.strokeStyle = "white";
        this.context.lineWidth = 2;

		this.context.fillText(text + " dude WINS!", WIDTH * 0.25, HEIGHT * 0.4); 
		this.context.strokeText(text + " dude WINS!", WIDTH * 0.25, HEIGHT * 0.4);

		this.context.fillText("Press [ENTER] for restart", WIDTH * 0.35, HEIGHT * 0.6);
		this.context.strokeText("Press [ENTER] for restart", WIDTH * 0.35, HEIGHT * 0.6);

	}

	stop() {
		clearInterval(this.gameRun);
		this.state = STATE.STOPPED; 
		kd.ENTER.press = () => {
			 this.restartGame()
		}
	}

	drawGameState() {
		this.context.clearRect(0, 0, WIDTH+200, HEIGHT+200);
		this.drawScore();

		for (var object in this.gameObjects) {
			this.gameObjects[object].draw();
		}
	}

	calculatePositions() {
		for (var object in this.gameObjects) {
			this.gameObjects[object].calculatePosition();
		}
	}
}