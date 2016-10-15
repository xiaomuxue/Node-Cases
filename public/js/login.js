/**
 * Created by Shenfq on 2016/10/3.
 */
$('#myform').bootstrapverify({
    uname: {
        notEmpty: {
            message: '用户名不能为空'
        }
    },
    pwd: {
        notEmpty: {
            message: '密码不能为空'
        }
    }
});
$('.form-control-feedback').css('top','25px');
function logining(){
    var uname = $.trim( $('#uname').val() );
    var pwd = $.trim( $('#pwd').val() );
    $.post('/userLogin',{uname: uname, pwd: pwd},function(data) {
        if(data.code == '0'){
            $.promptInfo({
                'position': 'top',
                'msg': data.text,
                'time': '5000'
            });
        }else if(data.code == '1'){
            $.popup.alert({
                'position':'top',
                'title': '提示信息',
                'msg': data.text,
                'okmsg': '重新输入',
                'okCallback': function(){
                    $('#uname').val('').parent().removeClass('has-feedback has-success').find('i').css('display','none');
                    $('#pwd').val('').parent().removeClass('has-feedback has-success').find('i').css('display','none');
                }
            });
        }else if(data.code == '2'){
            location.href = data.referer;
        }
    },'json');
}