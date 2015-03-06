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
		return this.main(optionStr);
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
	setNextHandler: function(newHandler) {
		this.currentHandler = newHandler;
	},
	setApplicationCommands: function(cmds) {
		this.console.setApplicationCommands(cmds);
	},
	isInputMode: function() {
		return this.currentHandler ? true : false;
	},
	clearRegisteredApplicationCommands: function() {
		this.console.clearRegisteredApplicationCommands();
	},
	execute: function(inputStr) {
		return new Promise(function(resolve, reject) {
			this.currentHandler(inputStr).then(resolve);
		});
	},
};
Application.prototype.constructor = Application;