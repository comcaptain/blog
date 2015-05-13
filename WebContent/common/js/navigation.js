var publicStatusNamesMap = {};
publicStatusNamesMap[PUBLIC_STATUS_ENUM_RPIVATE] = ["private", "不公开", "未公开"];
publicStatusNamesMap[PUBLIC_STATUS_ENUM_PUBLIC] = ["public", "公开", "公开中"];
publicStatusNamesMap[PUBLIC_STATUS_ENUM_PUBLISHED] = ["published", "发表", "发表中"]; 
function updatePublicStatus(articleId, newPublicStatus) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			url: "ajax/updatePublicStatus",
			method: "POST",
			cache: false,
			data: {
				articleId: articleId,
				publicStatus: newPublicStatus
			},
			success: function(data) {
				resolve(data);
			},
			error: function(data) {
				autoHideAlert("公开状态由于某种原因更新失败，嗯");
			}
		});
	});
}
function updatePublicStatusTitle(publicStatusEle) {
	if (publicStatusEle == undefined) publicStatusEle = document.getElementById("updatePublicStatus");
	if (!publicStatusEle) return;
	publicStatusEle.setAttribute("title", publicStatusNamesMap[publicStatusEle.getAttribute("publicStatus")][2]);
}
function updatePublicStatusHandler(data) {
	var publicStatus = data.publicStatus;
	var updatePublicStatusEle = document.getElementById("updatePublicStatus");
	updatePublicStatusEle.setAttribute("publicStatus", publicStatus);
	$(updatePublicStatusEle)
		.removeClass(publicStatusNamesMap[PUBLIC_STATUS_ENUM_RPIVATE][0] + " " + publicStatusNamesMap[PUBLIC_STATUS_ENUM_PUBLIC][0] + " " + publicStatusNamesMap[PUBLIC_STATUS_ENUM_PUBLISHED][0])
		.addClass(publicStatusNamesMap[publicStatus][0]);
	updatePublicStatusTitle(updatePublicStatusEle);
	
}
$(document).ready(function() {
	$(document).click(function() {
		$("#navigation .popup").removeClass("fadeIn").hide();
	});
	$(document).on("click", "a.confirm", function(event) {
		event.preventDefault();
		if (confirm("你确定要" + this.getAttribute("title") + "吗？")) {
			window.location.href = this.getAttribute("href");
		}
	});
	$(document).on("click", "#publishPopup", function(event) {
		event.preventDefault();
		event.stopPropagation();
	});
	updatePublicStatusTitle();
	$("#publishPopup").on("click", "li", function(event) {
		$("#navigation .popup").removeClass("fadeIn").hide();
		updatePublicStatus($("#updatePublicStatus").attr("articleId"), this.getAttribute("publicStatus")).then(updatePublicStatusHandler);
	});
	$("#updatePublicStatus").on("click", function(event) {
		event.preventDefault();
		event.stopPropagation();
		var publicStatus = this.getAttribute("publicStatus");
		var publishable = this.getAttribute("publishable") === "true";
		var articleId = this.getAttribute("articleId");
		var options = {};
		options[PUBLIC_STATUS_ENUM_RPIVATE] = publicStatusNamesMap[PUBLIC_STATUS_ENUM_RPIVATE];
		options[PUBLIC_STATUS_ENUM_PUBLIC] = publicStatusNamesMap[PUBLIC_STATUS_ENUM_PUBLIC];
		if (publishable) options[PUBLIC_STATUS_ENUM_PUBLISHED] = publicStatusNamesMap[PUBLIC_STATUS_ENUM_PUBLISHED];
		delete options[publicStatus];
		var keys = Object.keys(options);
		if (keys.length == 1) {
			if (confirm("你确定要" + options[keys[0]][1] + "吗？")) {
				updatePublicStatus(articleId, keys[0]).then(updatePublicStatusHandler);
			}
		}
		else if (keys.length > 1) {
			var optionContainer = document.getElementById("publishPopup");
			optionContainer.innerHTML = "";
			var $optionContainer = $(optionContainer);
			$optionContainer.removeClass("fadeIn");
			for (var publicStatus in options) {
				var ele = document.createElement("li");
				ele.setAttribute("publicStatus", publicStatus);
				ele.textContent = options[publicStatus][1];
				optionContainer.appendChild(ele);
			}
			$optionContainer.show();
			setTimeout(function() {
				$optionContainer.addClass("fadeIn");
			}, 10);
		}
	});
});