/**
 * Created by lenovo on 2016/10/8.
 */
$(function(){
    foodmood();
    foodmoodtwo();
});
var mysearch = location.search.split('&');
var uid = mysearch[1].split('=')[1];
var moodid = mysearch[0].split('=')[1];
function foodmood(){
    $.post('/foodMood',{uid:uid,moodid:moodid},function(data) {
        console.log(data);
        var htmlstr = '<h3 class="text-success" style="margin-left: 150px">'+data.moodtitle+'<small class="pull-right" style="padding-right: 30px;padding-top: 5px">'+data.mytime+'</small></h3>'+
            '<p style="cursor: pointer;margin-left: -40px">'+data.moodcontent+'</p>'+
            '<a href="" style="cursor: pointer"><img src="'+data.pic+'" alt="'+data.moodtitle+'" style="margin-bottom: 20px"/></a>'+
            '<div class="caption" style="margin-bottom: 30px">'+
            '<button class="btn btn-success"><span class="glyphicon glyphicon-heart"></span>&nbsp;<span class="badge">'+data.likenum+'</span></button>'+
            '<input type="button" value="评论" class="btn btn-success"/>'+
            '</div>';
        $('#include').html(htmlstr);

        var htmlstr2='<img src='+data.icon+' alt='+data.uname+'>'+'<a href="" style="color:#2BC467">'+data.uname+'&nbsp;</a><i style="font-size:16px;color:red">'+'日记'+'<span class="badge" style="background:pink;margin-left: 5px">'+data.total+'</span></i>'
        $('#userinfo').html(htmlstr2);
    })
}

function foodmoodtwo(){
    $.post('/foodMoodtwo',{uid:uid},function(data) {
        console.info(data);
        var i='<h3>TA的最新日记<small class="badge" style="background-color:#8CCCC1">'+data.length+'</small></h3><br />';
        $('#selfinfo').append(i);
        var htmlstr3='';
        for(var i=0;i<data.length;i++){
            htmlstr3+='<img src="'+data[i].pic+'" alt="菜品名" style="width: 73px;height: 73px; margin: 2px;"/>';
        }
        $('#selfinfo').append(htmlstr3);
    })
}
