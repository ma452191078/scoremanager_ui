/**
 * Created by majingyuan on 2017/5/30.
 */

var vm = null;
// 初始化加载vue
$(document).ready(function() {

    getPlayerList();
    vm = new Vue({
        el : '#body',
        data : {
            gameInfo : {},
            playerList : [],
            scoreList : [],
            playerInfo : {}
        },
        methods : {
            updateData : function(data) {
                this.gameInfo = data.gameInfo;
                this.playerList = data.playerList;
            },
            updateScoreInfo : function (scoreList, playerInfo) {
                this.scoreList = scoreList;
                this.playerInfo = playerInfo;
            },
            editScore : function (playerId, flag) {
                var parameter = {};

                parameter["playerId"] = playerId;

                var url = path + "/player/killPlayerInfo";
                $.ajax({
                    data : parameter,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {
                        getPlayerList();
                    },
                    error : function() {
                        alert("发生错误，稍后请重新刷新!");
                    }
                });
            },
            showScore : function (index) {
                var playerInfo = this.playerList[index];
                this.playerInfo = playerInfo;
                var parameter = {};

                parameter["playerId"] = playerInfo.playerId;
                var url = path + "/score/getScoreListByPlayer";
                $.ajax({
                    data : parameter,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {
                       var scoreList = data;
                       var sum = 0.00;
                       var avg = 0.00;
                       for(var i = 0; i < scoreList.length; i++){
                           sum = sum + scoreList[i].scoreValue;
                       }
                       if (scoreList.length > 2){
                           sum = sum - scoreList[0].scoreValue - scoreList[scoreList.length-1].scoreValue;
                           avg = sum / ( scoreList.length - 2 );
                       }else{
                           avg = sum / scoreList.length;
                       }

                        playerInfo.playerSum = sum;
                        playerInfo.playerAverage = avg.toFixed(2);
                        playerInfo.min = scoreList[0].scoreValue;
                        playerInfo.max = scoreList[scoreList.length-1].scoreValue;
                        vm.updateScoreInfo(scoreList,playerInfo);

                    },
                    error : function() {
                        alert("发生错误，稍后请重新刷新!");
                    }
                });
            }
        }
    });
});


// 获取比赛
function getPlayerList() {
    gameId = getUrlParam("gameId");
    var parameter = {};
    parameter["gameId"] = gameId;
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
        error : function() {
            alert("发生错误，稍后请重新刷新!");
        }
    });
}

function showQr() {
    var url = qrUrl + gameId;
    $('#gameUrl').val(url);
    $('#qrModal').modal('show');
}

