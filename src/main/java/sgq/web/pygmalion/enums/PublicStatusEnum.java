package sgq.web.pygmalion.enums;

public enum PublicStatusEnum {
	PRIVATE(0, "private"),
	PUBLIC(1, "public"),
	PUBLISHED(2, "publish");
	private final int code;
	private final String name;
	PublicStatusEnum(int code, String name) {
		this.code = code;
		this.name = name;
	}
	public int getCode() {
		return this.code;
	}
	public String getName() {
		return this.name;
	}
	public int code() {
		return this.code;
	}
	public int identifier() {
		return this.code;
	}
	public static PublicStatusEnum getEnum(int code) {
		for (PublicStatusEnum en: PublicStatusEnum.values()) {
			if (en.code == code) return en;
		}
		return null;
	}
}
