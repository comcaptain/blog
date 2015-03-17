package sgq.web.console.action;

import sgq.web.console.bean.WordMemoryDailyStatistics;
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

	public int getWordsetId() {
		return wordsetId;
	}

	public void setWordsetId(int wordsetId) {
		this.wordsetId = wordsetId;
	}

	public String display() {
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
}
