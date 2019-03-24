var points = Array.from(document.getElementsByClassName("point"));
// var camera = Array.from(document.getElementsByClassName("camera"));
// var plant = Array.from(document.getElementsByClassName("plant"));

var min = 100;
var max = 500;
var coef = 100;
var step = 50;

var oldX, oldY, newX, newY;
var X = 0, Y = 0;
var targetX = plant.clientWidth / 2 - X, targetY = plant.clientHeight / 2 - Y;
center.innerText = targetX + ':' + targetY;

console.log(targetX + ':' + targetY);


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
	if(coef < max){
		var cameraWidth = camera.clientWidth;
		var cameraHeight = camera.clientHeight;
		animate({
			duration: 1000,
			timing: function(timeFraction) {
				return Math.pow(timeFraction, 2);
			},
			draw: function(progress) {
				camera.style.width = coef + step * progress + "%";
				camera.style.height = coef + step * progress + "%";

				var resW = (camera.clientWidth - cameraWidth) / 2;
				var resH = (camera.clientHeight - cameraHeight) / 2;

				camera.style.left = X - resW + "px";
				X -= resW;

				camera.style.top = Y - resH  + "px";
				Y -= resH;
				cameraWidth = camera.clientWidth;
				cameraHeight = camera.clientHeight;
				if(progress == 1){
					coef += step;
				}

				targetX = plant.clientWidth / 2 - X;
				targetY = plant.clientHeight / 2 - Y;
				center.style.left = targetX + "px";
				center.style.top = targetY + "px";
				center.innerText = targetX + ':' + targetY;
			}
		});
	}
}

function zoomM(){
	if(coef > min){
		var cameraWidth = camera.clientWidth;
		var cameraHeight = camera.clientHeight;
		animate({
			duration: 1000,
			timing: function(timeFraction) {
				return Math.pow(timeFraction, 2);
			},
			draw: function(progress) {
				camera.style.width = coef - step * progress + "%";
				camera.style.height = coef - step * progress + "%";

				var freeWidth = camera.clientWidth - plant.clientWidth;
				var freeHeight = camera.clientHeight - plant.clientHeight;
				var resW = (camera.clientWidth - cameraWidth) / 2;
				var resH = (camera.clientHeight - cameraHeight) / 2;

				if(X - resW < 0){
					camera.style.left = X - resW + "px";
					X -= resW;
				}
				if(Y - resH < 0){
					camera.style.top = Y - resH  + "px";
					Y -= resH;
				}
				// восстановление при уходе за границы слева
				if(X < -freeWidth){
					camera.style.left = -freeWidth + "px";
					X = -freeWidth;
				}
				if(Y < -freeHeight){
					camera.style.top = -freeHeight  + "px";
					Y = -freeHeight;
				}
				cameraWidth = camera.clientWidth;
				cameraHeight = camera.clientHeight;
				if(progress == 1){
					coef -= step;
				}

				targetX = plant.clientWidth / 2 - X;
				targetY = plant.clientHeight / 2 - Y;
				center.style.left = targetX + "px";
				center.style.top = targetY + "px";
				center.innerText = targetX + ':' + targetY;
			}
		});
	}
}
// ===================================================================
var inCamera = false;
var cameraMove = false;
camera.onmouseenter = function () {
	inCamera = true;
}

camera.onmouseleave = function () {
	inCamera = false;
	cameraMove = false;
}

camera.onmousedown = function () {
	if(inCamera)
		cameraMove = true;
}

camera.onmouseup = function () {
	cameraMove = false;
}

// перемещение
camera.onmousemove = function() {
	if(cameraMove){
		newX = event.clientX;
		newY = event.clientY;
		var resX = newX - oldX;
		var resY = newY - oldY;
		var freeWidth = camera.clientWidth - plant.clientWidth;
		var freeHeight = camera.clientHeight - plant.clientHeight;
		if(X + resX <= 0 && X + resX >= -freeWidth){
			X += resX;
		}
		if(Y + resY <= 0 && Y + resY  >= -freeHeight){
			Y += resY;
		}

		camera.style.left = X + "px";
		camera.style.top = Y + "px";

		targetX = plant.clientWidth / 2 - X;
		targetY = plant.clientHeight / 2 - Y;
		center.style.left = targetX + "px";
		center.style.top = targetY + "px";
		center.innerText = targetX + ':' + targetY;
	}
	else{
		corX = (event.view.innerWidth - plant.clientWidth) / 2;
		corY = (event.view.innerHeight - plant.clientHeight) / 2;
		target.style.left = event.clientX - corX - X + "px";
		target.style.top = event.clientY - corY - Y + "px";
		console.log((event.clientX - corX - X) + ':' + (event.clientY - corY - Y));
	}
	oldX = event.clientX;
	oldY = event.clientY;
}
// ===================================================================