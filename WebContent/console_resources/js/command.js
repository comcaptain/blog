function Command(content, hint) {
	this.content = content;
	this.hint = hint;
	this.valueRequired = false;
	this.options = [];
	this.console = null;
}
Command.prototype = {
	name: "ConsoleCommand",
	wrapMessage: function(strMessage) {
		return new ConsoleMessage(strMessage, "green")
	},
	addOption: function(option) {
		this.options[option.content] = option;
	},
	registerConsole: function(console) {
		this.console = console;
	},
	toDisplayData: function() {
		var data = new ConsoleTableMessageData(4);
		data.withBorder = true;
		data.addTr(["name", "hint", "require value", "can combine"]);
		data.addTr([this.content, this.hint, this.valueRequired]);
		for (var i in this.options) {
			var option = this.options[i];
			data.addTr(["-" + option.content, option.hint, option.valueRequired, option.canCombine]);
		}
		return data;
	},
	_preProcessCommand: function(str) {
		str = str.replace(/\s+/g, " ");
		str = str.trim();
		return str;
	},
	_isOptionString: function(str) {
		return str.indexOf("-") == 0;
	},
	_testHelp: function(str) {
		return str.indexOf("--help") >= 0;
	},
	_toOptionValueStringPairs: function(str) {
		var optionValueStringPairList = [];
		var optionValueStringPair = [];
		var parts = str.split(" ");
		for (var i = 0; i < parts.length; i++) {
			var part = parts[i];
			if (this._isOptionString(part)) {
				if (this._testHelp(part)) {
					throw "help";
				}
				part = part.substr(1);
				if (optionValueStringPair["value"]) {
					optionValueStringPairList.push(optionValueStringPair);
					optionValueStringPair = [];
				}
				if (!optionValueStringPair["option"]) optionValueStringPair["option"] = [part];
				else optionValueStringPair["option"].push(part);
			}
			else {
				if (!optionValueStringPair["value"]) optionValueStringPair["value"] = [part];
				else optionValueStringPair["value"].push(part);
			}
		}
		if (optionValueStringPair != []) optionValueStringPairList.push(optionValueStringPair);
		return optionValueStringPairList;
	},
	_getOptionObjFromOptionStr: function(optionStr) {
		//if there is only one single option
		if (this.options[optionStr]) return [this.options[optionStr]];
		var optionObjs = [];
		var isCombine = true;
		var combineRuleRuinedOptionObjs = [];
		for(var i = 0; i < optionStr.length; i++) {
			var optionObj = this.options[optionStr.charAt(i)];
			if (!optionObj) {
				isCombine = false;
				break;
			}
			if (!optionObj.canCombine) combineRuleRuinedOptionObjs.push(optionObj);
			optionObjs.push(optionObj);
		}
		if (isCombine) {
			if (combineRuleRuinedOptionObjs.length > 0) {
				throw "Option -" + combineRuleRuinedOptionObjs[0]["content"] + " cannot be combined."
			}
			return optionObjs;
		}
		throw "Option -"  + optionStr + " is not supported!";
	},
	_referenceOptionObj: function(optionValueStringPairList) {
		var optionValuePairList = [];
		for (var i in optionValueStringPairList) {
			var optionValueStringPair = optionValueStringPairList[i];
			var optionValueObjPair = optionValueStringPair;
			var valueRequiredOptionName = "";
			if (optionValueStringPair["option"]) {
				var optionStrList = optionValueStringPair["option"];
				var optionObjList = [];
				for (var j in optionStrList) {
					var optionStr = optionStrList[j];
					var optionObjs = this._getOptionObjFromOptionStr(optionStr);
					for (var k in optionObjs) {
						var optionObj = optionObjs[k];
						optionObjList[optionObj.content] = optionObj;
						if (optionObj.valueRequired) valueRequiredOptionName = optionObj.content;
					}
				}
				optionValueObjPair["option"] = optionObjList;
			}
			if (valueRequiredOptionName && !optionValueObjPair["value"]) {
				throw "Option -" +  valueRequiredOptionName + " requires value.";
			}
			optionValuePairList.push(optionValueObjPair); 
			valueRequiredOptionName = "";
		}
		return optionValuePairList;
	},
	analyzeCommand: function(str) {
		str = this._preProcessCommand(str);
		if (!str) return;
		var optionValueStringPairList = this._toOptionValueStringPairs(str);
		var optionValuePairList = this._referenceOptionObj(optionValueStringPairList);
		return optionValueStringPairList;
	},
	/*
	data format:
	[
	 {
	   "option": "optionObjs",
	   "value": ["val1", "val2", ...]
	 },
	 {
	   "option": "optionObjs",
	   "value": ["val1", "val2", ...]
	 }
	]
	*/
	executeImpl: function(data, resolve) {
		return resolve(new ConsoleMessage("default execute", "green"));
	},
	execute: function(data) {
		return new Promise(function(resolve, reject) {
			if (!data && this.valueRequired) {
				resolve(new ConsoleMessage("Value is required", "red"));
				return;
			}
			this.executeImpl(data, resolve, reject)
		}.bind(this));
	},
	displayMessage: function(message) {
		if (typeof message == "string") message = this.wrapMessage(message);
		this.console.displayMessage(message);
	}
}
Command.prototype.constructor = Command;