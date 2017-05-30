
var vm = null;

// 初始化加载vue
$(document).ready(function() {
    getPlayerList();
    vm = new Vue({
        el : '#body',
        data : {
            gameInfo : {},
            playerList : []
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
    $('#my-prompt').modal({
        relatedTarget: this,
        onConfirm: function(options) {
            onSumbitScore(gameId, $('#playerId').val(), options.data);
        },
        // closeOnConfirm: false,
        onCancel: function() {

        }
    });
}



