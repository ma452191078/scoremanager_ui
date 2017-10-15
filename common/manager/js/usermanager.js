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
                var url = path + '/user/getUserInfo';
                var param = {};
                param["userId"] = userId;
                $.ajax({
                    data : param,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {
                        alert(data.message);
                        if (data.flag == 'success'){

                        }
                    },
                    error : function() {
                        alert("发生错误，稍后请重新刷新!");
                    }
                });
            },
            addNewPlayer : function (user) {
                this.userList.push(user);
            },
            savePlayer : function(){
                var playerName = $('#playerName').val();
                var playerDepartment = $('#playerDepartment').val();
                var playerNum = $('#playerNum').val();
                var playerImg = $('#playerImg').val();
                var param = {};
                param["gameId"] = gameId;
                param['playerName'] = playerName;
                param['playerDepartment'] = playerDepartment;
                param['playerNum'] = playerNum;
                param['playerImg'] = playerImg;
                var url = path + '/player/addPlayerInfo';
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
