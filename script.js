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
	if(coef < max){
		var cameraHeight = camera[0].clientHeight;
		var cameraWidth = camera[0].clientWidth;
		animate({
			duration: 1000,
			timing: function(timeFraction) {
				return Math.pow(timeFraction, 2);
			},
			draw: function(progress) {
				camera[0].style.width = coef + step * progress + "%";
				camera[0].style.height = coef + step * progress + "%";

				var resW = (camera[0].clientWidth - cameraWidth) / 2;
				var resH = (camera[0].clientHeight - cameraHeight) / 2;

				camera[0].style.left = X - resW + "px";
				X -= resW;

				camera[0].style.top = Y - resH  + "px";
				Y -= resH;
				cameraHeight = camera[0].clientHeight;
				cameraWidth = camera[0].clientWidth;
				if(progress == 1){
					coef += step;
				}
			}
		});
	}
}

function zoomM(){
	if(coef > min){
		var cameraHeight = camera[0].clientHeight;
		var cameraWidth = camera[0].clientWidth;
		animate({
			duration: 1000,
			timing: function(timeFraction) {
				return Math.pow(timeFraction, 2);
			},
			draw: function(progress) {
				camera[0].style.width = coef - step * progress + "%";
				camera[0].style.height = coef - step * progress + "%";

				var freeHeight = camera[0].clientHeight - plant[0].clientHeight;
				var freeWidth = camera[0].clientWidth - plant[0].clientWidth;
				var resW = (camera[0].clientWidth - cameraWidth) / 2;
				var resH = (camera[0].clientHeight - cameraHeight) / 2;

				if(X - resW < 0){
					camera[0].style.left = X - resW + "px";
					X -= resW;
				}
				if(Y - resH < 0){
					camera[0].style.top = Y - resH  + "px";
					Y -= resH;
				}
				// восстановление при уходе за границы слева
				if(X < -freeWidth){
					camera[0].style.left = -freeWidth + "px";
					X = -freeWidth;
				}
				if(Y < -freeHeight){
					camera[0].style.top = -freeHeight  + "px";
					Y = -freeHeight;
				}
				cameraHeight = camera[0].clientHeight;
				cameraWidth = camera[0].clientWidth;
				if(progress == 1){
					coef -= step;
				}
			}
		});
	}
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