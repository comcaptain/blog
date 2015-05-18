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
	var taskEle = undefined;
	if (taskId) {
		taskEle = $("li.task[data-task-id=" + taskId + "]")[0];
	}
	var isUpdateMode = false;
	if (!taskEle) {
		taskEle = taskTemplate.cloneNode(true);
	}
	else {
		isUpdateMode = true;
	}
	taskEle.removeAttribute("id");
	var currentExecutorElements = taskEle.querySelectorAll(".executor");
	var templateExecutor = currentExecutorElements[0];
	templateExecutor.removeAttribute("id");
	var executorsEle = templateExecutor.parentNode;
	$(executorsEle).addClass("left");
	var lastEle = executorsEle.getElementsByClassName("arrow")[0];
	var j = 0;
	//update executors
	for (; j < executorIds.length; j++) {
		var executorId = executorIds[j];
		var executor = executorData[executorId];
		var executorEle;
		if (j < currentExecutorElements.length) {
			executorEle = currentExecutorElements[j];
		}
		else {
			executorEle = templateExecutor.cloneNode(true);
			executorsEle.insertBefore(executorEle, lastEle);
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
	for (; j < currentExecutorElements.length; j++) {
		executorsEle.removeChild(currentExecutorElements[j]);
	}
	taskEle.getElementsByClassName("taskTitle")[0].textContent = task.task_title;
	taskEle.getElementsByClassName("timeHolder")[0].textContent = task.daily_start_time;
	taskEle.dataset.taskId = taskId;
	if (!isUpdateMode) taskContainer.appendChild(taskEle);
	adjustExecutorList(executorsEle);
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
function refreshUpdateTaskExecutors(taskId, container) {
	if(container === undefined) container = document.querySelector("#addTaskContainer");
	var executorsEle = container.querySelector(".executors");
	var template = document.getElementById("executorTemplate");
	var currentExecutorElements = executorsEle.querySelectorAll(".executor");
	var lastEle = executorsEle.querySelector(".arrow");
	var i = 0;
	for (var executorId in executorData) {
		var executorName = executorData[executorId].executor_name;
		var executorEle = undefined;
		if (currentExecutorElements.length < i + 1) {
			executorEle = template.cloneNode(true);
			executorEle.removeAttribute("id");
			executorsEle.insertBefore(executorEle, lastEle);
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
		checkbox.checked = (taskId === undefined ? false : relationData[taskId] && relationData[taskId].indexOf(parseInt(executorId)) > -1);
		i++;
	}
	for (; i < currentExecutorElements.length; i++) {
		executorsEle.removeChild(currentExecutorElements[i]);
	}
	$(container).addClass("temporaryShow");
	adjustExecutorList(executorsEle, container.querySelector(".taskTitleInput"));
	$(container).removeClass("temporaryShow");
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
	});
}
function updateTask(updatedTask, executorIds) {
	return syncUpdatedTask(updatedTask, executorIds).then(function() {
		var taskIndex = getTaskIndexById(updatedTask.task_id);
		taskData[taskIndex] = updatedTask;
		relationData[updatedTask.task_id] = executorIds;
	});
}
function getTaskById(taskId) {
	return taskData[getTaskIndexById(taskId)];
}
function getTaskIndexById(taskId) {
	for (var i = 0; i < taskData.length; i++) {
		if (taskData[i].task_id == taskId) return i;
	}
}
function fillUpdateContainer(container, task) {
	container.querySelector(".taskTitleInput").value = task.task_title;
	container.querySelector(".dailyStartTime").value = task.daily_start_time;
	refreshUpdateTaskExecutors(task.task_id, container);
}
$(document).ready(function() {
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
		var taskId = $li.data("taskId");
		var updateContainer = document.getElementById("addTaskContainer").cloneNode(true);
		updateContainer.removeAttribute("id");
		updateContainer.querySelector(".saveTask").textContent = "更新任务";
		$(updateContainer).insertAfter($li).addClass("updateMode").data("taskId", taskId).show();
		fillUpdateContainer(updateContainer, getTaskById(taskId));
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
			executorIds.push(parseInt(this.dataset.executorId));
		});
		if (!checkTaskParameter(newTask, executorIds)) return;
		if (newTask.task_id) {
			updateTask(newTask, executorIds).then(function() {
				$("li.task[data-task-id=" + newTask.task_id + "]").show();
				$container.remove();
				renderTask(newTask, executorIds);
			});
		}
		else {
			addTask(newTask, executorIds).then(function() {
				renderTask(newTask, executorIds);
				clearUpdateTaskContainer($container);
				$container.find(".taskTitleInput").focus();
			});
		}
	});
	$(document).on("click", ".cancel", function() {
		var $container = $(this).parents(".updateTaskContainer").eq(0);
		var taskId = $container.data("taskId");
		if (taskId) {
			$("li.task[data-task-id=" + taskId + "]").show();
			$container.remove();
		}
		else {
			clearUpdateTaskContainer($container);
			$container.hide();
			$("#uncollapseNewTask").show();
		}
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
