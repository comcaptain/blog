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
	<div id="statusBar">
		<span id="cursorPosition">行<span id="rowNo"></span>，列<span id="columnNo"></span></span>
	</div>
	<div id="left" class="col-md-6">
		<s:textfield name="model.title" id="title"></s:textfield>
		<textarea id="content"><s:text name="model.content"></s:text></textarea>
	</div>
	<div id="right" class="col-md-6">
		<div id="preview"></div>
	</div>
</body>
</html>