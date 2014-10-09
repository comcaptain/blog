<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE>
<html>
<head>
<s:include value="/common/jsp/common_header.jsp"></s:include>
<link rel="stylesheet" type="text/css" href="./main/css/article.css">
<title><s:property value="article.title" /></title>
</head>
<body>
<div class="container full-height" id="container">
	<s:include value="/common/jsp/navigation.jsp">
		<s:param name="extraClass">vertical-navigation</s:param>
		<s:param name="navArticleId"><s:property value="model.articleId" /></s:param>
	</s:include>
	<h1 id="title"><s:property value="model.title" /></h1>
	<div id="author"><s:property value="model.author.userName" /></div>
	<div id="content">
		<div id="contentContainer"><s:property escapeHtml="false" value="model.content" /></div>
		<div id="timeBox">
			<div id="createTime"><small class="text-muted timestamp">创建时间 <s:date name="model.createTime" format="yyyy.MM.dd HH:mm:ss" /></small></div>
			<div id="updateTime"><small class="text-muted timestamp">更新时间 <s:date name="model.updateTime" format="yyyy.MM.dd HH:mm:ss" /></small></div>
		</div>
	</div>
</div>
</body>
</html>