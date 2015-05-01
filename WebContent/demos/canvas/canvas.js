function init() {
	var canvas = document.getElementById("canvas");
	var width = canvas.width;
	var height = canvas.height;
	var ctx = canvas.getContext("2d");
	var animationRet;
	var ball = {
		x: 100,
		y: 100,
		vx: 5,
		vy: 2,
		radius: 25,
		color: "blue",
		draw: function() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			ctx.fillStyle = this.color;
			ctx.fill();
		}
	};
	function clear() {
		ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
		ctx.fillRect(0, 0, width, height);
		// ctx.clearRect(0, 0, width, height);
	}
	function draw() {
		var x = ball.x;
		var y = ball.y;
		var vx = ball.vx;
		var vy = ball.vy;
		var radius = ball.radius;
		var newX = x + vx;
		var newY = y + vy;
		if (newX < radius || newX > width - radius) {
			newX = x - vx;
			ball.vx = -ball.vx;
		}	
		else if (newY < radius || newY > height - radius) {
			newY = y - vy;
			ball.vy = -ball.vy;
		}
		ball.x = newX;
		ball.y = newY;
		clear();
		ball.vy *= 0.99;
		ball.vy += 0.25;
		ball.draw();
		animationRet = window.requestAnimationFrame(draw);
	}
	canvas.addEventListener('mouseover', function(e){
		animationRet = window.requestAnimationFrame(draw);
	});
	canvas.addEventListener("mouseout",function(e){
		window.cancelAnimationFrame(animationRet);
	});
}
window.addEventListener("DOMContentLoaded", function() {
	init();
});