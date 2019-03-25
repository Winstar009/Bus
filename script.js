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
var cOrigWidth = canvas.clientWidth;
var cOrigHeight = canvas.clientHeight

var cWidth = cOrigWidth;
var cHeight = cOrigHeight

var X = 0, Y = 0;
var zCoef = 1;
var zStep = 0.5;
var zMin = 1, zMax = 5;

window.onload = printCanvas();

function printCanvas() {
	canvas.width = cWidth;
	canvas.height = cHeight;

	var coefX = cWidth / 100;
	var coefY = cHeight / 100;
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

	// доп точки
	// ctx.beginPath();
	// ctx.arc(cursorX, cursorY, 10, 0, Math.PI * 2, true);
	// ctx.lineWidth = 1;
	// ctx.strokeStyle = "black";
	// ctx.fillStyle = "black";
	// ctx.stroke();
	// ctx.fill();

	// ctx.beginPath();
	// ctx.arc(cWidth / 2, cHeight / 2, 10, 0, Math.PI * 2, true);
	// ctx.lineWidth = 1;
	// ctx.strokeStyle = "black";
	// ctx.fillStyle = "black";
	// ctx.stroke();
	// ctx.fill();
	// доп точки
}

// ======================= масштабирование =======================
function zoom(coef, coefTo, posX, posY, posXTo, posYTo) {
	scrollUnlock = false;
	zoomP.setAttribute("disabled", "disabled");
	zoomM.setAttribute("disabled", "disabled");
	step = coefTo - coef;
	stepX = posXTo - posX;
	stepY = posYTo - posY;
	animate({
		duration: 400,
		timing: function(timeFraction) {
			return Math.pow(timeFraction, 2);
		},
		draw: function(progress) {

			cWidth = cOrigWidth * (coef + step * progress);
			cHeight = cOrigHeight * (coef + step * progress);
			zCoef = coef + step * progress;

			X = posX + stepX * progress;
			Y = posY + stepY * progress;

			printCanvas();
			canvas.style.transform = "scale(" + zCoef + "," + zCoef + ")";
			if(progress == 1){
				tx = X;
				ty = Y;
				ret();
			}
		}
	});
}

zoomP.onclick = function() {
	if(zCoef < zMax) {
		nX = newCoord(X, cWidth, zCoef, zCoef + zStep);
		nY = newCoord(Y, cHeight, zCoef, zCoef + zStep);
		zoom(zCoef, zCoef + zStep, X, Y, nX, nY);
	}
}

zoomM.onclick = function() {
	if(zCoef > zMin) {
		nX = newCoord(X, cWidth, zCoef, zCoef - zStep);
		nY = newCoord(Y, cHeight, zCoef, zCoef - zStep);
		zoom(zCoef, zCoef - zStep, X, Y, nX, nY);
	}
}

var scrollUnlock = true;
canvas.onwheel = function() {
	if(scrollUnlock){
		cX = tx;
		cY = ty;
		if(event.deltaY < 0){
			if(zCoef < zMax) {
				nX = newCoord(cX, cWidth, zCoef, zCoef + zStep);
				nY = newCoord(cY, cHeight, zCoef, zCoef + zStep);
				zoom(zCoef, zCoef + zStep, X, Y, nX, nY);
			}
		}
		else{
			if(zCoef > zMin) {
				nX = newCoord(cX, cWidth, zCoef, zCoef - zStep);
				nY = newCoord(cY, cHeight, zCoef, zCoef - zStep);
				zoom(zCoef, zCoef - zStep, X, Y, nX, nY);
			}
			else{
				zoom(zCoef, zCoef, X, Y, 0, 0);
			}
		}
	}
}

function newCoord(val, len, coef, newCoef) {
	return (val / (len * coef / 100)) * (len * newCoef / 100);
}
// ======================= масштабирование =======================

// ======================= перемещение =======================
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

var cursorX, cursorY;
var tx, ty;
canvas.onmousemove = function() {
	moveCamera();
	corX = event.view.innerWidth - cWidth;
	corY = event.view.innerHeight - cHeight;
	cursorX = event.clientX - corX / 2;
	cursorY = event.clientY - corY / 2;
	tx = X - (cursorX - cWidth / 2);
	ty = Y - (cursorY - cHeight / 2);
	printCanvas();
}

function moveCamera() {
	if(cameraMove){
		newX = event.clientX;
		newY = event.clientY;
		var resX = newX - oldX;
		var resY = newY - oldY;
		if(Math.abs(X + resX) < cWidth / 2)
			X += resX;
		if(Math.abs(Y + resY) < cHeight / 2)
			Y += resY;
		printCanvas();
	}
	oldX = event.clientX;
	oldY = event.clientY;	
}

function ret(){
	r = false;
	if(Math.abs(X) > cWidth / 2){
		if(X < 0) retX = -cWidth / 2;
		else retX = cWidth / 2;
		r = true;
	}
	else{
		retX = X;
	}
	if(Math.abs(Y) > cHeight / 2){
		if(Y < 0) retY = -cHeight / 2;
		else retY = cHeight / 2;
		r = true;
	}
	else{
		retY = Y;
	}
	if(r){
		zoom(zCoef, zCoef, X, Y, retX, retY);
	}
	else{
		scrollUnlock = true;
		if(zCoef != zMax)
			zoomP.removeAttribute("disabled");
		if(zCoef != zMin)
			zoomM.removeAttribute("disabled");
	}
}
// ======================= перемещение =======================