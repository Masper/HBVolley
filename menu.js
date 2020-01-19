const LOCATION = {
    '_1' : 0.12,
    '_2' : 0.22,
    '_3' : 0.32,
    '_4' : 0.42,
    '_5' : 0.52,
    '_6' : 0.62,
    '_7' : 0.72,
    '_8' : 0.82,
    '_9' : 0.92
};

const ACTION = {
    GO_BACK : 'GO_BACK',
    SUBSCRIBE: 'SUBSCRIBE',
    ENTER_ROOM : 'ENTER_ROOM',
    CHANGE_SETTINGS: 'CHANGE_SETTINGS'
}

class Menu {
	constructor (context, ioConnection) {
		this.ioConnection = ioConnection;
		this.context = context; 
		this.show = true; 
		this.menuFont = MENU_FONT; 
        this.items = [];
        this.menuScreen = 1;  
		// because the font won't always load
        setTimeout(() => {
            this.setMenuItems1(); this._drawMenuItems()}
            ,200);
		this._setControls();
	}

	_drawMenuItems() {
        console.log(this.items);
		this.context.clearRect(0, 0, WIDTH, HEIGHT);
        this.context.font = MENU_FONT;
        this.context.strokeStyle = "white";
        this.context.lineWidth = 2;

		for (let i = 0; i < this.items.length; i++) {	
            let item = this.items[i];
            
            if (item.screen != this.menuScreen) {
                continue; 
            }
			if (item.active) {
                this.context.fillStyle = MENU_FONT_COLOUR_ACTIVE;

			}
			else {
                this.context.fillStyle = MENU_FONT_COLOUR;              

			}
	
            this.context.fillText(item.text, WIDTH * 0.4, HEIGHT * item.location); 
            this.context.strokeText(item.text, WIDTH * 0.4, HEIGHT * item.location); 

		}
	}

	_setControls() {
		window.onkeydown = event => {
			if (event.key === 'ArrowDown') {
				this._changeActive(DIRECTION.UP)
			} else if (event.key === 'ArrowUp') {
				this._changeActive(DIRECTION.DOWN); 
			} else if (event.key === 'Enter') {
			this._enterMenuItem();
			} else if (event.key === 'ArrowRight') {
                this.changeActiveNumber(true);       
            } else if (event.key === 'ArrowLeft') {
                this.changeActiveNumber(false); 
            }
        }

        canvas.addEventListener("touchstart", e => {
            if (this.game != null) {
                return;
            }
            e = e.touches[0];
            var rect = canvas.getBoundingClientRect()

            var coordinate = {
                x: (e.clientX - rect.left) / (rect.right - rect.left ) * canvas.width ,
                y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
            };

            this.checkMenuInput(coordinate);
        }); 
    }

    checkMenuInput(coordinate) {
        let clickPosition =  coordinate.y / HEIGHT;

        for (let i = 0; i < this.items.length; i++) {
            let dif = Math.abs(this.items[i].location - clickPosition);

            if (dif < 0.05) {
                if (this.items[i].active == true) {
                    if (this.items[i].action == ACTION.CHANGE_NUMBER) {
                        this.changeActiveNumber(true);
                        return;
                    }
                    this._enterMenuItem(); 
                    return;
                }
                else {
                this.items.forEach(e => e.active = false);
                this.items[i].active = true; 
                }
            }
          }

        this._drawMenuItems();
    }

    changeActiveNumber(add) {
        if (!this.screen == 3 ) {
            return;
        }
        let active = this.items.find(e => e.active);
        this.addition = active.size;

        if (add) {
            active.add(this.addition);
        } else {
            this.addition = this.addition *-1;
            active.add(this.addition);
        }

        this.setMenuItems3();
        this.items.forEach(e => e.active = false);
        this.items.find(e => e.location === active.location).active = true; 

        this._drawMenuItems();
    }

    _enterMenuItem() {
        let active = this.items.find(e => e.active);

        if (active.action == MODE.ONE_PLAYER_MODE || active.action == MODE.TWO_PLAYER_MODE || active.action == MODE.AI_BATTLE_MODE) {
            this._startGame(active.action); 
        }

        if(active.action == ACTION.CHANGE_SETTINGS) {
            this.menuScreen = 3; 
            this.setMenuItems3();
            this._drawMenuItems();
        }

        if (active.action == MODE.MULTI_PLAYER_MODE) {
            this.ioConnection.connect(); 
            this.menuScreen = 2; 
            this.setMenuItems2();
            this._drawMenuItems();
            this._drawDudesWaiting(); 
        }

        if (active.action == ACTION.GO_BACK) {
            applyChangedValues();
            this.menuScreen = 1;
            this.setMenuItems1();
            this._drawMenuItems();
        }

        if (active.action == ACTION.SUBSCRIBE) {
            this.ioConnection.joinRoom(); 
            this._subscribe(active);
        }
    }

    _subscribe(item) {
        item.isSubscribed = !item.isSubscribed;
        if (!item.isSubscribed) {
            return; 
        }  

        this._drawDudesWaiting(); 
    }

    _drawDudesWaiting() { 
        for (let i = 0; i < this.items.length; i++)  {
        let item = this.items[i];

        let x = 0;
        if (item.hasDudeWaiting) {
            this._drawDude(x, DEBUG_COLOUR, item.location);    
            x += 75; 
        }

        if (item.isSubscribed) {
            this._drawDude(x, DUDE_COLOUR, item.location);
        }
    }
    }

