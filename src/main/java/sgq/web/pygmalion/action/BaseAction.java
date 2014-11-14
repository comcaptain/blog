package sgq.web.pygmalion.action;

import sgq.web.pygmalion.util.SessionUtil;

import com.opensymphony.xwork2.ActionSupport;

@SuppressWarnings("serial")
public abstract class BaseAction extends ActionSupport {
	public boolean isCreateArticleEnabled() {
		return SessionUtil.isLoggedIn();
	}
}
