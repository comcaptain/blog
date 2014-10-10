function hashCode(s) {
	return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);   
};
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
$(document).ready(function() {
	$(document).on("click", "a.confirm", function(event) {
		event.preventDefault();
		if (confirm("你确定要" + this.getAttribute("title") + "吗？")) {
			window.location.href = this.getAttribute("href");
		}
	});
});