/**
 * 检查用户是否登录
 * @author majingyuan
 * Created by majingyuan on 2017/10/15.
 */

$(function () {
    $("#page_head").load("../page/head.html");
});

// 检查用户是否登录
$(function () {
    // 检查session中的token是否存在
    var token = $.cookie('token');
    var userId = $.cookie('userId');
    var userName = $.cookie('userName');
    if (token != "undefind" || token != ""){

        // 已存在检查有效性失效转向登陆页
        // 检查是否为有效token
        var url = path + "/login/checkToken";
        var param = {};
        param["userToken"] = token;
        param["userId"] =  userId;

        $.ajax({
            data : param,
            url : url,
            type : 'POST',
            dataType : 'JSON',
            timeout : 10000,
            success : function(data) {
                if (data.errCode != "1"){
                    window.location.href = loginUrl;
                }else {
                    $("#navUserName").html(userName);
                }
            },
            error : function(data) {
                window.location.href = loginUrl;
            }
        });

    }else {
        //不存在cookie信息转向登陆页
        window.location.href = loginUrl;
    }

});

function logout() {
    $.cookie('token',null,{path:'/'});
    $.cookie('userId',null,{path:'/'});
    $.cookie('userName',null,{path:'/'});
    window.location.href = loginUrl;
}