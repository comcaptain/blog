package sgq.web.console.model;

import java.util.Date;

import sgq.web.console.enums.WordMemoryLevelEnum;

public class WordModel {
	private int jpWordId;
	private String hiragana;
	private String kanji;
	private String chinese;
	private WordMemoryLevelEnum level;
	private Date nextReviewDate;
	private int passCount;
	private int failCount;
	private int notSureCount;
	private int accumulatedTime;
	private int recordId;
	public WordModel() {}
	public WordModel(int jpWordId, String hiragana, String kanji,
			String chinese, int recordId, WordMemoryLevelEnum level, Date nextReviewDate, int passCount,
			int failCount, int notSureCount, int accumulatedTime) {
		this.jpWordId = jpWordId;
		this.hiragana = hiragana;
		this.kanji = kanji;
		this.chinese = chinese;
		this.recordId = recordId;
		this.level = level;
		this.nextReviewDate = nextReviewDate;
		this.passCount = passCount;
		this.failCount = failCount;
		this.notSureCount = notSureCount;
		this.accumulatedTime = accumulatedTime;
	}
	public int getJpWordId() {
		return jpWordId;
	}
	public void setJpWordId(int jpWordId) {
		this.jpWordId = jpWordId;
	}
	public String getHiragana() {
		return hiragana;
	}
	public void setHiragana(String hiragana) {
		this.hiragana = hiragana;
	}
	public String getKanji() {
		return kanji;
	}
	public void setKanji(String kanji) {
		this.kanji = kanji;
	}
	public String getChinese() {
		return chinese;
	}
	public void setChinese(String chinese) {
		this.chinese = chinese;
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
	public int getAccumulatedTime() {
		return accumulatedTime;
	}
	public void setAccumulatedTime(int accumulatedTime) {
		this.accumulatedTime = accumulatedTime;
	}
	public int getRecordId() {
		return recordId;
	}
	public void setRecordId(int recordId) {
		this.recordId = recordId;
	}
	public WordMemoryLevelEnum getLevel() {
		return level;
	}
	public void setLevel(WordMemoryLevelEnum level) {
		this.level = level;
	}
}
