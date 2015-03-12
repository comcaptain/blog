package sgq.web.console.dao;

import java.util.List;

import org.hibernate.Session;

import sgq.web.console.enums.WordMemoryLevel;
import sgq.web.console.model.WordModel;
import sgq.web.pygmalion.bean.Wordset;
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
	public List<WordModel> selectReviewWordList(int wordSetId) {
		Session session = this.getSessionFactory().openSession();
		List<WordModel> words = null;
		try {
			words = session.createQuery(
					"select new WordModel(word.jpWordId,word.hiragana,word.kanji,word.chinese,"
						+ "wmr.level,wmr.nextReviewDate,wmr.passCount,wmr.failCount,wmr.notSureCount) "
					+ "from JpWord word left join WordMemoryRecord wmr "
					+ "where word.wordSet.wordSetId = :wordSetId and wmr.user.userId = :userId and wmr.nextReviewDate < CURRENT_DATE()")
					.setParameter("userId", SessionUtil.getCurrentUserId())
					.setParameter("wordSetId", wordSetId)
					.list();
		}
		finally {
			session.close();
		}
		return words;
	}

	@SuppressWarnings("unchecked")
	public List<WordModel> selectRawWordList(int wordSetId) {
		Session session = this.getSessionFactory().openSession();
		List<WordModel> words = null;
		try {
			words = session.createQuery(
					"select new WordModel(word.jpWordId,word.hiragana,word.kanji,word.chinese,"
						+ "wmr.level,wmr.nextReviewDate,wmr.passCount,wmr.failCount,wmr.notSureCount) "
					+ "from JpWord word left join WordMemoryRecord wmr "
					+ "where word.wordSet.wordSetId = :wordSetId and wmr.user.userId = :userId and wmr.nextReviewDate is null and wmr.level = " + WordMemoryLevel.RAW.code)
					.setParameter("userId", SessionUtil.getCurrentUserId())
					.setParameter("wordSetId", wordSetId)
					.list();
		}
		finally {
			session.close();
		}
		return words;
	}
}
