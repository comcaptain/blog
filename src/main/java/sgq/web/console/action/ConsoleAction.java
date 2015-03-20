package sgq.web.console.action;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import sgq.web.console.bean.WordMemoryDailyStatistics;
import sgq.web.console.bean.WordMemoryRecord;
import sgq.web.console.service.WordMemoryDailyStatisticsService;
import sgq.web.console.service.WordsetService;
import sgq.web.pygmalion.action.BaseAction;
import sgq.web.pygmalion.util.SessionUtil;

public class ConsoleAction extends BaseAction {
	
	private static final long serialVersionUID = -2231071361329659061L;
	
	private boolean loginFirst;
	
	private int wordsetId;
	
	private String reviewWordListInJSON;
	
	private String rawWordListInJSON;
	
	private String wordsetsInJSON;
	
	private WordsetService wordsetService;
	
	private WordMemoryDailyStatistics statisticsToday;
	
	private WordMemoryDailyStatisticsService wmdsService;
	
	private String notSynchronizedWordsInJson;
	
	private String dailyStatisticsInJson;
	
	private String jsonStatus;

	public int getWordsetId() {
		return wordsetId;
	}

	public void setWordsetId(int wordsetId) {
		this.wordsetId = wordsetId;
	}

	public String display() {
		return SUCCESS;
	}
	
	public String synchronize() {
		Map<Integer, WordMemoryRecord> modifiedRecords = new HashMap<Integer,WordMemoryRecord>();
		List<WordMemoryRecord> newRecords = new LinkedList<WordMemoryRecord>();
		wordsetService.extractWmrsFromWordModelListInJson(this.notSynchronizedWordsInJson, newRecords, modifiedRecords);
		WordMemoryDailyStatistics dailyStatistics = 
				wordsetService.convertJsonToWordMemoryDailyStatistics(this.dailyStatisticsInJson);
		if (wordsetService.synchronize(this.wordsetId, newRecords, modifiedRecords, dailyStatistics)) {
			this.jsonStatus = SUCCESS;
		}
		else {
			this.jsonStatus = ERROR;
		}
		return SUCCESS;
	}
	
	public String retrieveWordSetList() {
		if (!SessionUtil.isLoggedIn()) {
			this.loginFirst = true;
		}
		else {
			this.wordsetsInJSON = wordsetService.retrieveWordSetListInJSON();
		}
		return SUCCESS;
	}
	
	public String retrieveWordList() {
		this.reviewWordListInJSON = wordsetService.retrieveReviewWordListInJSON(this.wordsetId);
		this.rawWordListInJSON = wordsetService.retrieveRawWordListInJSON(wordsetId);
		this.statisticsToday = wmdsService.getStatisticsToday();
		return SUCCESS;
	}

	public boolean isLoginFirst() {
		return loginFirst;
	}

	public void setLoginFirst(boolean loginFirst) {
		this.loginFirst = loginFirst;
	}

	public String getWordsetsInJSON() {
		return wordsetsInJSON;
	}

	public void setWordsetsInJSON(String wordsetsInJSON) {
		this.wordsetsInJSON = wordsetsInJSON;
	}

	public WordsetService getWordsetService() {
		return wordsetService;
	}

	public void setWordsetService(WordsetService wordsetService) {
		this.wordsetService = wordsetService;
	}

	public String getReviewWordListInJSON() {
		return reviewWordListInJSON;
	}

	public void setReviewWordListInJSON(String reviewWordListInJSON) {
		this.reviewWordListInJSON = reviewWordListInJSON;
	}

	public String getRawWordListInJSON() {
		return rawWordListInJSON;
	}

	public void setRawWordListInJSON(String rawWordListInJSON) {
		this.rawWordListInJSON = rawWordListInJSON;
	}

	public WordMemoryDailyStatisticsService getWmdsService() {
		return wmdsService;
	}

	public void setWmdsService(WordMemoryDailyStatisticsService wmdsService) {
		this.wmdsService = wmdsService;
	}

	public WordMemoryDailyStatistics getStatisticsToday() {
		return statisticsToday;
	}

	public void setStatisticsToday(WordMemoryDailyStatistics statisticsToday) {
		this.statisticsToday = statisticsToday;
	}

	public String getJsonStatus() {
		return jsonStatus;
	}

	public void setJsonStatus(String jsonStatus) {
		this.jsonStatus = jsonStatus;
	}

	public String getDailyStatisticsInJson() {
		return dailyStatisticsInJson;
	}

	public void setDailyStatisticsInJson(String dailyStatisticsInJson) {
		this.dailyStatisticsInJson = dailyStatisticsInJson;
	}

	public String getNotSynchronizedWordsInJson() {
		return notSynchronizedWordsInJson;
	}

	public void setNotSynchronizedWordsInJson(String notSynchronizedWordsInJson) {
		this.notSynchronizedWordsInJson = notSynchronizedWordsInJson;
	}
}
