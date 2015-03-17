package sgq.web.console.bean;

import java.util.Date;

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
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="user_id")
	private User user;
	@Column(name="count")
	private int count;
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
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
}
