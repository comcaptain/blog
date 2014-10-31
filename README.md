blog
====

### to do list  

权限控制

需求：
1. 对于不同的condition，执行不同的privilege检查，其实不同的condition只有是否当前用户操作自己的数据，这可以建立一个统一checker，需要传入以下几个参数：用户id（session），要检查的表名称（），要修改的数据id。

global权限控制，

这意味着，需要将



baseAction中加上getPrivilegeXXXId，然后所有的action继承这个
