package sgq.web.pygmalion.bean;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.apache.struts2.json.annotations.JSON;
import org.hibernate.annotations.Parameter;
import org.hibernate.annotations.Type;

import sgq.web.pygmalion.enums.PublicStatusEnum;

@Entity
@Table(name="article")
public class Article {
	@Id @GeneratedValue
	@Column(name="article_id")
	private int articleId;
	@Column(name="title")
	private String title;
	@Column(name="content")
	private String content;
	@Column(name="markdown")
	private String markdown;
	@Column(name="thumbnail")
	private String thumbnail;
	@Type(type="sgq.web.pygmalion.enums.EnumUserType",
			parameters={
				@Parameter(name="enumClass",value="sgq.web.pygmalion.enums.PublicStatusEnum"),
		    }
		)
	@Column(name="public_status")
	private PublicStatusEnum publicStatus;
	@Column(name="create_time")
	private Date createTime;
	@Column(name="update_time")
	private Date updateTime;
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "author")
	private User author;
	public Article() {
		
	}
	public Article(int articleId, String title, String thumbnail, Date createTime, Date updateTime, User author) {
		this.articleId = articleId;
		this.title = title;
		this.thumbnail = thumbnail;
		this.createTime = createTime;
		this.updateTime = updateTime;
		this.author = author;
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
	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	@JSON(format="yyyy-MM-dd HH:mm:ss")
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
	public String getThumbnail() {
		return thumbnail;
	}
	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}
	public String getMarkdown() {
		return markdown;
	}
	public void setMarkdown(String markdown) {
		this.markdown = markdown;
	}
	public PublicStatusEnum getPublicStatus() {
		return publicStatus;
	}
	public void setPublicStatus(PublicStatusEnum publicStatus) {
		this.publicStatus = publicStatus;
	}
}
