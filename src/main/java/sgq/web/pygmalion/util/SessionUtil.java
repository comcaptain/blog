package sgq.web.pygmalion.util;

import com.opensymphony.xwork2.ActionContext;

import sgq.web.pygmalion.bean.User;

public class SessionUtil {
	
	public static int getCurrentUserId() {
		return getUser().getUserId();
	}
	
	public static int getPriority() {
		return getUser().getPriority();
	}

	public static void registerUser(User user) {
		ActionContext.getContext().getSession().put("user", user);
	}
	
	private static User getUser() {
		return (User) ActionContext.getContext().getSession().get("user");
	}
}
