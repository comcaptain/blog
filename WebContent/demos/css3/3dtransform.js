function getRandomColor(opacity) {
	if (opacity == undefined) opacity = 0.3;
	return 'rgba(' + parseInt(Math.random() * 256) + ', ' + parseInt(Math.random() * 256) + ', ' + parseInt(Math.random() * 256) + ', ' + opacity + ')';
}
function calcParameters(count) {
	var data = loadData();
	var statusMap = {};
	if (data && data.count == count) {
		statusMap = data.statusMap;
	}
	var unitAngle = 360 / count;
	var width = 60;
	var distance = width / 2 / Math.tan(unitAngle / 180 * Math.PI / 2);
	var result = {
		count: count,
		unitAngle: unitAngle,
		distance: distance,
		statusMap: statusMap,
		overallRotate: 'rotate3d(1, 0, 0, -10deg)'
	}
	return result;
}
function initCircle(circle, count) {
	window.parameters = calcParameters(count);
	save(parameters);
	pause(circle);
	circle.innerHTML = "";
	circle.style.webkitAnimationDuration = (0.5 * count) + "s";
	circle.style.transformOrigin = "center center -" + parameters.distance + "px";
	var statusMap = parameters.statusMap;
	for (var i = 1; i <= count; i++) {
		var slide = document.createElement("figure");
		slide.style.transform = 'rotateY(' + ((i - 1) * parameters.unitAngle) + 'deg) translateZ(' + parameters.distance + 'px)';
		slide.textContent = i;
		if (statusMap[i] == 1) {
			slide.setAttribute("class", "completed");
		}
		slide.style.background = getRandomColor(0.7);
		circle.appendChild(slide);
	}
	var css = '@-webkit-keyframes roll {\n';
	css += "from {transform:" + parameters.overallRotate + ' rotateY(0deg) translateZ(-' + parameters.distance + 'px)' + "}\n";
	css += "to {transform:" + parameters.overallRotate + ' rotateY(360deg) translateZ(-' + parameters.distance + 'px)' + "}\n";
	css += "}";
	document.getElementById("injectCss").innerHTML = css;
	return circle;
}
function start(circle) {
	circle.style.webkitAnimationPlayState = "running";
}
function pause(circle) {
	circle.style.webkitAnimationPlayState = "paused";
}
function loadData() {
	var data = localStorage.getItem("todolistData");
	if (data == null) return {};
	data = JSON.parse(data);
	return data;
}
function saveData(data) {
	localStorage.setItem("todolistData", JSON.stringify(data));
}
function save(p) {
	if (p == undefined) p = window.parameters;
	saveData({
		count: p.count,
		statusMap: p.statusMap
	});
}
$(document).ready(function() {
	var circle = document.getElementById("circle");
	$("#start").click(function() {
		initCircle(circle, parseInt($("#taskCount").val()));
		start(circle);
	});
	$(circle).on("click", "figure", function() {
		var id = this.textContent;
		var $this = $(this);
		if ($this.hasClass("completed")) {
			window.parameters.statusMap[id] = 0;
			$this.removeClass("completed");
		}
		else {
			window.parameters.statusMap[id] = 1;
			$this.addClass("completed");
		}
		save();
	});
	$("#toggle").click(function() {
		if (circle.style.webkitAnimationPlayState == "paused") {
			start(circle);
		}
		else {
			pause(circle);
		}
	});
	var data = loadData();
	if (data) {
		var count = parseInt(data.count);
		if (!isNaN(count)) $("#taskCount").val(count);
		$("#start").click();
	}
});