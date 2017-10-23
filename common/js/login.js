/**
 * Created by majingyuan on 2017/9/22.
 * 登录界面
 */

// $(function(){
//     $.cookie('userName', null);
//     $.cookie('userId', null);
//     $.cookie('token', null);
// });

function userLogin() {
    var host = "http://" + window.location.host + "/scoremanager_ui/index.html";
    // 拼装登录参数
    var url = path + "/login/userLogin";
    var param = {};
    param["userAccount"] = $("#userName").val();
    param["userPassword"] =  $("#userPass").val();

    $.ajax({
        data : param,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            if (data.errCode == "1"){

                $.cookie('userName', data.userName, { expires: 1, path: '/' });
                $.cookie('userId', data.userId, { expires: 1, path: '/' });
                $.cookie('token', data.userToken, { expires: 1, path: '/' });
                window.location.href = host;
            }else{
                $("#msg-err").html(data.errMsg);
            }
        },
        error : function(data) {
            $("#msg-err").html(data.errMsg);
        }
    });
}