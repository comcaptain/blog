package sgq.web.console.action;

import sgq.web.console.service.WordsetService;
import sgq.web.pygmalion.action.BaseAction;
import sgq.web.pygmalion.util.SessionUtil;

public class ConsoleAction extends BaseAction {
	
	private static final long serialVersionUID = -2231071361329659061L;
	
	private boolean loginFirst;
	
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
}
