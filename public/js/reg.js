$.get('/getAllClassify',null,function(data) {
    if(data.code=='0'){
        console.log(data.text);
    }else{
        var currentCid = '';
        var $checkContent;
        var $Classify = $('#classify');
        var $Subdivide = $('#subdivide');
        $.each(data.json,function(index,item) {
            if( item.cid != currentCid ) {
                currentCid = item.cid;
                var classifystr = index==0
                    ? '<li class="active"><a href="#checkC'+currentCid+'" data-toggle="tab">'+item.cname+'</a></li>'
                    :'<li><a href="#checkC'+currentCid+'" data-toggle="tab">'+item.cname+'</a></li>';
                $Classify.append(classifystr);
                var subdividestr = index==0
                    ? '<li id="checkC'+currentCid+'" class="tab-pane active"><div id="Content'+currentCid+'" data-toggle="buttons"></div></li>'
                    : '<li id="checkC'+currentCid+'" class="tab-pane"><div id="Content'+currentCid+'" data-toggle="buttons"></div></li>';
                $Subdivide.append(subdividestr);
                $checkContent = $('#Content'+currentCid);
            }
            $checkContent.append('<label for="s'+item.sid+'" class="btn btn-default"> ' +
                '<input id="s'+item.sid+'" value="'+item.sid+' '+item.sname+'" name="kinds" type="checkbox">' +
                item.sname+
                '</label>');
        });
    }
},'json');

$('#userimg').on('change',function(){
    var file = this.files[0];
    var reader=new FileReader();
    if(/image\/\w+/.test(file.type)){
        reader.readAsDataURL(file);
        reader.onload=function(){
            var result=this.result;
            $('#showimg').css('background-image','url('+result+')')
                .css('background-size','cover')
                .find('p').html('点击可更换头像(小于200k)');
        }
    }
});


$('#myform').bootstrapverify({
    uname: {
       notEmpty: {
           message: '用户名不能为空'
       },
       stringLength: {
           arguments:{
                min: 3,
                max: 10
           },
           message: '用户名长度必须在3到10个字符之间'
       },
       regexp: {
            arguments: {reg: /^[a-zA-Z0-9\u4E00-\u9FA5_]+$/},
            message: '用户名只能包含中文字符、大小写字母、数字和下划线'
        },
        ajaxcallbacks: {
            arguments: {
                url: '/checkUname',
                method: 'POST'
            },
            message: '用户名已存在'
        }
   },
   telephone: {
       notEmpty: {
           message: '手机号码不能为空'
       },
       regexp: {
           arguments: {reg: /^[1][3-8]\d{9}$/},
           message: '手机号码格式错误'
       }
   },
   email: {
       notEmpty: {
           message: '邮箱不能为空'
       },
       emailAddress: {
           message: '邮箱格式错误'
       }
   },
   birthday: {
       notEmpty: {
           message: '生日不能为空'
       },
       date: {
           message: '生日格式错误'
       }
   },
   password: {
        notEmpty: {
           message: '密码不能为空'
        },
        stringLength: {
           arguments: {
                min: 6,
                max: 16
           },
           message: '密码长度在6到16之间'
        }
   },
   againpassword: {
        notEmpty: {
           message: '确认密码不能为空'
        },
        identical: {
            arguments: {
                field: 'password'
            },
            message: '两次输入密码不一致'
        }
       
   }
});