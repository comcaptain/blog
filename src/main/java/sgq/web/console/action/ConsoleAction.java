package sgq.web.console.action;

import sgq.web.pygmalion.action.BaseAction;
import sgq.web.pygmalion.util.SessionUtil;

public class ConsoleAction extends BaseAction {
	
	private static final long serialVersionUID = -2231071361329659061L;
	
	private boolean loginFirst;

	public String display() {
		return SUCCESS;
	}
	
	public String retrieveWordSetList() {
		if (!SessionUtil.isLoggedIn()) {
			this.loginFirst = true;
		}
		return SUCCESS;
	}

	public boolean isLoginFirst() {
		return loginFirst;
	}

	public void setLoginFirst(boolean loginFirst) {
		this.loginFirst = loginFirst;
	}
}
