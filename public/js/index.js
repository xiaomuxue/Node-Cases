/**
 * Created by Shenfq on 2016/9/29.
 */
window.uid = '';
checkLogin();

if(window.navigator.userAgent.toLowerCase().indexOf('mobile')==-1){
    //PC端
    var timer = null;
    $('#dropdown-toggle1').hover(function() {
        clearTimeout(timer);
        $('#dropdown1').addClass('open');
    },function() {
        timer = setTimeout(function(){
            $('#dropdown1').removeClass('open');
        },100);
    });

    $('#dropdown-menu1').hover(function() {
        clearTimeout(timer);
    },function() {
        timer = setTimeout(function(){
            $('#dropdown1').removeClass('open');
        },100);
    });

    $('#dropdown-toggle2').hover(function() {
        clearTimeout(timer);
        $('#dropdown2').addClass('open');
    },function() {
        timer = setTimeout(function(){
            $('#dropdown2').removeClass('open');
        },100);
    });

    $('#dropdown-menu2').hover(function() {
        clearTimeout(timer);
    },function() {
        timer = setTimeout(function(){
            $('#dropdown2').removeClass('open');
        },100);
    }).find('li a').click(function(){
        if( !hasLogin() ){
            return false;
        }
    });
}else{
    //移动端
}

$.get('/getAllClassify',null,function(data) {
    if(data.code=='0'){
        console.log(data.text);
    }else{
        var currentCid = '';
        var $currentUl;
        var $showclassify = $('#showclassify');
        var counter = 0;
        $.each(data.json,function(index,item) {
            if( item.cid != currentCid ) {
                currentCid = item.cid;
                $showclassify.append('<li><span>'+item.cname+'</span><ul id="c'+item.cid+'"></ul></li>');
                $currentUl = $('#c'+currentCid);
                counter = 0;
            }
            counter++;
            if(counter<=6) {
                $currentUl.append('<li><a href="/showSubdivide/' + item.sid + '">' + item.sname + '</a></li>');
            }
        });
    }
},'json');


function checkLogin(){
    $.post('/checkLogin',null,function(data){
        if(data.code == '0'){
            var str = '<a class="btn btn-def" href="/login.html">登录</a>'+
                '<a class="btn btn-def" href="/register.html">注册</a>';
            $('#logingroup').html(str);
        }else if(data.code == '1'){
            var str = '<img style="width:34px;height:34px;left:-34px;position:absolute;" src="'+data.json.icon+'" />'+
                '<a class="btn btn-def" href="/showHomePage/"'+data.json.uid+'>'+data.json.uname+'</a>'+
                '<a class="btn btn-def" href="javascript:exitLogin('+data.json.uid+')">退出登录</a>';
            $('#logingroup').html(str);
            uid = data.json.uid;

            if( $cimg = $('#addComment-img')[0] ){
                $cimg.src = data.json.icon;
            }
        }
    },'json');
}

function exitLogin(uid){
    $.popup.confirm({
        'position':'middle',
        'title': '提示信息',
        'msg': '你确定要退出吗？',
        'okmsg': '去意已决',
        'offmsg': '容我想想',
        'okCallback': function(){
            $.post('/exitLogin',{uid:uid},function(data){
                var data = $.trim(data);
                if(data == 'ok'){
                    var str = '<a class="btn btn-def" href="/login.html">登录</a>'+
                        '<a class="btn btn-def" href="/register.html">注册</a>';
                    $('#logingroup').html(str);
                    window.uid = '';
                }else if(data == 'error'){
                    alert('退出失败');
                }
            },'text');
        }
    });
}


function hasLogin(){
    if(uid == ''){
        $.popup.alert({
            'position':'middle',
            'title': '提示信息',
            'msg': '您还没有登录',
            'okmsg': '去登录',
            'okCallback': function(){
                location.href='/login.html';
            }
        });
        return false;
    }else{
        return true;
    }
}