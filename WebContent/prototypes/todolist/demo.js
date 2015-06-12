// {
// 	1: {
// 		executor_name: "赵",
// 		progress: 0.3
// 	},....
// }
function updateUserProgresses() {
	recalProgresses();
	renderUserProgresses();
}
function renderUserProgresses() {
	var progressBars = document.getElementById("progressBars");
	var existingBars = progressBars.querySelectorAll(".userProgress");
	var template = document.getElementById("userProgressTemplate");
	var i = 0;
	for (var executorId in executorData) {
		var progress = executorData[executorId];
		var progressNode;
		if (i < existingBars.length) {
			progressNode = existingBars[i];
		}
		else {
			progressNode = document.importNode(template.content, true).firstElementChild;
			progressBars.appendChild(progressNode);
		}
		progressNode.querySelector(".executorName").textContent = progress.executor_name;
		var bar = progressNode.querySelector(".progressBar");
		var percent = Math.round(progress.progress * 100);
		var percentStr = percent + "%";
		if (percent > 0) {
			bar.textContent = percentStr;
		}
		else {
			bar.textContent = "";
		}
		bar.style.width = percentStr;
		i++;
	}
	for (; i < existingBars.length; i++) {
		progressBars.removeChild(existingBars[i]);
	}
}
function recalProgresses() {
	//executor_id -> task_count
	var executorTaskCounts = {};
	for (var taskId in relationData) {
		var executorIds = relationData[taskId];
		executorIds.forEach(function(executorId) {
			if (executorTaskCounts[executorId] === undefined) executorTaskCounts[executorId] = 1;
			else executorTaskCounts[executorId] += 1;
		});
	}
	//executor_id -> task_complete_count
	var executorCompletedTaskCounts = {};
	for (var taskId in taskCompleteData) {
		for (var executorId in taskCompleteData[taskId]) {
			if (taskCompleteData[taskId][executorId] !== 1) continue;
			if (executorCompletedTaskCounts[executorId] === undefined) executorCompletedTaskCounts[executorId] = 1;
			else executorCompletedTaskCounts[executorId] += 1;
		}
	}
	for (var executorId in executorData) {
		var taskCount = executorTaskCounts[executorId];
		var completedTaskCount = executorCompletedTaskCounts[executorId];
		var progress = 0;
		if (taskCount !== undefined && completedTaskCount !== undefined) {
			progress = Math.round(completedTaskCount / taskCount * 100) / 100;
		}
		executorData[executorId].progress = progress;
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
		taskEle = document.importNode(taskTemplate.content, true).firstElementChild;
	}
	else {
		isUpdateMode = true;
	}
	if (executorIds !== undefined) {
		var currentExecutorElements = taskEle.querySelectorAll(".executor");
		var executorTemplate = document.getElementById("executorTemplate");
		var executorsEle = taskEle.querySelector(".executors");
		$(executorsEle).addClass("left");
		var lastEle = executorsEle.querySelector(".arrow");
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
				executorEle = document.importNode(executorTemplate.content, true).firstElementChild;
				executorEle = executorsEle.insertBefore(executorEle, lastEle);
			}
			var checkbox = executorEle.querySelector("[type=checkbox]");
			checkbox.classList.add("completeTaskCheckbox");
			if (taskCompleteData[taskId] && taskCompleteData[taskId][executorId] === 1) {
				checkbox.checked = true;
			}
			else {
				checkbox.checked = false;
			}
			checkbox.dataset.executorId = executorId;
			var id = "task" + taskId + "_executor" + executorId;
			checkbox.id = id;
			var label = executorEle.querySelector(".executorName");
			label.textContent = executor.executor_name;
			label.setAttribute("for", id);
			executorEle = undefined;
		}
		for (; j < currentExecutorElements.length; j++) {
			executorsEle.removeChild(currentExecutorElements[j]);
		}
	}
	var completedExecutorCount = taskCompleteData[taskId] !== undefined ? Object.keys(taskCompleteData[taskId]).length : 0;
	var executorCount = relationData[taskId].length;
	taskEle.querySelector(".taskTitle").textContent = task.task_title;
	taskEle.querySelector(".timeHolder").textContent = task.daily_start_time;
	taskEle.dataset.taskId = taskId;
	// var endColor = 0x02CD02;
	// var startColor = rgbToHex(window.getComputedStyle(taskContainer).color);
	// taskEle.style.color = hexToColor(parseInt(startColor + (completedExecutorCount / executorCount * (endColor - startColor))));
	taskEle.style.opacity = executorCount === 0 ? 0.5 : 0.5 - (completedExecutorCount / executorCount * 0.5) + 0.5;
	if (completedExecutorCount === executorCount) taskEle.classList.add("completed"); 
	else taskEle.classList.remove("completed");
	if (!isUpdateMode) taskContainer.appendChild(taskEle);
	if (executorIds !== undefined) renderExecutorList(executorsEle);
}
function rgbToHex(rgb) {
	var matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	return (parseInt(matches[1]) << 16) + (parseInt(matches[2]) << 8) + parseInt(matches[3]);
}
function hexToColor(hex) {
	return 'rgb(' + (hex >> 16) + ', ' + ((hex >> 8) & 0xff) + ', ' + (hex & 0xff) + ')';
}
function renderExecutorList(executorContainer, relativeHeightEle) {
	var $executorContainer = $(executorContainer);
	var executors = executorContainer.querySelectorAll(".executor");
	if (!executors || executors.length < 2) {
		$(executorContainer).addClass("noBracket");
	}
	else {
		$(executorContainer).removeClass("noBracket");
	}
	if (relativeHeightEle === undefined) relativeHeightEle = executorContainer.parentNode;
	var parentHeight = relativeHeightEle.clientHeight;
	$executorContainer.addClass("temporaryShow");
	var height = executorContainer.clientHeight;
	executorContainer.style.top = (parentHeight - height) / 2 + "px";
	if (executorContainer.classList.contains("left")) {
		executorContainer.style.left = (-(parseInt(window.getComputedStyle(executorContainer).width) + 10)) + "px";
	}
	else {
		executorContainer.style.right = (-(parseInt(window.getComputedStyle(executorContainer).width) - 17)) + "px";
	}
	$executorContainer.removeClass("temporaryShow");
}
function renderUpdateTaskExecutors(taskId, container) {
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
			executorEle = document.importNode(template.content, true).firstElementChild;
			executorsEle.insertBefore(executorEle, lastEle);
		}
		else {
			executorEle = currentExecutorElements[i];
		}
		var checkbox = executorEle.querySelector('input[type=checkbox]');
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
	renderExecutorList(executorsEle, container.querySelector(".taskTitleInput"));
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
	$container.find("[type=checkbox]").removeAttr("checked");
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
		for (var executorId in taskCompleteData[updatedTask.task_id]) {
			if (executorIds.indexOf(parseInt(executorId)) < 0) delete taskCompleteData[updatedTask.task_id][executorId];
		}
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
	renderUpdateTaskExecutors(task.task_id, container);
}
function deleteTask(taskId) {
	taskData.splice(getTaskIndexById(taskId), 1);
	delete relationData[taskId];
	delete taskCompleteData[taskId];
	$("li.task[data-task-id=" + taskId + "]").remove();
	updateUserProgresses();
}

