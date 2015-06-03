<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ page import="sgq.web.pygmalion.enums.PublicStatusEnum" %>
<%@ taglib prefix="s" uri="/struts-tags" %>
<%
String publicStatusStr = request.getParameter("publicStatus");
String publicStatusClass = "";
try {
	int publicStatus = Integer.parseInt(publicStatusStr);
	if (publicStatus == PublicStatusEnum.PUBLISHED.code()) {
		publicStatusClass = "published";
	}
	else if (publicStatus == PublicStatusEnum.PUBLIC.code()) {
		publicStatusClass = "public";
	}
	else {
		publicStatusClass = "private";
	}
}
catch (Exception e) {
	
}
pageContext.setAttribute("publicStatusClass", publicStatusClass);
pageContext.setAttribute("showEdit", "true".equals(request.getParameter("showEdit")));
pageContext.setAttribute("showDelete", "true".equals(request.getParameter("showDelete")));
pageContext.setAttribute("showArticle", "true".equals(request.getParameter("showArticle")));
pageContext.setAttribute("showPublicStatus", "true".equals(request.getParameter("showPublicStatus")));
%>
<nav class="${param.extraClass}">
	<ul>
		<li style="position: relative; left: -2px;" class="navigation-item">
			<s:a value="home" title="首页"><span class="glyphicon glyphicon-home navigation-icon"></span></s:a>
		</li>
		<s:if test="%{createArticleEnabled}">
		<li class="navigation-item">
			<s:a value="igloo" title="私人领地"><span class="glyphicon glyphicon-tint navigation-icon"></span></s:a>
		</li>
		<li class="navigation-item">
			<s:a value="newArticle" title="发表文章"><span class="glyphicon glyphicon-file navigation-icon"></span></s:a>
		</li>
		</s:if>
		<s:if test="%{#attr.showEdit}">
		<li class="navigation-item">
			<a href="editArticle?id=${param.navArticleId}" title="编辑"><span class="glyphicon glyphicon-edit navigation-icon"></span></a>
		</li>
		</s:if>
		<s:if test="%{#attr.showDelete}">
		<li class="navigation-item">
			<a id="deleteArticle" class="confirm" href="deleteArticle?id=${param.navArticleId}" title="删除"><span class="glyphicon glyphicon-trash navigation-icon"></span></a>
		</li>
		</s:if>
		<s:if test="%{#attr.showPublicStatus}">
		<li class="navigation-item">
			<a id="updatePublicStatus" href="javascript:;" class="${publicStatusClass}" articleId="${param.navArticleId}" publicStatus="${param.publicStatus}" publishable="${param.publishable}">
			<span class="glyphicon glyphicon-leaf navigation-icon ${publishClass}"></span>
			</a>
			<ul class="popup" id="publishPopup">
			</ul>
		</li>
		</s:if>
		<s:if test="%{#attr.showArticle}">
		<li class="navigation-item">
			<a id="navToArticle" href="article?id=${param.navArticleId}" title="查看文章"><span class="glyphicon glyphicon-flash navigation-icon"></span></a>
		</li>
		</s:if>
		<li class="navigation-item">
			<a href="mailto:master@pygmalion.click" title="联系我"><span class="glyphicon glyphicon-envelope navigation-icon"></span></a>
		</li>
	</ul>
</nav>