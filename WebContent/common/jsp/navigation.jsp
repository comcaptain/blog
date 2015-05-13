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
	<s:if test="%{#attr.showEdit}">
	<li>
		<a href="editArticle?id=${param.navArticleId}" title="编辑"><span class="glyphicon glyphicon-edit navigation-item"></span></a>
	</li>
	</s:if>
	<s:if test="%{#attr.showDelete}">
	<li>
		<a id="deleteArticle" class="confirm" href="deleteArticle?id=${param.navArticleId}" title="删除"><span class="glyphicon glyphicon-trash navigation-item"></span></a>
	</li>
	</s:if>
	<s:if test="%{#attr.showPublicStatus}">
	<li>
		<a id="updatePublicStatus" href="javascript:;" class="${publicStatusClass}" articleId="${param.navArticleId}" publicStatus="${param.publicStatus}" publishable="${param.publishable}">
		<span class="glyphicon glyphicon-leaf navigation-item ${publishClass}"></span>
		</a>
		<ul class="popup" id="publishPopup">
		</ul>
	</li>
	</s:if>
	<s:if test="%{#attr.showArticle}">
	<li>
		<a id="navToArticle" href="article?id=${param.navArticleId}" title="查看文章"><span class="glyphicon glyphicon-flash navigation-item"></span></a>
	</li>
	</s:if>
	<li>
		<a href="mailto:master@pygmalion.click" title="联系我"><span class="glyphicon glyphicon-envelope navigation-item"></span></a>
	</li>
</ul>