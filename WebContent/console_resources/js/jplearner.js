var isDragging = false;
var dragMouseInitialX = 0;
var dragMouseInitialY = 0;
var dragComponentInitialX = 0;
var dragComponentInitialY = 0;
var $draggingEle = null;
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
	$(document).mouseup(function(e) {
		isDragging = false;
	});
	$(document).on("mousedown", ".draggable", function(e) {
		dragMouseInitialX = e.screenX;
		dragMouseInitialY = e.screenY;
		dragComponentInitialX = $(this).position().left;
		dragComponentInitialY = parseInt($(this).css("top"));
		isDragging = true;
		$draggingEle = $(this);
	});
	$(document).on("mousemove", function(e) {
		if (isDragging) {
			$draggingEle.css("left", e.screenX - dragMouseInitialX + dragComponentInitialX);
			$draggingEle.css("top", e.screenY - dragMouseInitialY + dragComponentInitialY);
			$draggingEle.css("right", "auto");
		}
	});
	$(document).on("click", ".draggable .close", function() {
		$(this).parents(".draggable").hide();
	});
}) 
function JPLearner() {
	this.listSize = 20;
	this.name = "JPLearner";
	this.welcome = "This is a japanese language learning app.\nようこそ！";
	this.wordset = null;
	this.chosenLessons = [];
	this.chosenWords = [];
	this.words = {};
	this.userHistory = {};
	this.modifiedUserHistory = [];
	this.chineseVisible = false;
	this.hiraganaVisible = false;
	this.kanjiVisible = false;
	this.currentWord = null;
	this.currentIndex = -1;
	this.startTime = -1;
	this.clock = -1;
	this.lastWordCompleteTime = 0;
	this.timeSpentInTotal = 0;
	this.timeSpentOnCurrentWord = 0;
	this.paused = false;
	this.$statusBox =  null;
}
JPLearner.prototype = new Application();
$.extend(JPLearner.prototype, {
	updateStatus: function() {
		if (!this.$statusBox) {
			var statusBoxHtml = 
				'<div class="statusArea draggable">                         ' +                                                   
				'	<div class="header">                                    ' +                                                   
				'		<label>STATUS</label>                               ' +                                                   
				'		<button type="button" class="close">&times;</button>' +                                                   
				'	</div>                                                  ' +                                                   
				'	<div class="body">                                      ' +
				'		<table class="statusTable">                         ' +
				'			<tr>                                            ' +
				'				<td>E/R</td>                                ' +
				'				<td class="timeElapsed col2">0</td>         ' +
				'				<td class="timeRemaining col3">0</td>       ' +
				'			</tr>                                           ' +
				'			<tr>                                            ' +
				'				<td>Word</td>                               ' +
				'				<td class="wordsElapsed col2">0</td>        ' +
				'				<td class="wordsInTotal col3"></td>         ' +
				'			</tr>                                           ' +
				'			<tr>                                            ' +
				'				<td>Speed</td>                              ' +
				'				<td class="learningSpeed col2">0</td>       ' +
				'				<td class="col3">s/w</td>                   ' +
				'			</tr>                                           ' +
				'		</table>                                            ' +
				'	</div>                                                  ' +                                                   
				'</div>                                                     ';                                               
			this.$statusBox = $(statusBoxHtml);
			this.console.$consoleDiv.append(this.$statusBox);
		}
		if (this.paused) {
			this.lastWordCompleteTime = (new Date()).getTime() - this.timeSpentOnCurrentWord;
		}
		this.timeSpentOnCurrentWord = (new Date()).getTime() - this.lastWordCompleteTime;
		var timeElapsed = this.timeSpentInTotal + this.timeSpentOnCurrentWord;
		timeElapsed /= 1000;
		var wordsElapsed = this.currentIndex;
		var wordsInTotal = this.chosenWords.length;
		this.$statusBox.find(".timeElapsed").text(this.formatTime(timeElapsed));
		this.$statusBox.find(".wordsInTotal").text(wordsInTotal);
		if (wordsElapsed > 0) {
			var speed = (this.timeSpentInTotal) / 1000 / wordsElapsed;
			var timeRemaining = (wordsInTotal - wordsElapsed) * speed;
			this.$statusBox.find(".timeRemaining").text(this.formatTime(timeRemaining));
			this.$statusBox.find(".wordsElapsed").text(wordsElapsed);
			this.$statusBox.find(".learningSpeed").text(Math.round(speed * 100) / 100);
		}
	},
	formatTime: function(time) {
		time = Math.round(time);
		if (time < 60) return time;
		if (time < 3600) return (Math.round(time / 60)) + ":" + time % 60;
		var second = time % 60;
		time = Math.round(time / 60);
		var min = time % 60;
		hour = Math.round(time / 60);
		return hour + ":" + min + ":" + second;
	},
	countMapSize: function(map) {
		var count = 0;
		for(var i in map) count++;
		return count;
	},
	generateWordsView: function(words, showAll) {
		if (!words || words.length == 0) return "0 word";
		var displayTable = new ConsoleTableMessageData();
		var ths = ["lesson", "type"];
		if (this.chineseVisible || showAll) {
			ths.push("chinese");
		}
		if (this.hiraganaVisible || showAll) {
			ths.push("hiragana");
		}
		if (this.kanjiVisible || showAll) {
			ths.push("kanji");
		}
		ths.push("timeSpent");
		ths.push("passRate");
		displayTable.addTr(ths);
		for (var i in words) {
			var tr = [];
			var word = words[i];
			tr.push(word["lessonNo"]);
			tr.push(word["type"]);
			if (this.chineseVisible || showAll) {
				tr.push(word["chinese"]);
			}
			if (this.hiraganaVisible || showAll) {
				tr.push(word["hiragana"]);
			}
			if (this.kanjiVisible || showAll) {
				tr.push(word["kanji"] ? word["kanji"] : word["hiragana"]);
			}
			var wordHistory = this.userHistory[word.wordId];
			if (wordHistory) {
				tr.push(this.formatTime(wordHistory.timeSpent / 1000));
				if (wordHistory["testCount"]) {
					var rate = wordHistory.testPassCount / wordHistory.testCount;
					rate = parseInt(rate * 10000) / 100 + "%"
					tr.push(rate);
				}
			}
			displayTable.addTr(tr);
		}
		return new CmdMessage(displayTable);
	},
	executeServerAction: function(action, params) {
		this.thinking();
		return new Promise(function(resolve) {
			$.ajax({
				cache: false,
				url: "ajax/" + action,
				data: params,
				type: "post",
				success: function(data) {
					resolve(data);
				}
			});
		});
	},
	main: function() {
		var learner = this;
		return this.selectWordSet()
		.catch(function(error) {
			if (error == "login") {
				learner.info("先登录才能使用");
				return learner.login().then(function() {
					return learner.selectWordSet();
				});
			}
			return error;
		})
		.then(function(wordsetId) {
			return learner.retrieveWordList(wordsetId);
		});
	},
	/**
	 * [{"wordsetId": "xxx", "name": "xxx", "description": "xxx"}]
	 */
	selectWordSet: function() {
		return new Promise(function(resolve, reject) {
			this.executeServerAction("retrieveWordSetList", {}).then(function(data) {
				if (data.loginFirst) {
					reject("login"); return;
				}
				var wordsets = JSON.parse(data.wordsetsInJSON);
				var tableMessageData = new ConsoleTableMessageData(3);
				tableMessageData.withBorder = true;
				tableMessageData.addTr(["ID", "name", "description"]);
				for (var i in wordsets) {
					tableMessageData.addTr([i, wordsets[i]["name"], wordsets[i]["description"]]);
				}
				this.displayMessage(new ConsoleMessage(tableMessageData));
				this.wordsets = wordsets;
				this.getUserInput("输入词库id:", function(inputStr) {
					var inputIndex = parseInt(inputStr);
					if (isNaN(inputIndex)) return false;
					if (inputIndex < 0 || inputIndex >= wordsets.length) return false;
					return true;
				}, "词库id输错了").
				then(function(wordsetId) {
					resolve(parseInt(wordsetId));
				}.bind(this))
			}.bind(this), reject);
		}.bind(this));
	},
//	[{
//		jpwordId: 1, hiragana: 'xxx', kanji: 'xxx', chinese: 'xxx', level: 0, nextReviewDate: null, passCount: 1, failCount: 0, notSureCount: 2
//	}]
	retrieveWordList: function(wordsetId) {
		return new Promise(function(resolve, reject) {
			this.wordset = this.wordsets[wordsetId];
			this.executeServerAction("retrieveWordList", {wordsetId: this.wordset["wordsetId"]})
			.then(function(data) {
				this.reviewWordList = JSON.parse(data.reviewWordListInJSON);
				this.rawWordList = JSON.parse(data.rawWordListInJSON);
				this.info("没背过的单词共有" + this.rawWordList.length + "个");
				if (!this.reviewWordList || this.reviewWordList.length == 0) {
					this.info("今天没有要复习的内容，下面随机选" + this.listSize + "个没背过的单词");
				}
				else if (this.reviewWordList.length < this.listSize) {
					this.info("今天有" + this.reviewWordList.length + "个单词要复习");
				}
				else {
					this.info("今天有" + this.reviewWordList.length + "个单词要复习，下面从中随机挑" + this.listSIze + "个");
				}
				console.log(this.rawWordList);
				console.log(this.reviewWordList);
				console.log(data);
				resolve({message: this.infoMessage("abc"), exitApplication: true});
			}.bind(this));
		}.bind(this));
	},
	login: function() {
		var learner = this;
		var pFunc = function(resolve, reject) {
			learner.getUserInput("请输入用户名：")
			.then(function(inputStr) {
				learner.userName = inputStr;
				return learner.getUserInput("请输入密码");
			})
			.then(function(inputStr) {
				learner.password = inputStr;
				return learner.executeServerAction("secretLogin", {
					userName: learner.userName,
					password: learner.password
				});
			})
			.then(function(data) {
				if (data.resultStatus == "success") {
					learner.info("Welcome, " + learner.userName);
					resolve();
				}
				else {
					learner.error("用户名或者密码错误");
					new Promise(pFunc).then(resolve, reject);
				}
			});
		};
		return new Promise(pFunc);
	},
	_startSelectLessons: function() {
		this.next("You can choose any lessons in 1-" + (this.words.length - 1) + ", e.g. 1 2 7-8", this.selectLessons);
	},
	selectLessons: function(optionStr) {
		var lessonParts = optionStr.trim().split(/\s+/);
		try {
			this.chosenLessons = [];
			this.chosenWords = [];
			var duplicate = {};
			for (var i in lessonParts) {
				var lessonPart = lessonParts[i];
				if (/^\d+$/.test(lessonPart)) {
					var lesson = parseInt(lessonPart);
					if (this.words[lesson]) {
						if (typeof duplicate[lesson] == "undefined") {
							duplicate[lesson] = 1;
						}
						else {
							continue;
						}
						this.chosenLessons.push(lesson);
						this.chosenWords = this.chosenWords.concat(this.words[lesson]);
					}
				}
				else {
					var boundaries = lessonPart.split("-");
					if (boundaries.length != 2) throw "error";
					var start = parseInt(boundaries[0])
					var end = parseInt(boundaries[1])
					if (!(start && end && start <= end)) {
						throw "error";
					}
					for (var lesson = start; lesson <= end; lesson++) {
						if (this.words[lesson]) {
							if (typeof duplicate[lesson] == "undefined") {
								duplicate[lesson] = 1;
							}
							else {
								continue;
							}
							this.chosenLessons.push(lesson);
							this.chosenWords = this.chosenWords.concat(this.words[lesson]);
						}
					}
				}
			}
			if (this.chosenLessons.length == 0) throw "error";
		}
		catch(e) {
			throw "Invalid lesson list, please enter again:"
		}
		this.displayMessage(this.chosenLessons.length + " lesson(s) and " + this.chosenWords.length + " word(s) have been selected.");
		this._startSelectFilters();
	},
	calTestPassRate: function(wordId) {
		var record = this.userHistory[wordId]
		var rate = 0;
		if (!record || !record.testCount) rate = 0;
		else {
			rate = record.testPassCount / record.testCount * 100;
		}
		return rate;
	},
	_startSelectFilters: function() {
		var percentStatistics = [];
		for (var i in this.chosenWords) {
			var word = this.chosenWords[i];
			var ratePart = parseInt(this.calTestPassRate(word.wordId) / 10);
			if (typeof percentStatistics[ratePart] == "undefined") {
				percentStatistics[ratePart] = 1;
			}
			else {
				percentStatistics[ratePart]++;
			}
		}
		var displayTable = new ConsoleTableMessageData();
		for (var i in percentStatistics) {
			if (percentStatistics[i])
				displayTable.addTr([i * 10 + "%", percentStatistics[i]]);
		} 
		this.displayMessage("Please choose the test pass rate period, e.g. 30-100, means the test pass rate is between 30% and 100%");
		this.displayMessage("The rate distribution is as below: ");
		this.next(new CmdMessage(displayTable),this.selectFilters);
	},
	selectFilters: function(optionStr) {
		var error = "Invalid period, please enter again:";
		if (!/\d+-\d+/.test(optionStr)) throw error;
		var parts = optionStr.split("-");
		var start = parseInt(parts[0]);
		var end = parseInt(parts[1]);
		if (start > end) throw error;
		var filtered = [];
		for (var i in this.chosenWords) {
			var word = this.chosenWords[i];
			var rate = this.calTestPassRate(word.wordId);
			if (rate >= start && rate <= end) {
				filtered.push(word);
			}
		}
		if (filtered.length == 0) {
			this.displayMessage("no word selected, please choose again");
			this._startSelectFilters();
		}
		else {
			this.chosenWords = filtered;
			this.displayMessage(this.chosenWords.length + " word(s) have been selected now.");
			this.next("Please choose the visible word parts: c(Chinese中国語) h(hiragana平仮名) kanji(kanji漢字)," + 
					" e.g. ch, means only show Chinese and hiragana",this.selectVisibleParts);
		}
	},
	selectVisibleParts: function(optionStr) {
		optionStr = optionStr.replace(/\s/g, "");
		if (!/^[chk]+$/.test(optionStr)) throw "Invalid, please enter again:";
		if (optionStr.search("c") >= 0) this.chineseVisible = true;
		if (optionStr.search("h") >= 0) this.hiraganaVisible = true;
		if (optionStr.search("k") >= 0) this.kanjiVisible = true;
		this.resetLearningCycleData();
		this.startLearningCycle();
	},
	searchByKanji: function(keyWord) {
		var result = [];
		for (var i in this.words) {
			for (var j in this.words[i]) {
				if (this.words[i][j].kanji && this.words[i][j].kanji.indexOf(keyWord) >= 0) result.push(this.words[i][j]);
			}
		}
		return result;
	},
	resetLearningCycleData: function() {
		if (this.$statusBox) {
			this.$statusBox.remove();
			this.$statusBox = null;
		}
		this.clearRegisteredApplicationCommands();
		this.currentIndex = -1;
		this.currentWord = null;
		this.startTime = -1;
		window.clearInterval(this.clock);
	},
	nextWord: function(optionStr) {
		this.currentIndex++;
		this.currentWord = this.chosenWords[this.currentIndex];
		if (!this.currentWord) {
			this.finishLearningCycle();
		}
		else {
			this.next(this.generateWordsView([this.currentWord]));
			this.updateStatus();
		}
	},
	finishLearningCycle: function() {
		this.synchronize(function(msg) {
			this.displayMessage(msg);
			this.resetLearningCycleData();
			this._startSelectLessons();
		})
	},
	synchronize: function(callback) {
		var app = this;
		var count = this.modifiedUserHistory.length;
		if (app.modifiedUserHistory.length > 0) {
			this.displayMessage(new CmdMessage("Synchronizing, please wait...", "gray"));
			this.executeServerAction("synchronize",{data: JSON.stringify(this.modifiedUserHistory)}, function(data) {
				app.modifiedUserHistory = [];
				callback.call(app, count + " record(s) have been synchronized.");
			});
		}
		else {
			callback.call(app, "0 record is synchronized.");
		}
	},
	startLearningCycle: function() {
		this.console.registerApplicationCommand(this.console._clearCommand());
		this.console.registerApplicationCommand(this._tickCommand("0"));
		this.console.registerApplicationCommand(this._tickCommand("y"));
		this.console.registerApplicationCommand(this._tickCommand("n"));
		this.console.registerApplicationCommand(this._exitCommand());
		this.console.registerApplicationCommand(this._pauseCommand());
		this.console.registerApplicationCommand(this._resumeCommand());
		this.console.registerApplicationCommand(this._allCommand());
		this.console.registerApplicationCommand(this._statusCommand());
		this.console.registerApplicationCommand(this._findCommand());
		this.console.registerApplicationCommand(this._syncCommand());
		this.console.registerApplicationCommand(this._endCommand());
		this.startTime = (new Date()).getTime();
		this.lastWordCompleteTime = this.startTime;
		var app = this;
		this.clock = window.setInterval(function() {
			app.updateStatus();
		}, 1000);
		this.nextWord();
	},
	_tickCommand: function(tick) {
		var hints = {
			"0": "Learnt",
			"y": "Test pass",
			"n": "Test failed"
		};
		var counts = {
			"0": 0,
			"y": 0,
			"n": 0
		};
		counts[tick]++;
		var app = this;
		var cmd = new Command(tick, hints[tick]);
		cmd.executeImpl = function(data) {
			var wordId = app.currentWord.wordId;
			app.updateStatus();
			if (typeof app.userHistory[wordId] == "undefined") {
				app.userHistory[wordId] = {
					learnCount: counts["0"],
					testCount: counts["y"] + counts["n"],
					testPassCount: counts["y"],
					timeSpent: app.timeSpentOnCurrentWord,
					wordId: wordId,
					wordsetId: app.wordset.wordsetId
				};
			}
			else {
				app.userHistory[wordId] = $.extend(app.userHistory[wordId], {
					learnCount: app.userHistory[wordId].learnCount + counts["0"],
					testCount: app.userHistory[wordId].testCount + counts["y"] + counts["n"],
					testPassCount: app.userHistory[wordId].testPassCount + counts["y"],
					timeSpent: app.userHistory[wordId].timeSpent + app.timeSpentOnCurrentWord
				});
			}
			app.modifiedUserHistory.push(app.userHistory[wordId]);
			app.lastWordCompleteTime = (new Date()).getTime();
			app.timeSpentInTotal += app.timeSpentOnCurrentWord;
			app.timeSpentOnCurrentWord = 0;
			app.updateStatus();
			app.displayMessage(this.hint);
			app.nextWord();
		}
		return cmd;
	},
	_allCommand: function() {
		var app = this;
		var cmd = new Command("a", "show all parts of current word");
		cmd.executeImpl = function(data) {
			app.next(app.generateWordsView([app.currentWord], true));
		}
		return cmd;
	},
	_exitCommand: function() {
		var app = this;
		var cmd = new Command("exit", "exit the application");
		cmd.executeImpl = function(data) {
			app.synchronize(function(msg) {
				this.displayMessage(msg);
				this.resetLearningCycleData();
				this.end();
			})
		};
		return cmd;
	},
	_pauseCommand: function() {
		var app = this;
		var cmd = new Command("pause", "pause");
		cmd.executeImpl = function(data) {
			app.paused = true;
			app.timeSpentOnCurrentWord = (new Date()).getTime() - app.lastWordCompleteTime;
			app.updateStatus();
			this.end("paused");
		} 
		return cmd;
	},
	_resumeCommand: function() {
		var app = this;
		var cmd = new Command("resume", "resume from pause");
		cmd.executeImpl = function(data) {
			app.paused = false;
			app.lastWordCompleteTime = (new Date()).getTime() - app.timeSpentOnCurrentWord;
			app.updateStatus();
			this.end("resumed")
		};
		return cmd;
	},
	_statusCommand: function() {
		var app = this;
		var cmd = new Command("status", "toggle status box");
		cmd.executeImpl = function(data) {
			app.$statusBox.toggle();
			if (app.$statusBox.is(":visible")) {
				this.end("status box on");
			}
			else {
				this.end("status box off");
			}
		}
		return cmd;
	},
	_findCommand: function() {
		var app = this;
		var cmd = new Command("f", "find by kanji");
		cmd.valueRequired = true;
		cmd.executeImpl = function(data) {
			var keyWord = data[0]["value"][0];
			var result = app.searchByKanji(keyWord);
			this.end(app.generateWordsView(result, true));
		}
		return cmd;
	},
	_syncCommand: function() {
		var app = this;
		var cmd = new Command("sync", "synchronize user data with server");
		cmd.executeImpl = function(data) {
			var thisCmd = this;
			app.synchronize(function(msg) {
				thisCmd.end(msg)
			});
		};
		return cmd;
	},
	_endCommand: function() {
		var app = this;
		var cmd = new Command("end", "end this learning cycle");
		cmd.executeImpl = function(data) {
			app.finishLearningCycle();
		}
		return cmd;
	}
});
JPLearner.prototype.constructor = JPLearner;