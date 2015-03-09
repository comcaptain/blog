package sgq.web.console.dao;

import java.util.List;

import org.hibernate.Session;

import sgq.web.pygmalion.bean.Wordset;
import sgq.web.pygmalion.dao.BaseDao;

public class WordsetDao extends BaseDao{
	@SuppressWarnings("unchecked")
	public List<Wordset> selectAllWordset() {
		Session session = this.getSessionFactory().openSession();
		List<Wordset> wordsets = null;
		try {
			wordsets = session.createQuery("from Wordset").list();
		}
		finally {
			session.close();
		}
		return wordsets;
	}
}
