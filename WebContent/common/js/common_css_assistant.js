function adjustNavigationIcons() {
	var navigation = $(".vertical-navigation")[0];
	var container = document.getElementById("container");
	var left = container.offsetLeft - 30;
	navigation.style.left = left < 10 ? 10 : left;
}
window.onload = function() {
	if ($(".vertical-navigation").length > 0) {
		adjustNavigationIcons();
		$(window).resize(adjustNavigationIcons);
	}
}