//"use strict";

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100;

log('Welcome');

function Star(declination, ascension, brightness, color){
	this.declination = declination;
	this.brightness = brightness;
	this.ascension = ascension;
	this.color = color;
	this.hemisphere = this.ascension < 180 ? 0 : 1;
	this.x = Math.sin(((this.ascension % 180) - 90) / 180 * Math.PI);
	this.y = Math.sin(this.declination / 180 * Math.PI);
	//log(this);
}

function Hemisphere(context, x0, y0, width, height) {
	this.context = context;
	this.x = x0;
	this.y = y0;
	this.width = width;
	this.height = height;
	
	this.x2 = this.x + (width / 2);
	this.y2 = this.y + (height / 2);
}
Hemisphere.prototype.drawStar = function(star) {
	this.context.fillStyle = 'rgb(' + star.color.join(',') + ')';
	var x = this.x2 + (star.x * this.width / 2);
	var y = this.y2 + (star.y * this.height / 2);
	this.context.fillRect(x,y,3,3);
	//log("this.context.fillRect("+( this.x2 + (star.x * this.width / 2) )+","+(this.y2 + (star.y * this.height / 2))+",3,3);");

};
Hemisphere.prototype.draw = function() {
	this.context.strokeStyle = 'rgb(180,180,180)';
	this.context.strokeRect(this.x, this.y, this.width, this.height);
	
	this.drawStar(new Star(0,0,5,[255,255,255]));
	this.drawStar(new Star(90,179,5,[255,255,255]));
	this.drawStar(new Star(90,90,5,[255,255,255]));
};


function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
}

Vector.prototype.getMagnitude = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.getAngle = function () {
  return Math.atan2(this.y,this.x);
};

Vector.fromAngle = function (angle, magnitude) {
  return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};


function renderStars(canvases, data) {
	data.forEach(function(star) {
		var h = canvases[star.hemisphere];
		h.drawStar(star);
	});
}

var stars = [
	new Star(-90, 180, 10, [255, 0, 0]),
	new Star(0, 180, 10, [0, 0, 255]),
	new Star(45, 270, 10, [0, 255, 0]),
	new Star(0, 90, 10, [255, 0, 0]),
	new Star(-30, 90, 10, [255, 128, 0]),
	new Star(-45, 90, 10, [255, 255, 0]),
	new Star(-60, 90, 10, [0, 255, 0]),
	new Star(-90, 90, 10, [0, 0, 255]),
];
var qx = canvas.width * .25;
var qy = canvas.height * .25;
var hemispheres = [
	new Hemisphere(ctx, 0, qy, 2 * qx, 2 * qy),
	new Hemisphere(ctx, 2 * qx, qy, 2 * qx, 2 * qy)
];

function loop() {
  clear();
  update();
//  draw();
//  queue();
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
  hemispheres.forEach(function(h) { h.draw(); });
  renderStars(hemispheres, stars);
}

function draw() {
  drawParticles();
}

function queue() {
  window.requestAnimationFrame(loop);
}

loop();