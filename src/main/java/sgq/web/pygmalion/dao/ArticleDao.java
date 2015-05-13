package sgq.web.pygmalion.dao;

import java.util.Date;
import java.util.List;

import org.hibernate.Session;

import sgq.web.pygmalion.bean.Article;
import sgq.web.pygmalion.util.SessionUtil;

public class ArticleDao extends BaseDao{
	@SuppressWarnings("unchecked")
	public List<Article> getPublishedThumbnailList(int start, int limit) {
		Session session = this.sessionFactory.openSession();
		List<Article> articles = null;
		try {
			articles = session.createQuery("select new Article(articleId, title, thumbnail, createTime, updateTime, author) from Article where public_status = 2 order by update_time desc")
					.setFirstResult(start)
					.setMaxResults(limit)
					.list();
		}
		finally {
			session.close();
		}
		return articles;
	}
	@SuppressWarnings("unchecked")
	public List<Article> getPrivateThumbnailList(int start, int limit) {
		Session session = this.sessionFactory.openSession();
		List<Article> articles = null;
		try {
			articles = session.createQuery("select new Article(articleId, title, thumbnail, createTime, updateTime, author) from Article ar where ar.publicStatus != 2 and ar.author.userId = :userId order by update_time desc")
					.setParameter("userId", SessionUtil.getCurrentUserId())
					.setFirstResult(start)
					.setMaxResults(limit)
					.list();
		}
		finally {
			session.close();
		}
		return articles;
	}
	public Article getArticleById(int articleId) {
		Session session = this.sessionFactory.openSession();
		try {
			return (Article) session.get(Article.class, articleId);
		}
		finally {
			session.close();
		}
	}
	public Article saveArticle(Article article) {
		Session session = this.sessionFactory.openSession();
		try {
			if (article.getArticleId() == 0) {
				article.setCreateTime(new Date());
			}
			article.setUpdateTime(new Date());
			session.saveOrUpdate(article);
			session.flush();
			return article;
		}
		finally {
			session.close();
		}
	}
	public void deleteArticle(int id) {
		Session session = this.sessionFactory.openSession();
		try {
			Article article = new Article();
			article.setArticleId(id);
			session.delete(article);
			session.flush();
		}
		finally {
			session.close();
		}
	}
}
