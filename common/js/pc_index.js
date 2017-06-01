/**
 * Created by majingyuan on 2017/5/29.
 */
var vm = null;
var gameInfo = {};

// 初始化加载vue
$(document).ready(function() {

    getGameList();
    vm = new Vue({
        el : '#body',
        data : {
            gameList : [],
            gameInfo : gameInfo
        },
        methods : {
            updateData : function(data) {
                this.gameList = data.gameList;
            },
            showGameInfo : function (gameId) {
                window.location.href="game.html?gameId="+gameId;
            },
            editGameInfo : function (game) {
                this.gameInfo = game;
                $('#editGame').modal('show');
            },
            editPlayer : function (gameId) {
                window.location.href="player.html?gameId="+gameId;
            },
            saveGameInfo : function () {
                var gameId = $('#gameId').val();
                var gameName = $('#gameName').val();
                var gameOwner = $('#gameOwner').val();
                var startDate = $('#startDate').val();
                var param = {};
                param['gameId'] = gameId;
                param['gameName'] = gameName;
                param['gameOwner'] = gameOwner;
                param['startDate'] = startDate;
                var url = path + '/game/updateGameInfo';
                $.ajax({
                    data : param,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {
                        alert(data.message);
                        if (data.flag == 'success'){
                           $('#editGame').modal('hide');
                            //创建或修改成功后进入选手编辑界面
                            window.location.href="player.html?gameId="+data.gameId;
                        }
                    },
                    error : function() {
                        alert("发生错误，稍后请重新刷新!");
                    }
                });
            },
            killGameInfo : function (gameId) {
                var tipMessage = $('#changeTipsMessage');
                var param = {};
                param["gameId"] = gameId;
                var url = path + "/game/killGame";
                tipMessage.html('');
                $.ajax({
                    data : param,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {

                        if (data.flag == 'success'){
                            getGameList();
                        }
                        tipMessage.html(data.message);
                        $('#changeTip').modal('show');
                    },
                    error : function() {
                        alert("发生错误，稍后请重新刷新!");
                    }
                });
            }
        }
    });
    initDatePicker();
});


// 获取比赛列表
function getGameList() {
    var parameter = {gameDeleted:'0', gameActive:'0'};

    var url = path + "/game/getGameList";
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

//日期控件初始化
function initDatePicker(){
    $('#startDate').datetimepicker({
        minView: 'month', //选择日期后，不会再跳转去选择时分秒
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayBtn: 'linked',
        todayHighlight: true
    });
}