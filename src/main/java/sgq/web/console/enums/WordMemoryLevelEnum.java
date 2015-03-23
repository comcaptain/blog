package sgq.web.console.enums;

public enum WordMemoryLevelEnum {
	RAW(0),
	FIRST_BLOOD(1),
	DAY_1(2),
	DAY_2(3),
	DAY_4(4),
	DAY_7(5),
	DAY_15(6),
	DAY_30(7),
	COOKED(-1);
	public final int code;
	WordMemoryLevelEnum(int code) {
		this.code = code;
	}
	public static WordMemoryLevelEnum getEnum(int code) {
		for (WordMemoryLevelEnum en: WordMemoryLevelEnum.values()) {
			if (en.code == code) return en;
		}
		return null;
	}
	public int identifier() {
		return this.code;
	}
}
