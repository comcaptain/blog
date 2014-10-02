package sgq.web.pygmalion.bean;

import java.util.List;

public class ArticleMonthlyGroup {
	private String label;
	private List<ArticleDailyGroup> dailyGroups;
	public ArticleMonthlyGroup() {
		
	}
	public ArticleMonthlyGroup(List<ArticleDailyGroup> dailyGroups, int year, int month) {
		this.dailyGroups = dailyGroups;
		this.label = year + "." + (month < 10 ? "0" + month : month);
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public List<ArticleDailyGroup> getDailyGroups() {
		return dailyGroups;
	}
	public void setDailyGroups(List<ArticleDailyGroup> dailyGroups) {
		this.dailyGroups = dailyGroups;
	}
}
