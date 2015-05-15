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
@Table(name="task_executor")
public class TaskExecutor {
	@Id @GeneratedValue
	@Column(name="task_executor_id")
	private int taskExecutorId;
	@Column(name="executor_name")
	private String executorName;
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="creator")
	private User creator;
	public int getTaskExecutorId() {
		return taskExecutorId;
	}
	public void setTaskExecutorId(int taskExecutorId) {
		this.taskExecutorId = taskExecutorId;
	}
	public String getExecutorName() {
		return executorName;
	}
	public void setExecutorName(String executorName) {
		this.executorName = executorName;
	}
	public User getCreator() {
		return creator;
	}
	public void setCreator(User creator) {
		this.creator = creator;
	}
}
