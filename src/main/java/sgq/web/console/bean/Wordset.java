package sgq.web.console.bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="wordset")
public class Wordset {
	@Id @GeneratedValue
	@Column(name="wordset_id")
	private int wordsetId;
	@Column(name="name")
	private String name;
	@Column(name="description")
	private String description;
	public int getWordsetId() {
		return wordsetId;
	}
	public void setWordsetId(int wordsetId) {
		this.wordsetId = wordsetId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
}