    _drawDude(x, colour, location) {
        this.context.beginPath();
        this.context.arc(WIDTH * 0.5 + x,  HEIGHT * location, 30 ,  Math.PI, 2 * Math.PI, false);
        this.context.fillStyle = colour;  
        this.context.fill();

        this.context.beginPath();
        this.context.arc(WIDTH * 0.5 + 10 + x,  HEIGHT * location - 20 , 4 , 0, 2 * Math.PI, false);
		this.context.fillStyle = '#000000';
		this.context.fill();
    }

	_startGame(mode) {          
        this.items = []; 
        window.onkeydown = null;
		this.game = new Game(this.context, this.ioConnection, mode);
		this.game.run();
	}

	_changeActive(direction) {
		let active = this.items.find(e => e.active);
		let index = this.items.indexOf(active);
        this.items.forEach(e => e.active = false);
        this.items.forEach(e => e.isSubscribed = false);

		direction === DIRECTION.UP ? index +=1 : index -=1; 

		if (index < 0) {
			index = this.items.length-1;
		}
		if (index == this.items.length) {
			index = 0;
		}

		this.items[index].active = true; 
        this._drawMenuItems();
        this._drawDudesWaiting(); 
	}

    setMenuItems1() { 
        this.items = [{
            'text' : 'SINGLE PLAYER GAME',
            'action' : MODE.ONE_PLAYER_MODE,
			'location' : LOCATION._1, 
            'active' : true,
            'screen' : 1 },
          {
            'text' : 'TWO PLAYER GAME',
            'action' : MODE.TWO_PLAYER_MODE,
			'location' : LOCATION._2, 
            'active' : false,
            'screen' : 1 },
			{
            'text' : 'AI BATTLE GAME',
            'action' : MODE.AI_BATTLE_MODE,
			'location' : LOCATION._3,
            'active' : false,
            'screen' : 1 }, 
          {
            'text' : 'MULTI PLAYER GAME',
            'action' : MODE.MULTI_PLAYER_MODE,
			'location' : LOCATION._4,
            'active' : false,
            'screen' : 1 },
	        {   
             'text' : 'GAME SETTINGS',
            'action' : ACTION.CHANGE_SETTINGS,
			'location' : LOCATION._5,
            'active' : false,
            'screen' : 1 }]
    }

    setMenuItems3() { 
        this.items = 
                [{
                'text': 'Radius dudes: ' + configuration.size.dudeRadius,
                'action': ACTION.CHANGE_NUMBER,
                'size': 1,
                'location' : LOCATION._1, 
                'active' : true, 
                'screen' : 3,
                'add' : function(add) {configuration.size.dudeRadius += add
                }
            },
            {
                'text': 'Radius ball: ' + configuration.size.ballRadius,
                'action': ACTION.CHANGE_NUMBER,
                'size': 1,
                'location' : LOCATION._2, 
                'active' : false, 
                'screen' : 3,
                'add' : function(add) {configuration.size.ballRadius += add;
                }
            },
            {
                'text': 'Max speed dude: ' + configuration.speed.maxSpeedDude,
                'action': ACTION.CHANGE_NUMBER,
                'size': 0.1,
                'location' : LOCATION._3, 
                'active' : false, 
                'screen' : 3,
                'add' : function(add) {configuration.speed.maxSpeedDude = Math.round((configuration.speed.maxSpeedDude + add)*10)/10;
                }
            },
            {
                'text': 'Max speed ball: ' + configuration.speed.maxSpeedBall,
                'action': ACTION.CHANGE_NUMBER,
                'size': 0.1,
                'location' : LOCATION._4,
                'active' : false, 
                'screen' : 3,
                'add' : function(add) {
                   configuration.speed.maxSpeedBall = Math.round((configuration.speed.maxSpeedBall + add)*10)/10;
                }
            },
            {
                'text': 'Round boys: ' + configuration.visuals.makeRound,
                'action': ACTION.CHANGE_NUMBER,
                'size': 0.1,
                'location' : LOCATION._5,
                'active' : false, 
                'screen' : 3,
                'add' : function() {configuration.visuals.makeRound = !configuration.visuals.makeRound;
                }
            },
            {
                'text': 'Ground height: ' + configuration.location.ground,
                'action': ACTION.CHANGE_NUMBER,
                'size': 10,
                'location' : LOCATION._6,
                'active' : false, 
                'screen' : 3,
                'add' : function(add) {configuration.location.ground += add;
                }
            },
            {
                'text': 'Barrier height: ' + configuration.barrier.height,
                'action': ACTION.CHANGE_NUMBER,
                'size': 5,
                'location' : LOCATION._7,
                'active' : false, 
                'screen' : 3,
                'add' : function(add) {configuration.barrier.height += add;
                }
            },{
                'text': 'Jump speed: ' + configuration.physics.initalJumpVelocity,
                'action': ACTION.CHANGE_NUMBER,
                'size': 0.1,
                'location' : LOCATION._8,
                'active' : false, 
                'screen' : 3,
                'add' : function(add) {configuration.physics.initalJumpVelocity += add;
                }
            },
            {
                'text': 'GO BACK',
                'action': ACTION.GO_BACK,
                'location' : LOCATION._9,
                'active' : false, 
                'screen' : 3
            }]
    }

    setMenuItems2() {
        this.items =  
            [{
                'text': 'ROOM 1',
                'action': ACTION.SUBSCRIBE,
                'location' : LOCATION._1, 
                'active' : true, 
                'screen' : 2,
                'room' : 1,
                'hasDudeWaiting': true
            },
            {
                'text': 'GO BACK',
                'action': ACTION.GO_BACK,
                'location' : LOCATION._4,
                'active' : false, 
                'screen' : 2
            }   ]  
    }
}
