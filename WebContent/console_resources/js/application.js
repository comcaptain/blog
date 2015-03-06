function Application() {
	this.console = null;
	this.currentHandler = null;
	this.name = "app";
	this.welcome = "Hello, I'm app."
	this.main = function(value) {
		this.end(new ConsoleMessage(value + "\nexited", "orange"));
	};
	this.start = function(optionStr) {
		this.displayMessage(new ConsoleMessage(this.name + " started\n" + this.welcome, "orange"))
		this.main.call(this, optionStr);
	};
}
Application.prototype = {
	registerConsole: function(console) {
		this.console = console;
	},
	wrapMessage: function(strMessage) {
		return new ConsoleMessage(strMessage, "green")
	},
	displayMessage: function(message) {
		if (typeof message == "string") message = this.wrapMessage(message);
		this.console.displayMessage(message);
	},
	end: function(message) {
		if (typeof message == "string") message = this.wrapMessage(message);
		this.console.onApplicationComplete(message);
	},
	next: function(message, nextHandler) {
		if (typeof message == "string") message = this.wrapMessage(message);
		this.currentHandler = nextHandler;
		this.console.onExecuteComplete(message);
	},
	setApplicationCommands: function(cmds) {
		this.console.setApplicationCommands(cmds);
	},
	clearRegisteredApplicationCommands: function() {
		this.console.clearRegisteredApplicationCommands();
	}
};
Application.prototype.constructor = Application;