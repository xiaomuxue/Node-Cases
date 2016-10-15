var fid = location.pathname.split('/')[2];
var currentPage = 1;
var pageCount = 1;
var $likebtn = $('#likeMenubtn');
var $likeicon = $likebtn.find('.glyphicon');
showComment(1,5,true);
getLikeInfo();

$.post('/getHotMenu',null,function(data) {
    if(data.code=='0'){
        $.popup.alert({
            'position':'middle',
            'title': '提示信息',
            'msg': data.text,
            'okmsg': '重新加载',
            'okCallback': function(){
                location.reload();
            }
        });
    }else if(data.code=='1'){
        var $hotContent = $('#hotMenu');
        var htmlstr = '';
        $.each(data.json,function(index,item){
            htmlstr += '<li><a href="/showMenu/'+item.fid+'">'+item.title+'</a></li>';
        });
        $hotContent.html(htmlstr);
    }

},'json');

$.post('/getHotQuestion',null,function(data) {
    if(data.code=='0'){
        $.popup.alert({
            'position':'middle',
            'title': '提示信息',
            'msg': data.text,
            'okmsg': '重新加载',
            'okCallback': function(){
                location.reload();
            }
        });
    }else if(data.code=='1'){
        var $hotContent = $('#hotQuestion');
        var htmlstr = '';
        $.each(data.json,function(index,item){
            htmlstr += '<li><a href="/showMenu/'+item.questionid+'">'+item.content+'</a></li>';
        });
        $hotContent.html(htmlstr);
    }

},'json');


function showComment(pageNo,pageSize,flag){
    $.post('/getMenuComment',{fid:fid,pageNo:pageNo,pageSize:pageSize}, function(data) {
        var str = '';
        pageCount = Math.ceil(data.count/pageSize);
        var $commentcontent = $('#comment-content');
        var $commnetpage = $('#comment-page');
        $.each(data.json,function(index,item) {
            str += '<div class="row show-comment">'+
                '<div class="col-lg-2">'+
                    '<a href="/showHomePage/'+item.uid+'"><img class="auth-img" src="'+item.icon+'" alt="'+item.uname+'"></a>'+
                '</div>'+
                '<div class="col-lg-10">'+
                    '<p class="comment-title">'+
                    '<span>'+item.uname+'</span>&nbsp;<span class="comment-time">'+item.time+'</span>&nbsp;<a href="javascript:void(0)" onclick="showReply(this)">回复</a>'+
                    '</p>'+
                    '<p class="comment-text">'+item.content+'</p>'+
                '</div>' +
                '<div class="row addreply col-lg-10 pull-right">' +
                '<textarea class="re_textarea" placeholder="我也说一句" id="text_2956429"></textarea>' +
                '<button type="button" onclick="addReply(this,'+item.commentid+')" class="btn btn-def pull-right" >回复</button>' +
                '</div>'+
            '</div>';
        });
        if(flag){
            $commentcontent.html(str);
        }else{
            $commentcontent.append(str);
        }


        if(data.count>pageSize){
            var pagestr = currentPage >= pageCount ?
            '<button disabled class="btn btn-def" onclick="showComment('+(currentPage+1)+','+pageSize+')"> 没有更多评论 </button>' :
            '<button class="btn btn-def" onclick="showComment('+(currentPage+1)+','+pageSize+')"> 查看更多评论 </button>';

            $commnetpage.html(pagestr);
        }
        ++currentPage;

    },'json');
}

function showReply(ele) {
    var $repalyarea = $(ele).parents('.show-comment').find('.addreply');
    if($repalyarea.is(":visible")){
        $(ele).text('回复');
        $repalyarea.slideUp();
    }else{
        $(ele).text('收起');
        $repalyarea.slideDown();
        $repalyarea.find('textarea').focus();
    }
}

function addReply(ele,commentid){
    if(hasLogin()){
        var $replayarea = $(ele).prev()
        var content = $replayarea.val();
        if(content==''){
            $.popup.alert({
                'position':'middle',
                'title': '提示信息',
                'msg': '您的评论为空',
                'okmsg': '重新评论',
                'okCallback': function(){
                    $replayarea.focus();
                }
            });
        }else{

            $.post('/addMenuReply',{commentid:commentid,content:content},function(data) {
                if(data.code == '0'){
                    $.popup.alert({
                        'position':'middle',
                        'title': '提示信息',
                        'msg': data.text,
                        'okmsg': '重新评论',
                        'okCallback': function(){
                            $replayarea.focus();
                        }
                    });
                }else if(data.code == '1'){
                    $replayarea.val('');
                    showComment(1,5,true);
                }
            },'json');
        }
    }
}

function addComment(fid) {
    if(hasLogin()){
        var $comment = $('#comment');
        var contentval = $.trim( $comment.val() );
        if(contentval==''){
            $.popup.alert({
                'position':'middle',
                'title': '提示信息',
                'msg': '您的评论为空',
                'okmsg': '重新评论',
                'okCallback': function(){
                    $comment.focus();
                }
            });
        }else{
            $.post('/addMenuComment',{fid:fid,content:contentval},function(data) {
                if(data.code == '0'){
                    $.popup.alert({
                        'position':'middle',
                        'title': '提示信息',
                        'msg': data.text,
                        'okmsg': '重新评论',
                        'okCallback': function(){
                            $comment.focus();
                        }
                    });
                }else if(data.code == '1'){
                    $comment.val('');
                    showComment(1,5,true);
                }
            },'json');
        }
    }
}

function likeMenu() {
    if(hasLogin()){
        if($likebtn.hasClass('haslike')){
            $.post('/unlikeIt',{tablename:'menulike',id:fid},function(data){
                if(data.code == '0'){
                    $.popup.alert({
                        'msg': data.text
                    });
                }else if(data.code == '1'){
                    $likebtn.removeClass('haslike');
                    getLikeInfo();
                }
            },'json');
        }else{
            $.post('/likeIt',{tablename:'menulike',id:fid},function(data){
                if(data.code == '0'){
                    $.popup.alert({
                        'msg': data.text
                    });
                }else if(data.code == '1'){
                    $likebtn.addClass('haslike');
                    $likeicon.clone().css({
                        'position': 'absolute',
                        'left': $likeicon.position().left,
                        'top': $likeicon.position().top
                    }).appendTo($likebtn).animate({
                        'top': '-30px',
                        'opacity': '0.3'
                    },function(){
                        $(this).remove();
                    });
                    getLikeInfo();
                }

            },'json');
        }
    }
}

function getLikeInfo() {
    $.post('/getLinkinfo',{tablename:'menulike',id:fid},function(data) {
        $likebtn.find('.badge').text(data.total);
        if(data.haslike){
            $likebtn.addClass('haslike');
        }
    },'json');
}

