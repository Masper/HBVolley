'use strict';

const DIRECTION = {
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	STOP: 'STOP',
	UP: 'UP'
};

const GAMEOBJECT = {
	BALL: 'BALL',
	DUDE: 'DUDE',
	OBSTACLE: 'OBSTACLE'
}

const MODE = {
	ONE_PLAYER_MODE: 'ONE_PLAYER_MODE',
	TWO_PLAYER_MODE: 'TWO_PLAYER_MODE',
	MULTI_PLAYER_MODE: 'MULTI_PLAYER_MODE',
	AI_BATTLE_MODE: 'AI_BATTLE_MODE'
}

const STATE = {
	RUNNING: 'RUNNING',
	STOPPED: 'STOPPED'
}

const PLAYER ={
	ONE: true,
	TWO: false
}

const configuration = {
	colours : {
		BALL_COLOUR : '#FF5733',
		DUDE_COLOUR : '#f9e711',
		DEBUG_COLOUR : '#E116C0',
		BARRIER_COLOUR : '#000000'
	},
	visuals : {
		makeRound : false,
	},
	screen : {
		width : 1200,
		height : 700
	},
	size : {
		ballRadius : 20, 
		dudeRadius : 70
	},
	barrier : {
		width : 5, 
		height: 75
	},
	location : { 
		ground : 0, 
	},
	speed : {
		movementTickSize : 0.1,
		maxSpeedDude : 5,
		maxSpeedBall : 10, 
		frameSpeedMs : 8
	},
	physics : {
		applyFrictionDudeBounce : true, 
		horizontalMomentum : 0.7,
		gravity : 0.091,
		initalJumpVelocity: 5.4,
		dudeFriction : 0.92,
		groundFriction: -0.86,
		wallFriction : -1, 
	}
}

const BALL_COLOUR = '#FF5733'; 
const DUDE_COLOUR = '#f9e711';
const DEBUG_COLOUR = '#E116C0';
const BARRIER_COLOUR = '#000000'; 

var MAKE_ROUND = configuration.visuals.makeRound;
var WIDTH = 0;
var HEIGHT = 0;

var MENU_FONT = "55px 'Lilita One";
var MENU_FONT_COLOUR = '#09C60B';
var MENU_FONT_COLOUR_ACTIVE = '#E116C0';
var ENDING_TEXT_STYLING = "326px 'Lilita One";

var BALL_RADIUS = configuration.size.ballRadius;
var DUDE_RADIUS = configuration.size.dudeRadius;
var GROUND_LEVEL = configuration.location.ground; 
var WIDTH_BARRIER = configuration.barrier.width;
var HEIGHT_BARRIER = configuration.barrier.height;
var MOVEMENT_TICKS_SIZE = configuration.speed.movementTickSize;
var MAX_SPEED_DUDE = configuration.speed.maxSpeedDude;
var MAX_SPEED_BALL = configuration.speed.maxSpeedBall;
var FRAME_SPEED_MS = configuration.speed.frameSpeedMs;
var APPLY_FRICTION_BOUNCE = configuration.physics.applyFrictionDudeBounce;
var HORIZONTAL_MOMENTUM = configuration.physics.horizontalMomentum;
var GRAVITY = configuration.physics.gravity;
var INITAL_JUMP_VELOCITY = configuration.physics.initalJumpVelocity;
var DUDE_FRICTION = configuration.physics.dudeFriction;
var GROUND_FRICTION = configuration.physics.groundFriction;
var WALL_FRICTION = configuration.physics.wallFriction;

let applyChangedValues = function() {
BALL_RADIUS = configuration.size.ballRadius;
DUDE_RADIUS = configuration.size.dudeRadius;
GROUND_LEVEL = configuration.location.ground; 
WIDTH_BARRIER = configuration.barrier.width;
HEIGHT_BARRIER = configuration.barrier.height;
MOVEMENT_TICKS_SIZE = configuration.speed.movementTickSize;
MAX_SPEED_DUDE = configuration.speed.maxSpeedDude;
MAX_SPEED_BALL = configuration.speed.maxSpeedBall;
FRAME_SPEED_MS = configuration.speed.frameSpeedMs;
APPLY_FRICTION_BOUNCE = configuration.physics.applyFrictionDudeBounce;
HORIZONTAL_MOMENTUM = configuration.physics.horizontalMomentum;
GRAVITY = configuration.physics.gravity;
INITAL_JUMP_VELOCITY = configuration.physics.initalJumpVelocity;
DUDE_FRICTION = configuration.physics.dudeFriction;
GROUND_FRICTION = configuration.physics.groundFriction;
WALL_FRICTION = configuration.physics.wallFriction;
MAKE_ROUND = configuration.visuals.makeRound;
}