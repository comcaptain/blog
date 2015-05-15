var fakeServerData = {
	taskId: 100
};
function syncNewTask(task, executorIds) {
	return new Promise(function(resolve, reject) {
		resolve(fakeServerData.taskId++);
	});
}