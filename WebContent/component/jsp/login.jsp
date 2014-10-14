<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<div class="modal fade" id="loginModal" tabindex="-1" role="dialog">
  <form role="form" action="login" autocomplete="off">
  <div class="modal-dialog" style="margin-top: 13%;">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">login</h4>
      </div>
      <div class="modal-body">
		  <div class="form-group">
		    <label for="username">用户名</label>
		    <input type="text" class="form-control" name="userName" autocomplete="off" id="username" placeholder="用户名">
		  </div>
		  <div class="form-group">
		    <label for="password">密码</label>
		    <input type="password" class="form-control" name="password" autocomplete="off" id="password" placeholder="密码">
		  </div>
		  <div id="messageArea"></div>
      </div>
      <div class="modal-footer">
        <button type="submit" id="login" class="btn btn-primary">login</button>
      </div>
    </div>
  </div>
  </form>
</div>