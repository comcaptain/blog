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
@Table(name="word_memory_record")
public class WordMemoryRecord {
	@Id
	@GeneratedValue
	@Column(name="record_id")
	private int recordId;
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="user_id")
	private User user;
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="jpword_id")
	private JpWord word;
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="wordset_id")
	private Wordset wordset;
	@Column(name="level")
	private int level;
	@Column(name="next_review_date")
	private Date nextReviewDate;
	@Column(name="pass_count")
	private int passCount;
	@Column(name="fail_count")
	private int failCount;
	@Column(name="not_sure_count")
	private int notSureCount;
	public int getRecordId() {
		return recordId;
	}
	public void setRecordId(int recordId) {
		this.recordId = recordId;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public JpWord getWord() {
		return word;
	}
	public void setWord(JpWord word) {
		this.word = word;
	}
	public Wordset getWordSet() {
		return wordset;
	}
	public void setWordSet(Wordset wordset) {
		this.wordset = wordset;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public Date getNextReviewDate() {
		return nextReviewDate;
	}
	public void setNextReviewDate(Date nextReviewDate) {
		this.nextReviewDate = nextReviewDate;
	}
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
}
