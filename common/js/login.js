/**
 * Created by majingyuan on 2017/9/22.
 * 登录界面
 */

// 初始化提示框
$(function () {
    // 检查session中的token是否存在
    var token = $.cookie.get('token');
    var userId = $.cookie.get('userId');
    if (token != "undefind" || token != ""){
        $('[data-toggle="popover"]').popover()
    }else{
        // 已存在是转向管理页面
    }

});

function userLogin() {
    // 清空session
    $.cookie.clear();
    // 拼装登录参数
    var url = path + "/player/getPlayerListByGame";
    var param = {};
    param["userName"] = $("#userName").val();
    param["userPass"] =  $("#userPass").val();

    $.ajax({
        data : param,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            if (data.errCode == "success"){
                $.cookie.set("userName",data.userInfo.userName);
                $.cookie.set("userId",data.userInfo.userId);
                $.cookie.set("token",data.userInfo.token);

            }else{
                $("#msg-err").html(data.errMsg);
            }
        },
        error : function(data) {
            $("#msg-err").html(data.errMsg);
        }
    });
}