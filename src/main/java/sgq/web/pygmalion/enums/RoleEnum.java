package sgq.web.pygmalion.enums;

import java.util.Arrays;
import java.util.HashSet;

public enum RoleEnum {
	ADMIN(1, new PrivilegeEnum[]{PrivilegeEnum.EDIT_ARTICLE, PrivilegeEnum.DELETE_ARTICLE, PrivilegeEnum.PUBLISH_ARTICLE}),
	MANAGER(2, new PrivilegeEnum[]{PrivilegeEnum.EDIT_ARTICLE, PrivilegeEnum.PUBLISH_ARTICLE}),
	USER(300, new PrivilegeEnum[]{});
	private final int code;
	private final HashSet<PrivilegeEnum> privileges;
	RoleEnum(int code, PrivilegeEnum[] privileges) {
		this.code = code;
		this.privileges = new HashSet<PrivilegeEnum>(Arrays.asList(privileges));
	}
	public boolean containsPrivilege(PrivilegeEnum testPrivilege) {
		return this.privileges.contains(testPrivilege);
	}
	public int code() {
		return this.code;
	}
	public int identifier() {
		return this.code;
	}
	public static RoleEnum getEnum(int code) {
		for (RoleEnum en: RoleEnum.values()) {
			if (en.code == code) return en;
		}
		return null;
	}
}
