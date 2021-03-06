package sgq.web.pygmalion.model;

import java.util.Date;

import sgq.web.pygmalion.bean.Article;
import sgq.web.pygmalion.bean.User;
import sgq.web.pygmalion.enums.PrivilegeEnum;
import sgq.web.pygmalion.enums.PublicStatusEnum;
import sgq.web.pygmalion.util.SessionUtil;

public class ArticleModel {
	private int articleId;
	private String title;
	private String content;
	private String markdown;
	private String thumbnail;
	private Date createTime;
	private Date updateTime;
	private User author;
	private PublicStatusEnum publicStatus;
	public ArticleModel() {
		
	}
	public ArticleModel(Article article) {
		this.updateArticle(article);
	}
	public void updateArticle(Article article) {
		this.title = article.getTitle();
		this.content = article.getContent();
		this.markdown = article.getMarkdown();
		this.thumbnail = article.getThumbnail();
		this.createTime = article.getCreateTime();
		this.updateTime = article.getUpdateTime();
		this.author = article.getAuthor();
		this.articleId = article.getArticleId();
		this.publicStatus = article.getPublicStatus();
	}
	public int getArticleId() {
		return articleId;
	}
	public void setArticleId(int articleId) {
		this.articleId = articleId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getMarkdown() {
		return markdown;
	}
	public void setMarkdown(String markdown) {
		this.markdown = markdown;
	}
	public String getThumbnail() {
		return thumbnail;
	}
	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public User getAuthor() {
		return author;
	}
	public void setAuthor(User author) {
		this.author = author;
	}
	public boolean isEditable() {
		if (!SessionUtil.isLoggedIn()) return false;
		if (SessionUtil.getCurrentUserId() == this.getAuthor().getUserId()) return true;
		if (SessionUtil.getRole().containsPrivilege(PrivilegeEnum.EDIT_ARTICLE)) return true;
		return false;
	}
	public boolean isDeletable() {
		if (!SessionUtil.isLoggedIn()) return false;
		if (SessionUtil.getCurrentUserId() == this.getAuthor().getUserId()) return true;
		if (SessionUtil.getRole().containsPrivilege(PrivilegeEnum.DELETE_ARTICLE)) return true;
		return false;
	}
	public boolean isPublishable() {
		if (!SessionUtil.isLoggedIn()) return false;
		if (SessionUtil.getRole().containsPrivilege(PrivilegeEnum.PUBLISH_ARTICLE)) return true;
		return false;
	}
	public Article getNewArticle() {
		Article article = new Article();
		article.setTitle(title);
		article.setContent(content);
		article.setMarkdown(markdown);
		article.setThumbnail(thumbnail);
		article.setPublicStatus(PublicStatusEnum.PRIVATE);
		return article;
	}
	public void mergeArticle(Article oldArticle) {
		oldArticle.setTitle(title);
		oldArticle.setContent(content);
		oldArticle.setMarkdown(markdown);
		oldArticle.setThumbnail(thumbnail);
	}
	public PublicStatusEnum getEnumPublicStatus() {
		return publicStatus;
	}
	public int getPublicStatus() {
		return publicStatus.code();
	}
	public void setEnumPublicStatus(PublicStatusEnum publicStatus) {
		this.publicStatus = publicStatus;
	}
	public void setPublicStatus(int publicStatus) {
		this.publicStatus = PublicStatusEnum.getEnum(publicStatus);
	}
}
