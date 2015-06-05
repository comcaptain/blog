var fakeServerData = {
	taskId: 100,
	exeuctorId: 100
};
function syncNewTask(task, executorIds) {
	return new Promise(function(resolve, reject) {
		resolve(fakeServerData.taskId++);
	});
}
function syncUpdatedTask() {
	return new Promise(function(resolve, reject) {
		resolve();
	});
}
function syncExecutors(newExecutors) {
	return new Promise(function(resolve, reject) {
		var updatedExecutors = {};
		for (var i = 0; i < newExecutors.length; i++) {
			if (newExecutors[i].executor_id === undefined) newExecutors[i].executor_id = fakeServerData.exeuctorId++;
			updatedExecutors[newExecutors[i].executor_id] = {executor_name: newExecutors[i].executor_name};
		}
		resolve(updatedExecutors);
	});
}