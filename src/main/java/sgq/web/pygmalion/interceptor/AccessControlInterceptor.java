package sgq.web.pygmalion.interceptor;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

public class AccessControlInterceptor extends AbstractInterceptor{
	private static final long serialVersionUID = 8177404329615204220L;
	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		invocation.getAction().getClass().getMethod(invocation.getProxy().getMethod());
		return null;
	}

}
