package sgq.web.pygmalion.enums;

import java.util.Arrays;
import java.util.HashSet;

public enum UserType {
	ADMIN(1, new PrivilegeEnum[]{PrivilegeEnum.EDIT_ARTICLE, PrivilegeEnum.CREATE_ARTICLE, PrivilegeEnum.DELETE_ARTICLE}),
	MANAGER(2, new PrivilegeEnum[]{PrivilegeEnum.EDIT_ARTICLE});
	private final int code;
	private final HashSet<PrivilegeEnum> privileges;
	UserType(int code, PrivilegeEnum[] privileges) {
		this.code = code;
		this.privileges = new HashSet<PrivilegeEnum>(Arrays.asList(privileges));
	}
	public boolean containsPrivilege(PrivilegeEnum testPrivilege) {
		return this.privileges.contains(testPrivilege);
	}
	public int code() {
		return this.code;
	}
}
