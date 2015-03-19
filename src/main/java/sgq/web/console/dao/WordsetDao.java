package sgq.web.console.dao;

import java.util.List;

import org.hibernate.Session;

import sgq.web.console.bean.Wordset;
import sgq.web.console.enums.WordMemoryLevel;
import sgq.web.console.model.WordModel;
import sgq.web.pygmalion.dao.BaseDao;
import sgq.web.pygmalion.util.SessionUtil;

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

	@SuppressWarnings("unchecked")
	public List<WordModel> selectReviewWordList(int wordsetId) {
		Session session = this.getSessionFactory().openSession();
		List<WordModel> words = null;
		try {
			words = session.createQuery(
					"select new sgq.web.console.model.WordModel(word.jpWordId,word.hiragana,word.kanji,word.chinese,"
						+ "wmr.level,wmr.nextReviewDate,wmr.passCount,wmr.failCount,wmr.notSureCount,wmr.accumulatedTime) "
					+ "from WordMemoryRecord wmr inner join wmr.word word "
					+ "where word.wordset.wordsetId = :wordsetId and wmr.user.userId = :userId and wmr.nextReviewDate < CURRENT_DATE()")
					.setParameter("userId", SessionUtil.getCurrentUserId())
					.setParameter("wordsetId", wordsetId)
					.list();
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		finally {
			session.close();
		}
		return words;
	}

	@SuppressWarnings("unchecked")
	public List<WordModel> selectRawWordList(int wordsetId) {
		Session session = this.getSessionFactory().openSession();
		List<WordModel> words = null;
		try {
			words = session.createQuery(
					"select new sgq.web.console.model.WordModel(word.jpWordId,word.hiragana,word.kanji,word.chinese,"
							+ "coalesce(wmr.level, 0),wmr.nextReviewDate,coalesce(wmr.passCount, 0),coalesce(wmr.failCount, 0),coalesce(wmr.notSureCount, 0),coalesce(wmr.accumulatedTime, 0)) "
					+ "from WordMemoryRecord wmr right join wmr.word word "
					+ "where word.wordset.wordsetId = :wordsetId and ((wmr.user.userId = :userId and wmr.nextReviewDate is null and wmr.level = " + WordMemoryLevel.RAW.code + ") or wmr.user.userId is null)")
					.setParameter("userId", SessionUtil.getCurrentUserId())
					.setParameter("wordsetId", wordsetId)
					.list();
		}
		finally {
			session.close();
		}
		return words;
	}
}
