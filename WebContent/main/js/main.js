function NewContentLoader() {
	this.loading = false;
	this.ended = false;
	this.pageIndex = 1;
}
NewContentLoader.prototype = {
	init: function() {
		var loader = this;
		window.onscroll = function() {
			loader.loadNewContentDetector();
		}
	},
	loadNewContentDetector: function() {
		if (this.loading || this.ended) return;
		var scrollY = window.scrollY;
		var height = document.body.offsetHeight - window.innerHeight;
		var scrollPercent = scrollY / height;
		if (scrollPercent > 0.95) {
			this.loadNewContent();
		}
	},
	loadNewContent: function() {
		var loader = this;
		this.loading = true;
		this.renderLoading();
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "loadNewContent");
		xhr.responseType = "document";
		var params = new FormData();
		params.append("pageIndex", (this.pageIndex + 1));
		xhr.onload = function() {
			var children = xhr.response.querySelectorAll("body > li");
			if (children.length > 0) {
				var parent = document.querySelector(".timeline");
				//remove duplicate date badge
				var badges = document.querySelectorAll(".timeline-seperator-badge");
				var lastBadge = badges[badges.length - 1];
				var lastDate = lastBadge.textContent.trim();
				var newFirstDate = xhr.response.querySelector(".timeline-seperator-badge").textContent.trim();
				if (lastDate === newFirstDate) {
					lastBadge.parentNode.removeChild(lastBadge);
				}
				for (var i = 0; i < children.length; i++) {
					parent.appendChild(children[i]);
				}
				loader.pageIndex++;
			}
			else {
				loader.ended = true;
			}
			loader.renderStopLoading();
			loader.loading = false;
		}
		xhr.send(params);
	},
	renderLoading: function() {
		var loadingEle = document.createElement("div");
		loadingEle.id = "loading";
		loadingEle.textContent = "载入中......";
		document.querySelector("#container").appendChild(loadingEle);
	},
	renderStopLoading: function() {
		document.querySelector("#container").removeChild(document.querySelector("#loading"));
	}
}
NewContentLoader.prototype.constructor = NewContentLoader;
var loader = new NewContentLoader();
loader.init();