package sgq.web.pygmalion.dao;

import java.util.List;

import org.hibernate.Session;

import sgq.web.pygmalion.bean.User;
import sgq.web.pygmalion.exception.LoginException;


public class UserDao extends BaseDao{

	@SuppressWarnings("unchecked")
	public User login(String userName, String password) throws LoginException {
		Session session = this.sessionFactory.openSession();
		User user = null;
		try {
			List<User> users = session.createQuery("select new User(userId, priority, locked) from User where loginUserId = :userName and password = :password")
					.setParameter("userName", userName)
					.setParameter("password", password)
					.setMaxResults(1)
					.list();
			if (users == null || users.size() == 0) throw new LoginException("用户名或者密码不正确");
			user = users.get(0);
			if (user.isLocked()) throw new LoginException("用户已经被锁定了");
		}
		finally {
			session.close();
		}
		return user;
	}
}
