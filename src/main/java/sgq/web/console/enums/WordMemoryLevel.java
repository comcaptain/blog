package sgq.web.console.enums;

public enum WordMemoryLevel {
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
	WordMemoryLevel(int code) {
		this.code = code;
	}
	public static WordMemoryLevel getEnum(int code) {
		for (WordMemoryLevel en: WordMemoryLevel.values()) {
			if (en.code == code) return en;
		}
		return null;
	}
}
