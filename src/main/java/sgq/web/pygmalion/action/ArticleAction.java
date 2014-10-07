package sgq.web.pygmalion.action;

import sgq.web.pygmalion.bean.Article;
import sgq.web.pygmalion.service.ArticleService;

import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;

public class ArticleAction extends ActionSupport implements ModelDriven<Article> {

	private static final long serialVersionUID = 6803354488640376096L;

	private ArticleService articleService;
	
	private Article article;
	
	private int id;
	
	/**
	 * 0: failed
	 * 1: succeeded
	 */
	private int operationStatus;
	
	public String display() {
		this.setModel(this.articleService.getArticleById(this.id));
		return SUCCESS;
	}
	
	public String edit() {
		this.setModel(this.articleService.getArticleById(this.id));
		return SUCCESS;
	}
	
	public String save() {
		this.operationStatus = this.articleService.save(article);
		return SUCCESS;
	}

	public ArticleService getArticleService() {
		return articleService;
	}

	public void setArticleService(ArticleService articleService) {
		this.articleService = articleService;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Override
	public Article getModel() {
		return this.article;
	}
	public void setModel(Article article) {
		this.article = article;
	}

	public int getOperationStatus() {
		return operationStatus;
	}

	public void setOperationStatus(int operationStatus) {
		this.operationStatus = operationStatus;
	}


}
