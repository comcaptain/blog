<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<s:set var="isEven" value="false" />
<s:iterator var="thumbnailMonthlyGroup" value="thumbnailMonthlyGroups">
	<s:iterator var="dailyGroup" value="#thumbnailMonthlyGroup.dailyGroups">
		<s:iterator var="thumbnail" status="rowstatus" value="#dailyGroup.thumbnails">
	<li <s:if test="%{#isEven}">class="timeline-inverted"</s:if> >
		<s:if test="%{#rowstatus.isFirst()}">
		<div class="timeline-badge timeline-day-badge"><s:property value="#dailyGroup.label" /></div>
		</s:if>
		<section class="timeline-panel">
			<header class="timeline-heading">
				<h4 class="timeline-title"><a href="<s:url value='article?id=%{#thumbnail.articleId}' />"><s:property value="#thumbnail.title" /></a></h4>
				<p class="text-muted small">
					<span class="glyphicon glyphicon-time" title="最后修改"></span>
					<time datetime="<s:date name="#thumbnail.updateTime" format="yyyy.MM.dd HH:mm:ss" />"><s:date name="#thumbnail.updateTime" format="yyyy.MM.dd HH:mm:ss" /></time>
				</p>
			</header>
			<div class="timeline-body">
				<s:property value="#thumbnail.thumbnail" />
			</div>
		</section>
	</li>
	<s:set var="isEven" value="%{!#isEven}" />
		</s:iterator>
	</s:iterator>
	<li>
		<div class="timeline-badge timeline-seperator-badge"><s:property value="#thumbnailMonthlyGroup.label" /></div>
	</li>
</s:iterator>