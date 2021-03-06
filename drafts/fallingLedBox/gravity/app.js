import { Kit } from '../../sharedMods/kit.js';

var kit = Kit.init();

document.addEventListener('click', function() {
	console.log(kit.pointerX);
}, false);

window.addEventListener("resize", function() {
	console.log(kit.width);
}, false);

// console.log(kit);

// -----------------------------

var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var mouse = {
	x: window.innerWidth,
	y: window.innerHeight
};

var colours = [
	"#C83858",
	"#EE7566",
	"#F1C278",
	"#DCCB9B",
	"#7F9D8C"
];

window.addEventListener("mousemove", function(e) {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}, false);

window.addEventListener("resize", function(e) {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	init();
}, false);

window.addEventListener("click", function(e) {
	init();
}, false);

function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColours(cols) {
	return cols[Math.floor(Math.random()*cols.length)];
}

// draw a shape
function LED(x, y, dy, dx, radius, col) {
	this.x = x;
	this.y = y;
	// y velocity
	this.dy = dy;
	this.dx = dx;
	this.radius = radius;
	this.colour = col;

	this.update = function() {
		// add gravity
		// check bottom bound
		if (this.y + this.radius + this.dy > canvas.height) {
			// bounce & reverse motion
			this.dy = -this.dy * friction;
		} else {
			// accelerate if not at bottom
			this.dy += gravity;
		}
		// check side bounds
		if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius <= 0) {
			this.dx = -this.dx;
		}
		// move
		this.y += this.dy;
		this.x += this.dx;

		this.draw();
	}

	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		c.fillStyle = this.colour;
		c.fill();
		c.stroke();
		c.closePath();
	}
}

var gravity = 1,
	friction = 0.9,
	velocity = 2;

var ledRadius = 10,
	ledAmount = 50,
	ledArr,
	colRange = [200, 300];

function init() {
	ledArr = [];
 // fill the led array
	for (var i = 0; i < ledAmount; i++) {
		// get a random x coord
		let x = randomIntFromRange(ledRadius, canvas.width - ledRadius);
		// get a random y coord
		let y = randomIntFromRange(0, canvas.height - ledRadius);
		// bounce off each way
		var dx = randomIntFromRange(-2, 2);
		var dy = velocity;
		// get random col
		let col = 'hsla('+randomIntFromRange(colRange[0], colRange[1])+', 50%, 50%, 1)';
		ledArr.push(new LED(x, y, dy, dx, ledRadius, col));
	}
	console.log(ledArr);
}

function animate() {
	requestAnimationFrame(animate);

	c.clearRect(0,0, canvas.width, canvas.height);
	// get the leds to draw
	for (var i = 0; i < ledArr.length; i++) {
		ledArr[i].update();
	}
	// led.update();
	// c.fillText("We're Here", mouse.x, mouse.y);
}

init();
animate();












