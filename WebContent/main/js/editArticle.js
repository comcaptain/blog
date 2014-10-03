function MdEditor(content, title, preview, option) {
	this.content = content;
	this.$content = $(content);
	this.title = title;
	this.$title = $(title);
	this.preview = preview;
	this.$preview = $(preview);
	this.option = option;
	this.reader = new stmd.DocParser();
	this.writer = new stmd.HtmlRenderer();
	
	this.rowNo = 0;
	this.colNo = 0;
}
MdEditor.prototype = {
	defaultOption: {
		autoHeight: true,
		localCache: true,
		$colNoContainer: undefined,
		$rowNoContainer: undefined
	},
	init: function() {
		this.option = $.extend(this.defaultOption, this.option);
		if (this.option.localCache) {
			this.loadContentFromCache();
			setInterval(this.updateContentInCache, 1000);
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
		var titleCache = sessionStorage.getItem("title");
		if (titleCache) this.$title.val(titleCache);
		var contentCache = sessionStorage.getItem("content");
		if (contentCache) this.$content.val(contentCache);
	},
	updateContentInCache: function () {
		sessionStorage.setItem("title", this.title.value);
		sessionStorage.setItem("content", this.content.value);
	},
	render: function() {
		if (typeof this.timer != "undefined") clearTimeout(this.timer);
		var editor = this;
		this.timer = setTimeout(function() {
			var html = editor.writer.renderBlock(editor.reader.parse(editor.content.value));
			html = '<h1 class="title">' + editor.$title.val() + '</h1>' + html;
			editor.preview.innerHTML = html;
		}, 0);
	}
};
$.fn.extend({
	mdEditor: function(title, previw, option) {
		return new MdEditor(this[0], title, preview, option);
	}
});
var editor;
$(document).ready(function() {
	editor = $("#content").mdEditor($("#title")[0], $("#preview")[0], {
		$colNoContainer: $("#columnNo"),
		$rowNoContainer: $("#rowNo")
	});
	editor.init();
});