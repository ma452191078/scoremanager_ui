/**
 * 用户管理
 * @author majingyuan
 * Created by majingyuan on 2017/10/15.
 */

var vm = null;
var loginUserId = $.cookie('userId');

// 初始化加载vue
$(document).ready(function() {

    getUserList();
    vm = new Vue({
        el : '#body',
        data : {
            userInfo : {},
            userList : []
        },
        methods : {
            updateData : function(data) {
                this.userList = data.userList;
            },
            showUserInfo : function (userId) {
                var url = path + '/user/getUserInfoById';
                var param = {};
                param["userId"] = userId;
                $.ajax({
                    data : param,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {
                        if (data.userId != null){
                            userClean();

                            $('#userName').val(data.userName);
                            $('#userAccount').val(data.userAccount);
                            $('#userPassword').val("");
                            $('#userDepartment').val(data.userDepartment);
                            $('#userId').val(data.userId);
                            $('#userPassword').hide();
                            $('#editUser').modal('show');
                        }
                    },
                    error : function() {
                        alert("发生错误，稍后请重新刷新!");
                    }
                });
            },
            showNewUser: function (user) {
                this.userList.push(user);
            },
            saveUserInfo : function(){
                var userName = $('#userName').val();
                var userPassword = $('#userPassword').val();
                var userAccount = $('#userAccount').val();
                var userDepartment = $('#userDepartment').val();
                var userId = $('#userId').val();
                var param = {};
                param["userId"] = userId;
                param['userName'] = userName;
                param['userAccount'] = userAccount;
                param['userPassword'] = userPassword;
                param['userDepartment'] = userDepartment;
                param['addBy'] = loginUserId;

                var url = path + '/user/updateUserInfo';
                $.ajax({
                    data : param,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {
                        alert(data.errMsg);
                        if (data.errFlag == '1'){
                            $('#editUser').modal('hide');
                            getUserList();
                        }
                    },
                    error : function() {
                        alert("发生错误，稍后请重新刷新!");
                    }
                });
            },
            activeUser : function (userIndex, activeFlag) {

                var param = {};
                param["userId"] = this.userList[userIndex].userId;
                param["activeFlag"] = activeFlag;
                var url = path + '/user/activeUser';
                $.ajax({
                    data : param,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {
                        if (data.errFlag == '1'){
                            vm.userList[userIndex].activeFlag = activeFlag;
                        }
                    },
                    error : function() {
                        alert("发生错误，稍后请重新刷新!");
                    }
                });

                // this.userList.splice(userIndex,1);
            },
            restUserInfo : function (userId) {

                var param = {};
                param["userId"] = userId;
                var url = path + '/user/resetUserPassword';
                $.ajax({
                    data : param,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {
                        alert(data.errMsg);
                    },
                    error : function() {
                        alert("发生错误，稍后请重新刷新!");
                    }
                });

                // this.userList.splice(userIndex,1);
            }
        }
    });
});


// 获取用户列表
function getUserList() {

    var parameter = {};
    parameter['addBy'] = loginUserId;
    var url = path + "/user/getUserList";
    $.ajax({
        data : parameter,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            vm.updateData(data);
        },
        error : function() {
            alert("发生错误，稍后请重新刷新!");
        }
    });
}

//清空用户信息
function userClean() {
    $('#userName').val("");
    $('#userAccount').val("");
    $('#userPassword').val("");
    $('#userDepartment').val("");
    $('#userId').val("");
    $('#userPassword').show();
}


function addNewPlayer() {
    userClean();
    $('#editUser').modal('show');
}

function getWxTag() {
    var url = path + "/wechat/getDeptInfo";
    $.ajax({
        data : {},
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 50000,
        success : function(data) {
            alert(data);
        },
        error : function() {
            alert("发生错误，稍后请重新刷新!");
        }
    });
}