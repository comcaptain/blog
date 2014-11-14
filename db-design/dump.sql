CREATE DATABASE  IF NOT EXISTS `pygmalion` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `pygmalion`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pygmalion
-- ------------------------------------------------------
-- Server version	5.6.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `article` (
  `article_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `content` mediumtext,
  `markdown` mediumtext,
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `author` int(11) DEFAULT NULL,
  `thumbnail` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`article_id`),
  KEY `fk_article_user_idx` (`author`),
  CONSTRAINT `fk_article_user` FOREIGN KEY (`author`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article`
--

LOCK TABLES `article` WRITE;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
INSERT INTO `article` VALUES (2,'路由器弱口令入侵','<p>  为了防止被蹭网，现在大多数人都会给自家的wifi设置一个强密码，但是很少有人会去修改自己的路由器管理密码，大多依旧是默认的admin@admin。</p>\n<p>  因为照常理来说，不知道wifi密码就连不到路由器所在的局域网，也就无法登陆路由器。但是，很多路由器的web管理页面做的很差，login用的是<a href=\"http://www.wikiwand.com/en/Basic_access_authentication\">HTTP Basic authentication (BA)</a>，提交表单用的是GET请求，这就导致访问一个url就有可能改变你的路由器设置。 基于这个思路，下面介绍了利用路由器弱口令进行dns劫持，进而进行中间人攻击。</p>\n<p>基本思路：</p>\n<ol>\n<li><p>dns劫持, 在可以插入外链图片的网站中插入外链图片, 对同一个用户</p>\n<ul>\n<li><p>第1次请求跳转到<a href=\"http://admin:admin@192.168.1.1/userRpm/PPPoECfgAdvRpm.htm?wan=0&amp;lcpMru=1480&amp;ServiceName=&amp;AcName=&amp;EchoReq=0&amp;manual=2&amp;dnsserver=黑客服务器&amp;dnsserver2=8.8.8.8&amp;downBandwidth=0&amp;upBandwidth=0&amp;Save=%B1%A3+%B4%E6&amp;Advanced=Advanced\">http://admin:admin@192.168.1.1/userRpm/PPPoECfgAdvRpm.htm?wan=0&amp;lcpMru=1480&amp;ServiceName=&amp;AcName=&amp;EchoReq=0&amp;manual=2&amp;dnsserver=黑客服务器&amp;dnsserver2=8.8.8.8&amp;downBandwidth=0&amp;upBandwidth=0&amp;Save=%B1%A3+%B4%E6&amp;Advanced=Advanced</a></p></li>\n<li><p>第2,3次请求显示真正的图片。可以通过cookie来标识用户</p></li>\n</ul></li>\n<li><p>流量劫持。</p>\n<ul>\n<li>建立dns服务器，将目标网站的域名解析到我的http代理服务器，其它域名解析代理到8.8.8.8(<a href=\"https://github.com/tjfontaine/node-dns\">node-dns</a>)</li>\n<li>代理服务器可以用<a href=\"http://mitmproxy.org/\">mitmproxy</a>，这个可以实时替换流量中的任何文件</li>\n<li>如果目标网站是明文提交，设定正则表达式拉取用户名密码，如果header中cookie的sessionId部分的过期时间长，就拉取cookie</li>\n</ul></li>\n<li><p>缓存投毒。</p>\n<ul>\n<li><p>找到目标网站一个过期时间设置的很长的js文件，在其中加入以下js代码，然后将header中的expire时间设置的非常长，还有last-modified字段设置成很多年以后，然后干掉cache-control</p>\n<ul>\n<li>在form的submit中添加submit的listener，取得之后拦截submit请求，取得用户名和密码，然后添加一个隐藏的图片将用户名和密码发送到密码服务器，为了保证能传到服务器，延时一秒后再提交表单</li>\n<li>取得自动填写的表单，在load的时候取得表单的内容， 如果有值就发送到密码服务器</li>\n<li>（定期执行，在cookie中做标记看是否执行过）检测浏览器，如果浏览器支持iframe表单自动填写，就添加隐藏的iframe，iframe指向目标网站，但是假如特定的query字符串，在proxy中匹配这个字符串，当存在的时候将页面替换成一个简单的form表单页面（表单中的name和目标网站的一致）</li>\n</ul></li>\n<li><p>触发缓存</p>\n<ul>\n<li>实时在html中添加隐藏的iframe，隐藏的iframe指向目标网站，html标签加上manifest属性（离线缓存）</li>\n<li>访问遭到修改的js地址</li>\n</ul></li>\n</ul></li>\n</ol>\n','&emsp;&emsp;为了防止被蹭网，现在大多数人都会给自家的wifi设置一个强密码，但是很少有人会去修改自己的路由器管理密码，大多依旧是默认的admin@admin。  \n\n&emsp;&emsp;因为照常理来说，不知道wifi密码就连不到路由器所在的局域网，也就无法登陆路由器。但是，很多路由器的web管理页面做的很差，login用的是[HTTP Basic authentication (BA)](http://www.wikiwand.com/en/Basic_access_authentication)，提交表单用的是GET请求，这就导致访问一个url就有可能改变你的路由器设置。 基于这个思路，下面介绍了利用路由器弱口令进行dns劫持，进而进行中间人攻击。\n\n基本思路：\n\n1. dns劫持, 在可以插入外链图片的网站中插入外链图片, 对同一个用户\n    * 第1次请求跳转到<http://admin:admin@192.168.1.1/userRpm/PPPoECfgAdvRpm.htm?wan=0&lcpMru=1480&ServiceName=&AcName=&EchoReq=0&manual=2&dnsserver=黑客服务器&dnsserver2=8.8.8.8&downBandwidth=0&upBandwidth=0&Save=%B1%A3+%B4%E6&Advanced=Advanced>  \n\n     * 第2,3次请求显示真正的图片。可以通过cookie来标识用户\n\n2. 流量劫持。\n\n	* 建立dns服务器，将目标网站的域名解析到我的http代理服务器，其它域名解析代理到8.8.8.8([node-dns](https://github.com/tjfontaine/node-dns))\n	* 代理服务器可以用[mitmproxy](http://mitmproxy.org/)，这个可以实时替换流量中的任何文件\n	* 如果目标网站是明文提交，设定正则表达式拉取用户名密码，如果header中cookie的sessionId部分的过期时间长，就拉取cookie\n\n3. 缓存投毒。\n\n	* 找到目标网站一个过期时间设置的很长的js文件，在其中加入以下js代码，然后将header中的expire时间设置的非常长，还有last-modified字段设置成很多年以后，然后干掉cache-control\n		* 在form的submit中添加submit的listener，取得之后拦截submit请求，取得用户名和密码，然后添加一个隐藏的图片将用户名和密码发送到密码服务器，为了保证能传到服务器，延时一秒后再提交表单\n		* 取得自动填写的表单，在load的时候取得表单的内容， 如果有值就发送到密码服务器\n		* （定期执行，在cookie中做标记看是否执行过）检测浏览器，如果浏览器支持iframe表单自动填写，就添加隐藏的iframe，iframe指向目标网站，但是假如特定的query字符串，在proxy中匹配这个字符串，当存在的时候将页面替换成一个简单的form表单页面（表单中的name和目标网站的一致）\n\n	* 触发缓存\n		* 实时在html中添加隐藏的iframe，隐藏的iframe指向目标网站，html标签加上manifest属性（离线缓存）\n		* 访问遭到修改的js地址\n\n\n','2014-10-07 16:27:37','2014-10-14 18:07:44',1,'  为了防止被蹭网，现在大多数人都会给自家的wifi设置一个强密码，但是很少有人会去修改自己的路由器管理密码，大多依旧是默认的admin@admin。'),(5,'Struts2 and Spring integration thread safe','<p>If you are using Struts2-Spring plugin make sure to put bean scope as prototype.</p>\n<p>Struts2 create new instance of action on each request, since action work as a model also and in order to make it thread safe a new object is being created on each request and placed on value stack.</p>\n<p>Not proving scope will be treated by Spring as singleton and for ever request same action instance will be given back which can leads to a lot of issue from data corruption to weird behavior.</p>\n','If you are using Struts2-Spring plugin make sure to put bean scope as prototype.\n\nStruts2 create new instance of action on each request, since action work as a model also and in order to make it thread safe a new object is being created on each request and placed on value stack.\n\nNot proving scope will be treated by Spring as singleton and for ever request same action instance will be given back which can leads to a lot of issue from data corruption to weird behavior.','2014-10-09 14:19:48','2014-10-14 18:07:38',1,'If you are using Struts2-Spring plugin make sure to put bean scope as prototype.'),(7,'PushState: what exactly is the state object for','<p>HTML5 has extended <code>window.history</code> and now we can modify url without reload(of course, considering security, you can only change to a url in the same domain)</p>\n<p>Take this small example: <a href=\"http://jsfiddle.net/janfoeh/2SCbv/show/light/\">run fiddle</a> (<a href=\"http://jsfiddle.net/janfoeh/2SCbv\">editor view</a>):</p>\n<p>You have a page where a user can select a color. Every time they do, we generate a new history entry:</p>\n<pre><code>function doPushState(color) {\n    var state = {},\n        title = \"Page title\",\n        path  = \"/\" + color;\n    \n    history.pushState(state, title, path);\n};\n</code></pre>\n<p>We leave the state object blank for now and set the URL to the color name (don\'t reload the page - that URL doesn\'t exist, so you will get a 404).</p>\n<p>Now click on a red, green and blue once each. Note that the URL changes. Now what happens if you click the back button?</p>\n<p>The browser does indeed go back in history, but our page doesn\'t notice that - the URL changes from \'/blue\' back to \'/green\', but our page stays at \'You have selected blue\'. Our page has gone out of sync with the URL.</p>\n<p>This is what the <code>window.onpopstate</code> event and the state object are for:</p>\n<ol>\n<li><p>we include our selected color in our state object</p>\n<pre><code> function doPushState(color) {\n     var state = { selectedColor: color },\n         title = \"Page title\",\n         path  = \"/\" + color;\n \n     history.pushState(state, title, path);\n };\n</code></pre></li>\n<li><p>then we listen for the <code>popstate</code> event, so that we know when we have to update the selected color:</p>\n<pre><code> $(window).on(\'popstate\', function(event) {\n     var state = event.originalEvent.state;\n \n     if (state) {\n         selectColor( state.selectedColor );\n     }\n });\n</code></pre></li>\n</ol>\n<p>Try the updated example: <a href=\"http://jsfiddle.net/janfoeh/2SCbv/11/show/light/\">run fiddle</a> (<a href=\"http://jsfiddle.net/janfoeh/2SCbv/11\">editor view</a>): our page now updates accordingly when the user navigates back through history.</p>\n','HTML5 has extended `window.history` and now we can modify url without reload(of course, considering security, you can only change to a url in the same domain) \n\nTake this small example: [run fiddle][1] ([editor view][2]):\n\nYou have a page where a user can select a color. Every time they do, we generate a new history entry:\n\n    function doPushState(color) {\n        var state = {},\n            title = \"Page title\",\n            path  = \"/\" + color;\n        \n        history.pushState(state, title, path);\n    };\n\nWe leave the state object blank for now and set the URL to the color name (don\'t reload the page - that URL doesn\'t exist, so you will get a 404).\n\nNow click on a red, green and blue once each. Note that the URL changes. Now what happens if you click the back button?\n\nThe browser does indeed go back in history, but our page doesn\'t notice that - the URL changes from \'/blue\' back to \'/green\', but our page stays at \'You have selected blue\'. Our page has gone out of sync with the URL.\n\nThis is what the `window.onpopstate` event and the state object are for:\n\n1. we include our selected color in our state object\n\n        function doPushState(color) {\n            var state = { selectedColor: color },\n                title = \"Page title\",\n                path  = \"/\" + color;\n        \n            history.pushState(state, title, path);\n        };\n\n2. then we listen for the `popstate` event, so that we know when we have to update the selected color:\n\n        $(window).on(\'popstate\', function(event) {\n            var state = event.originalEvent.state;\n        \n            if (state) {\n                selectColor( state.selectedColor );\n            }\n        });\n\nTry the updated example: [run fiddle][3] ([editor view][4]): our page now updates accordingly when the user navigates back through history.\n\n  [1]: http://jsfiddle.net/janfoeh/2SCbv/show/light/\n  [2]: http://jsfiddle.net/janfoeh/2SCbv\n  [3]: http://jsfiddle.net/janfoeh/2SCbv/11/show/light/\n  [4]: http://jsfiddle.net/janfoeh/2SCbv/11','2014-10-09 14:34:33','2014-10-14 18:07:31',1,'HTML5 has extended window.history and now we can modify url without reload(of course, considering security, you can only change to a url in the same domain)'),(11,'to do list','<p>下面是本网站待开发的feature列表：</p>\n<ol>\n<li>编辑器功能\n<ul>\n<li><del>ctrl + b: bold</del></li>\n<li><del>ctrl + shift + b: blockquote</del></li>\n<li><del>ctrl + k: wrap code</del></li>\n<li><del>ctrl + d: delete selected lines</del></li>\n<li><del>ctrl + shift + d: wrap selected text with &lt;del&gt; tag</del></li>\n</ul></li>\n<li>用户login，不开放注册\n<ul>\n<li><del>按ctrl shift l(ogin)弹出login窗口</del></li>\n<li><del>ctrl q，退出login</del></li>\n</ul></li>\n<li>权限控制\n<ul>\n<li><del>在interceptor中实现login控制，需要login之后才能进入的加上annotaion，在interceptor中统一处理</del></li>\n<li><del>用role based做权限管理，在login的时候读入privilege信息</del></li>\n</ul></li>\n<li>html注入过滤</li>\n<li>全局快捷键\n<ul>\n<li>ctrl + shift + h: home</li>\n<li>ctrl + shift + n: new article</li>\n<li>ctrl + e: edit</li>\n<li>ctrl + shift + d: delete article</li>\n</ul></li>\n<li>工具页面，全局快捷键是ctrl + shift + t(ool)，下面是集成的工具列表\n<ul>\n<li>颜色转换 rgb 和hex</li>\n<li>keycode查询</li>\n<li>javascript format</li>\n</ul></li>\n</ol>\n','下面是本网站待开发的feature列表：\n\n1. 编辑器功能\n    * <del>ctrl + b: bold</del>\n    * <del>ctrl + shift + b: blockquote</del>\n    * <del>ctrl + k: wrap code</del>\n    * <del>ctrl + d: delete selected lines</del>\n    * <del>ctrl + shift + d: wrap selected text with \\<del\\> tag</del>\n2. 用户login，不开放注册\n    * <del>按ctrl shift l(ogin)弹出login窗口</del>\n    * <del>ctrl q，退出login</del>\n3. 权限控制\n    * <del>在interceptor中实现login控制，需要login之后才能进入的加上annotaion，在interceptor中统一处理</del>\n    * <del>用role based做权限管理，在login的时候读入privilege信息</del>\n4. html注入过滤\n5. 全局快捷键\n   * ctrl + shift + h: home\n   * ctrl + shift + n: new article\n   * ctrl + e: edit\n   * ctrl + shift + d: delete article \n6. 工具页面，全局快捷键是ctrl + shift + t(ool)，下面是集成的工具列表\n   * 颜色转换 rgb 和hex\n   * keycode查询\n   * javascript format','2014-10-10 11:14:10','2014-11-14 18:15:31',1,'下面是本网站待开发的feature列表：'),(13,'未来的新版块计划','<p>本网站未来可能会实现的新的板块列表：</p>\n<ol>\n<li>翻译板块<br>\n功能仿照oschina的翻译模块，但是不开放翻译的编辑权限，下面是一些不成系统的想法：\n<ul>\n<li>文章导入实现自动化，html导入成Markdown参考<a href=\"https://github.com/domchristie/to-markdown\">这个</a></li>\n<li>中英文对照</li>\n<li>翻译编辑功能，右边使用markdown   abc</li>\n</ul></li>\n</ol>\n','本网站未来可能会实现的新的板块列表：\n\n1. 翻译板块  \n    功能仿照oschina的翻译模块，但是不开放翻译的编辑权限，下面是一些不成系统的想法：\n   - 文章导入实现自动化，html导入成Markdown参考[这个](https://github.com/domchristie/to-markdown)\n   - 中英文对照\n   - 翻译编辑功能，右边使用markdown   abc','2014-10-15 13:04:14','2014-11-14 16:48:29',1,'本网站未来可能会实现的新的板块列表：');
/*!40000 ALTER TABLE `article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `login_user_id` varchar(100) NOT NULL,
  `user_name` varchar(200) NOT NULL,
  `password` varchar(200) DEFAULT NULL,
  `role` int(11) DEFAULT '100',
  `locked` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'base','pygmalion','base',1,0),(2,'user','user','base',300,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-11-14 18:17:04
