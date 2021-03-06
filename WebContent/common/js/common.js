function hashCode(s) {
	return s.split("").reduce(function(a, b) {
		a = ((a << 5) - a) + b.charCodeAt(0);
		return a & a
	}, 0);
};

var globalAlertTimer;
function autoHideAlert(message) {
	var $alertBox = undefined;
	if ($("#globalAlert").length > 0) {
		$alertBox = $("#globalAlert");
		$alertBox.find(".content").html(message);
	}
	else {
		$alertBox = $('<div id="globalAlert" class="alert alert-success"><button type="button" class="close" data-dismiss="alert">&times;</button><span class="content">' + message + '</span></div>');
		$("body").append($alertBox);
	}
	$alertBox.show();
	clearTimeout(globalAlertTimer);
	globalAlertTimer = setTimeout(function() {
		$alertBox.fadeOut(1000);
	}, 1000);
}
function loginHandler(event) {
	event.preventDefault();
	var $form = $(this);
	$.ajax({
		type: 'post',
		url: 'ajax/' + $form.attr("action"),
		data: $form.serializeArray(),
		cache: false,
		success: function(data) {
			if (data.resultStatus == "success") {
				$form.find("#messageArea").removeClass("text-danger").addClass("text-success").text("登录成功");
				setTimeout(function() {window.location.reload();}, 1000);
			}
			else {
				$form.find("#messageArea").removeClass("text-success").addClass("text-danger").text(data.errorMessage ? data.errorMessage : "服务器去火星了~~");
			}
		}
	});
}
$(document).ready(function() {
	$(document).on("keydown", function(event) {
		//ctrl shift l
		if (event.keyCode == 76 && event.shiftKey && event.ctrlKey) {
			if ($("#loginModal").length > 0) $("#loginModal").modal("show");
			else {
				$.ajax({
					url: "component/loginDisplay",
					success: function(html) {
						var $html = $(html);
						$html.modal();
						$html.on('shown.bs.modal', function() {
							$(this).find("#username").focus();
						});
						$html.find("form").on("submit", loginHandler);
					}
				});
			}
			event.preventDefault();
		}
		//ctrl q
		else if (event.keyCode == 81 && event.ctrlKey) {
			event.preventDefault();
			$.ajax({
				url: "ajax/secretLogout",
				success: function(data) {
					if (data.resultStatus == "success") {
						autoHideAlert("logout了~~");
						setTimeout(function() {window.location.reload();}, 1000);
					}
					else {
						autoHideAlert("登出失败，服务器去火星了~~");
					}
				}
			});
		}
	});
});