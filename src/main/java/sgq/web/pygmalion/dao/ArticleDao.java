package sgq.web.pygmalion.dao;

import java.util.Date;
import java.util.List;

import org.hibernate.Session;

import sgq.web.pygmalion.bean.Article;

public class ArticleDao extends BaseDao{
	@SuppressWarnings("unchecked")
	public List<Article> getThumbnailList(int start, int limit) {
		Session session = this.sessionFactory.openSession();
		List<Article> articles = null;
		try {
			articles = session.createQuery("select new Article(articleId, title, thumbnail, createTime, updateTime, author) from Article order by create_time desc")
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
	public int saveArticle(Article article) {
		Session session = this.sessionFactory.openSession();
		try {
			if (article.getCreateTime() == null) article.setCreateTime(new Date());
			article.setUpdateTime(new Date());
			session.saveOrUpdate(article);
			session.flush();
			return 1;
		}
		catch(Exception e) {
			return 0;
		}
		finally {
			session.close();
		}
	}
}
