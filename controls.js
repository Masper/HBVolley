const touchControls= {

	LEFT: {
		setDirection() {
			if (!this.addedControls == true) {
				this.addDirectives();
				this.addedControls == true;
			}
		},
		
		addDirectives() {
			document.getElementById("buttonRight").addEventListener('touchstart', e => 	{
			if (this.direction=DIRECTION.LEFT) {
				this.callJump();
			}
			this.direction=DIRECTION.RIGHT;}
			,{passive: true});

			document.getElementById("buttonLeft").addEventListener('touchstart', e => {
				if (this.direction=DIRECTION.RIGHT) {
					this.callJump();
				}
				this.direction=DIRECTION.LEFT;}	
			,{passive: true});

			document.getElementById("buttonRight").addEventListener('touchend', e => this.direction=DIRECTION.STOP
			,{passive: true});

			document.getElementById("buttonLeft").addEventListener('touchend', e => this.direction=DIRECTION.STOP
			,{passive: true});

			document.getElementById("jumpLeft").addEventListener('touchstart', e =>  this.callJump()
			,{passive: true});

			document.getElementById("jumpRight").addEventListener('touchstart', e => this.callJump()
			,{passive: true});
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