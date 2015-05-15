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
@Table(name="task_execution_record")
public class TaskExecutionRecord {
	@Id @GeneratedValue
	@Column(name="task_execution_record_id")
	private int taskExecutionRecordId;
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="task")
	private Task task;
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="task_executor")
	private TaskExecutor taskExecutor;
	@Column(name="complete_time")
	private java.util.Date completeTime;
	@Column(name="execute_date")
	private java.sql.Date executeDate;
	@Column(name="complete_status")
	private int completeStatus;
	public int getTaskExecutionRecordId() {
		return taskExecutionRecordId;
	}
	public void setTaskExecutionRecordId(int taskExecutionRecordId) {
		this.taskExecutionRecordId = taskExecutionRecordId;
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
	public java.util.Date getCompleteTime() {
		return completeTime;
	}
	public void setCompleteTime(java.util.Date completeTime) {
		this.completeTime = completeTime;
	}
	public java.sql.Date getExecuteDate() {
		return executeDate;
	}
	public void setExecuteDate(java.sql.Date executeDate) {
		this.executeDate = executeDate;
	}
	public int getCompleteStatus() {
		return completeStatus;
	}
	public void setCompleteStatus(int completeStatus) {
		this.completeStatus = completeStatus;
	}
}
