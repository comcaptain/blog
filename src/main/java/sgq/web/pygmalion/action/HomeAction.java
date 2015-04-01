package sgq.web.pygmalion.action;

import java.util.List;

import sgq.web.pygmalion.annotation.LoginProtected;
import sgq.web.pygmalion.bean.ArticleMonthlyGroup;
import sgq.web.pygmalion.service.ArticleService;

public class HomeAction extends BaseAction {
	
	private String userName;
	private String password;
	
	private String title;

	private static final long serialVersionUID = 7939869507632804670L;
	
	private ArticleService articleService;
	
	private List<ArticleMonthlyGroup> thumbnailMonthlyGroups;
	
	public String home() {
		this.setTitle("主页");
		this.setThumbnailMonthlyGroups(this.articleService.getThumbnailGroupsOfPublishedArticles(1));
		return SUCCESS;
	}
	/**
	 * show private articles(not published by owner)
	 * @return
	 */
	@LoginProtected
	public String igloo() {
		this.setTitle("私人领地");
		this.setThumbnailMonthlyGroups(this.articleService.getThumbnailGroupsOfPrivateArticles(1));
		return SUCCESS;
	}

	public ArticleService getArticleService() {
		return articleService;
	}

	public void setArticleService(ArticleService articleService) {
		this.articleService = articleService;
	}

	public List<ArticleMonthlyGroup> getThumbnailMonthlyGroups() {
		return thumbnailMonthlyGroups;
	}

	public void setThumbnailMonthlyGroups(List<ArticleMonthlyGroup> thumbnailMonthlyGroups) {
		this.thumbnailMonthlyGroups = thumbnailMonthlyGroups;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}

}
