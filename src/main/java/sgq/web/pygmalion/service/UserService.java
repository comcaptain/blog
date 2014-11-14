package sgq.web.pygmalion.service;

import sgq.web.pygmalion.bean.User;
import sgq.web.pygmalion.dao.UserDao;
import sgq.web.pygmalion.exception.LoginException;

import com.opensymphony.xwork2.ActionContext;

public class UserService {
	private UserDao userDao;

	public UserDao getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}
	
	public void login(String username, String password) throws LoginException {
		User user = this.getUserDao().getUserByLoginUserId(username);
		if (user == null || password == null || !password.equals(user.getPassword())) {
			throw new LoginException("用户名或者密码不正确");
		}
		if (user.isLocked()) {
			throw new LoginException("用户已经被锁定了");
		}
		ActionContext.getContext().getSession().put("user", user);
	}
	public void logout() {
		ActionContext.getContext().getSession().put("user", null);
	}
}