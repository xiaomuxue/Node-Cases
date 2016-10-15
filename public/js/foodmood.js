/**
 * Created by lenovo on 2016/10/8.
 */
$(function(){
    rankTop();
    getGoodsInfoPageOne(0,5);
});

//function foodmood(){
//    $.get('/foodMood',function(data){
//         var userstr='';
//         for(var i=0;i<5;i++){
//             userstr='<div class="col-lg-3" style="margin: 20px -20px;"><a href="#">'
//                 +'<img src="'+data.json[i].icon+'" style="width: 65px;height: 65px;"/></a><p><a href="#">'+data.json[i].uname+'</a></p></div>'+
//             '<div class="col-lg-9 sjx" style="margin: 20px 0;"><div class="thumbnail">'+
//             '<h3 class="text-success">'+data.json[i].moodtitle+'<small class="pull-right" style="margin-right: 20px;margin-top: 5px">'+(data.json[i].TIME).substr(11,5)+'</small></h3>'+
//             '<p style="cursor: pointer;margin-left: -40px">'+data.json[i].moodcontent+'</p><a href="foodmood-detail.html" style="cursor: pointer">'+'<img src="'+data.json[i].pic+'" style="width: 360px;height: 360px;"/></a><div class="caption text-right"><button class="btn btn-success">赞<span class="glyphicon glyphicon-heart"></span></button>'+'<input type="button" value="评论" class="btn btn-success"/></div></div></div>';
//             $("#userinfo").append(userstr);
//         }
//         //var userstr2='';
//         //for(var i=0;i<4;i++){
//         //    userstr2='<div class="row"><div class="col-lg-4"><a href=""><img src="'+data.json[i].icon+'" style="width: 70px;height: 70px"/></a></div><div class="col-lg-8"><h4><a href="">'+data.json[i].moodtitle+'</a></h4><p>by &nbsp;<a href="">'+data.json[i].uname+'</a></p></div></div><br/>'
//         //    $("#foodinfo").append(userstr2);
//         //}
//    });
//}
var currentPage = 1;
var pagetotal = 1;
function getGoodsInfoPageOne(pageNo,pageSize){
    $.post("/getmoodInfoByPageOne",{pageNo:pageNo,pageSize:pageSize},function(data){
        pagetotal = Math.ceil(data.total/pageSize);
        var userstr='';
        $.each(data.json,function(index,item){
                    console.log(item);
                    userstr+='<div class="col-lg-3" style="margin: 20px -20px;"><a href="#">'
                        +'<img src="'+item.icon+'" style="width: 65px;height: 65px;"/></a><p><a href="#">'+item.uname+'</a></p></div>'+
                        '<div class="col-lg-9 sjx" style="margin: 20px 0;"><div class="thumbnail">'+
                        '<h3 class="text-success">'+item.moodtitle+'<small class="pull-right" style="margin-right: 20px;margin-top: 5px">'+(item.TIME).substr(11,5)+'</small></h3>'+
                        '<p style="cursor: pointer;margin-left: -40px">'+item.moodcontent+'</p><a href="foodmood-detail.html" style="cursor: pointer">'+'<img src="'+item.pic+'" style="width: 360px;height: 360px;"/></a><div class="caption text-right"><button class="btn btn-success">赞<span class="glyphicon glyphicon-heart"></span></button>'+'<input type="button" value="评论" class="btn btn-success"/></div></div></div>';



        });
        $("#userinfo").html(userstr);

        var pagestr = '<li class="disabled"><a href="javascript:void(0)">&laquo;</a></li>';
        for(var i=1;i<=pagetotal;i++){
            pagestr += i==1
                ?'<li class="active"><a href="javascript:showGoodsInfoByPage('+i+',5)">'+i+'</a></li>'
                :'<li><a href="javascript:showGoodsInfoByPage('+i+',5)">'+i+'</a></li>';
        }
        pagestr += '<li><a href="javascript:showGoodsInfoByPage('+(currentPage+1)+',5)">&raquo;</a></li>';
        $("#mypage").html(pagestr);
    },"json");

}

function showGoodsInfoByPage(pageNo,pageSize){
    $.post("/getmoodInfoByPage",{pageNo:pageNo,pageSize:pageSize},function(data){
        $("#userinfo").html("");
        $.each(data,function(index,item){
            var userstr='';
            userstr='<div class="col-lg-3" style="margin: 20px -20px;"><a href="#">'
                +'<img src="'+item.icon+'" style="width: 65px;height: 65px;"/></a><p><a href="#">'+item.uname+'</a></p></div>'+
                '<div class="col-lg-9 sjx" style="margin: 20px 0;"><div class="thumbnail">'+
                '<h3 class="text-success">'+item.moodtitle+'<small class="pull-right" style="margin-right: 20px;margin-top: 5px">'+(item.TIME).substr(11,5)+'</small></h3>'+
                '<p style="cursor: pointer;margin-left: -40px">'+item.moodcontent+'</p><a href="foodmood-detail.html" style="cursor: pointer">'+'<img src="'+item.pic+'" style="width: 360px;height: 360px;"/></a><div class="caption text-right"><button class="btn btn-success">赞<span class="glyphicon glyphicon-heart"></span></button>'+'<input type="button" value="评论" class="btn btn-success"/></div></div></div>';
            $("#userinfo").append(userstr);
            currentPage = pageNo;
            var pagestr = 1==currentPage
                ?'<li class="disabled"><a href="javascript:void(0)">&laquo;</a></li>'
                :'<li><a href="javascript:showGoodsInfoByPage('+(currentPage-1)+',5)">&laquo;</a></li>';;
            for(var i=1;i<=pagetotal;i++){
                pagestr += i==currentPage
                    ?'<li class="active"><a href="javascript:showGoodsInfoByPage('+i+',5)">'+i+'</a></li>'
                    :'<li><a href="javascript:showGoodsInfoByPage('+i+',5)">'+i+'</a></li>';
            }
            pagestr += pagetotal==currentPage
                ?'<li class="disabled"><a href="javascript:void(0)">&raquo;</a></li>'
                :'<li><a href="javascript:showGoodsInfoByPage('+(currentPage+1)+',5)">&raquo;</a></li>';
            $("#mypage").html(pagestr);

        });
    },"json");
}

function rankTop(){
    $.post('/rankMood',function(data){
        var rankstr='';
        for(var i=0;i<5;i++){
            rankstr+='<div class="row"><div class="col-lg-4"><a href=""><img src="'+data[i].icon+'" style="width: 65px;height: 65px"/></a></div><div class="col-lg-8"><h5>TOP<span class="badge" style="background:rgb(111,191,177);">'+(i+1)+'</span></h5><p><a href="">'+
            data[i].uname+'</a></p></div></div><br/>';
        }
        $("#rankT").html(rankstr);
    });
}
