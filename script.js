function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// ======================= генерация точек и путей =======================
kPoitns = 100;
kRoutes = 10;
kPointsInRoute = 5;

var dataPoints = [];
for(i = 0; i < kPoitns; i++){
	el = new Object();
	el.id = i;
	el.x = Math.random() * 100;
	el.y = Math.random() * 100;
	dataPoints.push(el);
}

var dataRoutes = [];
for(i = 0; i < kRoutes; i++){
	el = new Object();
	el.id = i;
	el.points = [];
	el.color = getRandomColor();
	for(j = 0; j < kPointsInRoute; j++){
		p = Math.round(Math.random() * kPoitns);
		if(p < 0) p = 0;
		if(p >= kPoitns) p = kPoitns - 1;
		el.points.push(p);
	}
	dataRoutes.push(el);
}
// ======================= генерация точек и путей =======================

var canvas = document.getElementById("map-canvas");
var cWidth = canvas.clientWidth;
var cHeight = canvas.clientHeight

canvas.width = cWidth;
canvas.height = cHeight;

var X = 0, Y = 0;
var zCoef = 1;

window.onload = printCanvas();

function printCanvas() {
	var coefX = canvas.clientWidth / 100;
	var coefY = canvas.clientHeight / 100;
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, cWidth, cHeight);

	dataRoutes.forEach(function(e) {
		ctx.beginPath();
		ctx.moveTo(dataPoints[e.points[0]].x * coefX + X, dataPoints[e.points[0]].y * coefY + Y);
		e.points.forEach(function(p) {
			ctx.lineTo(dataPoints[p].x * coefX + X, dataPoints[p].y * coefY + Y);
		});
		ctx.strokeStyle = e.color;
		ctx.lineWidth = 1;
		ctx.stroke();
	});

	dataPoints.forEach(function(e) {
		ctx.beginPath();
		ctx.arc(e.x * coefX + X, e.y * coefY + Y, 10, 0, Math.PI * 2, true);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "blue";
		ctx.fillStyle = "#d0d0d0";
		ctx.stroke();
		ctx.fill();
	});
}

var inCamera = false;
var cameraMove = false;
canvas.onmouseenter = function () {
	inCamera = true;
}

canvas.onmouseleave = function () {
	inCamera = false;
	cameraMove = false;
}

canvas.onmousedown = function () {
	if(inCamera)
		cameraMove = true;
}

canvas.onmouseup = function () {
	cameraMove = false;
}

// перемещение
canvas.onmousemove = function() {
	moveCamera();
}

function moveCamera() {
	if(cameraMove){
		newX = event.clientX;
		newY = event.clientY;
		var resX = newX - oldX;
		var resY = newY - oldY;
		if(Math.abs(X + resX) < cWidth * zCoef / 2)
			X += resX;
		if(Math.abs(Y + resY) < cHeight * zCoef / 2)
			Y += resY;
		printCanvas();
	}
	oldX = event.clientX;
	oldY = event.clientY;	
}

/*
var oldX, oldY, newX, newY;
// ===================================================================

// масштабирование
var X = 0, Y = 0;
var zMin = 1, zMax = 3.5;
var zStep = 0.5;
var zCoef = 1;
var zCStep = 1;
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
		nX = newCoord(X, camera.clientWidth, zCoef, zCoef + zStep);
		nY = newCoord(Y, camera.clientHeight, zCoef, zCoef + zStep);
		zoom(zCoef, zCoef + zStep, X, Y, nX, nY);
		zCoef += zStep;
		X = nX;
		Y = nY;
		zCStep++;
	}
}

zoomM.onclick = function() {
	if(zCoef > zMin) {
		nX = newCoord(X, camera.clientWidth, zCoef, zCoef - zStep);
		nY = newCoord(Y, camera.clientHeight, zCoef, zCoef - zStep);
		zoom(zCoef, zCoef - zStep, X, Y, nX, nY);
		zCoef -= zStep;
		X = nX;
		Y = nY;
		zCStep--;
	}
}

plant.onwheel = function() {
	if(scrollUnlock){
		cX = -cursorX * zCoef;
		cY = -cursorY * zCoef;
		if(event.deltaY < 0){
			if(zCoef < zMax) {
				nX = newCoord(cX, camera.clientWidth, zCoef, zCoef + zStep);
				nY = newCoord(cY, camera.clientHeight, zCoef, zCoef + zStep);
				zoom(zCoef, zCoef + zStep, X, Y, nX, nY);
				zCoef += zStep;
				X = nX;
				Y = nY;
				zCStep++;
			}
		}
		else{
			if(zCoef > zMin) {
				nX = newCoord(cX, camera.clientWidth, zCoef, zCoef - zStep);
				nY = newCoord(cY, camera.clientHeight, zCoef, zCoef - zStep);
				zoom(zCoef, zCoef - zStep, X, Y, nX, nY);
				zCoef -= zStep;
				X = nX;
				Y = nY;
				zCStep--;
			}
		}
	}
}

function newCoord(val, len, coef, newCoef) {
	return (val / (len * coef / 100)) * (len * newCoef / 100);
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
*/