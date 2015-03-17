package sgq.web.console.service;

import java.util.Date;

import sgq.web.console.dao.WordMemoryDailyStatisticsDao;
import sgq.web.console.bean.WordMemoryDailyStatistics;

public class WordMemoryDailyStatisticsService {
	private WordMemoryDailyStatisticsDao wmdsDao;
	
	public WordMemoryDailyStatistics getStatisticsToday() {
		return this.wmdsDao.getStatisticsByDate(new Date());
	}

	public WordMemoryDailyStatisticsDao getWmdsDao() {
		return wmdsDao;
	}

	public void setWmdsDao(WordMemoryDailyStatisticsDao wmdsDao) {
		this.wmdsDao = wmdsDao;
	}
}
