package sgq.web.pygmalion.action;

import java.util.List;

import sgq.web.pygmalion.annotation.LoginProtected;
import sgq.web.pygmalion.bean.Article;
import sgq.web.pygmalion.bean.ArticleMonthlyGroup;
import sgq.web.pygmalion.service.ArticleService;

public class HomeAction extends BaseAction {
	
	private String userName;
	private String password;
	
	private String title;
	
	private int pageIndex;
	private boolean isPrivate;
	
	private boolean fullLoaded;

	private static final long serialVersionUID = 7939869507632804670L;
	
	private ArticleService articleService;
	
	private List<ArticleMonthlyGroup> thumbnailMonthlyGroups;
	
	public String home() {
		this.setTitle("主页");
		List<Article> articles = this.articleService.getPublishedArticles(1);
		this.setThumbnailMonthlyGroups(this.articleService.groupThumbnails(articles));
		this.setFullLoaded(articles.size() < ArticleService.PAGE_ITEM_COUNT);
		return SUCCESS;
	}
	
	public String loadNewContent() {
		List<Article> articles;
		if (this.isPrivate) {
			articles = this.articleService.getPrivateArticles(pageIndex);
		}
		else {
			articles = this.articleService.getPublishedArticles(pageIndex);
		}
		this.setThumbnailMonthlyGroups(this.articleService.groupThumbnails(articles));
		this.setFullLoaded(articles.size() < ArticleService.PAGE_ITEM_COUNT);
		return SUCCESS;
	}
	/**
	 * show private articles(not published by owner)
	 * @return
	 */
	@LoginProtected
	public String igloo() {
		this.setTitle("私人领地");
		List<Article> articles = this.articleService.getPrivateArticles(1);
		this.setThumbnailMonthlyGroups(this.articleService.groupThumbnails(articles));
		this.setFullLoaded(articles.size() < ArticleService.PAGE_ITEM_COUNT);
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

	public int etPageIndex() {
		return pageIndex;
	}

	public void setPageIndex(int pageIndex) {
		this.pageIndex = pageIndex;
	}

	public boolean isFullLoaded() {
		return fullLoaded;
	}

	public void setFullLoaded(boolean fullLoaded) {
		this.fullLoaded = fullLoaded;
	}

	public boolean isPrivate() {
		return isPrivate;
	}

	public void setPrivate(boolean isPrivate) {
		this.isPrivate = isPrivate;
	}

}
