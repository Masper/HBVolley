const controls = {
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