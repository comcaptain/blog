package sgq.web.console.dao;

import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;

import org.hibernate.CacheMode;
import org.hibernate.ScrollMode;
import org.hibernate.ScrollableResults;
import org.hibernate.Session;

import sgq.web.console.bean.WordMemoryRecord;
import sgq.web.console.bean.Wordset;
import sgq.web.console.enums.WordMemoryLevelEnum;
import sgq.web.console.logic.WordMemoryLogic;
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
	
	public Wordset getWordsetById(int wordsetId) {
		Session session = this.getSessionFactory().openSession();
		Wordset model = null;
		try {
			model = (Wordset) session.createQuery("from Wordset where wordsetId = :wordsetId").setParameter("wordsetId", wordsetId).uniqueResult();
		}
		finally {
			session.close();
		}
		return model;
	}

	@SuppressWarnings("unchecked")
	public List<WordModel> selectReviewWordList(int wordsetId) {
		Session session = this.getSessionFactory().openSession();
		List<WordModel> words = null;
		try {
			words = session.createQuery(
					"select new sgq.web.console.model.WordModel(word.jpWordId,word.hiragana,word.kanji,word.chinese,"
						+ "wmr.recordId, wmr.level,wmr.nextReviewDate,wmr.passCount,wmr.failCount,wmr.notSureCount,wmr.accumulatedTime) "
					+ "from WordMemoryRecord wmr inner join wmr.word word "
					+ "where word.wordset.wordsetId = :wordsetId "
						+ "and wmr.user.userId = :userId "
						+ "and wmr.nextReviewDate < CURRENT_DATE() "
						+ "and wmr.level != " + WordMemoryLevelEnum.COOKED.code)
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
							+ "coalesce(wmr.recordId, 0), coalesce(wmr.level, 0),wmr.nextReviewDate,coalesce(wmr.passCount, 0),coalesce(wmr.failCount, 0),coalesce(wmr.notSureCount, 0),coalesce(wmr.accumulatedTime, 0)) "
					+ "from WordMemoryRecord wmr right join wmr.word word "
					+ "where word.wordset.wordsetId = :wordsetId and ((wmr.user.userId = :userId and wmr.nextReviewDate is null and wmr.level = " + WordMemoryLevelEnum.RAW.code + ") or wmr.recordId is null)")
					.setParameter("userId", SessionUtil.getCurrentUserId())
					.setParameter("wordsetId", wordsetId)
					.list();
		}
		finally {
			session.close();
		}
		return words;
	}

	public ScrollableResults getWmrInDBStream(Map<Integer, WordMemoryRecord> records, Session session) {
		return session.createQuery("from WordMemoryRecord where user.userId = :userId and recordId in :recordIds")
			.setParameter("userId", SessionUtil.getCurrentUserId())
			.setParameterList("recordIds", new ArrayList<Integer>(records.keySet()))
			.setCacheMode(CacheMode.IGNORE)
			.scroll(ScrollMode.FORWARD_ONLY);
	}
	
	public void updateWmrs(ScrollableResults recordsInDb, Map<Integer, WordMemoryRecord> records, Session session) {
		int count = 0;
		while (recordsInDb.next()) {
			WordMemoryRecord recordInDb = (WordMemoryRecord) recordsInDb.get(0);
			WordMemoryRecord recordFromUser = records.get(recordInDb.getRecordId());
			if (recordFromUser == null) continue;
			records.remove(recordInDb.getRecordId());
			mergeWordMemoryRecord(recordInDb, recordFromUser);
			session.update(recordInDb);
			count++;
			if ( count % 45 == 0 ) {
		        session.flush();
		        session.clear();
		    }
		}
	}
	
	public void addWmrs(List<WordMemoryRecord> records, Wordset wordset, Session session) {
		int count = 0;
		for (WordMemoryRecord record: records) {
			record.setUser(SessionUtil.getUser());
			record.setWordSet(wordset);
			if (record.getLevel() == WordMemoryLevelEnum.COOKED) {
				record.setNextReviewDate(null);
			}
			else if (record.getPassCount() > 0) {
				record.setLevel(WordMemoryLevelEnum.FIRST_BLOOD);
				record.setNextReviewDate(WordMemoryLogic.getNextReviewDate(record.getLevel()));
			}
			else record.setLevel(WordMemoryLevelEnum.RAW);
			session.save(record);
			count++;
			if ( count % 45 == 0 ) {
		        session.flush();
		        session.clear();
		    }
		}
	}
	
	private void mergeWordMemoryRecord(WordMemoryRecord target, WordMemoryRecord updateData) {
		java.sql.Date today = new java.sql.Date(GregorianCalendar.getInstance().getTimeInMillis());
		if (target.getNextReviewDate() == null && updateData.getPassCount() > 0) {
			target.setLevel(WordMemoryLevelEnum.FIRST_BLOOD);
			target.setNextReviewDate(WordMemoryLogic.getNextReviewDate(target.getLevel()));
		}
		else if (target.getNextReviewDate() != null && target.getNextReviewDate().compareTo(today) <= 0 && updateData.getPassCount() > target.getPassCount()) {
			target.setLevel(WordMemoryLogic.getNextLevel(target.getLevel()));
			target.setNextReviewDate(WordMemoryLogic.getNextReviewDate(target.getLevel()));
		}
		target.setFailCount(updateData.getFailCount());
		target.setNotSureCount(updateData.getNotSureCount());
		target.setPassCount(updateData.getPassCount());
		target.setAccumulatedTime(updateData.getAccumulatedTime());
	}
}
