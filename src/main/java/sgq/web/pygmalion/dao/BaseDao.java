package sgq.web.pygmalion.dao;

import org.hibernate.SessionFactory;

public abstract class BaseDao {
	protected SessionFactory sessionFactory;

	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

}
