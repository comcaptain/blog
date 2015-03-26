var COOKED = -1;
var isDragging = false;
var dragMouseInitialX = 0;
var dragMouseInitialY = 0;
var dragComponentInitialX = 0;
var dragComponentInitialY = 0;
var $draggingEle = null;
$(document).ready(function() {
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
	this.listSize = 5;
	this.repeatTimes = 2;
	this.repeatCount = 0;
	this.name = "JPLearner";
	this.welcome = "This is a japanese language learning app.\nようこそ！";
	this.wordset = null;
	this.pickedWordList = [];
	this.words = {};
	this.statistics = {};
	this.notSynchronizedWords = {};
	this.currentWord = null;
	this.currentIndex = -1;
	this.startTime = -1;
	this.clock = -1;
	this.lastWordCompleteTime = 0;
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
				'				<td>累计时间</td>                           ' +
				'				<td class="timeElapsed col2">0</td>         ' +
				'			</tr>                                           ' +
				'			<tr>                                            ' +
				'				<td>单词量</td>                             ' +
				'				<td class="wordsElapsed col2">0</td>        ' +
				'			</tr>                                           ' +
				'			<tr>                                            ' +
				'				<td>通过率</td>                             ' +
				'				<td class="rate col2">0</td>                ' +
				'			</tr>                                           ' +
				'		</table>                                            ' +
				'	</div>                                                  ' +                                                   
				'</div>                                                     ';                                               
			this.$statusBox = $(statusBoxHtml);
			this.console.$consoleDiv.append(this.$statusBox);
		}
		if (Object.keys(this.notSynchronizedWords).length > 0) {
			this.warnBeforeUnload();
		}
		else {
			this.clearWarnBeforeUnload();
		}
		if (this.paused) {
			this.lastWordCompleteTime = (new Date()).getTime() - this.timeSpentOnCurrentWord;
		}
		this.timeSpentOnCurrentWord = (new Date()).getTime() - this.lastWordCompleteTime;
		var timeElapsed = this.statistics.accumulatedTime + this.timeSpentOnCurrentWord;
		timeElapsed /= 1000;
		this.$statusBox.find(".timeElapsed").text(this.formatTime(timeElapsed));
		var wordsElapsed = this.statistics.passCount + this.statistics.failCount + this.statistics.notSureCount;
		this.$statusBox.find(".wordsElapsed").text(wordsElapsed);
		this.$statusBox.find(".rate").text(this.defaultZero(Math.round(this.statistics.passCount / wordsElapsed * 10000) / 100) + "%");
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
	generateWordsView: function(words, showAll) {
		if (!words || words.length == 0) return "0 word";
		var displayTable = new ConsoleTableMessageData();
		var ths = ["kanji"];
		if (showAll) {
			ths.push("hiragana");
			ths.push("chinese");
		}
		ths.push("timeSpent");
		ths.push("passRate");
		displayTable.addTr(ths);
		for (var i in words) {
			var tr = [];
			var word = words[i];
			tr.push(word["kanji"] ? word["kanji"] : word["hiragana"]);
			if (showAll) {
				tr.push(word["hiragana"]);
				tr.push(word["chinese"]);
			}
			tr.push(this.formatTime(this.defaultZero(word.accumulatedTime) / 1000));
			var totalCount = word.passCount + word.notSureCount + word.failCount;
			var rate;
			if (totalCount > 0) {
				rate = word.passCount / totalCount;
				rate = parseInt(rate * 10000) / 100 + "%"
			}
			else {
				rate = '0';
			}
			tr.push(rate);
			displayTable.addTr(tr);
		}
		return new ConsoleMessage(displayTable);
	},
	executeServerAction: function(action, params) {
		this.thinking();
		return new Promise(function(resolve, reject) {
			$.ajax({
				cache: false,
				url: "ajax/" + action,
				data: params,
				type: "post",
				success: function(data) {
					resolve(data);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					reject();
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
		})
		.then(function() {
			return learner.startLearningCycle();
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
//	reviewWordList and rawWordList:
//	[{
//		jpwordId: 1, hiragana: 'xxx', kanji: 'xxx', chinese: 'xxx', level: 0, nextReviewDate: null, passCount: 1, failCount: 0, notSureCount: 2
//	}]
//	statistics:
//	{passCount: 1, notSureCount: 1, failCount: 1, accumulatedTime, wmStatisticsId}
	retrieveWordList: function(wordsetId) {
		return new Promise(function(resolve, reject) {
			this.wordset = this.wordsets[wordsetId];
			this.executeServerAction("retrieveWordList", {wordsetId: this.wordset["wordsetId"]})
			.then(function(data) {
				this.reviewWordList = JSON.parse(data.reviewWordListInJSON);
				this.rawWordList = JSON.parse(data.rawWordListInJSON);
				this.statistics = data.statisticsToday;
				if (!this.statistics) this.statistics = {};
				resolve();
			}.bind(this));
		}.bind(this));
	},
	pickWordListFromReviewList: function() {
		return this.pickWordList(this.reviewWordList, this.listSize);
	},
	pickWordListFromRawList: function() {
		return this.pickWordList(this.rawWordList, this.listSize);
	},
	pickWordList: function(wordList, maxCount) {
		var max = Math.min(wordList.length, maxCount);
		var picked = [];
		var edge = wordList.length - 1;
		for (var i = 0; i < max; i++) {
			var chosenIndex = parseInt(Math.random() * edge);
			picked.push(wordList[chosenIndex]);
			if (chosenIndex != edge) {
				var temp = wordList[chosenIndex];
				wordList[chosenIndex] = wordList[edge];
				wordList[edge] = temp;
			}
			edge--;
		}
		return picked;
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
	searchByKanji: function(keyWord) {
		var result = [];
		for (var i in this.reviewWordList) {
			if (this.reviewWordList[i].kanji && this.reviewWordList[i].kanji.indexOf(keyWord) >= 0) result.push(this.reviewWordList[i]);
		}
		for (var i in this.rawWordList) {
			if (this.rawWordList[i].kanji && this.rawWordList[i].kanji.indexOf(keyWord) >= 0) result.push(this.rawWordList[i]);
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
		this.currentWord = this.pickedWordList[this.currentIndex];
		return new Promise(function(resolve, reject) {
			if (!this.currentWord) {
				this.finishLearningCycle().then(resolve, reject);
			}
			else {
				this.info(this.generateWordsView([this.currentWord]));
				this.updateStatus();
				resolve();
			}
		}.bind(this));
	},
	finishLearningCycle: function(forceRestart) {
		return this.synchronize().then(function() {
			this.resetLearningCycleData();
			this.repeatCount++;
			if (forceRestart || this.repeatCount >= this.repeatTimes) {
				return this.startLearningCycle();
			}
			else {
				this.info("start fast review");
				return this.startLearningCycle(true);
			}
		}.bind(this));
	},
	synchronize: function(callback) {
		return new Promise(function(resolve, reject) {
			if (Object.keys(this.notSynchronizedWords).length > 0) {
				this.displayMessage(new ConsoleMessage("Synchronizing, please wait...", "gray"));
				this.executeServerAction("synchronizeJpLearnerUserData",{
					notSynchronizedWordsInJson: JSON.stringify(this.notSynchronizedWords),
					dailyStatisticsInJson: JSON.stringify(this.statistics),
					wordsetId: this.wordset.wordsetId
				}).then(function(data) {
					if (data.jsonStatus == 'success') {
						this.notSynchronizedWords = {};
						this.info("synchronized");
						this.clearWarnBeforeUnload();
						resolve();
					}
					else {
						this.error("Synchronization Failed");
						reject();
					}
				}.bind(this), function() {
					this.error("Synchronization Failed");
					reject();
				}.bind(this));
			}
			else {
				this.info("nothing to synchronize");
				resolve();
			}
		}.bind(this));
	},
	startLearningCycle: function(isRepeatedCycle) {
		if (!isRepeatedCycle) {
			this.repeatCount = 0;
			this.info("没背过的单词共有" + this.rawWordList.length + "个");
			if (!this.reviewWordList || this.reviewWordList.length == 0) {
				this.info("今天没有要复习的内容，下面随机选" + this.listSize + "个没背过的单词");
				this.pickedWordList = this.pickWordListFromRawList();
				this.isReviewMode = false;
			}
			else if (this.reviewWordList.length < this.listSize) {
				this.info("今天有" + this.reviewWordList.length + "个单词要复习");
				this.pickedWordList = this.pickWordListFromReviewList();
				this.isReviewMode = true;
			}
			else {
				this.info("今天有" + this.reviewWordList.length + "个单词要复习，下面从中随机挑" + this.listSize + "个");
				this.pickedWordList = this.pickWordListFromReviewList();
				this.isReviewMode = true;
			}
		}
		this.currentIndex = -1;
		this.startTime = (new Date()).getTime();
		this.lastWordCompleteTime = this.startTime;
		var app = this;
		app.clock = window.setInterval(function() {
			app.updateStatus();
		}, 1000);
		this.registerLearningCycleCommands();
		return this.nextWord();
	},
	registerLearningCycleCommands: function() {
		this.registerApplicationCommand(this.console._clearCommand());
		this.registerApplicationCommand(this._tickCommand("u"));
		this.registerApplicationCommand(this._tickCommand("y"));
		this.registerApplicationCommand(this._tickCommand("n"));
		this.registerApplicationCommand(this._exitCommand());
		this.registerApplicationCommand(this._pauseCommand());
		this.registerApplicationCommand(this._resumeCommand());
		this.registerApplicationCommand(this._allCommand());
		this.registerApplicationCommand(this._statusCommand());
		this.registerApplicationCommand(this._findCommand());
		this.registerApplicationCommand(this._syncCommand());
		this.registerApplicationCommand(this._endCommand());
	},
	defaultZero: function(str) {
		var v = parseInt(str, 10);
		if (isNaN(v)) return 0;
		return v;
	},
	removeWordFromList: function(jpWordId, wordList) {
		for (var i = 0; i < wordList.length; i++) {
			if (wordList[i]["jpWordId"] == jpWordId) {
				wordList.splice(i, 1);
				return;
			}
		}
	},
	_tickCommand: function(tick) {
		if (this._tickCommandCache != undefined && this._tickCommandCache[tick] != undefined) return this._tickCommandCache[tick];
		var hints = {
			"u": "不确定",
			"y": "记得",
			"n": "不记得",
			"x": "不要再出现了"
		};
		var app = this;
		var cmd = new Command(tick, hints[tick]);
		cmd.executeImpl = function(data, resolve) {
			var wordId = app.currentWord.jpWordId;
			if (this.content == 'u') {
				app.statistics.notSureCount++;
				if (!app.currentWord.notSureCount) app.currentWord.notSureCount = 1;
				else app.currentWord.notSureCount++;
			}
			else if (this.content == 'y') {
				app.statistics.passCount++;
				if (!app.currentWord.passCount) app.currentWord.passCount = 1;
				else app.currentWord.passCount++;
			}
			else if (this.content == 'n') {
				app.statistics.failCount++;
				if (!app.currentWord.failCount) app.currentWord.failCount = 1;
				else app.currentWord.failCount++;
			}
			else if (this.content == 'x') {
				app.statistics.passCount++;
				if (!app.currentWord.passCount) app.currentWord.passCount = 1;
				else app.currentWord.passCount++;
				app.currentWord = COOKED;
			}
			app.updateStatus();
			if (!app.notSynchronizedWords[wordId])
				app.notSynchronizedWords[wordId] = app.currentWord;
			if (app.isReviewMode) {
				app.removeWordFromList(wordId, app.reviewWordList);
			}
			else {
				app.removeWordFromList(wordId, app.rawWordList);
			}
			app.lastWordCompleteTime = (new Date()).getTime();
			app.statistics.accumulatedTime += app.timeSpentOnCurrentWord;
			app.currentWord.accumulatedTime += app.timeSpentOnCurrentWord;
			app.timeSpentOnCurrentWord = 0;
			app.updateStatus();
			app.info(this.hint);
			app.nextWord().then(resolve);
		}
		if (this._tickCommandCache == undefined) this._tickCommandCache = {};
		this._tickCommandCache[tick] = cmd;
		return cmd;
	},
	_allCommand: function() {
		if (this._allCommandCache != undefined) return this._allCommandCache;
		var app = this;
		var cmd = new Command("a", "show all parts of current word");
		cmd.executeImpl = function(data, resolve) {
			app.info(app.generateWordsView([app.currentWord], true));
			resolve();
		}
		this._allCommandCache = cmd;
		return cmd;
	},
	_exitCommand: function() {
		if (this._exitCommandCache != undefined) return this._exitCommandCache;
		var app = this;
		var cmd = new Command("exit", "exit the application");
		cmd.executeImpl = function(data, resolve, reject) {
			app.synchronize().then(function() {
				resolve({exitApplication: true});
			}, function() {
				reject();
			});
		};
		this._exitCommandCache = cmd;
		return cmd;
	},
	_pauseCommand: function() {
		if (this._pauseCommandCache != undefined) return this._pauseCommandCache;
		var app = this;
		var cmd = new Command("pause", "pause");
		cmd.executeImpl = function(data, resolve) {
			app.paused = true;
			app.timeSpentOnCurrentWord = (new Date()).getTime() - app.lastWordCompleteTime;
			app.updateStatus();
			app.info("paused");
			resolve();
		} 
		this._pauseCommandCache = cmd;
		return cmd;
	},
	_resumeCommand: function() {
		if (this._resumeCommandCache != undefined) return this._resumeCommandCache;
		var app = this;
		var cmd = new Command("resume", "resume from pause");
		cmd.executeImpl = function(data, resolve) {
			app.paused = false;
			app.lastWordCompleteTime = (new Date()).getTime() - app.timeSpentOnCurrentWord;
			app.updateStatus();
			app.info("resumed");
			resolve();
		};
		this._resumeCommandCache = cmd;
		return cmd;
	},
	_statusCommand: function() {
		if (this._statusCommandCache != undefined) return this._statusCommandCache;
		var app = this;
		var cmd = new Command("status", "toggle status box");
		cmd.executeImpl = function(data, resolve) {
			app.$statusBox.toggle();
			if (app.$statusBox.is(":visible")) {
				app.info("status box on");
			}
			else {
				app.info("status box off");
			}
			resolve();
		}
		this._statusCommandCache = cmd;
		return cmd;
	},
	_findCommand: function() {
		if (this._findCommandCache != undefined) return this._findCommandCache;
		var app = this;
		var cmd = new Command("f", "find by kanji, or find by the nth character of current kanji if you enter a number n");
		cmd.valueRequired = true;
		cmd.executeImpl = function(data, resolve, reject) {
			var keyWord = data[0]["value"][0];
			var index = parseInt(keyWord);
			if (!isNaN(index)) {
				var kanji = app.currentWord.kanji;
				if (!kanji) {
					reject("current word does not have kanji");
					return;
				}
				keyWord = kanji.charAt(index);
			}
			var result = app.searchByKanji(keyWord);
			app.info(app.generateWordsView(result, true));
			resolve();
		}
		this._findCommandCache = cmd;
		return cmd;
	},
	_syncCommand: function() {
		if (this._syncCommandCache != undefined) return this._syncCommandCache;
		var app = this;
		var cmd = new Command("sync", "synchronize user data with server");
		cmd.executeImpl = function(data, resolve, reject) {
			var thisCmd = this;
			app.synchronize().then(resolve, reject);
		};
		this._syncCommandCache = cmd;
		return cmd;
	},
	_endCommand: function() {
		if (this._endCommandCache != undefined) return this._endCommandCache;
		var app = this;
		var cmd = new Command("end", "end this learning cycle");
		cmd.executeImpl = function(data, resolve, reject) {
			app.finishLearningCycle(true).then(resolve, reject);
		}
		this._endCommandCache = cmd;
		return cmd;
	}
});
JPLearner.prototype.constructor = JPLearner;