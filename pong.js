var BUMPER_VERT_ACCEL = 0.07;
var VERTICAL_RICOCHET_SPEED = 2;
var HORIZONTAL_BALL_START_SPEED = 5;
var VERTICAL_BALL_START_SPEED = 1;

var ball;
var bumper_left;
var bumper_right;
var graphicsItems;
var score_left = 0;
var score_right = 0;
var rally = 0;

// Ball class
function Ball(x_vel, y_vel){
	this.x = width/2;
	this.y = height/2;
	this.size = (width/40 < height/20) ? width/40 : height/20;
	this.x_vel = x_vel;
	this.y_vel = y_vel;
	//this.x_accel = 0;
	//this.y_accel = 0;
	this.resetPos = function(x_dir){
		// Input is 1 or -1
		graphicsItems.pop();
		ball = new Ball(x_dir * HORIZONTAL_BALL_START_SPEED, map(random(1),0,1,-1,1) * VERTICAL_BALL_START_SPEED);
		graphicsItems.push(ball);
	}
	this.update = function(){
		if (bumper_left.bounding_box(this.x,this.y) || bumper_right.bounding_box(this.x,this.y)){
			this.x_vel = -this.x_vel; // Reverse direction
			rally += 1;
			var y;
			if (this.x < width/2){
				y = bumper_left.getY();
			}else{
				y = bumper_right.getY();
			}
			this.y_vel += map(this.y - y, 0,bumper_left.height/2, 0, VERTICAL_RICOCHET_SPEED); // Add to vertical velocity if the ball doesn't hit the exact centre.
		}
		
		if (this.y < 0 || this.y > height){ // Adds collision to the top and bottom of the viewport.
			this.y_vel = -this.y_vel;
		}
		
		if (this.x < 0){
			background(50, 89, 100);
			score_right += 1;
			rally = 0;
			this.resetPos(-1);
		} else if (this.x > width){
			background(50, 89, 100);
			score_left += 1;
			rally = 0;
			this.resetPos(1);
		}
		//this.x_vel += this.x_accel;
		//this.y_vel += this.y_accel;
		this.x += this.x_vel;
		this.y += this.y_vel;
		//this.x_accel *= 0.93;
		//this.y_accel *= 0.93;
		//this.x_vel *= 0.99;
		//this.y_vel *= 0.99;
	};
	this.show = function(){
		push();
		noStroke;
		fill(255);
		translate(this.x, this.y);
		ellipse(0,0, this.size, this.size);
		pop();
	};
};
// Bumper Class
function Bumper(x_pos){
	this.x = x_pos;
	this.y = height/2;
	this.width = (width/40 < height/20) ? width/40 : height/20;
	this.height = this.width*7;
	//this.height = height/4;
	this.y_vel = 0;
	this.y_accel = 0;
	this.bounding_box = function(x,y){
		if (x < this.x + this.width/2 && x > this.x - this.width/2){
			if (y < this.y + this.height/2 && y > this.y - this.height/2){
				return true;
			}
		}
		return false;
	}
	this.getY = function(){
		return this.y;
	}
	this.update = function(){
		if (this.y + this.height/2 > height){
			this.y = height - this.height/2;
			this.y_accel = 0;
			this.y_vel = 0;
		}
		else if(this.y - this.height/2 < 0){
			this.y = this.height/2;
			this.y_accel = 0;
			this.y_vel = 0;
		}
		this.y_vel += this.y_accel;
		this.y += this.y_vel;
		this.y_accel *= 0.5;
		this.y_vel *= 0.99;
	};
	this.show = function(){
		push();
		noStroke;
		fill(255);
		translate(this.x, this.y);
		rectMode(CENTER);
		rect(0,0, this.width, this.height);
		pop();
	};
};
// GraphicsItems Class
function GraphicsItems(items){
	if (items){
		this.items = items;
	} else{
		this.items = [];
	}
	this.pushList = function(item_list){
		items += item_list;
	}
	this.push = function(item){
		items.push(item);
	}
	this.pop = function(){
		items.pop();
	}
	this.run = function() {
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].update();
			this.items[i].show();
		}
	}
};

function setup() {
	createCanvas(windowWidth - 4, windowHeight - 4);
	background(50, 89, 100);
	HORIZONTAL_BALL_START_SPEED = windowWidth / 170;
	HORIZONTAL_BALL_START_SPEED = ( width / 40 ) / 4;
	VERTICAL_BALL_START_SPEED = windowHeight / 350;
	var x_dir = 1;
	if (random(1) > 0.5){ // Pick a random direction to start
		x_dir = -1; 
	}

	bumper_left = new Bumper(20);
	bumper_right = new Bumper(width-20);
	ball = new Ball(x_dir * HORIZONTAL_BALL_START_SPEED, map(random(1),0,1,-1,1) * VERTICAL_BALL_START_SPEED);
	graphicsItems = new GraphicsItems([bumper_left, bumper_right, ball]);
}

function draw() {
	background(50, 89, 100);
	
	textAlign(CENTER);
	textSize(32);
	fill(255);
	text('PONG\nCLONE', width/2, height/2);
	text(String(score_left), 20, height - 20);
	text(String(score_right), width - 20, height - 20);
	text(String(rally), width/2, height - 20);
	graphicsItems.run();
	checkInput();
}
function checkInput(){
	if (keyIsDown(UP_ARROW)) {
		bumper_right.y_accel -= BUMPER_VERT_ACCEL;
	}
	if (keyIsDown(DOWN_ARROW)) {
		bumper_right.y_accel += BUMPER_VERT_ACCEL;
	}
	if (keyIsDown(87)){
		bumper_left.y_accel -= BUMPER_VERT_ACCEL;
	}
	if (keyIsDown(83)){
		bumper_left.y_accel += BUMPER_VERT_ACCEL;
	}
	return false;
}
function windowResized() {
	setup();
}