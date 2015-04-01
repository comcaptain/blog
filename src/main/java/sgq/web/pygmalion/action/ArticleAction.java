package sgq.web.pygmalion.action;

import sgq.web.pygmalion.annotation.LoginProtected;
import sgq.web.pygmalion.bean.Article;
import sgq.web.pygmalion.exception.PrivilegeException;
import sgq.web.pygmalion.model.ArticleModel;
import sgq.web.pygmalion.service.ArticleService;

import com.opensymphony.xwork2.ModelDriven;

public class ArticleAction extends BaseAction implements ModelDriven<ArticleModel> {

	private static final long serialVersionUID = 6803354488640376096L;
	
	private ArticleService articleService;
	
	private ArticleModel article;
	
	private int id;
	
	public String display() {
		this.setModel(this.articleService.getArticleById(this.id));
		return SUCCESS;
	}
	@LoginProtected
	public String edit() {
		this.setModel(this.articleService.getArticleById(this.id));
		return SUCCESS;
	}
	@LoginProtected
	public String save() throws PrivilegeException {
		this.setModel(this.articleService.save(article));
		return SUCCESS;
	}
	@LoginProtected
	public String newArticle() {
		return SUCCESS;
	}
	@LoginProtected
	public String deleteArticle() throws PrivilegeException {
		this.articleService.deleteArticle(this.id);
		return SUCCESS;
	}
	@LoginProtected
	public String togglePublish() throws PrivilegeException {
		this.setModel(this.articleService.togglePublish(article.getArticleId()));
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
	public ArticleModel getModel() {
		if (this.article == null) {
			this.article = new ArticleModel();
		}
		return this.article;
	}
	public void setModel(Article article) {
		this.article.updateArticle(article);
	}

}
