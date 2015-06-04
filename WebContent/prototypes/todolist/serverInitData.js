var executorData = {
	1: {
		executor_name: "赵"
	},
	2: {
		executor_name: "钱"
	},
	3: {
		executor_name: "孙"
	}
};
var taskData = [
{
	task_id: 1,
	task_title: "买一个新的ipad",
	daily_start_time: "19:32"
},
{
	task_id: 2,
	task_title: "添加特性列表",
	daily_start_time: "12:32"
},
{
	task_id: 3,
	task_title: "缩短todo list",
	daily_start_time: "13:32"
},
{
	task_id: 4,
	task_title: "做一些有意思的事情",
	daily_start_time: "19:32"
},
{
	task_id: 5,
	task_title: "做一些测试",
	daily_start_time: "15:32"
},
{
	task_id: 6,
	task_title: "添加新的task",
	daily_start_time: "16:32"
}
];
var relationData = {
	1: [1, 2, 3],
	2: [2],
	3: [1, 2],
	4: [1, 2],
	5: [2,	 3],
	6: [1, 2, 3],
};
var taskCompleteData = {
	1: {1: 1, 2: 1},
	6: {2: 1},
};