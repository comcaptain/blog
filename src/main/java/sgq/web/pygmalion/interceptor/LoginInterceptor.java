package sgq.web.pygmalion.interceptor;

import org.apache.struts2.ServletActionContext;

import sgq.web.pygmalion.annotation.LoginProtected;
import sgq.web.pygmalion.exception.LoginException;
import sgq.web.pygmalion.util.SessionUtil;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

@SuppressWarnings("serial")
public class LoginInterceptor extends AbstractInterceptor{
	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		LoginProtected annotation = invocation.getAction().getClass().getMethod(invocation.getProxy().getMethod()).getAnnotation(LoginProtected.class);
		if (annotation != null) {
			if (!SessionUtil.isLoggedIn()) {
				ServletActionContext.getResponse().setHeader("cache-control", "no-cache");
				throw new LoginException("Please login first");
			}
		}
		return invocation.invoke();
	}
}
