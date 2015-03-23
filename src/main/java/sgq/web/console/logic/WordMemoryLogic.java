package sgq.web.console.logic;

import java.sql.Date;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;

import sgq.web.console.enums.WordMemoryLevelEnum;

public class WordMemoryLogic {
	private static final WordMemoryLevelEnum[] levels = {WordMemoryLevelEnum.RAW, WordMemoryLevelEnum.FIRST_BLOOD, 
		WordMemoryLevelEnum.DAY_1, WordMemoryLevelEnum.DAY_2, WordMemoryLevelEnum.DAY_4, WordMemoryLevelEnum.DAY_7, WordMemoryLevelEnum.DAY_15, WordMemoryLevelEnum.DAY_30, WordMemoryLevelEnum.COOKED};
	private static final Map<WordMemoryLevelEnum, Integer> gaps = generateGaps();
	public static Map<WordMemoryLevelEnum, Integer> generateGaps() {
		Map<WordMemoryLevelEnum, Integer> gaps = new HashMap<WordMemoryLevelEnum, Integer>();
		gaps.put(WordMemoryLevelEnum.FIRST_BLOOD, 1);
		gaps.put(WordMemoryLevelEnum.DAY_1, 2);
		gaps.put(WordMemoryLevelEnum.DAY_2, 4);
		gaps.put(WordMemoryLevelEnum.DAY_4, 7);
		gaps.put(WordMemoryLevelEnum.DAY_7, 15);
		gaps.put(WordMemoryLevelEnum.DAY_15, 30);
		return gaps;
	}
	public static final WordMemoryLevelEnum getNextLevel(WordMemoryLevelEnum currentLevel) {
		for (int i = 0; i < levels.length; i++) {
			if (levels[i] == currentLevel) {
				if (i + 1 < levels.length) {
					return levels[i + 1];
				}
				return null;
			}
		}
		return null;
	}
	public static final Date getNextReviewDate(WordMemoryLevelEnum currentLevel) {
		Calendar nextReviewDate = GregorianCalendar.getInstance();
		nextReviewDate.roll(Calendar.DATE, gaps.get(currentLevel));
		return new Date(nextReviewDate.getTimeInMillis());
	}
}
