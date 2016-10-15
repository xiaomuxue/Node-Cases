/**
 * Created by YC on 2016/9/30.
 */

$(function(){
    foodsQuestionRight();
    foodsQuestionFoot();
    getFoodsInfoByPageOne(1,12);
});


$('#putquestion').on('click',function(){
    if( window.uid != '' ){
        var content = $.trim( $('#mytxt').val() );
        $.post('/askQuestion',{uid:uid, content: content},function(data) {
            if(data.code == '0'){
                $.promptInfo({
                    'position': 'bottom',
                    'msg': data.text,
                    'time': '5000'
                });
            }else if(data.code == '1'){
                location.reload();      //页面加载事件，直接刷新
                window.location.href='foodanswer.html';
            }
        },'json');
    }else{
        $.popup.alert({
            'position':'middle',
            'title': '提示信息',
            'msg': '您还没有登录',
            'okmsg': '去登录',
            'okCallback': function(){
                location.href = '/login.html';
            }
        });
    }

});

//分页
var total = 0;
var totalPages = 0;
function getFoodsInfoByPageOne(pageNo,pageSize){
    $.post("/getFoodsInfoByPageOne",{pageNo:pageNo,pageSize:pageSize},function(data){
        $("#div1").html('');     //清空html里面的内容
        var Headstr='';
        var Constr='';
        Headstr='<div class="list-group-item Header">'+
            '<span class="pull-left">问题</span>'+
            '<span id="Middle">答案</span>'+
            '<span class="pull-right">时间</span></div>';
        $("#div1").append(Headstr);
        for(var i=0;i<12;i++) {
            Constr = '<div class="list-group-item"><div class="list-group-item-text">' +
                '<a href="foodanswer.html?id='+data.objs[i].questionid+'" style="width:160px">' + data.objs[i].qcontent + '</a></div>' +
                '<span class="list-group-item-text" style="display:inline-block;width:200px">' + data.objs[i].acontent + '</span><span class="pull">'
                + data.objs[i].count + '</span><span class="pull-right pull">' + (data.objs[i].TIME).substr(11, 5) + '</span></div>';
            $("#div1").append(Constr);
        }
        total=parseInt(data.total);    //获取总记录数
        totalPages=Math.ceil(total/pageSize);
        for(var i=1;i<=totalPages;i++){
            if (i == 1) {
                $("#pagetion").append($('<li><a href="javascript:showFoodsInfoByPage(' + i + ',' + pageSize + ')" class="checked">' + i + '</a></li>'));
            } else {
                $("#pagetion").append($('<li><a href="javascript:showFoodsInfoByPage(' + i + ',' + pageSize + ')" class="unchecked">' + i + '</a></li>'));
            }
        }
    },"json");
}

//分页查询商品信息
//pageNo:查第几页
//pageSize:每页有多少条
function showFoodsInfoByPage(pageNo,pageSize){
    $.post("/getFoodsInfoByPage",{pageNo:pageNo,pageSize:pageSize},function(data){
        $("#div1").html('');
        var Headstr='';
        var Constr='';
        Headstr='<div class="list-group-item Header">'+
            '<span class="pull-left">问题</span>'+
            '<span id="Middle">答案</span>'+
            '<span class="pull-right">时间</span></div>';
        $("#div1").append(Headstr);
        for(var i=0;i<data.length;i++){
            Constr = '<div class="list-group-item"><div class="list-group-item-text">' +
                '<a href="foodanswer.html?id='+data[i].questionid+'" style="width:160px">' +data[i].qcontent + '</a></div>' +
                '<span class="list-group-item-text" style="display:inline-block;width:200px">' + data[i].acontent + '</span><span class="pull">'
                + data[i].count + '</span><span class="pull-right pull">' + (data[i].TIME).substr(11, 5) + '</span></div>';
            $("#div1").append(Constr);
        }
        //  $("#pagetion li a").attr("class","unchecked");     //自动生成分页数，把属性设为未选
        //  $("#pagetion li a").eq(pageNo-1).attr("class","checked");    //表示选中的那页为checked的属性
    },'json');
}
//未回答的问题
function foodsQuestionRight(){
    $.get('/Notanswer',function(data){
        var RightContstr='';
        for(var i=0;i<7;i++){
            RightContstr='<div class="page-header">' +
                '<a href="foodanswer.html?id='+data.json[i].questionid+'"><h5 style="width:160px">'+data.json[i].content+'</h5>'+
                '<span class="pull-right browse">'+data.json[i].visits+'浏览</span></a></div>';
            $("#contentRight").append(RightContstr);
        }
    });
};


//答题排行榜
function foodsQuestionFoot(){
    var FootHeadstr='';
    var FootConstr='';
    FootHeadstr='<h4 class="text-center">答题排行</h4>';
    $("#contentFooter").append(FootHeadstr);
    $.get('/answerlist',function(data){
        for(var i=0;i<3;i++){
            FootConstr='<div class="page-header"><div class="col-lg-3 col-md-12">' +
                '<a href=""><img src="'+data.json[i].icon+'" class="img-circle" height="50px" width="50px"/></a>' +
                '</div><div><a href=""><span class="name">'+data.json[i].uname+'</span></a></div>' +
                '<div class="replay"><p>回答了<span>'+data.json[i].count+'</span>个问题</p></div>' +
                '</div>';
            $("#contentFooter").append(FootConstr);
        }
    });
}


