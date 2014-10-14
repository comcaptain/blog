package sgq.web.pygmalion.service;

import sgq.web.pygmalion.bean.User;
import sgq.web.pygmalion.dao.UserDao;
import sgq.web.pygmalion.exception.LoginException;
import sgq.web.pygmalion.util.SessionUtil;

public class UserService {
	private UserDao userDao;

	public UserDao getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}
	
	public void login(String username, String password) throws LoginException {
		User user = this.getUserDao().login(username, password);
		SessionUtil.registerUser(user);
	}
}