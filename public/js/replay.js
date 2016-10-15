/**
 * Created by YC on 2016/10/1.
 */

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

//提交答案的js
function SubAns(){

}


//回复框
function replay(){
    $("a").next(".issue").css("display","block");
       /* if( $(".issue").css("display","none")){
            $(".issue").css("display","block");
            $(".issue").siblings().css("display","none");
        }else{
            $(".issue").css("display","none");
        }   */
}

//点击回复框时，失焦和获焦时边框色彩的更改
$("#click").focus(function(){
   $(this).css({"border":"1px solid rgb(31,166,88)"});
});
$("#click").blur(function(){
    $(this).css({"border":"1px solid #333"});
});
