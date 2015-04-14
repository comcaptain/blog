package sgq.web.pygmalion.interceptor;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

public class Log4j2ExceptionInterceptor extends AbstractInterceptor{
	
	private static final Logger logger = LogManager.getLogger(Log4j2ExceptionInterceptor.class);

	/**
	 * 
	 */
	private static final long serialVersionUID = 1749986164680146564L;

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		try {
			return invocation.invoke();
		}
		catch (Exception e) {
			ServletActionContext.getResponse().setHeader("cache-control", "no-cache");
			logger.error("Global Exception: ", e);
			throw e;
		}
	}

}
