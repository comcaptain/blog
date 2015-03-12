package sgq.web.console.action;

import sgq.web.console.service.WordsetService;
import sgq.web.pygmalion.action.BaseAction;
import sgq.web.pygmalion.util.SessionUtil;

public class ConsoleAction extends BaseAction {
	
	private static final long serialVersionUID = -2231071361329659061L;
	
	private boolean loginFirst;
	
	private int wordSetId;
	
	private String reviewWordListInJSON;
	
	private String rawWordListInJSON;
	
	private String wordsetsInJSON;
	
	private WordsetService wordsetService;

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
		this.reviewWordListInJSON = wordsetService.retrieveReviewWordListInJSON(this.wordSetId);
		this.rawWordListInJSON = wordsetService.retrieveRawWordListInJSON(wordSetId);
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

	public int getWordSetId() {
		return wordSetId;
	}

	public void setWordSetId(int wordSetId) {
		this.wordSetId = wordSetId;
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
}
