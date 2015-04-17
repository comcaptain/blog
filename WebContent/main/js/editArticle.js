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
	this.reader = new commonmark.Parser();
	this.writer = new commonmark.HtmlRenderer();
	this.imagePrefix = "pygmalion://";
	this.rowNo = 0;
	this.colNo = 0;
}
MdEditor.prototype = {
	defaultOption: {
		autoHeight: false,
		localCache: false,
		$colNoContainer: undefined,
		$rowNoContainer: undefined,
		saveCallback: undefined,
		onDragOver: undefined,
		onDragLeave: undefined,
		onDrop: undefined
	},
	init: function() {
		this.option = $.extend(this.defaultOption, this.option);
		this.dataUpdateTime = this.option.dataUpdateTime;
		this.dataId = this.option.dataId;
		if (this.option.localCache) {
			this.loadContentFromCache();
			setInterval($.proxy(this.updateContentInCache, this), 1000000);
		}
		this.rebuildDataUrlMap();
		this.onChange();
		if (this.title.value) {
			this.content.focus();
		}
		else {
			this.title.focus();
		}
		this.hashCode = hashCode(this.title.value + this.content.value);
		this.bindEvents();
	},
	rebuildDataUrlMap: function() {
		this.dataUrlMap = {};
		var editor = this;
		this.$contentPreview.find("img[dataUrlSourceId]").each(function() {
			editor.dataUrlMap[this.getAttribute("dataUrlSourceId")] = this.getAttribute("src");
		});
	},
	insertImage: function(imageFile) {
		var editor = this;
		var reader = new FileReader();
		reader.onload = function(e) {
			var imageDataUrl = e.target.result;
			if (editor.maxDataUrlId == undefined) editor.maxDataUrlId = 0;
			editor.maxDataUrlId++;
			if (editor.dataUrlMap == undefined) editor.dataUrlMap = {};
			editor.dataUrlMap[editor.maxDataUrlId] = imageDataUrl;
			editor.insertAtCursor('![pygmalion-image](' + editor.imagePrefix + editor.maxDataUrlId + ')');
			editor.onChange();
		};
		reader.readAsDataURL(imageFile);
	},
	bindEvents: function() {
		var editor = this;
		window.onbeforeunload = function() {
			if (editor.hashCode != hashCode(editor.title.value + editor.content.value)) {
				return "有未保存的修改，确定离开吗？";
			}
		}
		this.content.addEventListener("paste", function(event) {
			var files = event.clipboardData.items;
			Array.prototype.forEach.call(files, function(file) {
				if (file.type.indexOf("image") < 0)
					return;
				file = file.getAsFile();
				editor.insertImage(file);
			});
		});
		this.$content.on("click paste mouseup keyup cut", $.proxy(function() {
			this.onChange();
		}, editor));
		this.$title.on("click paste mouseup keyup cut", $.proxy(this.onChange, editor));
		$(document).on("keydown", function(event) {
			if (event.keyCode == 83 && event.ctrlKey) {
				event.preventDefault();
				editor.onSave.call(editor);
			}
		});
		if (this.option.onDragLeave) {
			this.content.addEventListener("dragleave", function(event) {
				event.preventDefault();
				editor.$content.removeClass("dragover");
				editor.option.onDragLeave(event);
			})
		}
		this.content.addEventListener("dragover", function(event) {
			event.preventDefault();
			editor.$content.addClass("dragover");
			if (editor.option.onDragOver) {
				editor.option.onDragOver(event);
			}
		});
		this.content.addEventListener("drop", function(event) {
			event.preventDefault();
			if (editor.option.onDrop) {
				editor.option.onDrop(event);
			}
			editor.$content.removeClass("dragover");
			var files = event.dataTransfer.files;
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				if (file.type.indexOf("image") < 0) continue;
				editor.insertImage(file);
			}
		})
		this.$content.on("keydown", function(event) {
			//enter
			if (event.keyCode == 13) {
				editor.onEnter(event);
			}
			//ctrl k
			else if (event.keyCode == 75 && event.ctrlKey) {
				if (editor.getSelectedText().indexOf("\n") < 0) {
					editor.wrapSelection(event, "`");
				}
				else {
					editor.toggleSelectionIndent("", event);
					var preLineIndent = editor.getPrevLineIndent();
					editor.wrapSelection(event, preLineIndent + "```\n", "\n" + preLineIndent + "```");
				}
			}
			//ctrl shift b
			else if (event.keyCode == 66 && event.ctrlKey && event.shiftKey) {
				editor.toggleSelectionIndent(">", event);
			}
			//ctrl b
			else if (event.keyCode == 66 && event.ctrlKey && !event.shiftKey) {
				editor.wrapSelection(event, "**");
			}
			//ctrl shift d
			else if (event.keyCode == 68 && event.ctrlKey && event.shiftKey) {
				editor.wrapSelection(event, "<del>", "</del>");
			}
			//ctrl d
			else if (event.keyCode == 68 && event.ctrlKey) {
				editor.deleteSelection(event);
			}
			//shift tab
			else if (event.keyCode == 9 && event.shiftKey) {
				editor.clearIndent(event);
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
		this.updateCursorPosition();
		if (this.option.$colNoContainer) {
			this.option.$colNoContainer.text(this.colNo);
		}
		if (this.option.$rowNoContainer) {
			this.option.$rowNoContainer.text(this.rowNo);
		}
	},
	getSelectedText: function() {
		var lowerSelectionBound = this.content.selectionStart;
		var higherSelectionBound = this.content.selectionEnd;
		return this.content.value.substring(lowerSelectionBound, higherSelectionBound);
	},
	clearIndent: function(event) {
		event.preventDefault();
		var text = this.content.value;
		var bounds = this.extendSelectionToFullLines(this.content.selectionStart, this.content.selectionEnd);
		var lowerBound = bounds.lowerBound;
		var upperBound = bounds.upperBound;
		var selectedLines = text.substring(lowerBound, upperBound);
		if (text.substring(this.content.selectionStart, this.content.selectionEnd).indexOf("\n") < 0) {
			var matches = selectedLines.match(/^(\s*)((?:(?:\d+\.)|-|\+|\*) +)?/);
			if (!matches || !matches[0]) return;
			this.content.setSelectionRange(lowerBound, lowerBound + matches[0].length);
			document.execCommand('delete', false, undefined);
		}
	},
	onEnter: function(event) {
		var textValue = this.content.value;
		var lowerSelectionBound = this.content.selectionStart;
		var higherSelectionBound = this.content.selectionEnd;
		var lineStart = lowerSelectionBound - 1;
		while (lineStart > 0) {
			var c = textValue.charAt(lineStart);
			if (c == '\n') {
				lineStart++; break;
			}
			lineStart--;
		}
		var matches = textValue.substring(lineStart, lowerSelectionBound).match(/^(\s*)((?:(?:\d+\.)|-|\+|\*) )?/);
		if (matches) {
			event.preventDefault();
			var insertValue = "\n" + matches[1];
			if (matches.length > 2 && matches[2] != undefined) {
				var listSign = matches[2];
				if (listSign.match(/^\d+\. $/)) {
					listSign = parseInt(listSign.substring(0, listSign.length - 1)) + 1 + ". ";
				}
				insertValue += listSign;
			}
			document.execCommand('insertText', false, insertValue);
		}
	},
	generateSpaces: function(count) {
		var result = "";
		for (var i = 0; i < count; i++) result += " ";
		return result;
	},
	toggleSelectionIndent: function(indentText, event) {
		var text = this.content.value;
		var extendedBounds = this.extendSelectionToFullLines(this.content.selectionStart, this.content.selectionEnd);
		var lowerSelectionBound = extendedBounds.lowerBound;
		var higherSelectionBound = extendedBounds.upperBound;
		event.preventDefault();
		var selectedLines = text.substring(lowerSelectionBound, higherSelectionBound);
		var lineMatch = selectedLines.match(/\n/g);
		var lineCount = (lineMatch ? lineMatch.length : 0) + (selectedLines.match(/\n$/) ? 0 : 1);
		var preLineIndent = this.getPrevLineIndent();
		var indentMatch = selectedLines.match(new RegExp("(?:\n|^)" + preLineIndent + indentText,"g"));
		var wellIndentedCount = indentMatch ? indentMatch.length : 0;
		//delete mode
		if (lineCount == wellIndentedCount) {
			if (indentText.length == 0) return;
			var isLineStart = true;
			var indexDiff = 0;
			for (var i = lowerSelectionBound; i == lowerSelectionBound || i < higherSelectionBound; i++) {
				if (isLineStart) {
					this.content.setSelectionRange(i + preLineIndent.length - indexDiff , i + preLineIndent.length + indentText.length - indexDiff);
					document.execCommand('delete', false, undefined);
					isLineStart = false;
					indexDiff += indentText.length;
				}
				if (text.charAt(i) == "\n") {
					isLineStart = true;
				}
			}
			higherSelectionBound -= indexDiff;
		}
		//indent mode
		else {
			var selectedIndentMatches = selectedLines.match(/(\n|^)\s*/g);
			var minimumIndentLength = selectedLines.length;
			for (var i = 0; i < selectedIndentMatches.length; i ++) {
				var match = selectedIndentMatches[i];
				if (match.charAt(0) == "\n") match = match.substring(1);
				if (match.length < minimumIndentLength) minimumIndentLength = match.length;
			}
			var indentDiff = preLineIndent.length - minimumIndentLength;
			for (var i = 0; i < indentDiff; i++) {
				indentText = " " + indentText;
			}
			var isLineStart = true;
			var indexDiff = 0;
				for (var i = lowerSelectionBound; i == lowerSelectionBound || i < higherSelectionBound; i++) {
					if (isLineStart) {
						this.content.setSelectionRange(i + indexDiff , i + indexDiff);
						document.execCommand('insertText', false, indentText);
						isLineStart = false;
						indexDiff += indentText.length;
					}
					if (text.charAt(i) == "\n") {
						isLineStart = true;
					}
				}
				higherSelectionBound += indexDiff;
			}
			//recover selection range
			this.content.setSelectionRange(lowerSelectionBound, higherSelectionBound);
	},
	wrapSelection: function(event, wrapString, wrapString2) {
		event.preventDefault();
		var lowerBound = this.content.selectionStart;
		var upperBound = this.content.selectionEnd;
		this.content.setSelectionRange(lowerBound, lowerBound);
		document.execCommand('insertText', false, wrapString);
		this.content.setSelectionRange(upperBound + wrapString.length, upperBound + wrapString.length);
		document.execCommand('insertText', false, wrapString2 ? wrapString2 : wrapString);
		this.content.setSelectionRange(lowerBound, upperBound + wrapString.length + (wrapString2 ? wrapString2 : wrapString).length);
	},
	extendSelectionToFullLines: function(lowerBound, upperBound) {
		if (lowerBound > upperBound) {
			var temp = lowerBound;
			lowerBound = upperBound;
			upperBound = temp;
		}
		var text = this.content.value;
		if (text.charAt(lowerBound) == '\n') {
			lowerBound--;
		}
		while (lowerBound > 0) {
			if (text.charAt(lowerBound) == '\n') {
				lowerBound++;
				break;
			}
			lowerBound--;
		}
		while (upperBound < text.length) {
			if (text.charAt(upperBound) == '\n') {
				upperBound++;
				break;
			}
			upperBound++;
		}
		return {lowerBound: lowerBound, upperBound: upperBound}
	},
	getLine: function(index) {
		var bounds = this.extendSelectionToFullLines(index, index);
		return this.content.value.substring(bounds.lowerBound, bounds.upperBound);
	},
	getPrevLineIndent: function(index) {
		if (index == undefined) index = this.getSelectionLowerBound();
		var preLine = this.getPrevLine(index);
		var length = preLine.match(/^( *)((?:(?:\d+\.)|-|\+|\*) )?/)[0].length;
		return this.generateSpaces(length);
	},
	getPrevLine: function(index) {
		var text = this.content.value;
		var upperBound = index;
		var char = text.charAt(upperBound);
		while (char != "\n" && upperBound > 0) {
			upperBound--;
			char = text.charAt(upperBound);
		}
		if (upperBound == 0) return 0;
		var lowerBound = upperBound - 1;
		char = text.charAt(lowerBound);
		while (char != "\n" && lowerBound > 0) {
			lowerBound--;
			char = text.charAt(lowerBound)
		}
		if (lowerBound != 0) lowerBound++;
		return text.substring(lowerBound, upperBound);
	},
	getIndexRowCol: function(index) {
		var text = this.content.value;
		var lineBreakCount = 0;
		var colNo = 0;
		for (var i = 0; i < index; i++) {
			colNo++;
			if (text.charAt(i) === "\n") {
				lineBreakCount++;
				colNo = 0;
			}
		}
		return {
			rowNo: lineBreakCount + 1,
			colNo: colNo
		};
	},
	getSelectionLowerBound: function() {
		var lowerBound = this.content.selectionStart;
		var higherBound = this.content.selectionEnd;
		return lowerBound < higherBound ? lowerBound : higherBound;
	},
	deleteSelection: function(event) {
		event.preventDefault();
		var extendedBounds = this.extendSelectionToFullLines(this.content.selectionStart, this.content.selectionEnd);
		var lowerBound = extendedBounds.lowerBound;
		var upperBound = extendedBounds.upperBound;
		this.content.setSelectionRange(lowerBound, upperBound);
		document.execCommand('forwardDelete', false, undefined);
	},
	onCursorChange: function() {
		
	},
	refreshCacheInfo: function(dataUpdateTime, dataId) {
		this.dataUpdateTime = dataUpdateTime;
		this.dataId = dataId;
		this.updateContentInCache();
		this.hashCode = hashCode(this.title.value + this.content.value);
	},
	getCursorIndex: function() {
		return (this.content.selectionDirection === "forward" ? this.content.selectionStart : this.content.selectionEnd);
	},
	insertAtCursor: function(text) {
		document.execCommand('insertText', false, text);
	},
	updateCursorPosition: function() {
		var cursorIndex = this.getCursorIndex();
		var position = this.getIndexRowCol(cursorIndex);
		this.rowNo = position.rowNo;
		this.colNo = position.colNo;
	},
	autoHeightHandler: function() {
		var matches = this.content.value.match(/\n/g);
		var lineCount = (matches ? matches.length : 0) + 1;
		this.content.rows = lineCount + 2;
	},
	loadContentFromCache: function() {
		var cacheDataId = sessionStorage.getItem("dataId");
		var cacheDataUpdateTime = sessionStorage.getItem("dataUpdateTime");
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
	preprocessMd: function(parsedMd) {
		var toBeProcessed = [parsedMd];
		var uselessDataUrlSources = {};
		for (var dataUrlSourceId in this.dataUrlMap) uselessDataUrlSources[dataUrlSourceId] = 1;
		while (toBeProcessed.length > 0) {
			var current = toBeProcessed.shift();
			while (current) {
				if (current.firstChild) toBeProcessed.push(current.firstChild);
				if (current.type == "Image") {
					var usedDataSourceId = this.preprocessImageInMd(current);
					if (usedDataSourceId != -1) delete uselessDataUrlSources[usedDataSourceId];
				}
				current = current.next;
			}
		}
		for (var dataUrlSourceId in uselessDataUrlSources) delete this.dataUrlMap[dataUrlSourceId];
	},
	preprocessImageInMd: function(imageNode) {
		if (imageNode.destination.indexOf(this.imagePrefix) == 0) {
			imageNode.dataUrlSourceId = imageNode.destination.substring(this.imagePrefix.length);
			imageNode.destination = this.dataUrlMap[imageNode.dataUrlSourceId];
			return imageNode.dataUrlSourceId;
		}
		return -1;
	},
	render: function(isSync) {
		if (typeof this.timer != "undefined") clearTimeout(this.timer);
		var editor = this;
		function localRender() {
			var parsedMd = editor.reader.parse(editor.content.value);
			editor.preprocessMd(parsedMd);
			var html = editor.writer.render(parsedMd);
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
		var editor = new MdEditor(title, this[0], titlePreview, contentPreview, option);
		editor.init();
		return editor;
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
						if (window.location.href.indexOf("editArticle") < 0) {
							window.onbeforeunload = undefined;
							window.location.href = "editArticle?id=" + data.articleId;
						}
						window.updateTime = data.updateTime;
						editor.refreshCacheInfo(data.updateTime, data.articleId);
					}
					else {
						showMessage("保存失败");
					}
				}
			});
		}
	});
});