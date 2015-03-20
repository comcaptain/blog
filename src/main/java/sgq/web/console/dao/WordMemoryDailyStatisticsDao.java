package sgq.web.console.dao;

import java.sql.Date;

import org.hibernate.Session;

import sgq.web.console.bean.WordMemoryDailyStatistics;
import sgq.web.pygmalion.dao.BaseDao;
import sgq.web.pygmalion.util.SessionUtil;

public class WordMemoryDailyStatisticsDao extends BaseDao {
	public WordMemoryDailyStatistics getStatisticsByDate(Date date) {
		Session session = this.getSessionFactory().openSession();
		WordMemoryDailyStatistics result = null;
		try {
			result = (WordMemoryDailyStatistics) session.createQuery("from WordMemoryDailyStatistics where date = :date and user.userId = :userId")
				.setParameter("date", date)
				.setParameter("userId", SessionUtil.getCurrentUserId())
				.uniqueResult();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			session.close();
		}
		return result;
	}
	public WordMemoryDailyStatistics getStatisticsById(int wmStatisticsId) {
		Session session = this.getSessionFactory().openSession();
		return getStatisticsById(wmStatisticsId, session);
	}
	public WordMemoryDailyStatistics getStatisticsById(int wmStatisticsId, Session session) {
		WordMemoryDailyStatistics result = null;
		try {
			result = (WordMemoryDailyStatistics) session.createQuery("from WordMemoryDailyStatistics where wmStatisticsId = :wmStatisticsId and user.userId = :userId")
				.setParameter("wmStatisticsId", wmStatisticsId)
				.setParameter("userId", SessionUtil.getCurrentUserId())
				.uniqueResult();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			session.close();
		}
		return result;
	}
	public void update(WordMemoryDailyStatistics dailyStatisticsInDb, WordMemoryDailyStatistics dailyStatistics, Session session) {
		dailyStatisticsInDb.setAccumulatedTime(dailyStatistics.getAccumulatedTime());
		dailyStatisticsInDb.setFailCount(dailyStatistics.getFailCount());
		dailyStatisticsInDb.setNotSureCount(dailyStatistics.getNotSureCount());
		dailyStatisticsInDb.setPassCount(dailyStatistics.getPassCount());
		session.save(dailyStatisticsInDb);
	}
}
