package sgq.web.pygmalion.dao;

import java.util.List;

import org.hibernate.Session;

import sgq.web.pygmalion.bean.User;
import sgq.web.pygmalion.exception.LoginException;


public class UserDao extends BaseDao{

	@SuppressWarnings("unchecked")
	public User getUserByLoginUserId(String loginUserId) throws LoginException {
		Session session = this.sessionFactory.openSession();
		try {
			List<User> users = session.createQuery("from User where loginUserId = :loginUserId")
					.setParameter("loginUserId", loginUserId)
					.setMaxResults(1)
					.list();
			if (users == null || users.size() == 0) return null;
			return users.get(0);
		}
		finally {
			session.close();
		}
	}
}
