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
<div class="container" id="container">
	<div id="controlLayer">
		<a href="<s:url value="/editArticle?id=%{article.articleId}" />">[编辑]</a>
		<a href="<s:url value="/deleteArticle?id=%{article.articleId}" />">[删除]</a>
	</div>
	<h1 id="title"><s:property value="article.title" /></h1>
	<div id="author">by <s:property value="article.author.userName" /></div>
	<div id="content">
		<div id="contentContainer"><s:property value="article.content" /></div>
		<div id="timeBox">
			<div id="createTime"><small class="text-muted">创建时间 <s:date name="article.createTime" format="yyyy.MM.dd hh:mm:ss" /></small></div>
			<div id="updateTime"><small class="text-muted">更新时间 <s:date name="article.updateTime" format="yyyy.MM.dd hh:mm:ss" /></small></div>
		</div>
	</div>
</div>
</body>
</html>