<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>CMD</title>
<script type="text/javascript" src="<s:url value="./common/js/jquery-1.11.1.min.js"/>"></script>
<script type="text/javascript" src="<s:url value="./console_resources/js/application.js"/>"></script>
<script type="text/javascript" src="<s:url value="./console_resources/js/console_message_model.js"/>"></script>
<script type="text/javascript" src="<s:url value="./console_resources/js/command.js"/>"></script>
<script type="text/javascript" src="<s:url value="./console_resources/js/console.js"/>"></script>
<link rel="stylesheet" type="text/css" href="<s:url value="./console_resources/css/console.css"/>">
<script type="text/javascript">
var cmdObj;
$(document).ready(function() {
	cmdObj = $("body").cmdConsole({rightPaste: true});
	var cmd = new Command("cal", "cal [expression], calculate, use javascript grammar");
	cmd.valueRequired = true;
	cmd.executeImpl = function(data) {
		this.end(new ConsoleMessage(eval(data[0]["value"][0]), "green"));
	};
	cmdObj.registerCommand(cmd);
	cmdObj.registerApplication(new JPLeaner());
});
</script>
</head>
<body>

</body>
</html>