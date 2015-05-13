var processor = require("gulp-based-front-end-preprocessor");
var testConfig = {
	packages: {
		"common/jsp/common_header.jsp": {
			"common/js/common_lib.js": [
				"common/js/jquery-1.11.1.min.js",
				"common/js/bootstrap.min.js",
				"common/js/common.js",
				"common/js/common_css_assistant.js",
				"common/js/navigation.js",
			],
			"common/css/common_lib.css": [
				"common/css/bootstrap.min.css",
				"common/css/common.css",
			]
		},
		"console_resources/jsp/console.jsp": {
			"console_resources/js/console_all.js": [
				"common/js/jquery-1.11.1.min.js",
				"console_resources/js/application.js",
				"console_resources/js/console_message_model.js",
				"console_resources/js/command.js",
				"console_resources/js/console.js",
				"console_resources/js/jplearner.js"
			],
			"console_resources/css/console_all.css": [
				"console_resources/css/console.css",
				"console_resources/css/jplearner.css",
			]
		},
		"console_resources/jsp/console.jsp": {
			"console_resources/js/console_all.js": [
				"common/js/jquery-1.11.1.min.js",
				"console_resources/js/application.js",
				"console_resources/js/console_message_model.js",
				"console_resources/js/command.js",
				"console_resources/js/console.js",
				"console_resources/js/jplearner.js"
			],
			"console_resources/css/console_all.css": [
				"console_resources/css/console.css",
				"console_resources/css/jplearner.css",
			]
		},
		"main/jsp/editArticle.jsp": {
			"main/js/edit_article_all.js": [
				"common/js/stmd.js",
				"main/js/editArticle.js"
			]
		},
		"main/jsp/main.jsp": {
			"main/css/main_all.css": [
				"main/css/main.css",
				"common/css/timeline.css"
			]
		}

	},
	source_dir: "WebContent",
	output_dir: "WebContent"
}
processor.execute(testConfig);