function ConsoleMessage(data, color) {
	this.data = data
	if (!color) {
		this.color = "white"
	}
	else {
		this.color = color
	}
}
function ConsoleTableMessageData(columnCount) {
	this.columnCount = columnCount;
	this.withBorder = true;
	this.trs = [];
};
ConsoleTableMessageData.prototype = {
	addTr: function(tds) {
		if (!this.columnCount || this.columnCount < tds.length) this.columnCount = tds.length;
		this.trs.push(tds);
	}
};
ConsoleTableMessageData.prototype.constructor = ConsoleTableMessageData;