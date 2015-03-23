package sgq.web.console.dao;

import java.sql.Date;
import java.util.GregorianCalendar;

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
		finally {
			session.close();
		}
		return result;
	}
	public WordMemoryDailyStatistics getStatisticsById(int wmStatisticsId) {
		Session session = this.getSessionFactory().openSession();
		try {
			return getStatisticsById(wmStatisticsId, session);
		}
		finally {
			session.close();
		}
	}
	public WordMemoryDailyStatistics getStatisticsById(int wmStatisticsId, Session session) {
		WordMemoryDailyStatistics result = null;
			result = (WordMemoryDailyStatistics) session.createQuery("from WordMemoryDailyStatistics where wmStatisticsId = :wmStatisticsId and user.userId = :userId")
				.setParameter("wmStatisticsId", wmStatisticsId)
				.setParameter("userId", SessionUtil.getCurrentUserId())
				.uniqueResult();
		return result;
	}
	public void saveOrUpdate(WordMemoryDailyStatistics dailyStatistics, Session session) {
		WordMemoryDailyStatistics dailyStatisticsInDb = this.getStatisticsById(dailyStatistics.getWmStatisticsId(), session);
		if (dailyStatisticsInDb == null) {
			dailyStatisticsInDb = new WordMemoryDailyStatistics();
			dailyStatisticsInDb.setUser(SessionUtil.getUser());
			dailyStatisticsInDb.setDate(new java.sql.Date(GregorianCalendar.getInstance().getTimeInMillis()));
		}
		dailyStatisticsInDb.setAccumulatedTime(dailyStatistics.getAccumulatedTime());
		dailyStatisticsInDb.setFailCount(dailyStatistics.getFailCount());
		dailyStatisticsInDb.setNotSureCount(dailyStatistics.getNotSureCount());
		dailyStatisticsInDb.setPassCount(dailyStatistics.getPassCount());
		session.saveOrUpdate(dailyStatisticsInDb);
	}
}
