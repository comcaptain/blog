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
import sgq.web.pygmalion.enums.PrivilegeEnum;
import sgq.web.pygmalion.enums.PublicStatusEnum;
import sgq.web.pygmalion.exception.PrivilegeException;
import sgq.web.pygmalion.model.ArticleModel;
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
	
	public List<Article> getPublishedArticles(int page) {
		return this.articleDao.getPublishedThumbnailList((page - 1) * PAGE_ITEM_COUNT, PAGE_ITEM_COUNT);
	}
	
	public List<Article> getPrivateArticles(int page) {
		return this.articleDao.getPrivateThumbnailList((page - 1) * PAGE_ITEM_COUNT, PAGE_ITEM_COUNT);
	}
	
	public Article save(ArticleModel articleData) throws PrivilegeException {
		Article article = null;
		if (articleData.getArticleId() == 0) {
			article = articleData.getNewArticle();
			User author = new User();
			author.setUserId(SessionUtil.getCurrentUserId());
			article.setAuthor(author);
		}
		else {
			Article articleInDB = this.getArticleById(articleData.getArticleId());
			if (!this.canEditArticle(articleInDB)) {
				throw new PrivilegeException(SessionUtil.getCurrentUserId() + " wants to edit article " + articleData.getArticleId() + " illegally!");
			}
			articleData.mergeArticle(articleInDB);
			article = articleInDB;
		}
		return this.articleDao.saveArticle(article);
	}

	public void deleteArticle(int id) throws PrivilegeException {
		if (!this.canDeleteArticle(id)) {
			throw new PrivilegeException(SessionUtil.getCurrentUserId() + " wants to delete article " + id + " illegally!");
		}
		this.articleDao.deleteArticle(id);
	}
	
	public boolean canDeleteArticle(int articleId) {
		Article article = this.getArticleById(articleId);
		if (article.getAuthor().getUserId() == SessionUtil.getCurrentUserId()) return true;
		if (SessionUtil.getRole().containsPrivilege(PrivilegeEnum.DELETE_ARTICLE)) return true;
		return false;
	}
	
	public boolean canEditArticle(int articleId) {
		Article article = this.getArticleById(articleId);
		return this.canEditArticle(article);
	}
	
	public boolean canEditArticle(Article article) {
		if (article.getAuthor().getUserId() == SessionUtil.getCurrentUserId()) return true;
		if (SessionUtil.getRole().containsPrivilege(PrivilegeEnum.EDIT_ARTICLE)) return true;
		return false;
	}

	public List<ArticleMonthlyGroup> groupThumbnails(List<Article> thumbnails) {
		List<ArticleMonthlyGroup> monthlyGroupList = new LinkedList<ArticleMonthlyGroup>();
		if (thumbnails == null || thumbnails.size() == 0) return monthlyGroupList;
		Calendar date = GregorianCalendar.getInstance();
		date.setTime(thumbnails.get(0).getUpdateTime());
		int year = date.get(Calendar.YEAR);
		int month = date.get(Calendar.MONTH);
		int day = date.get(Calendar.DAY_OF_MONTH);
		List<ArticleDailyGroup> dailyGroupList = new LinkedList<ArticleDailyGroup>();
		List<Article> dailyThumbnailsList = new LinkedList<Article>();
		Iterator<Article> iterator = thumbnails.iterator();
		while (iterator.hasNext()) {
			Article article = iterator.next();
			Calendar currentDate = GregorianCalendar.getInstance();
			currentDate.setTime(article.getUpdateTime());
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

	public Article updatePublicStatus(int articleId, PublicStatusEnum newPublicStatus) throws PrivilegeException {
		if (!SessionUtil.getRole().containsPrivilege(PrivilegeEnum.PUBLISH_ARTICLE) && newPublicStatus == PublicStatusEnum.PUBLISHED) {
			throw new PrivilegeException(SessionUtil.getCurrentUserId() + " wants to illegally publish article [" + articleId + "]");
		}
		Article article = this.articleDao.getArticleById(articleId);
		article.setPublicStatus(newPublicStatus);
		article = this.articleDao.saveArticle(article);
		return article;
	}
}