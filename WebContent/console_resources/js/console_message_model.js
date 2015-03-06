function ConsoleMessage(data, color) {
	this.data = data
	if (!color) {
		this.color = "white"
	}
	else {
		this.color = color
	}
}
function ConsoleTableMessage(columnCount) {
	this.columnCount = columnCount;
	this.withBorder = true;
	this.trs = [];
};
ConsoleTableMessage.prototype = {
	addTr: function(tds) {
		if (!this.columnCount || this.columnCount < tds.length) this.columnCount = tds.length;
		this.trs.push(tds);
	}
};
ConsoleTableMessage.prototype.constructor = ConsoleTableMessage;