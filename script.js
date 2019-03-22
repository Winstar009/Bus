

var points = Array.from(document.getElementsByClassName("point")); 

points.forEach(function(element) {
	var x = element.getAttribute("data-x");
	var y = element.getAttribute("data-y");
	element.style.left = x + "%";
	element.style.top = y + "%";
});

var camera = Array.from(document.getElementsByClassName("camera"));

var min = 100;
var max = 500;
var coef = 100;
var step = 50;

function zoomP(){
	if(coef < max)
		coef += step;
	camera[0].style.width = coef + "%";
	camera[0].style.height = coef + "%";
}

function zoomM(){
	if(coef > min)
		coef -= step;
	camera[0].style.width = coef + "%";
	camera[0].style.height = coef + "%";

	norm();
}

function mouseDown(){
	this.onmousemove = function() {
		console.log(1);
	}
	this.onmouseUp = function() {
		console.log("Up");
	}
	console.log("Dowm");
	console.log(this);
}

var oldX, oldY, newX, newY;
var X = 0, Y = 0;

var plant = Array.from(document.getElementsByClassName("plant"));

function mapMouseMove(){
	if(event.buttons == 1){
		newX = event.clientX;
		newY = event.clientY;
		var resX = newX - oldX;
		var resY = newY - oldY;
		var freeHeight = camera[0].clientHeight - plant[0].clientHeight;
		var freeWidth = camera[0].clientWidth - plant[0].clientWidth;

		if(X + resX <= 0 && X + resX >= -freeWidth){
			X += resX;
		}
		if(Y + resY <= 0 && Y + resY  >= -freeHeight){
			Y += resY;
		}

		camera[0].style.left = X + "px";
		camera[0].style.top = Y + "px";
	}
	oldX = event.clientX;
	oldY = event.clientY;
}

function norm(){
	var freeHeight = camera[0].clientHeight - plant[0].clientHeight;
	var freeWidth = camera[0].clientWidth - plant[0].clientWidth;
	if(X < -freeWidth){
		camera[0].style.left = -freeWidth + "px";
		X = -freeWidth;
	}
	if(Y < -freeHeight){
		camera[0].style.top = -freeHeight + "px";
		Y = -freeHeight;
	}
}