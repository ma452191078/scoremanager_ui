/**
 * 修改密码
 * @author majingyuan
 * @date 2017/10/19.
 * Created by majingyuan on 2017/10/19.
 */

var userId;
var tips;
$(function () {
    userId = $.cookie("userId");;
    tips = $("#tips");
    tips.hide();
});

/**
 * 检查旧密码是否正确
 */
function changePassowrd() {
    var oldPassword = $("#oldPassword").val();
    var newPassowrd = $("#newPassword").val();
    var param = {};
    param["userId"] = userId;
    param["userOldPassword"] = oldPassword;
    param["userPassword"] = newPassowrd;

    var url = path + "/user/changePassword";
    tips.html('');
    $.ajax({
        data : param,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            if (data.errFlag == "1") {
                tips.removeClass("alert-danger");
                tips.addClass("alert-success");
            }else{
                tips.removeClass("alert-success");
                tips.addClass("alert-danger");
            }
            tips.html(data.errMsg);
            tips.show();
        },
        error : function() {
            alert("发生错误，稍后请重新刷新!");
        }
    });
}

/**
 * 检查确认密码是否一致
 */
function checkConfirmPassword() {
    var newPassword = $("#newPassword").val();
    var confirmPassword = $("#confirmPassword").val();
    if (newPassword == confirmPassword){
        changePassowrd();
    }else {
        tips.html("确认密码不一致，请重新输入");
        tips.show();
    }
}