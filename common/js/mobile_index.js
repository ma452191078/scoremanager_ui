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
            imgUrl : imgUrl,
            roleList : []
        },
        methods : {
            updateData : function(data) {
                this.playerList = data.playerList;
                this.gameInfo = data.gameInfo;
                this.roleList = data.gameInfo.gameRoleInfoList;
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
            if (vm.gameInfo.gameRole == "" || vm.gameInfo.gameRole == null){
                $("#role_head").hide();
            }
        },
        error : function(data) {
            alert("发生错误，稍后请重新刷新!");
        }
    });
}

// 提交得分
function onSumbitScore(gameId, playerId) {
    var parameter = {};
    parameter["scoreValue"] = 0.00;
    parameter["playerId"]= playerId;
    parameter["gameId"]= gameId;
    parameter['judgeId'] = store.get('user');
    var roleList = [];
    var tmpIndex = 0;
    var errFlag = 0;
    var errMsg;
    $("#roleScoreList").find(".roleScoreDetail").each(
        function() {
            var roleScoreDetail = {};
            var maxValue = 0;
            var scoreValue = $("input[name='roleScore_"+tmpIndex+"']");
            roleScoreDetail["scoreValue"] = scoreValue.val();
            roleScoreDetail["roleId"] = $("input[name='roleId_"+tmpIndex+"']").val();
            maxValue = $("input[name='max_"+tmpIndex+"']").val();
            // 检查是否超过最大值
            if (parseInt(maxValue) < parseInt(roleScoreDetail["scoreValue"])){
                errMsg = '该项分数不能高于' + maxValue + '分！';
                scoreValue.select();
                errFlag = 1;
                return;
            }
            // 检查分值是否有效
            if (parseInt(roleScoreDetail["scoreValue"]) < 0 || roleScoreDetail["scoreValue"] == ""){
                errMsg = '请输入有效分数！';
                scoreValue.select();
                errFlag = 1;
                return;
            }

            roleList.push(roleScoreDetail);
            tmpIndex ++;
        }
    );
    if (errFlag == 1){
        alert(errMsg);
        return
    }
    parameter['scoreRoleInfoList'] = roleList;
    var jsonOb = eval(parameter);

    var url = path + "/score/addScore";
    $.ajax({
        data : JSON.stringify(jsonOb),
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        contentType: 'application/json;charset=utf-8',
        success : function(data) {
            var message = $('#message');
            message.html('');
            message.html(data.message);
            if (data.flag == 'success'){
                getPlayerList();
            }
            $('#my-prompt').modal('close');
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
                        onSumbitScore(gameId, $('#playerId').val());

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


