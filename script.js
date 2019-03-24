var points = Array.from(document.getElementsByClassName("point"));

var oldX, oldY, newX, newY;
// расстановка точек
points.forEach(function(element) {
	var x = element.getAttribute("data-x");
	var y = element.getAttribute("data-y");
	element.style.left = x + "%";
	element.style.top = y + "%";
});
// ===================================================================

// масштабирование
var X = 0, Y = 0;
var zMin = 1, zMax = 3.5;
var zStep = 0.5;
var zCoef = 1;
var zCStep = 1;

var coefP = 1.6, coefM = 0.5, corZ = 0.1;
var scrollUnlock = true;

function zoom(coef, coefTo, posX, posY, posXTo, posYTo) {
	scrollUnlock = false;
	zoomP.setAttribute("disabled", "disabled");
	zoomM.setAttribute("disabled", "disabled");
	step = coefTo - coef;
	stepX = posXTo - posX;
	stepY = posYTo - posY;
	animate({
		duration: 1000,
		timing: function(timeFraction) {
			return Math.pow(timeFraction, 2);
		},
		draw: function(progress) {
			val = coef + step * progress;
			valX = posX + stepX * progress;
			valY = posY + stepY * progress;
			camera.style.transform = "matrix(" + val + ", 0, 0," + val + "," + valX + "," + valY + ")";
			if(progress == 1){
				ret();
			}
			posTarget();
		}
	});
}

zoomP.onclick = function() {
	if(zCoef < zMax) {
		xyCoef = coefP - zCStep * corZ;
		zoom(zCoef, zCoef + zStep, X, Y, X * xyCoef, Y * xyCoef);
		zCoef += zStep;
		X *= xyCoef;
		Y *= xyCoef;
		zCStep++;
	}
}

zoomM.onclick = function() {
	if(zCoef > zMin) {
		xyCoef = coefM + zCStep * corZ;
		zoom(zCoef, zCoef - zStep, X, Y, X * xyCoef, Y * xyCoef);
		zCoef -= zStep;
		X *= xyCoef;
		Y *= xyCoef;
		zCStep--;
	}
}

plant.onwheel = function() {
	if(scrollUnlock){
		cX = -cursorX * zCoef;
		cY = -cursorY * zCoef;
		if(event.deltaY < 0){
			if(zCoef < zMax) {
				xyCoef = coefP - zCStep * corZ;
				zoom(zCoef, zCoef + zStep, X, Y, cX * xyCoef, cY * xyCoef);
				zCoef += zStep;
				X = cX * xyCoef;
				Y = cY * xyCoef;
				zCStep++;
			}
		}
		else{
			if(zCoef > zMin) {
				xyCoef = coefM + zCStep * corZ;
				zoom(zCoef, zCoef - zStep, X, Y, cX * xyCoef, cY * xyCoef);
				zCoef -= zStep;
				X = cX * xyCoef;
				Y = cY * xyCoef;
				zCStep--;
			}
		}
	}
}
// ===================================================================
function ret(){
	r = false;
	if(Math.abs(X) > camera.clientWidth * zCoef / 2){
		if(X < 0) retX = camera.clientWidth * zCoef / 2 + X;
		else retX = camera.clientWidth * zCoef / 2 - X;
		r = true;
	}
	else{
		retX = 0;
	}
	if(Math.abs(Y) > camera.clientHeight * zCoef / 2){
		if(Y < 0) retY = camera.clientHeight * zCoef / 2 + Y;
		else retY = camera.clientHeight * zCoef / 2 - Y;
		r = true;
	}
	else{
		retY = 0
	}
	if(r){
		animate({
			duration: 1000,
			timing: function(timeFraction) {
				return Math.pow(timeFraction, 2);
			},
			draw: function(progress) {
				if(X < 0) valX = X - retX * progress;
				else valX = X + retX * progress;
				if(Y < 0) valY = Y - retY * progress;
				else valY = Y + retY * progress;
				camera.style.transform = "matrix(" + zCoef + ", 0, 0," + zCoef + "," + valX + "," + valY + ")";
				if(progress == 1){
					if(X < 0) X -= retX;
					else X += retX;
					if(Y < 0) Y -= retY;
					else Y += retY;
					scrollUnlock = true;
					if(zCoef != zMax)
						zoomP.removeAttribute("disabled");
					if(zCoef != zMin)
						zoomM.removeAttribute("disabled");
				}
				posTarget();
			}
		});
	}
	else{
		scrollUnlock = true;
		if(zCoef != zMax)
			zoomP.removeAttribute("disabled");
		if(zCoef != zMin)
			zoomM.removeAttribute("disabled");
	}
}
var inCamera = false;
var cameraMove = false;
plant.onmouseenter = function () {
	inCamera = true;
}

plant.onmouseleave = function () {
	inCamera = false;
	cameraMove = false;
}

plant.onmousedown = function () {
	if(inCamera)
		cameraMove = true;
}

plant.onmouseup = function () {
	cameraMove = false;
}

// перемещение
camera.onmousemove = function() {
	moveCamera();
}

function moveCamera() {
	if(cameraMove){
		newX = event.clientX;
		newY = event.clientY;
		var resX = newX - oldX;
		var resY = newY - oldY;
		if(Math.abs(X + resX) < camera.clientWidth * zCoef / 2)
			X += resX;
		if(Math.abs(Y + resY) < camera.clientHeight * zCoef / 2)
			Y += resY;
		camera.style.transform = "matrix(" + zCoef + ", 0, 0," + zCoef + "," + X + "," + Y + ")";
		posTarget();
	}
	oldX = event.clientX;
	oldY = event.clientY;	
}

var cursorX, cursorY
plant.onmousemove = function() {
	moveCamera();
	corX = (event.view.innerWidth - plant.clientWidth) / 2;
	corY = (event.view.innerHeight - plant.clientHeight) / 2;
	centerX = event.view.innerWidth / 2;
	centerY = event.view.innerHeight / 2
	cursorX = -X / zCoef + (event.clientX - centerX) / zCoef;
	cursorY = -Y / zCoef + (event.clientY - centerY) / zCoef;
	target.style.transform = "matrix(1, 0, 0, 1," + cursorX + "," + cursorY + ")";
	target.innerText = cursorX + ':' + cursorY;
}
// ===================================================================


center.innerText = '0:0';
function posTarget() {
	targetX = -X / zCoef;
	targetY = -Y / zCoef;
	center.style.transform = "matrix(1, 0, 0, 1," + targetX + "," + targetY + ")";
	center.innerText = targetX + ':' + targetY;
}