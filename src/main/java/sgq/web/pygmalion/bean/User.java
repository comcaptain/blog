package sgq.web.pygmalion.bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Parameter;
import org.hibernate.annotations.Type;

import sgq.web.pygmalion.enums.RoleEnum;

@Entity
@Table(name="user")
public class User {
	@Id
	@GeneratedValue
	@Column(name="user_id")
	private int userId;
	@Column(name="login_user_id")
	private String loginUserId;
	@Column(name="user_name")
	private String userName;
	@Column(name="password")
	private String password;	
	@Type(type="sgq.web.pygmalion.enums.EnumUserType",
		parameters={
			@Parameter(name="enumClass",value="sgq.web.pygmalion.enums.RoleEnum"),
	    }
	)
	@Column(name="role")
	private RoleEnum role;
	@Column(name="locked")
	private boolean locked;
	public User() {
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getLoginUserId() {
		return loginUserId;
	}
	public void setLoginUserId(String loginUserId) {
		this.loginUserId = loginUserId;
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
	public boolean isLocked() {
		return locked;
	}
	public void setLocked(boolean locked) {
		this.locked = locked;
	}
	public RoleEnum getRole() {
		return role;
	}
	public void setRole(RoleEnum role) {
		this.role = role;
	}
}
