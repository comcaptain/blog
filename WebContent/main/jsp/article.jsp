<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE>
<html>
<head>
<s:include value="/common/jsp/common_header.jsp"></s:include>
<link rel="stylesheet" type="text/css" href="main/css/article.css">
<title><s:property value="model.title" /></title>
</head>
<body>
<div class="container full-height" id="container">
	<s:include value="/common/jsp/navigation.jsp">
		<s:param name="extraClass">vertical-navigation</s:param>
		<s:param name="navArticleId"><s:property value="model.articleId" /></s:param>
		<s:param name="showCreate"><s:property value="model.creatable" /></s:param>
		<s:param name="showEdit"><s:property value="model.editable" /></s:param>
		<s:param name="showDelete"><s:property value="model.deletable" /></s:param>
		<s:param name="showPublicStatus"><s:property value="model.editable" /></s:param>
		<s:param name="publishable"><s:property value="model.publishable" /></s:param>
		<s:param name="publicStatus"><s:property value="model.publicStatus" /></s:param>
	</s:include>
	<article>
		<header>
			<h1 id="title"><s:property value="model.title" /></h1>
			<div id="author"><s:property value="model.author.userName" /></div>
		</header>
		<div id="contentContainer">
			<s:property escapeHtml="false" value="model.content" />
			<div id="timeBox">
				<div id="createTime" class="text-muted timestamp">创建时间 <time datetime="<s:date name="model.createTime" format="yyyy.MM.dd HH:mm:ss" />" pubdate><s:date name="model.createTime" format="yyyy.MM.dd HH:mm:ss" /></time></div>
				<div id="updateTime" class="text-muted timestamp">更新时间 <time datetime="<s:date name="model.updateTime" format="yyyy.MM.dd HH:mm:ss" />"><s:date name="model.updateTime" format="yyyy.MM.dd HH:mm:ss" /></time></div>
			</div>
		</div>
	</article>
</div>
</body>
</html>