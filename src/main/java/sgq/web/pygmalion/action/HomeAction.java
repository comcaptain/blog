package sgq.web.pygmalion.action;

import java.util.List;

import sgq.web.pygmalion.bean.ArticleMonthlyGroup;
import sgq.web.pygmalion.service.ArticleService;

import com.opensymphony.xwork2.ActionSupport;

public class HomeAction extends ActionSupport {
	
	private String userName;
	private String password;

	private static final long serialVersionUID = 7939869507632804670L;
	
	private ArticleService articleService;
	
	private List<ArticleMonthlyGroup> thumbnailMonthlyGroups;
	
	public String home() {
		this.setThumbnailMonthlyGroups(this.articleService.getThumbnailGroupsOfRecentArticles(1));
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

}
