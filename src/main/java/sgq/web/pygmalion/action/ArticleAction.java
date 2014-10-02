package sgq.web.pygmalion.action;

import sgq.web.pygmalion.bean.Article;
import sgq.web.pygmalion.service.ArticleService;

import com.opensymphony.xwork2.ActionSupport;

public class ArticleAction extends ActionSupport {

	private static final long serialVersionUID = 6803354488640376096L;

	private ArticleService articleService;
	
	private Article article;
	
	private int id;
	
	public String execute() {
		this.setArticle(this.articleService.getArticleById(this.id));
		return SUCCESS;
	}

	public ArticleService getArticleService() {
		return articleService;
	}

	public void setArticleService(ArticleService articleService) {
		this.articleService = articleService;
	}

	public Article getArticle() {
		return article;
	}

	public void setArticle(Article article) {
		this.article = article;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}


}
