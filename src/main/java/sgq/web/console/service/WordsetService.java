package sgq.web.console.service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import sgq.web.console.dao.WordsetDao;
import sgq.web.console.model.WordModel;
import sgq.web.pygmalion.bean.Wordset;

import com.google.gson.Gson;

public class WordsetService {
	private WordsetDao wordsetDao;

	public WordsetDao getWordsetDao() {
		return wordsetDao;
	}

	public void setWordsetDao(WordsetDao wordsetDao) {
		this.wordsetDao = wordsetDao;
	}
	
	public String retrieveWordSetListInJSON() {
		List<Object> json = new LinkedList<Object>();
		for (Wordset wordset: wordsetDao.selectAllWordset()) { 
			Map<String, Object> wordsetJson = new HashMap<String, Object>();
			wordsetJson.put("wordSetId", wordset.getWordsetId());
			wordsetJson.put("name", wordset.getName());
			wordsetJson.put("description", wordset.getDescription());
			json.add(wordsetJson);
		}
		return new Gson().toJson(json);
	}

	public String retrieveReviewWordListInJSON(int wordSetId) {
		return this.convertWordModelListToJSON(wordsetDao.selectReviewWordList(wordSetId));
	}

	public String retrieveRawWordListInJSON(int wordSetId) {
		return this.convertWordModelListToJSON(wordsetDao.selectRawWordList(wordSetId));
	}
	
	private String convertWordModelListToJSON(List<WordModel> words) {
		List<Object> json = new LinkedList<Object>();
		for (WordModel word: words) { 
			Map<String, Object> wordJson = new HashMap<String, Object>();
			wordJson.put("jpWordId", word.getJpWordId());
			wordJson.put("hiragana", word.getHiragana());
			wordJson.put("kanji", word.getKanji());
			wordJson.put("chinese", word.getChinese());
			wordJson.put("level", word.getLevel());
			wordJson.put("nextReviewDate", word.getNextReviewDate());
			wordJson.put("passCount", word.getPassCount());
			wordJson.put("failCount", word.getFailCount());
			wordJson.put("notSureCount", word.getNotSureCount());
			json.add(wordJson);
		}
		return new Gson().toJson(json);
	}
}
