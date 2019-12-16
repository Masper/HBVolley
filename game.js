const DIRECTION = {
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	STOP: 'STOP',
	UP: 'UP'
};

const MODE = {
	ONE_PLAYER_MODE: 'ONE_PLAYER_MODE',
	TWO_PLAYER_MODE: 'TWO_PLAYER_MODE',
	MULTI_PLAYER_MODE: 'MULTI_PLAYER_MODE'
}

const STATE = {
	RUNNING: 'RUNNING',
	STOPPED: 'STOPPED'
}

const BALL_RADIUS = 12;
const DUDE_RADIUS = 50;

const BALL_COLOUR = '#FF5733'; 
const DUDE_COLOUR = '#f9e711';
const DEBUG_COLOUR = '#E116C0';
const BARRIER_COLOUR = '#AB5733'; 

const WIDTH = 750;
const HEIGHT = 500;

const MENU_FONT = "50px 'Lilita One";
const MENU_FONT_COLOUR = '#FFFF00'
const MENU_FONT_COLOUR_ACTIVE = '#E116C0';

const ENDING_TEXT_STYLING = "12px 'Lilita One";

const WIDTH_BARRIER = 5;
const HEIGHT_BARRIER = 125;

const MAX_SPEED_BALL = 10;
const FRAME_SPEED_MS = 8;
const APPLY_FRICTION_BOUNCE = true; 
const HORIZONTAL_MOMENTUM = 3; 
const MOVEMENT_TICKS = 5; 
const GRAVITY = 0.08;
const INITAL_JUMP_VELOCITY = 6; 

// Not all momentum is returned 
const DUDE_FRICTION = 0.96;
const GROUND_FRICTION = -0.86; 
const WALL_FRICTION = -1; 

class Ball {
	constructor(context, x, y) {
		this.x = x;
		this.y = y;
		this.context = context; 
		this.colour = BALL_COLOUR;
		this.radius = BALL_RADIUS; 
		this.vector = {dx: 0, dy:0};
		this._draw();
		this.hitGround = 0;
	}
	
