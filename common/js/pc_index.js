/**
 * Created by majingyuan on 2017/5/29.
 */
var vm = null;
var gameInfo = {};
var userId = $.cookie('userId');

// 初始化加载vue
$(document).ready(function() {

    checkUser();
    getGameList();
    vm = new Vue({
        el : '#body',
        data : {
            gameList : [],
            gameInfo : gameInfo,
            roleList : []
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
                this.roleList = game.gameRoleInfoList;

                $('#editGame').modal('show');
                editor.setData(game.gameRole);
            },
            editPlayer : function (gameId) {
                window.location.href="player.html?gameId="+gameId;
            },
            saveGameInfo : function () {
                var gameId = $("#gameId").val();
                var gameName = $("#gameName").val();
                var gameOwner = $("#gameOwner").val();
                var startDate = $("#startDate").val();
                var gameRole = editor.getData();
                var roleList = [];
                var tempIndex = 0;
                // var realNameFlag = $("input:radio[name='realNameFlag']:checked").val();
                var changeScoreFlag = $("input:radio[name='changeScoreFlag']:checked").val();

                if (gameName === ""){
                    alert("比赛名称不能为空");
                    $('#gameName').focus();
                    return;
                }
                if (gameOwner === ""){
                    alert("主办单位不能为空");
                    $('#gameOwner').focus();
                    return;
                }
                if (startDate === ""){
                    alert("比赛时间不能为空");
                    $('#startDate').focus();
                    return;
                }


                $("#roleList").find(".roleDetail").each(
                    function() {
                        var roleDetail = {};
                        roleDetail["roleId"] = $("input[name='roleId_"+tempIndex+"']").val();
                        roleDetail["roleIndex"] = $("input[name='roleIndex_"+tempIndex+"']").val();
                        roleDetail["roleName"] = $("input[name='roleName_"+tempIndex+"']").val();
                        roleDetail["roleScore"] =  $("input[name='roleScore_"+tempIndex+"']").val();

                        if (roleDetail["roleName"] === "" || roleDetail["roleScore"] === ""){
                            alert("评分项目不能为空");
                            return;
                        }
                        roleList.push(roleDetail);
                        tempIndex = tempIndex + 1;
                    }
                );

                var param = {};
                param['gameId'] = gameId;
                param['gameName'] = gameName;
                param['gameOwner'] = gameOwner;
                param['startDate'] = startDate;
                param['gameRole'] = gameRole;
                param['gameRoleInfoList'] = roleList;
                param['addBy'] = userId;
                param['changeScoreFlag'] = changeScoreFlag;
                var jsonOb = eval(param);

                // var ajax_data = JSON.stringify(param);
                var url = path + '/game/updateGameInfo';
                $.ajax({
                    data : JSON.stringify(jsonOb),
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    contentType: 'application/json;charset=utf-8',
                    success : function(data) {
                        alert(data.message);
                        if (data.flag === 'success'){
                           $('#editGame').modal('hide');
                            //创建或修改成功后进入选手编辑界面
                            window.location.href="player.html?gameId="+data.gameId;
                        }
                    },
                    error : function() {
                        alert("发生错误，稍后请重试!");
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

                        if (data.flag === 'success'){
                            getGameList();
                        }
                        tipMessage.html(data.message);
                        $('#changeTip').modal('show');
                    },
                    error : function() {
                        alert("发生错误，稍后请重试!");
                    }
                });
            }
        }
    });
    initDatePicker();
    var editor = CKEDITOR.replace('gameRole');
});


// 获取比赛列表
function getGameList() {
    var parameter = {gameDeleted:'0', gameActive:'0', addBy:userId};

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

//添加新规则
function addNewRole() {
    var roleCount = $("#roleDetail_0").length;
    var roleDetail = $("#roleDetail_0").clone();

    $("#roleList").append(roleDetail);
    updateNewRoleIndex();
}

//移除一个规则
function removeRole(tempIndex)
{
    if(tempIndex > 0){
        $("#roleDetail_" + tempIndex).remove();
        updateNewRoleIndex();
    }
}

//修改新增规则的序号
function updateNewRoleIndex() {
    var tempIndex = 0;
    var roleList = $("#roleList").find(".roleDetail");
    roleList.each(
        function() {
            $(this).attr("id","roleDetail_"+tempIndex);
            if (tempIndex > 0){
                $(this).find("#removeRole").attr("onclick",
                    "removeRole(" + tempIndex + ");");
            }

            // 更正表单name
            var paramArray = new Array("roleIndex","roleName", "roleScore");
            for ( var i in paramArray) {
                var param = paramArray[i];
                $(this).find("#" + param).attr(
                    "name",
                    param + "_" + tempIndex);

                if (param === "roleIndex"){
                    $(this).find("#" + param).attr(
                        "value",
                        tempIndex);
                }
            }

            tempIndex = tempIndex + 1;
        }
    );
}

// 检查用户权限
function checkUser() {
    var userId = $.cookie('userId');
    var parameter = {};
    parameter["userId"] = userId;
    var url = path + "/user/checkUserInfoById";
    $.ajax({
        data : parameter,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            if (data != ""){
                //在菜单中添加用户管理
                $("#nav").append(data.menu);
            }
        },
        error : function() {

        }
    });
}

// 转向用户管理
function userManager() {

    window.location.href=imgUrl + "/manager/manager_user.html";
}