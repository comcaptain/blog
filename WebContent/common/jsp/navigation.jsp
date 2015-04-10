<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<s:set name="showEdit">hidden${param.showEdit}</s:set>
<s:set name="showDelete">hidden${param.showDelete}</s:set>
<s:set name="showArticle">hidden${param.showArticle}</s:set>
<s:set name="showPublish">hidden${param.showPublish}</s:set>
<%
boolean isPublished = Boolean.parseBoolean(request.getParameter("isPublished"));
pageContext.setAttribute("publishClass", isPublished ? "marked" : "");
pageContext.setAttribute("publishTitle", isPublished ? "取消发表" : "发表");
%>
<ul id="navigation" class="${param.extraClass}">
	<li style="position: relative; left: -2px;">
		<s:a value="home" title="首页"><span class="glyphicon glyphicon-home navigation-item"></span></s:a>
	</li>
	<s:if test="%{createArticleEnabled}">
	<li>
		<s:a value="igloo" title="私人领地"><span class="glyphicon glyphicon-tint navigation-item"></span></s:a>
	</li>
	<li>
		<s:a value="newArticle" title="发表文章"><span class="glyphicon glyphicon-file navigation-item"></span></s:a>
	</li>
	</s:if>
	<s:if test="%{#showEdit != 'hidden' && #showEdit != 'hiddenfalse'}">
	<li>
		<a href="editArticle?id=${param.navArticleId}" title="编辑"><span class="glyphicon glyphicon-edit navigation-item"></span></a>
	</li>
	</s:if>
	<s:if test="%{#showDelete != 'hidden' && #showDelete != 'hiddenfalse'}">
	<li>
		<a id="deleteArticle" class="confirm" href="deleteArticle?id=${param.navArticleId}" title="删除"><span class="glyphicon glyphicon-trash navigation-item"></span></a>
	</li>
	</s:if>
	<s:if test="%{#showPublish != 'hidden' && #showPublish != 'hiddenfalse'}">
	<li>
		<a id="publishArticle" href="javascript:void" articleId="${param.navArticleId}" title="${publishTitle}"><span class="glyphicon glyphicon-leaf navigation-item ${publishClass}"></span></a>
	</li>
	</s:if>
	<s:if test="%{#showArticle != 'hidden' && #showArticle != 'hiddenfalse'}">
	<li>
		<a id="navToArticle" href="article?id=${param.navArticleId}" title="查看文章"><span class="glyphicon glyphicon-flash navigation-item"></span></a>
	</li>
	</s:if>
	<li>
		<a href="mailto:master@pygmalion.click" title="联系我"><span class="glyphicon glyphicon-envelope navigation-item"></span></a>
	</li>
</ul>