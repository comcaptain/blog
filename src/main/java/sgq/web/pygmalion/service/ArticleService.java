package sgq.web.pygmalion.service;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import sgq.web.pygmalion.bean.Article;
import sgq.web.pygmalion.bean.ArticleDailyGroup;
import sgq.web.pygmalion.bean.ArticleMonthlyGroup;
import sgq.web.pygmalion.bean.User;
import sgq.web.pygmalion.dao.ArticleDao;
import sgq.web.pygmalion.util.SessionUtil;

public class ArticleService {
	private ArticleDao articleDao;
	public static final int PAGE_ITEM_COUNT = 20;

	public ArticleDao getArticleDao() {
		return articleDao;
	}

	public void setArticleDao(ArticleDao articleDao) {
		this.articleDao = articleDao;
	}
	
	public Article getArticleById(int articleId) {
		return this.articleDao.getArticleById(articleId);
	}
	
	public List<ArticleMonthlyGroup> getThumbnailGroupsOfRecentArticles(int page) {
		List<Article> articles = this.articleDao.getThumbnailList((page - 1) * PAGE_ITEM_COUNT, PAGE_ITEM_COUNT);
		return this.groupThrumbnails(articles);
	}
	
	public Article save(Article article) {
		User author = new User();
		author.setUserId(SessionUtil.getCurrentUserId());
		if (article.getArticleId() == 0) article.setAuthor(author);
		return this.articleDao.saveArticle(article);
	}

	public void deleteArticle(int id) {
		this.articleDao.deleteArticle(id);
	}

	private List<ArticleMonthlyGroup> groupThrumbnails(List<Article> thumbnails) {
		List<ArticleMonthlyGroup> monthlyGroupList = new LinkedList<ArticleMonthlyGroup>();
		if (thumbnails == null || thumbnails.size() == 0) return monthlyGroupList;
		Calendar date = GregorianCalendar.getInstance();
		date.setTime(thumbnails.get(0).getCreateTime());
		int year = date.get(Calendar.YEAR);
		int month = date.get(Calendar.MONTH);
		int day = date.get(Calendar.DAY_OF_MONTH);
		List<ArticleDailyGroup> dailyGroupList = new LinkedList<ArticleDailyGroup>();
		List<Article> dailyThumbnailsList = new LinkedList<Article>();
		Iterator<Article> iterator = thumbnails.iterator();
		while (iterator.hasNext()) {
			Article article = iterator.next();
			Calendar currentDate = GregorianCalendar.getInstance();
			currentDate.setTime(article.getCreateTime());
			boolean isSameYear = currentDate.get(Calendar.YEAR) == year;
			boolean isSameMonth = currentDate.get(Calendar.MONTH) == month;
			boolean isSameDay = currentDate.get(Calendar.DAY_OF_MONTH) == day;
			if (isSameYear && isSameMonth && isSameDay) {
				dailyThumbnailsList.add(article);
			}
			else {
				dailyGroupList.add(new ArticleDailyGroup(dailyThumbnailsList, day));
				dailyThumbnailsList = new LinkedList<Article>();
				dailyThumbnailsList.add(article);
				day = currentDate.get(Calendar.DAY_OF_MONTH);
			}
			if (!isSameYear || !isSameMonth) {
				monthlyGroupList.add(new ArticleMonthlyGroup(dailyGroupList, year, month + 1));
				dailyGroupList = new LinkedList<ArticleDailyGroup>();
				dailyThumbnailsList = new LinkedList<Article>();
				dailyThumbnailsList.add(article);
				day = currentDate.get(Calendar.DAY_OF_MONTH);
				month = currentDate.get(Calendar.MONTH);
				year = currentDate.get(Calendar.YEAR);
			}
		}
		if (dailyThumbnailsList.size() > 0) {
			dailyGroupList.add(new ArticleDailyGroup(dailyThumbnailsList, day));
		}
		if (dailyGroupList.size() > 0) {
			monthlyGroupList.add(new ArticleMonthlyGroup(dailyGroupList, year, month + 1));
		}
		return monthlyGroupList;
	}
}