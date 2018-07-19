import { Kit } from '../../sharedMods/kit.js';
import {  rotate, resolveCollision } from './utilities.js';
import { createSound } from './sound.js';


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

var kit = new Kit(canvas);
console.log(kit.width);

// document.addEventListener('click', function() {
// 	console.log(kit.pointerX);
// }, false);

// window.addEventListener("resize", function() {
// 	console.log(kit.width);
// }, false);

// console.log(kit);

// -----------------------------

// var c = canvas.getContext('2d');

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// window.addEventListener("resize", function(e) {
// 	canvas.width = window.innerWidth;
// 	canvas.height = window.innerHeight;
// 	init();
// }, false);

var mouse = {
	x: 0,
	y: 0
};

function Colour(hue, sat, light, op) {
	this.hue = hue;
	this.sat = sat;
	this.light = light;
	this.op = op;

	this.write = () => {
		return 'hsla('+this.hue+','+this.sat+','+this.light+','+this.op+')';
	}
}
var colours = [
	"#C83858",
	"#EE7566",
	"#F1C278",
	"#DCCB9B",
	"#7F9D8C"
];

// window.addEventListener("mousemove", function(e) {
// 	mouse.x = e.clientX;
// 	mouse.y = e.clientY;
// }, false);



window.addEventListener("click", function(e) {
	init();
}, false);


function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColours(cols) {
	return cols[Math.floor(Math.random()*cols.length)];
}

function distance(x1, y1, x2, y2) {
	let xDis = x2 - x1;
	let yDis = y2 - y1;

	return Math.sqrt( Math.pow(xDis, 2) + Math.pow(yDis, 2) );
}

var start = performance.now();
function play(led, now) {
	let count = 0;


	if ( (now - start) < 100) {
		led.fill = new Colour(led.col,'10%','90%',1);
	} else {
		led.fill = new Colour(led.col,'50%','60%',1);
	}

}

// return a random value to use as the starting velocity
function makeRandVel(randNum, vel) {
	if (randNum < 0.5) {
		return +randNum+vel;
	} else {
		return randNum-vel
	}
}

// event manager
const eventManager = {
  eventsStack: [],
  fire(eventName, fn) {
    this.eventsStack.push({ event: eventName, fn });
  },
  listen(eventName, payload) {
    this.eventsStack
      .filter(({ event }) => event === eventName)
      .forEach(({ fn }) => fn(payload));
  },

  // have a module that has the function in to call, then call the function

  // fire(eventName, data) {
  // 	this.eventsStack.push({ event: eventName, data });
  // },
  // listen(eventName, fn) {

  // }
}
eventManager.listen('hit', console.log('hit'));

// draw a shape
function LED(x, y, dy, dx, radius, col) {
	this.x = x;
	this.y = y;
	// y velocity
	this.velocity = {
		x: makeRandVel(Math.random(), velocity),
		y: makeRandVel(Math.random(), velocity)
	}
	this.radius = radius;
	this.col = col;
	this.stroke = new Colour(col,'50%','50%',1);
	this.fill = new Colour(col,'50%','50%',0.2);
	this.mass = 1;
	// this.hit = new CustomEvent('hit');

	this.update = (leds, now) => {
		this.draw();

		for (let i=0; i<leds.length; i++) {
			// if it's the same particle just carry on
			if (this === leds[i]) continue;
			// otherwise check distance
			if (distance(this.x, this.y, leds[i].x, leds[i].y) - (this.radius+leds[i].radius) < 0) {
				resolveCollision(this, leds[i]);
				start = performance.now();
				// console.log(leds[i].radius);
				createSound(i, leds[i].radius);
				// play(this, now);
				// event try
				// eventManager.fire('hit', this);
			}
			if (this === leds[i]) {
				if ((performance.now() - start) < 100) {
					this.fill = new Colour(this.col, '30%', '90%', 0.3);
				} else {
					this.fill = new Colour(this.col,'50%','50%',0.2);
				}
			}
		}

		// check side bounds
		if (this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius <= 0) {
			this.velocity.x = -this.velocity.x;
		}
		// top and bottom bounds
		if (this.y + this.radius + this.velocity.y > canvas.height || this.y - this.radius <= 0) {
			this.velocity.y = -this.velocity.y;
		}



		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}


	this.updateGravity = function() {
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
		c.strokeStyle = this.stroke.write();
		c.fillStyle = this.fill.write();
		c.fill();
		c.stroke();
		c.closePath();
	}
}

var gravity = 1,
	friction = 0.9,
	velocity = 1;

var ledAmount = 20,
	ledArr,
	colRange = [200, 300];


function init() {
	ledArr = [];
	for (let i = 0; i < ledAmount; i++) {
		let ledRadius = randomIntFromRange(20, 30);
		let x = randomIntFromRange(ledRadius*2, window.innerWidth-ledRadius*2);
		let y = randomIntFromRange(ledRadius*2, window.innerHeight-ledRadius*2);
		let col = randomIntFromRange(colRange[0], colRange[1]);

		// comparing the distance between particle - make sure they don't overlap
		if (i > 0) { // don't need the first one
			for (let j=0; j<ledArr.length; j++) {
				if (distance(x, y, ledArr[j].x, ledArr[j].y) - ledRadius * 2 < 0) {
					x = randomIntFromRange(ledRadius*2, window.innerWidth-ledRadius*2);
					y = randomIntFromRange(ledRadius*2, window.innerHeight-ledRadius*2);

					// this makes it loop exactly the right amount of times backwards: nifty
					j = -1;
				}
			}
		}

		ledArr.push(new LED(x, y, 0, 0, ledRadius, col));
	}
}

function initGravity() {
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

function animate(now) {
	requestAnimationFrame(animate);

	c.clearRect(0,0, canvas.width, canvas.height);
	// get the leds to draw
	ledArr.forEach(led => {
		led.update(ledArr, now);
	})

	// if (getDistance(led1.x, led1.y, led2.x, led2.y) < led1.radius + led2.radius) {
	// 	led1.colour = 'red';
	// } else {
	// 	led1.colour = 'black';
	// }
	// c.fillText("We're Here", mouse.x, mouse.y);
}

init();
animate();












