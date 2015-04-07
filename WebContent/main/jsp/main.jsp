<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE>
<html>
<head>
<s:include value="/common/jsp/common_header.jsp"></s:include>
<link rel="stylesheet" type="text/css" href="main/css/main.css">
<link rel="stylesheet" type="text/css" href="common/css/timeline.css">
<title>PYGMALION - <s:property value="title" /></title>
</head>
<body>
<div class="page-header" id="titleArea">
	<s:include value="/common/jsp/navigation.jsp">
		<s:param name="extraClass">vertical-navigation</s:param>
	</s:include>
	<img id="headImage" src="<s:url value="main/images/head.jpg" />" />
</div>
<div class="container" id="container">
<ul class="timeline">
<s:set var="isEven" value="false" />
<s:iterator var="thumbnailMonthlyGroup" value="thumbnailMonthlyGroups">
	<s:iterator var="dailyGroup" value="#thumbnailMonthlyGroup.dailyGroups">
		<s:iterator var="thumbnail" status="rowstatus" value="#dailyGroup.thumbnails">
	<li <s:if test="%{#isEven}">class="timeline-inverted"</s:if> >
		<s:if test="%{#rowstatus.isFirst()}">
		<div class="timeline-badge timeline-day-badge"><s:property value="#dailyGroup.label" /></div>
		</s:if>
		<div class="timeline-panel">
			<div class="timeline-heading">
				<h4 class="timeline-title"><a href="<s:url value='article?id=%{#thumbnail.articleId}' />"><s:property value="#thumbnail.title" /></a></h4>
				<p><small class="text-muted"><i class="glyphicon glyphicon-time" title="最后修改"></i> <s:date name="#thumbnail.updateTime" format="yyyy.MM.dd hh:mm:ss" /></small></p>
			</div>
			<div class="timeline-body">
				<s:property value="#thumbnail.thumbnail" />
			</div>
		</div>
	</li>
	<s:set var="isEven" value="%{!#isEven}" />
		</s:iterator>
	</s:iterator>
	<li>
		<div class="timeline-badge timeline-seperator-badge"><s:property value="#thumbnailMonthlyGroup.label" /></div>
	</li>
</s:iterator>
</ul>
</div>
</body>
</html>