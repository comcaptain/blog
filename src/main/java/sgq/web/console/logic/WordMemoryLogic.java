package sgq.web.console.logic;

import java.sql.Date;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;

import sgq.web.console.enums.WordMemoryLevel;

public class WordMemoryLogic {
	private static final WordMemoryLevel[] levels = {WordMemoryLevel.RAW, WordMemoryLevel.FIRST_BLOOD, 
		WordMemoryLevel.DAY_1, WordMemoryLevel.DAY_2, WordMemoryLevel.DAY_4, WordMemoryLevel.DAY_7, WordMemoryLevel.DAY_15, WordMemoryLevel.DAY_30, WordMemoryLevel.COOKED};
	private static final Map<WordMemoryLevel, Integer> gaps = generateGaps();
	public static Map<WordMemoryLevel, Integer> generateGaps() {
		Map<WordMemoryLevel, Integer> gaps = new HashMap<WordMemoryLevel, Integer>();
		gaps.put(WordMemoryLevel.FIRST_BLOOD, 1);
		gaps.put(WordMemoryLevel.DAY_1, 2);
		gaps.put(WordMemoryLevel.DAY_2, 4);
		gaps.put(WordMemoryLevel.DAY_4, 7);
		gaps.put(WordMemoryLevel.DAY_7, 15);
		gaps.put(WordMemoryLevel.DAY_15, 30);
		return gaps;
	}
	public static final WordMemoryLevel getNextLevel(WordMemoryLevel currentLevel) {
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
	public static final Date getNextReviewDate(WordMemoryLevel currentLevel) {
		Calendar nextReviewDate = GregorianCalendar.getInstance();
		nextReviewDate.roll(Calendar.DATE, gaps.get(currentLevel));
		return new Date(nextReviewDate.getTimeInMillis());
	}
}
