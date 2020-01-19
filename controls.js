const touchControls= {

	LEFT: {
		setDirection() {
			document.getElementById("buttonRight").addEventListener('touchstart', e => {
				this.direction=DIRECTION.RIGHT;
				console.log("clicky click right");}
				, true);

			document.getElementById("buttonLeft").addEventListener('touchstart', e => {
					this.direction=DIRECTION.LEFT;
					console.log("clicky click left");}
					, true);

			document.getElementById("jumpLeft").addEventListener('touchstart', e => {
				this.callJump(); 
				console.log("jump");}
				, true);

			document.getElementById("jumpRight").addEventListener('touchstart', e => {
				this.callJump(); 
				console.log("jump");}
			, true);
		}
	}
}



const controlsKeyboard= {
    LEFT: { 
        setDirection() {
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
		   this.callJump(); 
	     }
    }
},
    RIGHT: { 
        setDirection() {
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
			this.callJump(); 
		 }
	   }
    }
}