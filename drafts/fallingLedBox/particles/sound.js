var ctx = new window.AudioContext();


// add some other params laterer
function createSound(size, radius) {
	let osc = ctx.createOscillator();
	osc.frequency.value = 220;
	osc.type = 'sine';
	osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime+3);

	let lfo = ctx.createOscillator();
	lfo.frequency.value = 4;
	lfo.type = 'sine';

	// osc.connect(ctx.destination);

	let gain1 = ctx.createGain();
	gain1.gain.value = 1;
	gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+1.9);

	 let gain2 = ctx.createGain();
	gain2.gain.value = 300;

	lfo.connect(gain2).connect(osc.detune);
	osc.connect(gain1).connect(ctx.destination);

	// lfo.connect(gain1).connect(gain2);
	// osc.connect(gain1).connect(gain2);
	// gain1.connect(gain2).connect(ctx.destination);

	osc.start();
	lfo.start();
	osc.stop(ctx.currentTime+1);
	lfo.stop(ctx.currentTime+1);
}

var sound = createSound(4);

function playSound() {
	osc.connect(ctx.destination);
	osc.start();
}

export { createSound };