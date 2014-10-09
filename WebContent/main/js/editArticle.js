function MdEditor(title, content, titlePreview, contentPreview, option) {
	this.content = content;
	this.$content = $(content);
	this.title = title;
	this.$title = $(title);
	this.contentPreview = contentPreview;
	this.$contentPreview = $(contentPreview);
	this.titlePreview = titlePreview;
	this.$titlePreview = $(titlePreview);
	this.option = option;
	this.reader = new stmd.DocParser();
	this.writer = new stmd.HtmlRenderer();
	
	this.rowNo = 0;
	this.colNo = 0;
}
MdEditor.prototype = {
	defaultOption: {
		autoHeight: false,
		localCache: true,
		$colNoContainer: undefined,
		$rowNoContainer: undefined,
		saveCallback: undefined
	},
	init: function() {
		this.option = $.extend(this.defaultOption, this.option);
		this.dataUpdateTime = this.option.dataUpdateTime;
		this.dataId = this.option.dataId;
		if (this.option.localCache) {
			this.loadContentFromCache();
			setInterval($.proxy(this.updateContentInCache, this), 1000000);
		}
		this.onChange();
		this.onContentChange();
		this.content.focus();
		this.bindEvents();
	},
	bindEvents: function() {
		var editor = this;
		this.$content.on("click paste mouseup keyup cut", $.proxy(function() {
			this.onChange();
			this.onContentChange();
		}, editor));
		this.$title.on("click paste mouseup keyup cut", $.proxy(this.onChange, editor));
		$(document).on("keydown", function(event) {
			if (event.keyCode == 83 && event.ctrlKey) {
				event.preventDefault();
				editor.onSave.call(editor);
			}
		});
	},
	getThumbnail: function() {
		var thumbnail = this.$contentPreview.find(":first-child")[0].innerText;
		thumbnail = thumbnail.length >  200 ? thumbnail.substring(0, 200) : thumbnail;
		return thumbnail;
	},
	onSave: function() {
		this.render(true);
		this.option.saveCallback(this.title.value, this.contentPreview.innerHTML, this.content.value, this.getThumbnail());
	},
	onChange: function() {
		if (this.option.autoHeight) this.autoHeightHandler();
		if (this.option.localCache) this.updateContentInCache();
		this.render();
	},
	onEnter: function() {
		
	},
	onContentChange: function() {
		this.updateCursorPosition();
		if (this.option.$colNoContainer) {
			this.option.$colNoContainer.text(this.colNo);
		}
		if (this.option.$rowNoContainer) {
			this.option.$rowNoContainer.text(this.rowNo);
		}
	},
	onCursorChange: function() {
		
	},
	refreshCacheInfo: function(dataUpdateTime, dataId) {
		this.dataUpdateTime = dataUpdateTime;
		this.dataId = dataId;
		this.updateContentInCache();
	},
	updateCursorPosition: function() {
		var text = this.content.value;
		var cursorIndex = (this.content.selectionDirection === "forward" ? this.content.selectionStart : this.content.selectionEnd);
		var lineBreakCount = 0;
		var colNo = 0;
		for (var i = 0; i < cursorIndex; i++) {
			colNo++;
			if (text.charAt(i) === "\n") {
				lineBreakCount++;
				colNo = 0;
			}
		}
		this.rowNo = lineBreakCount + 1;
		this.colNo = colNo;
	},
	autoHeightHandler: function() {
		var matches = this.content.value.match(/\n/g);
		var lineCount = (matches ? matches.length : 0) + 1;
		this.content.rows = lineCount + 2;
	},
	loadContentFromCache: function() {
		var cacheDataId = sessionStorage.getItem("dataId");
		var cacheDataUpdateTime = sessionStorage.getItem("dataUpdateTime");
		console.log(sessionStorage);
		console.log(this.dataId);
		console.log(this.dataUpdateTime);
		if (cacheDataId == this.dataId && cacheDataUpdateTime == this.dataUpdateTime) {
			var titleCache = sessionStorage.getItem("title");
			if (titleCache) this.$title.val(titleCache);
			var contentCache = sessionStorage.getItem("content");
			if (contentCache) this.$content.val(contentCache);
		}
	},
	updateContentInCache: function () {
		sessionStorage.setItem("dataId", this.dataId);
		sessionStorage.setItem("dataUpdateTime", this.dataUpdateTime);
		sessionStorage.setItem("title", this.title.value);
		sessionStorage.setItem("content", this.content.value);
	},
	render: function(isSync) {
		if (typeof this.timer != "undefined") clearTimeout(this.timer);
		var editor = this;
		function localRender() {
			var html = editor.writer.renderBlock(editor.reader.parse(editor.content.value));
			editor.titlePreview.innerText = editor.$title.val();
			editor.contentPreview.innerHTML = html;
		}
		if (isSync) {
			localRender();
		}
		else {
			this.timer = setTimeout(localRender, 0);
		}
	}
};
$.fn.extend({
	mdEditor: function(title, titlePreview, contentPreview, option) {
		return new MdEditor(title, this[0], titlePreview, contentPreview, option);
	}
});
var editor;
var messageTimer;
function showMessage(msg) {
	$("#messageArea").show().text(msg);
	if (messageTimer) clearTimeout(messageTimer);
	messageTimer = setTimeout(function() {
		$("#messageArea").fadeOut(1000, function() {
			this.innerHTML = "";
		})
	}, 3000);
}
$(document).ready(function() {
	editor = $("#content").mdEditor($("#title")[0], $("#title_preview")[0], $("#content_preview")[0], {
		$colNoContainer: $("#columnNo"),
		$rowNoContainer: $("#rowNo"),
		dataUpdateTime: window.updateTime,
		dataId: window.articleId,
		saveCallback: function(title, content, markdown, thumbnail) {
			$.ajax({
				type: "post",
				cache: false,
				url: "ajax/saveArticle",
				data: {
					"model.title": title,
					"model.content": content,
					"model.markdown": markdown,
					"model.thumbnail": thumbnail,
					"model.articleId": window.articleId
				},
				success: function(data) {
					if (data.articleId) {
						showMessage("保存成功");
						if (!window.articleId) {
							window.history.replaceState( {} , title, "editArticle?id=" + data.articleId );
						}
						window.updateTime = data.updateTime;
						window.articleId = data.articleId;
						editor.refreshCacheInfo(data.updateTime, data.articleId);
					}
					else {
						showMessage("保存失败");
					}
				}
			});
		}
	});
	editor.init();
});