package sgq.web.console.bean;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import sgq.web.pygmalion.bean.User;

@Entity
@Table(name= "word_memory_daily_statistics")
public class WordMemoryDailyStatistics {
	@Id
	@GeneratedValue
	@Column(name="wm_statistics_id")
	private int wmStatisticsId;
	@Column(name="date")
	private Date date;
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="user_id")
	private User user;
	@Column(name="pass_count")
	private int passCount;
	@Column(name="fail_count")
	private int failCount;
	@Column(name="not_sure_count")
	private int notSureCount;
	@Column(name="accumulated_time")
	private int accumulatedTime;
	public int getPassCount() {
		return passCount;
	}
	public void setPassCount(int passCount) {
		this.passCount = passCount;
	}
	public int getFailCount() {
		return failCount;
	}
	public void setFailCount(int failCount) {
		this.failCount = failCount;
	}
	public int getNotSureCount() {
		return notSureCount;
	}
	public void setNotSureCount(int notSureCount) {
		this.notSureCount = notSureCount;
	}
	public int getAccumulatedTime() {
		return accumulatedTime;
	}
	public void setAccumulatedTime(int accumulatedTime) {
		this.accumulatedTime = accumulatedTime;
	}
	public int getWmStatisticsId() {
		return wmStatisticsId;
	}
	public void setWmStatisticsId(int wmStatisticsId) {
		this.wmStatisticsId = wmStatisticsId;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
}