function repaintWholePage() {
	updateUserProgresses();
	updateTasks();
	renderUpdateTaskExecutors();
}
$(document).ready(function() {
	repaintWholePage();
	$(document).on("keydown", ".updateTaskContainer .enterSave", function(event) {
		if (event.keyCode === 13) {
			$(this).parents(".updateTaskContainer").eq(0).find(".saveTask").click();
		}
	});
	$(document).on("click", ".delete", function() {
		var $task = $(this).parents(".task").eq(0);
		var title = $task.find(".taskTitle").text();
		if (!confirm("你确定要删除【" + title + "】吗？")) return;
		deleteTask($(this).parents(".task").eq(0).data("taskId"));
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
		$container.find("[type=checkbox]:checked").each(function() {
			executorIds.push(parseInt(this.dataset.executorId));
		});
		if (!checkTaskParameter(newTask, executorIds)) return;
		if (newTask.task_id) {
			updateTask(newTask, executorIds).then(function() {
				$("li.task[data-task-id=" + newTask.task_id + "]").show();
				$container.remove();
				renderTask(newTask, executorIds);
				updateUserProgresses();
			});
		}
		else {
			addTask(newTask, executorIds).then(function() {
				renderTask(newTask, executorIds);
				clearUpdateTaskContainer($container);
				$container.find(".taskTitleInput").focus();
				updateUserProgresses();
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
	$(document).on("change", ".completeTaskCheckbox", function() {
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
		renderTask(getTaskById(taskId));
		updateUserProgresses();
	});
	$("#editExecutors").click(function() {
		openExecutorEditDialog();
	});
	$("#executorEditDialog").on("click", "#addNewExecutor", function() {
		var parent = document.getElementById("executorFieldSets");
		var template = document.getElementById("executorEditorTemplate");
		var node = document.importNode(template.content, true).firstElementChild;
		parent.appendChild(node);
	});
	$("#executorEditDialog").on("click", ".close", function() {
		$(".dialogContainer").hide();
	});
	$("#executorEditDialog").on("click", ".deleteExecutor", function() {

		$(this).parents(".executorFieldSet").eq(0).remove();
	});
	$("#executorEditDialog").on("click", "#saveExecutors", function() {
		if (!confirm("你确定要保存修改吗，完成记录可能会被删除")) return;
		var nodes = document.querySelectorAll("#executorFieldSets .executorFieldSet");
		var newExecutors = [];
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			var executorId = node.dataset.executorId;
			var executorName = node.querySelector(".nameInput").value;
			if (executorId === undefined) {
				newExecutors.push({executor_name: executorName});
			}
			else {
				newExecutors.push({
					executor_id: executorId,
					executor_name: executorName
				});
			}
		}
		syncExecutors(newExecutors).then(function(updatedExecutors) {
			executorData = updatedExecutors;
			for (var taskId in relationData) {
				var executorIds = relationData[taskId];
				for (var i = 0; i < executorIds.length; i++) {
					var executorId = executorIds[i];
					if (executorData[executorId] === undefined) {
						executorIds.splice(i, 1); i--;
					}
				}
			}
			for (var taskId in taskCompleteData) {
				for (var executorId in taskCompleteData[taskId]) {
					if (executorData[executorId] === undefined) {
						delete taskCompleteData[taskId][executorId]
					}
				}
			}
			repaintWholePage();
			$(".dialogContainer").hide();
		});
	});

});
function openExecutorEditDialog() {
	var anchorOffset = $("#editExecutors").offset();
	var $dialog = $("#executorEditDialog");
	anchorOffset.left -= 5 + $dialog.width();
	$dialog.css("left", anchorOffset.left);
	$dialog.css("top", anchorOffset.top);
	var template = document.getElementById("executorEditorTemplate");
	var existingNodes = document.querySelectorAll(".executorFieldSet");
	var i = 0;
	var parent = document.getElementById("executorFieldSets");
	for (var executorId in executorData) {
		var node;
		if (i < existingNodes.length) {
			node = existingNodes[i];
		}
		else {
			node = document.importNode(template.content, true).firstElementChild;
			parent.appendChild(node);
		}
		node.querySelector(".nameInput").value = executorData[executorId].executor_name;
		node.dataset.executorId = executorId;
		i++;
	}
	for (; i < existingNodes.length; i++) {
		parent.removeChild(existingNodes[i]);
	}
	$(".dialogContainer").show();
}