<%@ taglib prefix="s" uri="/struts-tags" %>
<ul id="navigation" class="${param.extraClass}">
	<li>
		<s:a value="home"><span class="glyphicon glyphicon-home navigation-item"></span></s:a>
	</li>
	<li>
		<s:a value="newArticle"><span class="glyphicon glyphicon-pencil navigation-item"></span></s:a>
	</li>
	<li>
		<s:a value="user"><span class="glyphicon glyphicon-user navigation-item"></span></s:a>
	</li>
</ul>