	_bounce(x, vector, underneath) {
		let y = 1+x;

		if (x > 0 ) {
			y = 1-x;
		}

		let momentum = Math.abs(this.vector.dx) + Math.abs(this.vector.dy); 

		if (APPLY_FRICTION_BOUNCE) {
			this.vector.dx = momentum * -x * DUDE_FRICTION;
			this.vector.dy = momentum * y * DUDE_FRICTION;
		}
		else {
		// No friction applied here
		this.vector.dx = momentum * -x;
		this.vector.dy = momentum * y;
		}

		if (vector.dy > 0 ) {
			this.vector.dy += 0.2 * vector.dy; 
		}

		this.vector.dx += 0.1 * vector.dx;

		if (underneath) {
			this.vector.dy = Math.abs(this.vector.dy) * -1;
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

		if (Math.abs(this.vector.dy + this.vector.dx)*1.5 > MAX_SPEED_BALL) {
			this.vector.dy *= 0.8;
			this.vector.dx *= 0.8;
		}
	}

	_calculatePosition() {
		if (this.x <= this.radius / 2) {
			this.x = this.radius / 2;
			this.vector.dx *= WALL_FRICTION;
		}

		if (this.x > WIDTH - this.radius/2) {
			this.x = WIDTH - this.radius/2;
			this.vector.dx *= WALL_FRICTION;
		} 

		if (this.y <= this.radius ) {
			this.hitGround += 1; 
			this.y = this.radius ;
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
		this.isPlayer = isPlayer; 
		isPlayer ? this._initPlayer() : this._initEnemy();	
		this.vector = {dx: 0, dy:0};
		this.context = context;
		this.radius = DUDE_RADIUS;
		this._draw();
	}

	_initPlayer() {
		this.colour = DUDE_COLOUR;
		this.x = WIDTH * 1/3
	}

	_initEnemy() {
		this.colour = DEBUG_COLOUR; 
		this.x = WIDTH * 2/3;
	}

	giveAi(ai) {
		this.AI = ai;
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
		if (this.isPlayer) {
		//this.context.arc(this.state === DIRECTION.LEFT ? this.x - this.radius/3: this.x + this.radius/3, HEIGHT - this.radius/1.8- this.y, this.radius/9, 0, 2 * Math.PI, false);

       this.context.arc(this.x + this.radius/3, HEIGHT - this.radius/1.8- this.y, this.radius/9, 0, 2 * Math.PI, false);
		}
		else{
			this.context.arc(this.x - this.radius/3, HEIGHT - this.radius/1.8- this.y, this.radius/9, 0, 2 * Math.PI, false);

		}
		this.context.fillStyle = '#000000';
      	this.context.fill();
	}

	_applyDirection(direction) {
		if (this.state === direction) {
			this.vector.dx *= 1.1;
		}
		else {
			if (direction === DIRECTION.LEFT) {
				this.vector.dx = HORIZONTAL_MOMENTUM * -1; 
			}
			else if (direction === DIRECTION.RIGHT) {
				this.vector.dx = HORIZONTAL_MOMENTUM; 
			}
			else if (direction === DIRECTION.STOP) {
				this.vector.dx = 0; 
			}
		}

		this.state = direction; 
	}

	
	_calculatePosition() {
		if (this.zombie) {
			return; 
		}

		this.x += this.vector.dx;
		this.y += this.vector.dy;

		this._boundaryCheck();
		this._applyGravity(); 
	}

	_callJump() {
		this.jumpCall = true; 
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
			this._applyDirection(direction);
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
			if (this.x <= WIDTH/2 + this.radius) {
				this.x = WIDTH/2 + this.radius;
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


class AI {
	constructor() {
		this.randomTicks = 100; 
	}

	decideJump(ballx, bally, dudex, dudey, ballvector) {
		if (ballvector.dx <3) {
			console.log(ballvector.dx);
			return false; 
		}
		if (dudey != 0) {
			return false;
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

class Menu {
	constructor (context, ioConnection) {
		this.ioConnection = ioConnection;
		this.context = context; 
		this.show = true; 
		this.menuFont = MENU_FONT; 
		this.items = [];
		// because the font won't always load
		setTimeout(() => this._openingVisual(), 1000);
		this._setControls();

	}

	_drawMenuItems() {
		this.context.clearRect(0, 0, WIDTH, HEIGHT);
		this.context.font = MENU_FONT;

		for (let i = 0; i < this.items.length; i++) {	
			let item = this.items[i];
			if (item.active) {
				this.context.fillStyle = MENU_FONT_COLOUR_ACTIVE;
			}
			else {
				this.context.fillStyle = MENU_FONT_COLOUR;
			}
	
			this.context.fillText(item.text, WIDTH * 0.3, HEIGHT * item.location); 
		}
	}

	_setControls() {
		window.onkeydown = event => {
			if (event.key === 'ArrowDown') {
				this._changeActive(DIRECTION.UP)
			} else if (event.key === 'ArrowUp') {
				this._changeActive(DIRECTION.DOWN); 
			} else if (event.key === 'Enter') {
			this._startGame();
			}
		}
	}

	_startGame() {
		// should be callback for gamerunner
		let active = this.items.find(e => e.active);
		let gameMode;
		if (active.text === 'TWO PLAYER GAME') {
			gameMode = MODE.TWO_PLAYER_MODE;
		}
		else {
			gameMode = MODE.ONE_PLAYER_MODE;
		}
		let game = new Game(this.context, this.ioConnection, gameMode);
		game.run();
	}

	_changeActive(direction) {
		let active = this.items.find(e => e.active);
		let index = this.items.indexOf(active);
		this.items.forEach(e => e.active = false);

		direction === DIRECTION.UP ? index +=1 : index -=1; 

		if (index < 0) {
			index = this.items.length-1;
		}
		if (index == this.items.length) {
			index = 0;
		}

		this.items[index].active = true; 
		this._drawMenuItems();
		}

	_openingVisual() { 
		this.context.clearRect(0, 0, WIDTH, HEIGHT);
		this.items.push(
			{
			'text' : 'SINGLE PLAYER GAME',
			'location' : 0.3,
			'active' :  true
		  }
		)
		this.items.push(
			{
			'text' : 'TWO PLAYER GAME',
			'location' :0.5,
			'active' : false
			}
		)

		this.items.push(
			{
			'text' : 'MULTI PLAYER GAME',
			'location' :0.7,
			'active' : false
			}
		)

		this._drawMenuItems();
	}
}

class GameRunner {	
	constructor(ioConnection) {
		this._initCanvas();
		// reference to IO because no callback yet
		this.menu = new Menu(this.context, ioConnection);
		//this.game = new Game(this.context, ioConnection); 
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
		this.mode = gameMode; 
		this.context = context; 
		this.menu = new Menu(this.context);
		this.receivingTransmission = false;
		this.score = {'left' : 0,
					'right' : 0};
		this._addIOConnection(IOConnection); 
		this._initGameObjects() 
		this._setControls();
	}

	_addIOConnection(IOConnection) {
		this.IOConnection = IOConnection;
		this.receivingTransmission = true;
	}

	_initiateAi() {
		if (this.mode === MODE.ONE_PLAYER_MODE) {
			let dude = this._dude2();
			dude.giveAi(new AI());
			console.log("ai-added");
		}
	}

	_initGameObjects() {
		this.gameObjects = [];
		this.gameObjects.push(new Ball(this.context, 250, 500));
		this.gameObjects.push(new Dude(this.context, true));
		this.gameObjects.push(new Obstacle(this.context));
		this.gameObjects.push(new Dude(this.context, false))
		this._initiateAi();
	}

	_dude2() {
		return this.gameObjects[3];
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
			let dude = this._dude();
			let dude2 = this._dude2();
			if (event.key === 'ArrowRight') {
				dude._applyDirection(DIRECTION.RIGHT);
			} else if (event.key === 'ArrowLeft') {
				dude._applyDirection(DIRECTION.LEFT);
			} else if (event.key === 'ArrowUp') {
				dude._callJump(); 
			} else if (event.key === 'ArrowDown') {
				dude._applyDirection(DIRECTION.STOP);
			} else if (event.key === 'd' && this.mode === MODE.TWO_PLAYER_MODE) {
				dude2._applyDirection(DIRECTION.RIGHT);
			} else if (event.key === 'w' && this.mode === MODE.TWO_PLAYER_MODE) {
				dude2._callJump();
			} else if (event.key === 'a' && this.mode === MODE.TWO_PLAYER_MODE) {
				dude2._applyDirection(DIRECTION.LEFT);
			} else if (event.key === 's' && this.mode === MODE.TWO_PLAYER_MODE) {
				dude2._applyDirection(DIRECTION.STOP);		
			} else if (event.key === 'Enter' && this.state === STATE.STOPPED) {
				this._restartGame();
			}
		}
	}

	_detectCollisionBarrier() {
		// Le copy-paste stack

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

	_transmitStatesBallAndDude() {
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

	_detectCollisionBallDudes(withMovement) {
		// Is based on a sphere dude

		let dudes = []
		dudes.push(this._dude());
		dudes.push(this._dude2());
		let ball = this._ball(); 

		for (let i = 0; i<dudes.length; i++) {	
			let dude = dudes[i];
			let dx = dude.x - ball.x;
			let dy = dude.y - ball.y;
			let distance = Math.sqrt(dx * dx + dy * dy);
	
			if (distance < dude.radius + ball.radius) {
				let underneath = false;
				if (dy > ball.radius) {
					underneath = true; 
				}
				let dx2 = (dude.x - ball.x) / (dude.radius + ball.radius);
				ball._bounce(dx2, dude.vector, underneath);
				return true; 
			}
		}
	}

	_detectCollisionBallObstacle() {
		let ball = this._ball();  
		let obstacle = this._obstacle();

		if (this._detectCollisionBarrier()) {
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

	_detectCollision() {
		let col1 = this._detectCollisionBallDudes();

		let col2 = this._detectCollisionBallObstacle();	
		if(col1 && col2) {
				this._ball()._bounceWithDirection(DIRECTION.UP);
		}

	}

	
	_calculateReflection() {
		let dx = (this._dude().x - this._ball().x) / (this._dude().radius + this._ball().radius);
		this._ball()._bounce(dx, this._dude().vector);
	}

	_receiveStateDude2() {
		if (this.receivingTransmission) {
			let transmission =  this.IOConnection.getInput();
			if (transmission != null) {
				this._dude2().x = 2/3 * transmission.x;
				this._dude2().y = transmission.y;
			}
		}		
	}

	_nextPoint() {
		this._initGameObjects();
	}

	_detectEnding() {
		if (this._ball().hitGround > 0 ) {
			if (this._updateScore()) {
				this._nextPoint(); 
			}
			else {
				return true; 
			}
		}
	}

	_restartGame() { 
		this._initGameObjects();
		this._resetScore();
		this.run();
	}

	_resetScore() {
		this.score.left = 0;
		this.score.right = 0;
	}

	_updateScore() {
		this._ball().x < WIDTH/2 ? this.score.right++ : this.score.left++;

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
		this.context.fillText("enter for restart...", WIDTH * 0.3, HEIGHT * 0.6);

		this.stop();
	}

	stop() {
		clearInterval(this.gameRun);
		this.state = STATE.STOPPED; 
		console.log("ending");
	}

	run() {
		this.gameRun = setInterval(() => {
			this.state = STATE.RUNNING;
			this._detectCollision(true);

			if (this.mode === MODE.ONE_PLAYER_MODE) {
				let ball = this._ball();
				this._dude2().aiMove(ball.x,ball.y,ball.vector);
			}
	
			this.gameObjects.forEach(a => a._calculatePosition());

			if (this.IOConnectio && this.mode === MODE.TWO_PLAYER_MODE) {
				this._transmitStatesBallAndDude(); 
				this._receiveStateDude2();	
			}

			this.context.clearRect(0, 0, WIDTH, HEIGHT);

			if (this._detectEnding()) {
				this._drawEnding();
			}	

			this._drawScore();
			this.gameObjects.forEach(a => a._draw());
		}, FRAME_SPEED_MS);
	}

}