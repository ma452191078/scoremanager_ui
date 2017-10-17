/**
 * 用户管理
 * @author majingyuan
 * Created by majingyuan on 2017/10/15.
 */

var vm = null;

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
            addNewPlayer : function () {
                userClean();

                $('#editUser').modal('show');
            },
            saveUserInfo : function(){
                var userName = $('#userName').val();
                var userPassword = $('#userPassword').val();
                var userDepartment = $('#userDepartment').val();
                var userId = $('#userId').val();
                var param = {};
                param["gameId"] = gameId;
                param['playerName'] = playerName;
                param['playerDepartment'] = playerDepartment;
                param['playerNum'] = playerNum;
                param['playerImg'] = playerImg;
                var url = path + '/user/updateUserInfo';
                $.ajax({
                    data : param,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {
                        alert(data.message);
                        if (data.flag == 'success'){
                            $('#addPlayer').modal('hide');
                            vm.addNewPlayer(data.playerInfo);
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

                var url = path + '/user/activeUser';
                $.ajax({
                    data : param,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {
                        if (data.flag == 'failed'){
                            alert(data.message);
                        }
                    },
                    error : function() {
                        alert("发生错误，稍后请重新刷新!");
                    }
                });

                this.userList.splice(userIndex,1);
            }
        }
    });
});


// 获取比赛
function getUserList() {

    var parameter = {};
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
    $('#userPassword').val("");
    $('#userDepartment').val("");
    $('#userId').val("");
    $('#userPassword').show();
}
