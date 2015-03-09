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
@Table(name="jp_word")
public class JpWord {
	@Id @GeneratedValue
	@Column(name="jpword_id")
	private int jpwordId;
	@Column(name="hiragana")
	private String hiragana;
	@Column(name="kanji")
	private String kanji;
	@Column(name="chinese")
	private String chinese;
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="wordset_id")
	private Wordset wordset;
	public int getJpwordId() {
		return jpwordId;
	}
	public void setJpwordId(int jpwordId) {
		this.jpwordId = jpwordId;
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
	public Wordset getWordset() {
		return wordset;
	}
	public void setWordset(Wordset wordset) {
		this.wordset = wordset;
	}
}
