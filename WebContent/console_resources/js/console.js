$(document).ready(function() {
	$('[contenteditable]').on("focus", function(e) {
	    window.setTimeout(function() {
	        $(e.target).text("")
	    }, 100);
	});

	// Code below this line is to simply reset the element with some text after clicking/tabbing away.
	$('[contenteditable]').on("blur", function(e) {
	    $(e.target).text("Hello")
	});
});
(function( $ ) { 
    $.cmdConsole = function(options, $consoleDiv) {
    	this.settings = $.extend({
    		info: "This is just for fun.\nWeb console UI. \nversion 0.4",
    		rightPaste: true
    	}, options);
    	this.$consoleDiv = $consoleDiv;
    	this.consoleDiv = $consoleDiv[0];
    	this.commandHistory = [];
    	this.registeredCommands = {};
    	this.registeredApplications = {};
    	this.registeredApplicationCommands = {};
    	this.activeApplication = null;
    	this.currentCommandIndex = -1;
    	this.clipboard = undefined;
    	this.$currentInput = undefined;
    	this.currentCommand = null;
    	this.enterPromise = null;
    	this.init();
    };
    $.extend($.cmdConsole, {
    	prototype: {
    		utils: {
    			moveCursorToEnd: function(contentEditableElement) {
    			    var range,selection;
    			    if (document.createRange) {//Firefox, Chrome, Opera, Safari, IE 9+
    			        range = document.createRange();//Create a range (a range is a like the selection but invisible)
    			        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
    			        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    			        selection = window.getSelection();//get the selection object (allows you to change selection)
    			        selection.removeAllRanges();//remove any selections already made
    			        selection.addRange(range);//make the range you have just created the visible selection
    			    }
    			    else if (document.selection) { //IE 8 and lower
    			        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
    			        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
    			        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    			        range.select();//Select the range (make it the visible selection
    			    }
    			},
    			getSelectedText: function() {
    			    if (window.getSelection) {
    			        return window.getSelection().toString();
    			    } else if (document.selection) {
    			        return document.selection.createRange().text;
    			    }
    			    return '';
    			},
    			disableRightClickMenu: function($ele) {
    				$ele.attr("oncontextmenu", "return false;");
    			},
    			scrollToBottom: function() {
    				$("body").scrollTop(document.body.scrollHeight);
    			}
    		},
    		onSelect: function(ele, event) {
    			var selectedText = $.trim(this.utils.getSelectedText());
    			if (selectedText) this.clipboard = selectedText;
    		},
    		onRightClick: function(ele, event) {
    			if (this.clipboard) {
    				this._enterCommand(this.clipboard);
    			}
    		},
    		processUserInput: function(inputStr) {
    			if (this.userInputObj.check == undefined || this.userInputObj.check(inputStr)) {
    				this.userInputObj.resolve(inputStr);
    				delete this.userInputObj;
    			}
    			else {
    				var errorMessage = this.userInputObj.errorMessage;
    				if (typeof errorMessage == "function") {
    					errorMessage = errorMessage(inputStr);
    				}
    				this.info(errorMessage);
    				this.info(this.userInputObj.prompt);
    				this.startNewInput();
    			}
    		},
			onEnter: function(ele, event) {
				var inputStr = $.trim(this.$currentInput.text());
				var cmdConsole = this;
				if (this.isWaitingForUserInput()) {
					this.processUserInput(inputStr);
					return;
				}
				var p;
				try {
					p = this.processCommand(inputStr);
				}
				catch(e) {
					p = Promise.reject(e);
				}
				p.then(this.onExecuteComplete.bind(this), function(e) {
					var message = null;
					if (e == "help") {
						message = new ConsoleMessage(this.currentCommand.toDisplayData());
					}
					else {
						message = new ConsoleMessage(e.toString(), "red");
					}
					this.onExecuteComplete(message);
				}.bind(this));
			},
			onTab: function(ele, event) {
				if (this.isApplicationRunning() && !this.isApplicationCommandRegistered()) return;
				var inputStr = $.trim(this.$currentInput.text());
				var cmdMessage = "";
				var count = 0;
				var lastMatchedCmd = undefined;
				for (var cmd in this.isApplicationRunning() ? this.registeredApplicationCommands : this.registeredCommands) {
					if (!inputStr || cmd.toLowerCase().indexOf(inputStr.toLowerCase()) == 0) {
						if (cmdMessage) cmdMessage += "\n";
						cmdMessage += cmd;
						count++;
						lastMatchedCmd = cmd;
					}
				}
				var applicationMsg = "";
				if (!this.isApplicationRunning()) {
					for (var cmd in this.registeredApplications) {
						if (!inputStr || cmd.toLowerCase().indexOf(inputStr.toLowerCase()) == 0) {
							if (applicationMsg) applicationMsg += "\n";
							applicationMsg += cmd;
							count++;
							lastMatchedCmd = cmd;
						}
					}
				}
				if (count == 1) {
					this._replaceCommand(lastMatchedCmd);
					return;
				}
				if (count == 0) this.displayMessage(new ConsoleMessage("none", "green"));
				else if (cmdMessage && applicationMsg) {
					this.displayMessage(new ConsoleMessage("Commands:", "orange"));
					this.displayMessage(new ConsoleMessage(cmdMessage, "green"));
					this.displayMessage(new ConsoleMessage("Applications:", "orange"));
					this.displayMessage(new ConsoleMessage(applicationMsg, "green"));
				}
				else {
					this.displayMessage(new ConsoleMessage(cmdMessage + applicationMsg, "green"));
				}
				this.startNewInput();
				this._replaceCommand(inputStr);
			},
			onExecuteComplete: function(data) {
				if (data) {
					var message = typeof data.exitApplication != "undefined" ? data.message : data;
					if (message) this.displayMessage(message);
					if (data.exitApplication) {
						this._stopApplication();
					}
				}
				this.startNewInput();
			},
			startNewInput: function() {
    			var $inputBlock = $('<div class="cmd_console_block cmd_console_block_input cmd_console_line"></div>');
    			this.$consoleDiv.append($inputBlock);
    			if (!this.isApplicationRunning() || this.isApplicationCommandRegistered()) $inputBlock.append('<span class="cmd_console_arrow">&gt;</span>');
    			var $cmdConsoleInput = $('<span contenteditable="true" spellcheck="false" class="cmd_console_input"></span>');
    			if (this.$currentInput) this.$currentInput.removeAttr("contenteditable");
    			this.$currentInput = $cmdConsoleInput;
    			$inputBlock.append($cmdConsoleInput);
    			this.utils.scrollToBottom();
    			this.utils.moveCursorToEnd($cmdConsoleInput[0]);
    			$cmdConsoleInput.focus();
			},
			getUserInput: function(prompt, check, errorMessage) {
				return new Promise(function(resolve, reject) {
					this.info(prompt);
					this.userInputObj = {
						resolve: resolve,
						reject: reject,
						prompt: prompt,
						check: check,
						errorMessage: errorMessage
					};
					this.startNewInput();
				}.bind(this));
			},
			isWaitingForUserInput: function() {
				return this.userInputObj;
			},
    		displayMessage: function(message) {
    			var $cmdConsoleBlockResult = $('<div class="cmd_console_block cmd_console_block_result"></div>');
    			this.$consoleDiv.append($cmdConsoleBlockResult);
    			var cssClass = "cmd_console_text_" + message.color;
    			var data = message.data;
				if (typeof(data) == "object") {
					if (data.constructor.name == "ConsoleTableMessageData")
						this._generateTableResult($cmdConsoleBlockResult, data, cssClass);
				}
				else {
					this._generateLineResult($cmdConsoleBlockResult, data, cssClass);
				}
    			this.utils.scrollToBottom();
    		},
    		info: function(str) {
    			this.displayMessage(new ConsoleMessage(str, "green"));
    		},
    		_enterCommand: function(command) {
				var currentText = this.$currentInput.text();
				this.$currentInput.text(currentText + command);
				this.utils.moveCursorToEnd(this.$currentInput[0]);
    		},
    		_replaceCommand: function(command) {
    			this.$currentInput.text(command);
    			this.utils.moveCursorToEnd(this.$currentInput[0]);
    		},
    		_generateTableResult: function($container, tableData, cssClass) {
    			var tableClass = 'cmd_console_table ' + cssClass;
    			if (tableData.withBorder) {
    				tableClass += " cmd_console_with_border";
    			}
    			var $table = $('<table class="' + tableClass + '"></table>');
    			for (var i in tableData.trs) {
    				var tds = tableData.trs[i];
    				var $tr = $('<tr></tr>');
    				for (var j = 0; j < tableData.columnCount; j++) {
    					if (tds[j] || tds[j] == 0) {
    						var str = tds[j];
    	    				if (!this._containsAllAscii(str)) {
        						$tr.append('<td class="non-ascii">' + str + '</td>');
    	    				}
    	    				else {
        						$tr.append('<td>' + str + '</td>');
    	    				}
    					}
    					else 
    						$tr.append('<td></td>');
    				}
    				$table.append($tr);
    			}
    			$container.append($table);
    		},
    		_generateLineResult: function($container, data, cssClass) {
    			data = data + "";
    			var resultLines = data.split("\n");
    			for (var i in resultLines) {
    				var line = resultLines[i];
    				if (!this._containsAllAscii(line)) cssClass += " non-ascii";
    				$container.append('<span class="cmd_console_line ' + cssClass + '">' + resultLines[i] + '</span>');
    			}
    		},
    		_containsAllAscii: function(str) {
    			return  /^[\000-\177]*$/.test(str) ;
    		},
    		_startApplication: function(application, optionStr) {
    			this.activeApplication = application;
    			return application.start(optionStr);
    		},
    		_stopApplication: function() {
    			this.displayMessage(new ConsoleMessage(this.activeApplication.name + " exited.", "orange"));
    			this.activeApplication = null;
    			this.registeredApplicationCommands = {};
    		},
    		isApplicationRunning: function() {
    			if (this.activeApplication) return true;
    			return false;
    		},
    		isApplicationCommandRegistered: function() {
    			if (!this.registeredApplicationCommands) return false;
    			for (var i in this.registeredApplicationCommands) {
    				return true;
    			}
    			return false;
    		},
    		thinking: function() {
    			if (this.$currentInput) this.$currentInput.removeAttr("contenteditable");
    			this.$currentInput = undefined;
    			this.displayMessage(new ConsoleMessage("Thinking, please wait...", "gray"));
    		},
    		processCommand: function(inputStr) {
				var commandStr = inputStr;
				var hasOption = false;
				//to do, application specific history
				this.addCommandHistory(inputStr);
				var optionStr = undefined;
				if (inputStr.indexOf(" ") >= 0) {
					commandStr = inputStr.substr(0, inputStr.indexOf(" "));
					optionStr = inputStr.substr(inputStr.indexOf(" "));
					hasOption = true;
				}
				var command = this.isApplicationRunning() ? this.registeredApplicationCommands[commandStr] : this.registeredCommands[commandStr];
				if (command) {
					this.currentCommand = command;
					if (hasOption) {
						var data = command.analyzeCommand(optionStr);
						return command.execute(data);
					}
					return command.execute();
				}
				if (this.registeredApplications[commandStr] && !this.isApplicationRunning()){
					if (hasOption) {
						return this._startApplication(this.registeredApplications[commandStr], optionStr);
					}
					return this._startApplication(this.registeredApplications[commandStr]);
				}
				else {
					return Promise.reject("Command " + commandStr + " is not supported. Press Tab to get supported commands list.");
				}
    		},
    		addCommandHistory: function(command) {
    			this.commandHistory.push(command);
    			this.currentCommandIndex = this.commandHistory.length;
    		},
    		showNextCommand: function() {
    			if (this.isApplicationRunning()) return;
    			if (this.currentCommandIndex < 0) return;
    			if (this.currentCommandIndex >= this.commandHistory.length - 1) return;
    			this.currentCommandIndex ++;
    			this._replaceCommand(this.commandHistory[this.currentCommandIndex]);
    		},
    		showPrevCommand: function() {
    			if (this.isApplicationRunning()) return;
    			if (this.currentCommandIndex < 0) return;
    			if (this.currentCommandIndex == 0) return;
    			this.currentCommandIndex --;
    			this._replaceCommand(this.commandHistory[this.currentCommandIndex]);
    		},
    		init: function() {
    			this._initConsoleByHtmlInsertion();
    			this._bindEvents();
    			this._embedInternalCommand();
				if (this.settings.rightPaste) this.utils.disableRightClickMenu(this.$consoleDiv);
    		},
    		registerCommand: function(cmd) {
    			cmd.registerConsole(this);
    			this.registeredCommands[cmd.content] = cmd;
    		},
    		registerApplicationCommand: function(cmd) {
    			cmd.registerConsole(this);
    			this.registeredApplicationCommands[cmd.content] = cmd;
    		},
    		clearRegisteredApplicationCommands: function() {
    			this.registeredApplicationCommands = [];
    		},
    		registerApplication: function(app) {
    			app.registerConsole(this);
    			this.registeredApplications[app.name] = app;
    		},
    		_initConsoleByHtmlInsertion: function() {
    			this.$consoleDiv.addClass("cmd_console");
    			var $info = $(('<div class="cmd_console_info cmd_console_text_orange"></div>'));
    			this.$consoleDiv.append($info);
    			var infoLines = this.settings["info"].split("\n");
    			for (var i in infoLines) {
    				$info.append('<span class="cmd_console_line narrow">' + infoLines[i] + '</span>');
    			}
    			this.startNewInput();
    		},
    		_bindEvents: function() {
    			var cmdConsole = this;
    			this.$consoleDiv.on("keydown", ".cmd_console_input", function(event) {    				
    				//enter
    				if (event.keyCode == 13) {
    					event.preventDefault();
        				cmdConsole.onEnter(this, event);
    				}
    				//arrow up
    				else if (event.keyCode == 38) {
    					event.preventDefault();
    					cmdConsole.showPrevCommand();
    				}
    				//arrow down
    				else if (event.keyCode == 40) {
    					event.preventDefault();    		
    					cmdConsole.showNextCommand();
    				}
    				//tab
    				else if (event.keyCode == 9) {
    					event.preventDefault();
    					cmdConsole.onTab(this, event);
    				}
    			});
    			if (this.settings.rightPaste) {
        			this.$consoleDiv.mouseup(function(event) {
        				//left mouse click
        				if (event.which == 1) {
        					cmdConsole.onSelect(this, event);
        				}
        				//right mouse click
        				else if (event.which == 3) {
        					event.preventDefault();
        					cmdConsole.onRightClick(this, event);
        				}
        			});
    			}
    		},
    		//below are internal commands
    		_embedInternalCommand: function() {
    			this.registerCommand(this._clearCommand());
    			this.registerCommand(this._getRGBCommand());
    			this.registerCommand(this._getHexColorCommand());
    		},
    		_clearCommand: function() {
    			var cmd = new Command("clear", "Clear all messages on the screen");
    			var cmdConsole = this;
    			cmd.executeImpl = function(data, resolve) {
    				cmdConsole.$consoleDiv.find(".cmd_console_block").remove();
    				resolve();
    			};
    			return cmd;
    		},
    		_getRGBCommand: function() {
    			var cmd = new Command("rgb", "input hexformat color, e.g. #00FF00, get rgb format color");
    			cmd.valueRequired = true;
    			cmd.executeImpl = function(data, resolve) {
    				var value = data[0]["value"][0];
    				var matches = value.match(/^#?([0-9a-fA-F]{6})$/);
    				if (!matches) {
    					throw "You must input a hexformat color, e.g. #00FF00 or 00FF00";
    				}
    				var hexString = matches[1];
    				resolve(new ConsoleMessage("rgb("
    						+ parseInt("0x" + hexString.substr(0, 2)) + ","
    						+ parseInt("0x" + hexString.substr(2, 2)) + ","
    						+ parseInt("0x" + hexString.substr(4, 2)) + ")", "green"));
    			}
    			return cmd;
    		},
    		_getHexColorCommand: function() {
    			var help = "input rgb format color, e.g. rgb(0,255,0) or (0,255,0) or 0,255,0 \nWarning: no space is allowed";
    			var cmd = new Command("hexColor", help);
    			cmd.valueRequired = true;
    			cmd.executeImpl = function(data, resolve) {
    				var value = data[0]["value"][0];
    				var matches = value.match(/^\(?([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\)?$/);
    				if (!matches) {
    					throw "You must " + help;
    				}
    				var toToDigitsHex = function(numStr) {
    					var hexStr = parseInt(numStr).toString("16");
    					if (hexStr.length == 1) hexStr = "0" + hexStr;
    					return hexStr.toUpperCase();
    				}
    				resolve(new ConsoleMessage("#" + toToDigitsHex(matches[1]) + toToDigitsHex(matches[2]) + toToDigitsHex(matches[3]), "green"));
    			}
    			return cmd;
    		}
    	}
    
    });
    $.fn.cmdConsole = function(options) {
		if (this.length == 0) return;
		return new $.cmdConsole(options, this);
    }; 
}( jQuery ));