package sgq.web.pygmalion.enums;

public enum PrivilegeEnum {
	EDIT_ARTICLE(1, "edit article"),
	DELETE_ARTICLE(2, "delete article");
	private final int code;
	private final String name;
	PrivilegeEnum(int code, String name) {
		this.code = code;
		this.name = name;
	}
	public int getCode() {
		return this.code;
	}
	public String getName() {
		return this.name;
	}
}
