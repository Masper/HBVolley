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
		setTimeout(() => this._firstMenu(), 100);
		this._setControls();
	}

	_drawMenuItems() {
		this.context.clearRect(0, 0, WIDTH, HEIGHT);
        this.context.font = MENU_FONT;

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
			this._enterMenuItem();
			} else if (event.key === 'ArrowRight') {
                this.changeActiveNumber(true);       
            } else if (event.key === 'ArrowLeft') {
                this.changeActiveNumber(false); 
            }
        }
    }

    changeActiveNumber(add) {
        if (!this.screen == 3 ) {
            return;
        }
        let active = this.items.find(e => e.active);
        this.addition = active.size;

        console.log(this.addition);

        if (add) {
            console.log("add");
            active.add(this.addition);
        } else {
            this.addition = this.addition *-1;

            console.log("deduct");
            active.add(this.addition);
        }

        this._settingsMenu();

    }



    _enterMenuItem() {
        let active = this.items.find(e => e.active);

        if (active.action == MODE.ONE_PLAYER_MODE || active.action == MODE.TWO_PLAYER_MODE || active.action == MODE.AI_BATTLE_MODE) {
            this._startGame(active.action); 
        }

        if(active.action == ACTION.CHANGE_SETTINGS) {
            this._settingsMenu(); 
            this._drawMenuItems();
        }

        if (active.action == MODE.MULTI_PLAYER_MODE) {
            this.ioConnection.connect(); 
            this._multiMenu();
            this._drawMenuItems();
            this._drawDudesWaiting(); 
        }

        if (active.action == ACTION.GO_BACK) {
            reInitializeValues();
            this._firstMenu(); 
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
        // should be callback for gamerunner
        this.items = []; 
        window.onkeydown = null;
		let game = new Game(this.context, this.ioConnection, mode);
		game.run();
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

    _firstMenu() { 
        this.context.clearRect(0, 0, WIDTH, HEIGHT);
        this.items = [];
		this.items.push(
			{
            'text' : 'SINGLE PLAYER GAME',
            'action' : MODE.ONE_PLAYER_MODE,
			'location' : LOCATION._1, 
            'active' : true,
            'screen' : 1
		  }
		)
		this.items.push(
			{
            'text' : 'TWO PLAYER GAME',
            'action' : MODE.TWO_PLAYER_MODE,
			'location' : LOCATION._2, 
            'active' : false,
            'screen' : 1
            }
        )
        
        this.items.push(
			{
            'text' : 'AI BATTLE GAME',
            'action' : MODE.AI_BATTLE_MODE,
			'location' : LOCATION._3,
            'active' : false,
            'screen' : 1
			}
        )

		this.items.push(
			{
            'text' : 'MULTI PLAYER GAME',
            'action' : MODE.MULTI_PLAYER_MODE,
			'location' : LOCATION._4,
            'active' : false,
            'screen' : 1
			}
        )

        this.items.push(
			{
            'text' : 'GAME SETTINGS',
            'action' : ACTION.CHANGE_SETTINGS,
			'location' : LOCATION._5,
            'active' : false,
            'screen' : 1
			}
        )
        this.menuScreen = 1; 

		this._drawMenuItems();
    }

    _settingsMenu() {
        this.menuScreen = 3; 

        this.context.clearRect(0, 0, WIDTH, HEIGHT);
        
        this.items = [];
        console.log(configuration.size.ballRadius);
        console.log(configuration.size.dudeRadius);

        this.items.push( 
            {
                'text': 'Radius dudes: ' + configuration.size.dudeRadius,
                'action': ACTION.CHANGE_NUMBER,
                'size': 1,
                'location' : LOCATION._1, 
                'active' : true, 
                'screen' : 3,
                'add' : function(add) {configuration.size.dudeRadius += add;
                }
            }
        );

        this.items.push( 
            {
                'text': 'Radius ball: ' + configuration.size.ballRadius,
                'action': ACTION.CHANGE_NUMBER,
                'size': 1,
                'location' : LOCATION._2, 
                'active' : false, 
                'screen' : 3,
                'add' : function(add) {configuration.size.ballRadius += add;
                }
             }
        );

        this.items.push( 
            {
                'text': 'Max speed dude: ' + configuration.speed.maxSpeedDude,
                'action': ACTION.CHANGE_NUMBER,
                'size': 0.1,
                'location' : LOCATION._3, 
                'active' : false, 
                'screen' : 3,
                'add' : function(add) {configuration.speed.maxSpeedDude += add;
                }
            }
        );

        this.items.push( 
            {
                'text': 'Max speed ball: ' + configuration.speed.maxSpeedBall,
                'action': ACTION.CHANGE_NUMBER,
                'size': 0.1,
                'location' : LOCATION._4,
                'active' : false, 
                'screen' : 3,
                'add' : function(add) {configuration.speed.maxSpeedBall += add;
                }
            }
        );

        this.items.push( 
            {
                'text': 'Round boys: ' + configuration.visuals.makeRound,
                'action': ACTION.CHANGE_NUMBER,
                'size': 0.1,
                'location' : LOCATION._5,
                'active' : false, 
                'screen' : 3,
                'add' : function() {configuration.visuals.makeRound = !configuration.visuals.makeRound;
                }
            }
        );

        this.items.push( 
            {
                'text': 'Ground height: ' + configuration.location.ground,
                'action': ACTION.CHANGE_NUMBER,
                'size': 10,
                'location' : LOCATION._6,
                'active' : false, 
                'screen' : 3,
                'add' : function(add) {configuration.location.ground += add;
                }
            }
        );

        this.items.push( 
            {
                'text': 'Barrier height: ' + configuration.barrier.height,
                'action': ACTION.CHANGE_NUMBER,
                'size': 5,
                'location' : LOCATION._7,
                'active' : false, 
                'screen' : 3,
                'add' : function(add) {configuration.barrier.height += add;
                }
            }
        );

        this.items.push( 
            {
                'text': 'Jump speed: ' + configuration.physics.initalJumpVelocity,
                'action': ACTION.CHANGE_NUMBER,
                'size': 0.1,
                'location' : LOCATION._8,
                'active' : false, 
                'screen' : 3,
                'add' : function(add) {configuration.physics.initalJumpVelocity += add;
                }
            }
        );

 
        this.items.push (
            {
                'text': 'GO BACK',
                'action': ACTION.GO_BACK,
                'location' : LOCATION._9,
                'active' : false, 
                'screen' : 3
            }
        )

        this.menuScreen = 3; 
        this._drawMenuItems();
    }

    newSettingItem() {

    }

    _multiMenu() {
        this.context.clearRect(0, 0, WIDTH, HEIGHT);
        this.items = [];

        this.items.push( 
            {
                'text': 'ROOM 1',
                'action': ACTION.SUBSCRIBE,
                'location' : LOCATION._1, 
                'active' : true, 
                'screen' : 2,
                'room' : 1,
                'hasDudeWaiting': true
            }
        );

        /*

        this.items.push( 
            {
                'text': 'ROOM 2',
                'action': ACTION.SUBSCRIBE,
                'location' : LOCATION._2, 
                'active' : false, 
                'screen' : 2,
                'room' : 2
            }
        );

        this.items.push( 
            {
                'text': 'ROOM 3',
                'action': ACTION.SUBSCRIBE,
                'location' : LOCATION._3, 
                'active' : false, 
                'screen' : 2,
                'room' : 3
            }
        );
        */

        this.items.push (
            {
                'text': 'GO BACK',
                'action': ACTION.GO_BACK,
                'location' : LOCATION._4,
                'active' : false, 
                'screen' : 2
            }
        )

        this.menuScreen = 2; 
    }
}
