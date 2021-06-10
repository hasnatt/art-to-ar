var canvas = document.getElementById('canvas');

var context = canvas.getContext('2d');

var load_counter = 0;

var background = new Image();

var layer2 = new Image();
var layer3 = new Image();
var layer4 = new Image();
var layer5 = new Image();
var layer6 = new Image();
var layer7 = new Image();
var layer8 = new Image();
var mask = new Image();

var layer_list = [
    {
        'image': background,
        'src': './images/layer_1.png',
        'z_index': -2.25,
        'position':{x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': layer2,
        'src': './images/layer_2.png',
        'z_index': -2,
        'position':{x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': layer3,
        'src': './images/layer_3.png',
        'z_index': -1.75,
        'position':{x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': layer4,
        'src': './images/layer_4.png',
        'z_index': -1.5,
        'position':{x: 0, y: 0},
        'blend': null,
        'opacity': 0.2
    },
    {
        'image': layer5,
        'src': './images/layer_5.png',
        'z_index': -1.25,
        'position':{x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': layer6,
        'src': './images/layer_6.png',
        'z_index': -0.25,
        'position':{x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': mask,
        'src': './images/layer_9.png',
        'z_index': 0,
        'position':{x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': layer7,
        'src': './images/layer_7.png',
        'z_index': 0.25,
        'position':{x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': layer8,
        'src': './images/layer_8.png',
        'z_index': 0.3,
        'position':{x: 0, y: 0},
        'blend': null,
        'opacity': 1
    }

]

layer_list.forEach(function(layer, index) {
    layer.image.onload = function(){
       load_counter+=1; 
       if (load_counter >= layer_list.length){
           drawCanvas();
       }
    }
    layer.image.src = layer.src;
});


// Draw layers in Canvas
function drawCanvas() {		
	// Erase everything currently on the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	// Loop through each layer in the list and draw it to the canvas
	layer_list.forEach(function(layer, index) {
		
		// Calculate what the position of the layer should be (getOffset function is below)
		layer.position = getOffset(layer);

		// If the layer has a blend mode set, use that blend mode, otherwise use normal
		if (layer.blend) {
			context.globalCompositeOperation = layer.blend;
		} else {
			context.globalCompositeOperation = 'normal';
		}
		
		// Set the opacity of the layer
		context.globalAlpha = layer.opacity;
		
		// Draw the layer into the canvas context
		context.drawImage(layer.image, layer.position.x, layer.position.y);
	});
	
	// Loop this function! requestAnimationFrame is a special built in function that can draw to the canvas at 60 frames per second
	// NOTE: do not call drawCanvas() without using requestAnimationFrame here—things will crash!
	requestAnimationFrame(drawCanvas);
}

// Function to calculate layer offset
function getOffset(layer) {
	// Calculate the amount you want the layers to move based on touch or mouse input.
	// You can play with the touch_multiplier variable here. Depending on the size of your canvas you may want to turn it up or down.
	var touch_multiplier = 0.3;
	var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
	var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;
	
	// Calculate the total offset for both X and Y
	var offset = {
		x: touch_offset_x,
		y: touch_offset_y
	};

	// Return the calculated offset to whatever requested it.
	return offset;
}




//// TOUCH AND MOUSE CONTROLS ////

// Initialize variables for touch and mouse-based parallax

// This is a variable we're using to only move things when you're touching the screen or holding the mouse button down.
var moving = false;

// Initialize touch and mouse position
var pointer_initial = {
	x: 0,
	y: 0
};
var pointer = {
	x: 0,
	y: 0
};

// This one listens for when you start touching the canvas element
canvas.addEventListener('touchstart', pointerStart);
// This one listens for when you start clicking on the canvas (when you press the mouse button down)
canvas.addEventListener('mousedown', pointerStart);

// Runs when touch or mouse click starts
function pointerStart(event) {
	// Ok, you touched the screen or clicked, now things can move until you stop doing that
	moving = true;
	// Check if this is a touch event
	if (event.type === 'touchstart') {
		// set initial touch position to the coordinates where you first touched the screen
		pointer_initial.x = event.touches[0].clientX;
		pointer_initial.y = event.touches[0].clientY;
	// Check if this is a mouse click event
	} else if (event.type === 'mousedown') {
		// set initial mouse position to the coordinates where you first clicked
		pointer_initial.x = event.clientX;
		pointer_initial.y = event.clientY;
	}
}


// This runs whenever your finger moves anywhere in the browser window
window.addEventListener('mousemove', pointerMove);
// This runs whenever your mouse moves anywhere in the browser window
window.addEventListener('touchmove', pointerMove);

// Runs when touch or mouse is moved
function pointerMove(event) {
	// This is important to prevent scrolling the page instead of moving layers around
	event.preventDefault();
	// Only run this if touch or mouse click has started
	if (moving === true) {
		var current_x = 0;
		var current_y = 0;
		// Check if this is a touch event
		if (event.type === 'touchmove') {
			// Current position of touch
			current_x = event.touches[0].clientX;
			current_y = event.touches[0].clientY;
		// Check if this is a mouse event
		} else if (event.type === 'mousemove') {
			// Current position of mouse cursor
			current_x = event.clientX;
			current_y = event.clientY;
		}
		// Set pointer position to the difference between current position and initial position
		pointer.x = current_x - pointer_initial.x;
		pointer.y = current_y - pointer_initial.y; 
	}
};

// Listen to any time you move your finger in the canvas element
canvas.addEventListener('touchmove', function(event) {
	// Don't scroll the screen
	event.preventDefault();
});
// Listen to any time you move your mouse in the canvas element
canvas.addEventListener('mousemove', function(event) {
	// Don't do whatever would normally happen when you click and drag
	event.preventDefault();
});

// Listen for when you stop touching the screen
window.addEventListener('touchend', function(event) {
	// Run the endGesture function (below)
	endGesture();
});
// Listen for when you release the mouse button anywhere on the screen
window.addEventListener('mouseup', function(event) {
	// Run the endGesture function (below)
	endGesture();
});


function endGesture() {
	// You aren't touching or clicking anymore, so set this back to false
	moving = false;
	
	pointer.x = 0;
	pointer.y = 0;
}
