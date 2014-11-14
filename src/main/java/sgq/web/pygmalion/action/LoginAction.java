package sgq.web.pygmalion.action;

import sgq.web.pygmalion.exception.LoginException;
import sgq.web.pygmalion.service.UserService;

@SuppressWarnings("serial")
public class LoginAction extends BaseAction {
	private UserService userService;
	private String errorMessage;
	private String userName;
	private String password;
	private String resultStatus;
	public String display() {
		return SUCCESS;
	}
	public String login() {
		try {
			this.userService.login(this.getUserName(), this.getPassword());
			this.resultStatus = "success";
		}
		catch(LoginException e) {
			this.resultStatus = "error";
			this.errorMessage = e.getMessage();
		}
		return SUCCESS;
	}
	public String logout() {
		this.userService.logout();
		this.resultStatus = "success";
		return SUCCESS;
	}
	public String getErrorMessage() {
		return errorMessage;
	}
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	public UserService getUserService() {
		return userService;
	}
	public void setUserService(UserService userService) {
		this.userService = userService;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getResultStatus() {
		return resultStatus;
	}
	public void setResultStatus(String resultStatus) {
		this.resultStatus = resultStatus;
	}
}
