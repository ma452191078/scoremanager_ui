var store = null;
var vm = null;

// 初始化加载vue
$(document).ready(function() {
    initLocalStorage();
    getPlayerList();
    vm = new Vue({
        el : '#body',
        data : {
            gameInfo : {},
            playerList : [],
            imgUrl : imgUrl
        },
        methods : {
            updateData : function(data) {
                this.playerList = data.playerList;
                this.gameInfo = data.gameInfo;
            }
        }
    });
});

// 获取参赛选手列表
function getPlayerList() {
    var parameter = {
        gameId : getUrlParam('gameId')
    };

    var url = path + "/player/getPlayerListByGame";
    $.ajax({
        data : parameter,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            vm.updateData(data);
        },
        error : function(data) {
            alert("发生错误，稍后请重新刷新!");
        }
    });
}

// 提交得分
function onSumbitScore(gameId, playerId, scoreValue) {
    var parameter = {};
    parameter["scoreValue"]= scoreValue;
    parameter["playerId"]= playerId;
    parameter["gameId"]= gameId;
    parameter['judgeId'] = store.get('user');
    var url = path + "/score/addScore";
    $.ajax({
        data : parameter,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            var message = $('#message');
            message.html('');
            message.html(data.message);
            if (data.flag == 'success'){
                getPlayerList();
            }
            $('#scoreValue').val('');
            $('#submitAlert').modal('open');
        },
        error : function(data) {
            alert("发生错误，稍后请重新刷新!");
        }
    });
}

// 展示弹窗
function showModel(gameId, playerId, playerName) {
    $('#playerName').html(playerName);
    $('#playerId').val(playerId);

    var parameter = {};
    parameter["playerId"]= playerId;
    parameter["gameId"]= gameId;
    parameter['judgeId'] = store.get('user');
    var url = path + "/score/checkScoreByJudgeId";
    $.ajax({
        data : parameter,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            var message = $('#message');
            if (data.flag == 'success'){
                message.html('选手<strong>'+playerName+'</strong>您已提交评分，不能再次评分。');
                $('#submitAlert').modal('open');
            }else{
                message.html('');
                $('#scoreValue').val('');
                $('#my-prompt').modal({
                    relatedTarget: this,
                    onConfirm: function(options) {
                        var score = $('#scoreValue').val();
                        if (score > 100){
                            alert('请输入不高于100的分数！');
                        }else if (score < 0){
                            alert('请输入不小于0的分数！');
                        }else {
                            $('#my-prompt').modal('close');
                            onSumbitScore(gameId, $('#playerId').val(), options.data);
                        }
                    },
                    closeOnConfirm: false,
                    onCancel: function() {

                    }
                });
            }
        },
        error : function(data) {
            alert("发生错误，稍后请重新刷新!");
        }
    });
}

function initLocalStorage() {
    //初始化本地存储对象
    store = $.AMUI.store;

    if (!store.enabled) {
        alert('您的浏览器无法使用本地存储功能. 请禁用隐私模式或更新您的浏览器。');
        return;
    }
    var user = store.get('user');
    if (user == null || user == undefined || user === ''){
        var parameter = {};
        parameter["gameId"]= getUrlParam('gameId');
        parameter["code"]= getUrlParam('code');

        var url = path + "/game/getGameJudgeId";
        $.ajax({
            data : parameter,
            url : url,
            type : 'POST',
            dataType : 'JSON',
            timeout : 10000,
            success : function(data) {
                if (data.flag === 'success'){
                    store.set('user', data.judgeId);
                }
            },
            error : function(data) {
                alert("发生错误，稍后请重新刷新!");
            }
        });
    }
}



