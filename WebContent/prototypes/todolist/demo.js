// {
// 	1: {
// 		executor_name: "赵",
// 		progress: 0.3
// 	},....
// }
function updateUserProgresses() {
	var progressBars = document.getElementById("progressBars");
	progressBars.innerHTML = "";
	var template = document.getElementById("userProgressTemplate");
	for (var executorId in executorData) {
		var progress = executorData[executorId];
		var progressNode = template.cloneNode(true);
		progressNode.removeAttribute("id");
		progressNode.getElementsByClassName("executorName")[0].textContent = progress.executor_name;
		var bar = progressNode.getElementsByClassName("progressBar")[0];
		var percentStr = (progress.progress * 100) + "%";
		bar.textContent = percentStr;
		bar.style.width = percentStr;
		progressBars.appendChild(progressNode);
	}
}
// task data:
// [
// 	{
// 		task_id: 1,
// 		task_title: "买一个新的ipad",
// 		daily_start_time: "19:32"
// 	}
// ]
// relation data, <task_id>: <executor_id_list>
// {
// 	1: [1, 2],
// 	2: [1, 2],
// 	3: [1, 2],
// 	4: [1, 2],
// 	5: [1, 2],
// 	6: [1, 2],
// }
// task 1 is completed by executor 1 and 2, task 6 is completed by executor 2
// var taskCompleteData = {
// 	1: {1: 1, 2: 1},
// 	6: {2: 1},
// }; 
function updateTasks() {
	document.getElementById("taskList").innerHTML = "";
	for (var i = 0; i < taskData.length; i++) {
		var task = taskData[i];
		var taskId = task.task_id
		renderTask(task, relationData[taskId]);
	}
}
function renderTask(task, executorIds) {
	var taskContainer = document.getElementById("taskList");
	var taskTemplate = document.getElementById('taskTemplate');
	var taskId = task.task_id;
	var taskEle = taskTemplate.cloneNode(true);
	taskEle.removeAttribute("id");
	var templateExecutor = taskEle.getElementsByClassName("executor")[0];
	templateExecutor.removeAttribute("id");
	var executorEle = templateExecutor;
	var parent = executorEle.parentNode;
	$(parent).addClass("left");
	var lastEle = parent.getElementsByClassName("arrow")[0];
	//update executors
	for (var j = 0; j < executorIds.length; j++) {
		var executorId = executorIds[j];
		var executor = executorData[executorId];
		if (executorEle == undefined) {
			executorEle = templateExecutor.cloneNode(true);
			parent.insertBefore(executorEle, lastEle);
		}
		var checkbox = executorEle.getElementsByClassName("completeTaskCheckbox")[0];
		checkbox.checked = (taskCompleteData[taskId] && taskCompleteData[taskId][executorId] === 1 ? true : false);
		checkbox.dataset.executorId = executorId;
		var id = "task" + taskId + "_executor" + executorId;
		checkbox.id = id;
		var label = executorEle.getElementsByClassName("executorName")[0];
		label.textContent = executor.executor_name;
		label.setAttribute("for", id);
		executorEle = undefined;
	}
	taskEle.getElementsByClassName("taskTitle")[0].textContent = task.task_title;
	taskEle.getElementsByClassName("timeHolder")[0].textContent = task.daily_start_time;
	taskEle.dataset.taskId = taskId;
	taskContainer.appendChild(taskEle);
	adjustExecutorList(parent);
}
function adjustExecutorList(executorContainer, relativeHeightEle) {
	var $executorContainer = $(executorContainer);
	var executors = executorContainer.querySelectorAll(".executor");
	if (!executors || executors.length < 2) {
		$(executorContainer).addClass("noBracket");
	}
	if (relativeHeightEle === undefined) relativeHeightEle = executorContainer.parentNode;
	var parentHeight = relativeHeightEle.clientHeight;
	$executorContainer.addClass("temporaryShow");
	var height = executorContainer.clientHeight;
	$executorContainer.removeClass("temporaryShow");
	executorContainer.style.top = (parentHeight - height) / 2 + "px";
}
function refreshUpdateTaskExecutors(taskId) {
	var container = document.querySelector("#addTaskContainer .executors");
	var template = document.getElementById("executorTemplate");
	var currentExecutorElements = container.querySelectorAll(".executor");
	var lastEle = container.querySelector(".arrow");
	var i = 0;
	for (var executorId in executorData) {
		var executorName = executorData[executorId].executor_name;
		var executorEle = undefined;
		if (currentExecutorElements.length < i + 1) {
			executorEle = template.cloneNode(true);
			executorEle.removeAttribute("id");
			container.insertBefore(executorEle, lastEle);
		}
		else {
			executorEle = currentExecutorElements[i];
		}
		var checkbox = executorEle.querySelector('.completeTaskCheckbox');
		var label = executorEle.querySelector('.executorName');
		var id = "update_task_" + (taskId === undefined ? "x" : taskId) + "_executor" + executorId;
		label.setAttribute("for", id);
		checkbox.setAttribute("id", id);
		checkbox.dataset.executorId = executorId;
		label.textContent = executorData[executorId].executor_name;
		checkbox.checked = false;
		i++;
	}
	i--;
	for (; i < currentExecutorElements.length; i++) {
		container.removeChild(currentExecutorElements[i]);
	}
	$("#addTaskContainer").addClass("temporaryShow");
	adjustExecutorList(container, document.querySelector("#addTaskContainer .taskTitleInput"));
	$("#addTaskContainer").removeClass("temporaryShow");
}
function checkTaskParameter(task, executorIds) {
	if (task.task_title === undefined || task.task_title === "" || executorIds.length === 0) return false;
	if (task.daily_start_time !== undefined && task.daily_start_time !== "") {
		var match = task.daily_start_time.match(/^(\d\d):(\d\d)$/);
		if (!match) return false;
		var hour = parseInt(match[1]);
		var min = parseInt(match[2]);
		if (hour < 0 || hour > 23 || min < 0 || min > 59) return false;
	}
	return true;
}
function clearUpdateTaskContainer($container) {
	$container.find(".taskTitleInput").val("");
	$container.find(".dailyStartTime").val("");
	$container.find(".completeTaskCheckbox").removeAttr("checked");
}
function addTask(newTask, executorIds) {
	return syncNewTask(newTask, executorIds).then(function(taskId) {
		newTask.task_id = taskId;
		taskData.push(newTask);
		relationData[taskId] = executorIds;
		renderTask(newTask, executorIds);
	});
}
document.addEventListener("DOMContentLoaded", function() {
	updateUserProgresses();
	updateTasks();
	refreshUpdateTaskExecutors();
	$(document).on("keydown", ".updateTaskContainer .enterSave", function(event) {
		if (event.keyCode === 13) {
			$(this).parents(".updateTaskContainer").eq(0).find(".saveTask").click();
		}
	});
	$(document).on("click", ".editTask", function() {
		var $li = $(this).parents("li.task").eq(0);
		$li.hide();
		var updateContainer = document.getElementById("addTaskContainer").cloneNode(true);
		updateContainer.removeAttribute("id");
		$li.insertBefore(document.getElementById(""));
	});
	$(document).on("click", ".saveTask", function() {
		var $container = $(this).parents(".updateTaskContainer").eq(0);
		var newTask = {
			task_id: $container.data("taskId"),
			task_title: $container.find(".taskTitleInput").val(),
			daily_start_time: $container.find(".dailyStartTime").val()
		};
		var executorIds = [];
		$container.find(".completeTaskCheckbox:checked").each(function() {
			executorIds.push(this.getAttribute("executorId"));
		});
		if (!checkTaskParameter(newTask, executorIds)) return;
		addTask(newTask, executorIds).then(function() {
			clearUpdateTaskContainer($container);
			$container.find(".taskTitleInput").focus();
		});
	});
	$(".dailyStartTime").on("keydown", function(event) {
		var value = this.value;
		var keyCode = event.keyCode;
		//0-9 and num area 0-9
		if ((keyCode <= 57 && keyCode >= 48) || (keyCode <= 105 && keyCode >= 96)) {
			if (value && value.match(/^\d$/)) {
				event.preventDefault();
				var currentNumber = 0;
				if (keyCode <=57 ) currentNumber = keyCode - 48;
				else currentNumber = keyCode - 96;
				this.value = value + currentNumber + ":";
			}
		}
	});
	$("#uncollapseNewTask").click(function() {
		$(this).hide();
		$("#addTaskContainer").show();
		$("#addTaskContainer").find(":input").eq(0).focus();
	});
	$("#collapseNewTask").click(function() {
		var $container = $("#addTaskContainer");
		clearUpdateTaskContainer($container);
		$container.hide();
		$("#uncollapseNewTask").show();
	});
	$(document).on("change", "#taskList .completeTaskCheckbox", function() {
		var executorId = this.dataset.executorId;
		var taskId = $(this).parents("li.task").data("taskId");
		if (this.checked) {
			var executors = taskCompleteData[taskId];
			if (!executors) {
				executors = {};
			}
			executors[executorId] = 1;
			taskCompleteData[taskId] = executors;
		}
		else {
			var executors = taskCompleteData[taskId];
			if (!executors) {
				return;
			}
			delete executors[executorId];
		}
	});
});