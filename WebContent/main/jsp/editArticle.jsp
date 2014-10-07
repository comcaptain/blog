<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE>
<html>
<head>
<s:include value="/common/jsp/common_header.jsp"></s:include>
<link rel="stylesheet" type="text/css" href="<s:url value="./main/css/editArticle.css"/>">
<script type="text/javascript" src="<s:url value="./common/js/stmd.js"/>"></script>
<script type="text/javascript" src="<s:url value="./main/js/editArticle.js"/>"></script>
<title><s:property value="article.title" /></title>
</head>
<body>
	<s:hidden name="model.articleId" id="articleId"></s:hidden>
	<div id="statusBar">
		<span id="cursorPosition">行<span id="rowNo"></span>，列<span id="columnNo"></span></span>
		<span id="messageArea"></span>
		<span class="glyphicon glyphicon-home navigation-item"></span>
		<span class="glyphicon glyphicon-pencil navigation-item"></span>
		<span class="glyphicon glyphicon-user navigation-item"></span>
	</div>
	<div id="left" class="col-md-6">
		<s:textfield name="model.title" id="title"></s:textfield>
		<s:textarea id="content" name="model.markdown"></s:textarea>
	</div>
	<div id="right" class="col-md-6">
		<div id="preview">
		<h1 id="title_preview"></h1>
		<div id="content_preview"></div>
		</div>
	</div>
</body>
</html>