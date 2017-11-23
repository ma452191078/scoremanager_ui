/**
 * Created by majingyuan on 2017/5/30.
 */
var vm = null;
var gameId;

// 初始化加载vue
$(document).ready(function() {

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
                this.gameInfo = data.gameInfo;
                this.playerList = data.playerList;
            },
            addNewPlayer : function (player) {
                this.playerList.push(player);
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
            removePlayer : function (playerIndex) {

                var param = {};
                param["playerId"] = this.playerList[playerIndex].playerId;

                var url = path + '/player/delPlayer';
                $.ajax({
                    data : param,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {
                        if (data.flag === 'failed'){
                            alert(data.message);
                        }
                    },
                    error : function() {
                        alert("发生错误，稍后请重新刷新!");
                    }
                });

                this.playerList.splice(playerIndex,1);
            }
        }
    });
});


// 获取比赛
function getPlayerList() {
    gameId = getUrlParam("gameId");
    var parameter = {};
    parameter["gameId"] = gameId;
    parameter["judgeId"] = null;
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

function uploadImg() {
    var formData = new FormData();
    var name = $("#filePath").val();
    formData.append("file",$("#filePath")[0].files[0]);
    formData.append("gameId",gameId);
    var url = path + "/file/upload"
    $.ajax({
        url : url,
        type : 'POST',
        data : formData,
// 告诉jQuery不要去处理发送的数据
        processData : false,
// 告诉jQuery不要去设置Content-Type请求头
        contentType : false,
        beforeSend:function(){
            console.log("正在进行，请稍候");
        },
        success : function(data) {
            if(data.flag==='success'){
                alert('上传成功');
                $('#playerImg').val(data.filePath);
            }
            console.log(data.message);
        },
        error : function(responseStr) {
            alert('上传失败请重试');
            console.log("error");
        }
    });

}


function showGameInfo() {
    window.location.href="game.html?gameId="+gameId;
}