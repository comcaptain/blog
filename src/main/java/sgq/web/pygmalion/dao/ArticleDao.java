package sgq.web.pygmalion.dao;

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
		return (Article) session.get(Article.class, articleId);
	}
}
