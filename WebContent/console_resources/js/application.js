function Application() {
	this.console = null;
	this.currentHandler = null;
	this.name = "app";
	this.welcome = "Hello, I'm app."
	this.main = function(value) {
		return new Promise(function(resolve, reject) {
			resolve(new ConsoleMessage(value + "\nexited", "orange"), "exit");
		}.bind(this));
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
	infoMessage: function(strMessage) {
		return new ConsoleMessage(strMessage, "green")
	},
	errorMessage: function(str) {
		return new ConsoleMessage(str, "red");
	},
	info: function(msg) {
		if (typeof msg == "string")
			this.displayMessage(this.infoMessage(msg));
		else
			this.displayMessage(msg);
	},
	error: function(msg) {
		if (typeof msg == "string")
			this.displayMessage(this.errorMessage(msg));
		else
			this.displayMessage(msg);
	},
	displayMessage: function(message) {
		if (typeof message == "string") message = this.infoMessage(message);
		this.console.displayMessage(message);
	},
	setApplicationCommands: function(cmds) {
		this.console.setApplicationCommands(cmds);
	},
	clearRegisteredApplicationCommands: function() {
		this.console.clearRegisteredApplicationCommands();
	},
	getUserInput: function() {
		return this.console.getUserInput.apply(this.console, arguments);
	},
	thinking: function() {
		this.console.thinking();
	},
	registerApplicationCommand: function(command) {
		this.console.registerApplicationCommand(command);
	},
	warnBeforeUnload: function(msg) {
		this.console.warnBeforeUnload(msg);
	},
	clearWarnBeforeUnload: function() {
		this.console.clearWarnBeforeUnload();
	},
};
Application.prototype.constructor = Application;