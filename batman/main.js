
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var loading_screen = document.getElementById('loading');

var loaded = false;
var load_counter = 0;

var background = new Image();
var clouds = new Image();
var floaties_1 = new Image();
var floaties_2 = new Image();
var shadows = new Image();
var wings = new Image();
var mask = new Image();
var batman = new Image();
var batsign = new Image();

// Create a list of layer objects
var layer_list = [
	{
		'image': background,
		'src': './images/layer_1.png',
		'z_index': -1.55,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},

	{
		'image': floaties_1,
		'src': './images/layer_3.png',
		'z_index': -1.25,
		'position': {x: 0, y: 0},
		'blend': 'overlay',
		'opacity': 1
	},
	{
		'image': floaties_2,
		'src': './images/layer_4.png',
		'z_index': -0.5,
		'position': {x: 0, y: 0},
		'blend': 'overlay',
		'opacity': 1
	},
	{
		'image': shadows,
		'src': './images/shadows.png',
		'z_index': -1.5,
		'position': {x: 0, y: 0},
		'blend': 'multiply',
		'opacity': 0.7
	},
	{
		'image': wings,
		'src': './images/layer_6.png',
		'z_index': -0.5,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},

	{
		'image': mask,
		'src': './images/mask.png',
		'z_index': 0,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': batman,
		'src': './images/layer_7.png',
		'z_index': 1,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': batsign,
		'src': './images/layer_8.png',
		'z_index': 1.1,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 0.9
	}
];

layer_list.forEach(function(layer, index) {
	layer.image.onload = function() {
		load_counter += 1;
		if (load_counter >= layer_list.length) {
			// hie the loading screen
			hideLoading();
			requestAnimationFrame(drawCanvas);
		}
	}
	layer.image.src = layer.src;
});

function hideLoading() {
	loading_screen.classList.add('hidden');
}

function drawCanvas() {
	// clear whatever is in the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	TWEEN.update();

	// Calculate canvas rotation
	var rotate_x = (pointer.y * -0.15) + (motion.y * -1.2);
	var rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);

	var transform_string = "rotateX(" + rotate_x + "deg) rotateY(" + rotate_y + "deg)";

	// rotate the canvas 
	canvas.style.transform = transform_string;

	// Loop through each layer so its drawn to canvas
	layer_list.forEach(function(layer, index) {

		layer.position = getOffset(layer);

		if (layer.blend) {
			context.globalCompositeOperation = layer.blend;
		} else {
			context.globalCompositeOperation = 'source-over';
		}

		context.globalAlpha = layer.opacity;

		context.drawImage(layer.image, layer.position.x, layer.position.y);
	});

	requestAnimationFrame(drawCanvas);
}

//complex maths
function getOffset(layer) {
	var touch_multiplier = 0.3;
	var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
	var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;

	var motion_multiplier = 2.5;
	var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
	var motion_offset_y = motion.y * layer.z_index * motion_multiplier;

	var offset = {
		x: touch_offset_x + motion_offset_x,
		y: touch_offset_y + motion_offset_y
	};

	return offset;
}

//// TOUCH CONTROLS

var moving = false;

var pointer_initial = {
	x: 0,
	y: 0
};

var pointer = {
	x: 0,
	y: 0
};

canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);

function pointerStart(event) {
	moving = true;
    if (event.type === 'touchstart') {
		pointer_initial.x = event.touches[0].clientX;
		pointer_initial.y = event.touches[0].clientY;
	} else if (event.type === 'mousedown') {
		pointer_initial.x = event.clientX;
		pointer_initial.y = event.clientY;
	}
}

window.addEventListener('touchmove', pointerMove);
window.addEventListener('mousemove', pointerMove);

function pointerMove(event) {
	event.preventDefault();
	if (moving === true) {
		var current_x = 0;
		var current_y = 0;
		if (event.type === 'touchmove') {
			current_x = event.touches[0].clientX;
			current_y = event.touches[0].clientY;
		} else if (event.type === 'mousemove') {
			current_x = event.clientX;
			current_y = event.clientY;
		}
		pointer.x = current_x - pointer_initial.x;
		pointer.y = current_y - pointer_initial.y;
	}
}

canvas.addEventListener('touchmove', function(event) {
	event.preventDefault();
});

canvas.addEventListener('mousemove', function(event) {
	event.preventDefault();
});

window.addEventListener('touchend', function(event) {
	endGesture();
});

window.addEventListener('mouseup', function(event) {
	endGesture();
});

function endGesture() {
	moving = false;

	TWEEN.removeAll();
	var pointer_tween = new TWEEN.Tween(pointer).to({x: 0, y: 0}, 300).easing(TWEEN.Easing.Back.Out).start();
}


//// MOTION CONTROLS 

var motion_initial = {
	x: null,
	y: null
};

var motion = {
	x: 0,
	y: 0
};

var motion_button = document.querySelector('.allow-motion-button');


var alpha = 0;
var beta = 0;
var total_x = 0;
var total_y = 0;
var max_offset = 2000;

window.addEventListener("devicemotion", function(e) {

	motion_button.classList.remove('visible');

    alpha = e.rotationRate.alpha;
    beta = e.rotationRate.beta;

    total_x += beta;
    total_y += alpha;

    if (Math.abs(total_x) > max_offset) {
        total_x = max_offset * Math.sign(total_x);
    }
    if (Math.abs(total_y) > max_offset) {
        total_y = max_offset * Math.sign(total_y);
    }

    var x_offset = -total_y / 100;
    var y_offset = total_x / 100;

    motion.x = x_offset;
    motion.y = y_offset;

    if (window.orientation === 90) {
    	motion.x = -x_offset;
    	motion.y = -y_offset;
    } else if (window.orientation === -90) {
    	motion.x = x_offset;
    	motion.y = y_offset;
    } else if (window.orientation === 180) {
    	motion.x = -y_offset;
    	motion.y = x_offset;
    } else if (window.orientation === 0) {
    	motion.x = y_offset;
    	motion.y = -x_offset;
    }

});

window.addEventListener('orientationchange', function(event) {

	total_x = 0;
	total_y = 0;
});

if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
	motion_button.classList.add('visible');
}

// iOS Permissions
function enableMotion() {
	DeviceOrientationEvent.requestPermission();
	motion_button.classList.remove('visible');
}
