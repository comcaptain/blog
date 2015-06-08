<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE>
<html>
<head>
<s:include value="/common/jsp/common_header.jsp"></s:include>
<script type="text/javascript" src="main/js/main.js"></script>
<link rel="stylesheet" type="text/css" href="main/css/main.css">
<link rel="stylesheet" type="text/css" href="common/css/timeline.css">
<title>PYGMALION - <s:property value="title" /></title>
</head>
<body>
<header class="page-header" id="titleArea">
	<s:include value="/common/jsp/navigation.jsp">
		<s:param name="extraClass">vertical-navigation</s:param>
	</s:include>
	<div id="flipSensor"></div>
	<section id="flipContainer">
	<div id="imageFlipper">
		<img id="headImage" class="front" src="<s:url value="main/images/head.jpg" />" />
		<div class="back">
			<div id="backContent" class="container">
				<address id="authorInfo">
					<p>Author: Sun Guoqiang</p>
					<p>Email: master@pygmalion.click</p>
				</address>
			</div>
		</div>
	</div>
	</section>
</header>
<div class="container" id="container">
<%@include file="timeline.jsp"%>
</div>
</body>
</html>