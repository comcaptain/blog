package sgq.web.console.service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.ScrollableResults;
import org.hibernate.Session;
import org.hibernate.Transaction;

import sgq.web.console.bean.WordMemoryDailyStatistics;
import sgq.web.console.bean.WordMemoryRecord;
import sgq.web.console.bean.Wordset;
import sgq.web.console.dao.WordMemoryDailyStatisticsDao;
import sgq.web.console.dao.WordsetDao;
import sgq.web.console.enums.WordMemoryLevelEnum;
import sgq.web.console.model.WordModel;

import sgq.web.console.bean.JpWord;

import com.google.gson.Gson;

public class WordsetService {
	
	private static final Logger logger = LogManager.getLogger(WordsetService.class);

	private WordMemoryDailyStatisticsDao wmdsDao;
	
	private WordsetDao wordsetDao;

	public WordsetDao getWordsetDao() {
		return wordsetDao;
	}

	public void setWordsetDao(WordsetDao wordsetDao) {
		this.wordsetDao = wordsetDao;
	}
	
	public String retrieveWordSetListInJSON() {
		List<Object> json = new LinkedList<Object>();
		for (Wordset wordset: wordsetDao.selectAllWordset()) { 
			Map<String, Object> wordsetJson = new HashMap<String, Object>();
			wordsetJson.put("wordsetId", wordset.getWordsetId());
			wordsetJson.put("name", wordset.getName());
			wordsetJson.put("description", wordset.getDescription());
			json.add(wordsetJson);
		}
		return new Gson().toJson(json);
	}

	public String retrieveReviewWordListInJSON(int wordsetId) {
		return this.convertWordModelListToJSON(wordsetDao.selectReviewWordList(wordsetId));
	}

	public String retrieveRawWordListInJSON(int wordsetId) {
		return this.convertWordModelListToJSON(wordsetDao.selectRawWordList(wordsetId));
	}
	
	private String convertWordModelListToJSON(List<WordModel> words) {
		List<Object> json = new LinkedList<Object>();
		for (WordModel word: words) { 
			Map<String, Object> wordJson = new HashMap<String, Object>();
			wordJson.put("jpWordId", word.getJpWordId());
			wordJson.put("hiragana", word.getHiragana());
			wordJson.put("kanji", word.getKanji());
			wordJson.put("chinese", word.getChinese());
			wordJson.put("recordId", word.getRecordId());
			wordJson.put("level", word.getLevel().code);
			wordJson.put("nextReviewDate", word.getNextReviewDate());
			wordJson.put("passCount", word.getPassCount());
			wordJson.put("failCount", word.getFailCount());
			wordJson.put("notSureCount", word.getNotSureCount());
			wordJson.put("accumulatedTime", word.getAccumulatedTime());
			json.add(wordJson);
		}
		return new Gson().toJson(json);
	}
	
	public void extractWmrsFromWordModelListInJson(String wordModelListInJson, 
			List<WordMemoryRecord> newRecords, Map<Integer, WordMemoryRecord> modifiedRecords) {
		@SuppressWarnings("unchecked")
		Map<String, Map<String, Object>> data = (new Gson()).fromJson(wordModelListInJson, Map.class);
		for (Entry<String, Map<String, Object>> entry : data.entrySet()) {
			Map<String, Object> word = entry.getValue();
			WordMemoryRecord wmr = new WordMemoryRecord();
			wmr.setAccumulatedTime(((Double)word.get("accumulatedTime")).intValue());
			wmr.setFailCount(((Double)word.get("failCount")).intValue());
			wmr.setPassCount(((Double)word.get("passCount")).intValue());
			wmr.setNotSureCount(((Double)word.get("notSureCount")).intValue());
			wmr.setLevel(WordMemoryLevelEnum.getEnum(((Double)word.get("level")).intValue()));
			Integer recordId = ((Double)word.get("recordId")).intValue();
			if (recordId == null || recordId <= 0) {
				JpWord temp = new JpWord();
				temp.setJpWordId(((Double)word.get("jpWordId")).intValue());
				wmr.setWord(temp);
				newRecords.add(wmr);
			}
			else {
				wmr.setRecordId(recordId);
				modifiedRecords.put(recordId, wmr);
			}
		}
	}

	public WordMemoryDailyStatistics convertJsonToWordMemoryDailyStatistics(String dailyStatisticsInJson) {
		@SuppressWarnings("unchecked")
		Map<String, Object> data = (new Gson()).fromJson(dailyStatisticsInJson, Map.class);
		WordMemoryDailyStatistics model = new WordMemoryDailyStatistics();
		model.setWmStatisticsId(((Double)data.get("wmStatisticsId")).intValue());
		model.setAccumulatedTime(((Double)data.get("accumulatedTime")).intValue());
		model.setPassCount(((Double)data.get("passCount")).intValue());
		model.setFailCount(((Double)data.get("failCount")).intValue());
		model.setNotSureCount(((Double)data.get("notSureCount")).intValue());
		return model;
	}

	public boolean synchronize(int wordsetId, List<WordMemoryRecord> newRecords, Map<Integer,WordMemoryRecord> modifiedRecords, WordMemoryDailyStatistics dailyStatistics) {
		Session session = this.wordsetDao.getSessionFactory().openSession();
		Transaction tx = session.beginTransaction();
		try {
			if (modifiedRecords.size() > 0) {
				ScrollableResults recordsInDb = wordsetDao.getWmrInDBStream(modifiedRecords, session);
				wordsetDao.updateWmrs(recordsInDb, modifiedRecords, session);
			}
			if (newRecords.size() > 0) {
				Wordset wordset = wordsetDao.getWordsetById(wordsetId);
				wordsetDao.addWmrs(newRecords, wordset, session);
			}
			this.wmdsDao.saveOrUpdate(dailyStatistics, session);
			tx.commit();
			return true;
		}
		catch(Exception e) {
			tx.rollback();
			logger.error("Synchonization Failed!", e);
			return false;
		}
		finally {
			session.close();
		}
	}

	public WordMemoryDailyStatisticsDao getWmdsDao() {
		return wmdsDao;
	}

	public void setWmdsDao(WordMemoryDailyStatisticsDao wmdsDao) {
		this.wmdsDao = wmdsDao;
	}
}