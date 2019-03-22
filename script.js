var points = Array.from(document.getElementsByClassName("point"));
var camera = Array.from(document.getElementsByClassName("camera"));
var plant = Array.from(document.getElementsByClassName("plant"));

var min = 100;
var max = 500;
var coef = 100;
var step = 50;

var oldX, oldY, newX, newY;
var X = 0, Y = 0;


// расстановка точек
points.forEach(function(element) {
	var x = element.getAttribute("data-x");
	var y = element.getAttribute("data-y");
	element.style.left = x + "%";
	element.style.top = y + "%";
});
// ===================================================================

// масштабирование
function zoomP(){
	if(coef < max)
		coef += step;
	var oldFreeHeight = camera[0].clientHeight - plant[0].clientHeight;
	var oldFreeWidth = camera[0].clientWidth - plant[0].clientWidth;
	camera[0].style.width = coef + "%";
	camera[0].style.height = coef + "%";
	var newFreeHeight = camera[0].clientHeight - plant[0].clientHeight;
	var newFreeWidth = camera[0].clientWidth - plant[0].clientWidth;
	normP(oldFreeHeight, oldFreeWidth, newFreeHeight, newFreeWidth)
}

function normP(oldH, oldW, newH, newW){
	var resW = newW - oldW;
	var resH = newH - oldH;
	camera[0].style.left = X - resW / 2 + "px";
	X -= resW / 2;

	camera[0].style.top = Y - resH / 2 + "px";
	Y -= resH / 2;
	console.log(resH + ':' + resW);
}

function zoomM(){
	if(coef > min)
		coef -= step;
	var oldFreeHeight = camera[0].clientHeight - plant[0].clientHeight;
	var oldFreeWidth = camera[0].clientWidth - plant[0].clientWidth;
	camera[0].style.width = coef + "%";
	camera[0].style.height = coef + "%";
	var newFreeHeight = camera[0].clientHeight - plant[0].clientHeight;
	var newFreeWidth = camera[0].clientWidth - plant[0].clientWidth;
	normM(oldFreeHeight, oldFreeWidth, newFreeHeight, newFreeWidth);
}

function normM(oldH, oldW, newH, newW){
	var freeHeight = camera[0].clientHeight - plant[0].clientHeight;
	var freeWidth = camera[0].clientWidth - plant[0].clientWidth;
	var resW = newW - oldW;
	var resH = newH - oldH;
	camera[0].style.left = X - resW / 2 + "px";
	X -= resW / 2;
	camera[0].style.top = Y - resH / 2 + "px";
	Y -= resH / 2;
	if(X < -freeWidth){
		camera[0].style.left = -freeWidth + "px";
		X = -freeWidth;
	}
	if(Y < -freeHeight){
		camera[0].style.top = -freeHeight + "px";
		Y = -freeHeight;
	}
	console.log(resH + ':' + resW);
}
// ===================================================================

// перемещение
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
// ===================================================================