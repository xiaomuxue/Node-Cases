/**
 * Created by YC on 2016/10/10.
 */

$(function(){
    replay();
    SubAns();
    foodsanswerRight();
    replayanswer();
});

/* 输入文本框控制字数 */
/*$(function(){
 $("#myt").focus(function(){
 var str=$(this).text();
 $(this).css({"border":"1px solid rgb(31,166,88)"});
 if(str.length<=140){
 $("#myp").text("你还可以输入"+(140-str.length)+"个字");
 }else{
 $("#myp").text("你已经超出"+(str.length-140)+"个字");
 }
 });
 $("#myt").blur(function(){
 $(this).css({"border":"1px solid #333"});
 $("#myp").text("添加答案");
 });
 $("#myt").keyup(function(){
 var str=$("#myt").value;
 if(str.length<=140){
 $("#myp").text("你还可以输入"+(140-str.length)+"个字");      //控制所输入文本的字数
 }else{
 $("#myp").text("你已经超出"+(str.length-140)+"个字");
 }
 });      //真正的微博是使用keypress或者keydown     //JQuery写的

 });
 */
var myp=document.getElementById("myp");
var myt=document.getElementById("myt");
myt.onfocus=function(){               //获焦事件：把它写活
    var str=myt.value;
    myt.style.border="1px solid rgb(31,166,88)";
    if(str.length<=140){
        myp.innerHTML="你还可以输入"+(140-str.length)+"个字";
    }else{
        myp.innerHTML="你已经超出"+(str.length-140)+"个字";
    }
}
myt.onblur=function(){
    myp.innerHTML="添加答案";
    myt.style.border="1px solid #333";
}

myt.onkeyup=function(){
    var str=myt.value;
    if(str.length<=140){
        myp.innerHTML="你还可以输入"+(140-str.length)+"个字";      //控制所输入文本的字数
    }else{
        myp.innerHTML="你已经超出"+(str.length-140)+"个字";
    }
}      //真正的微博是使用keypress或者keydown
// 原生JS写的

//点击回复框时，失焦和获焦时边框色彩的更改
$("#click").focus(function(){
    $(this).css({"border":"1px solid rgb(31,166,88)"});
});
$("#click").blur(function(){
    $(this).css({"border":"1px solid #333"});
});

$("#replay-frame").click(function(){
    if( $("#replay").css("display","none") ){
        $("#replay").css({"display":"block"});
    }else{
        $("#replay").css({"display":"none"});
    }
});

//获取提交答案上面的信息
function replay(){
    var id = location.search.split('=')[1];
    var headstr='';
    var contentstr='';
    $.post('/replayanswer/'+id,function(data){
        headstr='<a href=""><img src="'+data.json[0].icon+'" style="border-radius:50%;width:50px;height:50px;"/><span id="name">'+data.json[0].uname+
            '</span></a><span class="pull-right">浏览<i>'+data.json[0].visits+'</i>次数</span>';
        $("#headpanel").append(headstr);
        contentstr='<h4>'+data.json[0].content+'</h4>';
        $("#contentpanel").prepend(contentstr);
    });
}

//提交答案的js
function SubAns(){
    var id = location.search.split('=')[1];
    $('#putanswer').on('click',function(){
        if( window.uid != '' ){
            var content = $.trim( $('#myt').val() );
            $.post('/submitanswer',{questionid:id,uid:uid, content: content},function(data) {
                if(data.code == '0'){
                    $.promptInfo({
                        'position': 'bottom',
                        'msg': data.text,
                        'time': '5000'
                    });
                }else if(data.code == '1'){
                    location.reload();      //页面加载事件，直接刷新
                    window.location.href='foodanswer.html?id='+id;
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
}

//未回答的问题
function foodsanswerRight(){
    $.get('/Notanswer',function(data){
        console.log(data.json);
        var RightContstr='';
        var total=data.json.length;
        if(total>9){
            total=9;
        }
        for(var j=0;j<total;j++){
            RightContstr+='<li><a href="#">'+data.json[j].content+'</a></li>';
        }
        $("#Nanswer").append(RightContstr);
    },"json");
};

//回复那一块
function replayanswer(){
    var id = location.search.split('=')[1];
    $.post('/replay',{questionid:id},function(data){
        var panelHestr='<h5><span>'+data.json[1].count+'</span>条回答</h5>';
        $('#Answer').html(panelHestr);
        var Repstr='<p class="answer-auth"><a href="" class="answer-name">'+
            data.json[1].uname+'</a> <span class="answer-time">'+(data.json[1].TIME).substr(0,10)+
            '</span></p><p class="answer-conent">'+data.json[1].content+'</p>';
        $("#infoReplay").html(Repstr);
    });
}

