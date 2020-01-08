const ballDrawLogic = {
	draw() {
    	this.context.beginPath();
    	this.context.arc(this.x, HEIGHT - this.y, this.radius, 0, 2 * Math.PI, false);
   		this.context.fillStyle = '#000000';
   		this.context.fill();

  		this.context.beginPath();
   		this.context.arc(this.x, HEIGHT - this.y, this.radius -3, 0, 2 * Math.PI, false);
   		this.context.fillStyle = this.colour; 
		this.context.fill();
	}
}

const dudeDrawLogic = {
	draw() {
    	this.drawBody(); 
   		this.drawEye(); 
   		this.drawInnerEye();   
   		this.drawBlink();
	},
	drawBody() {
		console.log(MAKE_ROUND);
		this.context.beginPath();
		this.context.arc(this.x, HEIGHT - this.y  , this.radius,  MAKE_ROUND ? 0 : Math.PI, 2 * Math.PI, false);
		this.context.fillStyle = '#000000';
		this.context.fill();
		
		this.context.beginPath();
		this.context.arc(this.x, HEIGHT - this.y, this.radius -3,  MAKE_ROUND ? 0 : Math.PI, 2 * Math.PI, false);
		this.context.fillStyle = this.colour; 
		this.context.fill();
	
		if (!MAKE_ROUND) {
		this.context.beginPath();
		this.context.moveTo(this.x - this.radius, HEIGHT - this.y - 1);
		this.context.lineTo(this.x + this.radius, HEIGHT - this.y - 1);
		this.context.lineWidth = 3;
		}
	
		this.context.stroke();
	},
	drawEye() {
		let k; 
		this.isLeft ? k = 1 : k = -1; 
		this.context.beginPath();
		this.context.arc(this.x + k * this.radius/3, HEIGHT - this.radius/1.8 - this.y, this.radius/6.9, 0, 2 * Math.PI, false);
		this.context.fillStyle = '#000000';
		this.context.fill();		
	},
	drawBlink() {
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
	},
	drawInnerEye() {
		let k; 
		this.isLeft ? k = 1 : k = -1; 
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
}

const obstacleDrawLogic = {
	draw() {
		this.context.beginPath();
		this.context.fillStyle = this.colour; 
		this.context.fillRect(this.x, this.y, this.width, this.height);
		this.context.stroke();
	}
}