;(function(w, d, $, undefined){
    var successStr = '<i id="inputsuccess" class="verifyinfo form-control-feedback glyphicon glyphicon-ok" style="top: 0px; z-index: 100; display: none;"></i>';
    var errorStr = '<i id="inputerror" class="verifyinfo form-control-feedback glyphicon glyphicon-remove" style="top: 0px; z-index: 100; display: none;"></i>';
    function updateState(flag, $formgroup){
        if(flag && !$formgroup.hasClass('has-error')){
            $formgroup.attr('class','form-group has-feedback has-success');
            $formgroup.find('#inputsuccess').show();
            $formgroup.find('#inputerror').hide();
        }else{
            $formgroup.attr('class','form-group has-feedback has-error');
            $formgroup.find('#inputerror').show();
            $formgroup.find('#inputsuccess').hide();
        }
    }
    var defrule = {
        notEmpty: function() {
            var $formgroup = this.parents('.form-group');
            $formgroup.find('.verifyinfo').hide();
            $formgroup.attr('class','form-group has-feedback');
            var val = this.val();
            if(val==''){
                this.flag = false;
                $formgroup.find('#notEmpty').css('display','block');
            }else{
                this.flag = true;
            }
            updateState(this.flag,$formgroup);
        },
        stringLength: function(arg) {
            var $formgroup = this.parents('.form-group');
            var val = this.val();
            var len = val.length;
            if(len<arg.min || len>arg.max){
                this.flag = false;
                $formgroup.find('#stringLength').css('display','block');
            }else{
                this.flag = true;
            }
            updateState(this.flag,$formgroup);
        },
        regexp: function(arg) {
            var $formgroup = this.parents('.form-group');
            var val = this.val();
            if(arg.reg.test(val)){
                this.flag = true;
            }else{
                this.flag = false;
                $formgroup.find('#regexp').css('display','block');
            }
            updateState(this.flag,$formgroup);
        },
        identical: function(arg) {
            var $formgroup = this.parents('.form-group');
            var val = this.val();
            if(val == $(':input[name='+arg.field+']').val() ){
                this.flag = true;
            }else{
                this.flag = false;
                $formgroup.find('#identical').css('display','block');
            }
            updateState(this.flag,$formgroup);
        },
        emailAddress: function() {
            var $formgroup = this.parents('.form-group');
            var val = this.val();
            if(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val)){
                this.flag = true;
            }else{
                this.flag = false;
                $formgroup.find('#emailAddress').css('display','block');
            }
            updateState(this.flag,$formgroup);
        },
        date: function() {
            var $formgroup = this.parents('.form-group');
            var val = this.val();
            if(/(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/.test(val)){
                this.flag = true;
            }else{
                this.flag = false;
                $formgroup.find('#date').css('display','block');
            }
            updateState(this.flag,$formgroup);
        },
        ajaxcallbacks: function(arg){
            var $formgroup = this.parents('.form-group');
            var that = this;
            $.post(arg.url, {uname:this.val()}, function(data) {
                if(data.valid){
                    that.flag = true;
                }else{
                    that.flag = false;
                    $formgroup.find('#ajaxcallbacks').css('display','block');
                }
                updateState(that.flag,$formgroup);
            },'json');
        }
    }

    $.fn.bootstrapverify = function(verifymethod) {
        var $this = $(this);
        $.each(verifymethod, function(name, rules) {
            var $nowinput = $this.find(':input[name='+name+']');
            var $formgroup = $nowinput.parents('.form-group');
            $nowinput.flag = false;
            $formgroup.append(successStr+errorStr);
            $.each(rules, function (index, item) {
                $formgroup.append('<small class="text-danger verifyinfo" id="'+index+'" style="display: none;">'+item.message+'</small>');
                if(defrule[index]){
                    $nowinput.on('input',function(){
                        defrule[index].call($nowinput,item.arguments);
                    });
                }
            });
        });

        $(":submit").on('mouseover',function( ){
            var flag = false;
            $this.find('.form-group').each(function(index, dom) {
                if( $(dom).hasClass('has-error') || $(dom).find(':input').val()==''){
                    flag = true;
                    return false;
                }
            });
            if(flag){
                this.disabled = true;
                var that = this;
                setTimeout(function(){
                    that.disabled = false;
                },2000);
            }else{
                this.disabled = false;
            }
        });
    }

})(window, document, $);