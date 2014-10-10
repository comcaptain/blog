<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<s:set name="showEdit">0${param.showEdit}</s:set>
<s:set name="showDelete">0${param.showDelete}</s:set>
<s:set name="showArticle">0${param.showArticle}</s:set>
<ul id="navigation" class="${param.extraClass}">
	<li>
		<s:a value="home" title="首页"><span class="glyphicon glyphicon-home navigation-item"></span></s:a>
	</li>
	<li>
		<s:a value="newArticle" title="发表文章"><span class="glyphicon glyphicon-file navigation-item"></span></s:a>
	</li>
	<li>
		<s:a value="user" title="用户中心"><span class="glyphicon glyphicon-user navigation-item"></span></s:a>
	</li>
	<s:if test="%{#showEdit != 0}">
	<li>
		<a href="editArticle?id=${param.navArticleId}" title="编辑"><span class="glyphicon glyphicon-edit navigation-item"></span></a>
	</li>
	</s:if>
	<s:if test="%{#showDelete != 0}">
	<li>
		<a id="deleteArticle" class="confirm" href="deleteArticle?id=${param.navArticleId}" title="删除"><span class="glyphicon glyphicon-trash navigation-item"></span></a>
	</li>
	</s:if>
	<s:if test="%{#showArticle != 0}">
	<li>
		<a id="deleteArticle" href="article?id=${param.navArticleId}" title="查看文章"><span class="glyphicon glyphicon-flash navigation-item"></span></a>
	</li>
	</s:if>
</ul>