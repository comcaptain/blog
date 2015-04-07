<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE>
<html>
<head>
<script type="text/javascript">
var articleId = '<s:property value="model.articleId" />';
var updateTime = '<s:date name="model.updateTime" format="yyyy.MM.dd HH:mm:ss" />';
</script>
<s:include value="/common/jsp/common_header.jsp"></s:include>
<link rel="stylesheet" type="text/css" href="main/css/editArticle.css">
<script type="text/javascript" src="common/js/stmd.js"></script>
<script type="text/javascript" src="main/js/editArticle.js"></script>
<title>
	<s:if test="%{model == null}">New Article</s:if>
	<s:else><s:property value="model.title" /></s:else>
</title>
</head>
<body>
	<div id="statusBar">
		<s:include value="/common/jsp/navigation.jsp">
			<s:param name="extraClass">horizontal-navigation</s:param>
			<s:param name="navArticleId"><s:property value="model.articleId" /></s:param>
			<s:param name="showArticle"><s:property value="model.editable" /></s:param>
			<s:param name="showDelete"><s:property value="model.deletable" /></s:param>
			<s:param name="showPublish"><s:property value="model.publishable" /></s:param>
			<s:param name="isPublished"><s:property value="model.published" /></s:param>
		</s:include>
		<span id="cursorPosition">行<span id="rowNo"></span>，列<span id="columnNo"></span></span>
		<span id="messageArea"></span>	
	</div>
	<div id="left" class="col-md-6">
		<s:textfield name="model.title" id="title"></s:textfield>
		<s:textarea spellcheck="false" id="content" name="model.markdown"></s:textarea>
	</div>
	<div id="right" class="col-md-6">
		<div id="preview">
		<h1 id="title_preview"></h1>
		<div id="content_preview"></div>
		</div>
	</div>
</body>
</html>