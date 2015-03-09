package sgq.web.console.service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import sgq.web.console.dao.WordsetDao;
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
}
