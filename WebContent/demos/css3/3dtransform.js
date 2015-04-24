var index = 1;
var num = 100;
var unitAngle = 360 / num;;
var width = 50;
var distance = width / 2 / Math.tan(unitAngle / 180 * Math.PI / 2);
function showIndex(index) {
	var transform = 'rotate3d(1, -1, 0, -45deg) rotateY(' + (-(index - 1) * unitAngle) + 'deg) translateZ(-' + distance + 'px)';
	$("#circle").css("transform", transform);
	$("#circle").css("transition", "transform 3s");
}
function getRandomColor(opacity) {
	if (opacity == undefined) opacity = 0.3;
	return 'rgba(' + parseInt(Math.random() * 256) + ', ' + parseInt(Math.random() * 256) + ', ' + parseInt(Math.random() * 256) + ', ' + opacity + ')';
}
function initCircle(container, circle) {
	circle.style.transformOrigin = "center center -" + distance + "px";
	for (var i = 1; i <= num; i++) {
		var slide = document.createElement("figure");
		slide.style.transform = 'rotateY(' + ((i - 1) * unitAngle) + 'deg) translateZ(' + distance + 'px)';
		slide.textContent = i;
		slide.style.background = getRandomColor(0.7);
		circle.appendChild(slide);
	}
}
function initKeyFrames() {
	var css = '@-webkit-keyframes roll {\n';
	css += "from {transform:" + 'rotate3d(1, -1, 0, -45deg) rotateY(0deg) translateZ(-' + distance + 'px)' + "}\n";
	css += "to {transform:" + 'rotate3d(1, -1, 0, -45deg) rotateY(360deg) translateZ(-' + distance + 'px)' + "}\n";
	css += "}";
	document.getElementById("injectCss").innerHTML = css;
}
function restart() {
	index = 1;
	num = parseInt($("#number").val());
	unitAngle = 360 / num;;
	width = 50;
	distance = width / 2 / Math.tan(unitAngle / 180 * Math.PI / 2);
	document.getElementById("circle").innerHTML = "";
	var circle = document.getElementById("circle");
	initCircle(document.getElementById("container"), circle);
	circle.style.webkitAnimationDuration = $("#duration").val() + "s";
	initKeyFrames();
	showIndex(index);
}
$(document).ready(function() {
	restart();
		$("#circle").addClass("animate");
	$("#toggle").click(function() {
		var circle = document.getElementById("circle");
		if (circle.style.webkitAnimationPlayState == "paused") {
			circle.style.webkitAnimationPlayState = "running";
		}
		else {
			circle.style.webkitAnimationPlayState = "paused";
		}
	});
	$("#start").click(function() {
		restart();
		$("#circle").addClass("animate");
	});
});