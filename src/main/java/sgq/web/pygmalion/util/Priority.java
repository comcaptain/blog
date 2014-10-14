package sgq.web.pygmalion.util;

public enum Priority {
	Admin(1),
	Normal(100);
	private final int code;
	Priority(int code) {
		this.code = code;
	}
	public int getCode() {
		return code;
	}
}
