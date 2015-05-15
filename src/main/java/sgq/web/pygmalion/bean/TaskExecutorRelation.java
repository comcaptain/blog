package sgq.web.pygmalion.bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="task_executor_relation")
public class TaskExecutorRelation {
	@Id @GeneratedValue
	@Column(name="task_executor_relation_id")
	private int taskExecutorRelationId;
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="task")
	private Task task;
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="taskExecutor")
	private TaskExecutor taskExecutor;
	public int getTaskExecutorRelationId() {
		return taskExecutorRelationId;
	}
	public void setTaskExecutorRelationId(int taskExecutorRelationId) {
		this.taskExecutorRelationId = taskExecutorRelationId;
	}
	public Task getTask() {
		return task;
	}
	public void setTask(Task task) {
		this.task = task;
	}
	public TaskExecutor getTaskExecutor() {
		return taskExecutor;
	}
	public void setTaskExecutor(TaskExecutor taskExecutor) {
		this.taskExecutor = taskExecutor;
	}
}
