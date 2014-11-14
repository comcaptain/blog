package sgq.web.pygmalion.util;

import sgq.web.pygmalion.bean.User;
import sgq.web.pygmalion.enums.RoleEnum;

import com.opensymphony.xwork2.ActionContext;

public class SessionUtil {
	
	public static boolean isLoggedIn() {
		return getUser() != null;
	}
	
	public static int getCurrentUserId() {
		return getUser().getUserId();
	}
	
	public static RoleEnum getRole() {
		return getUser().getRole();
	}
	
	private static User getUser() {
		return (User) ActionContext.getContext().getSession().get("user");
	}
}
