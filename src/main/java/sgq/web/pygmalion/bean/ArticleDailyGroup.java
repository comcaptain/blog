package sgq.web.pygmalion.bean;

import java.util.List;

public class ArticleDailyGroup {
	private String label;
	private List<Article> thumbnails;
	public ArticleDailyGroup() {
		
	}
	public ArticleDailyGroup(List<Article> thumbnails, int dayOfMonth) {
		this.thumbnails = thumbnails;
		this.label = dayOfMonth < 10 ? dayOfMonth + "日" : dayOfMonth + "";
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public List<Article> getThumbnails() {
		return thumbnails;
	}
	public void setThumbnails(List<Article> thumbnails) {
		this.thumbnails = thumbnails;
	}
}
