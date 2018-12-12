/**
 * Created by majingyuan on 2017/5/30.
 */

var vm = null;
var gameId = getUrlParam("gameId");

// 初始化加载vue
$(document).ready(function() {
    getGameResult();
    vm = new Vue({
        el : '#body',
        data : {
            playerResult:[],
            gameInfo:{}
        },
        methods : {
            updateData: function (data) {
                this.playerResult = data.playerInfoList;
                this.gameInfo = data;
            }
        }
    });

});


// 获取比赛
function getGameResult() {

    var parameter = {};
    parameter["gameId"] = gameId;
    var url = path + "/game/getGameResult";
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
        }
    });
}

