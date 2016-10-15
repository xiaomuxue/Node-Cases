;(function(w, d, $, undefined){
	var $mask = $('<div id="mask"></div>').appendTo('body')
		,windowH = $(window).height()
		,windowW = $(window).width();
	$.promptInfo = function (options){
		defaults = {
			'msg': '这是一段提示信息',
			'position': 'top',
			'time': '3000'
		}
		$.extend( defaults, options );
		var $info = $('<div class="prompt" id="showinfo"></div>').html(defaults.msg).appendTo('body')
			,infow = $info.width()
			,infoh = $info.height();
		$info.css("left",(windowW-infow)/2);
		if("bottom"==$.trim(defaults.position)){
			$info.css("bottom",50);
		}else if("top"==$.trim(defaults.position)){
			$info.css("top",50);
		}else if("middle"==$.trim(defaults.position)){
			$info.css("bottom",(windowH-infoh)/2);
		}else{
			$info.css("top",50);
		}
		$info.fadeIn();
		setTimeout(function() {	
			$info.fadeOut(function(){
				$(this).remove();
			});	
		}, defaults.time );
	}

	var $popup = $('<div class="popup" id="alert"><div class="popup_header"><p id="popup_title" class="popup_title"></p><span class="popup_close">&times;</span></div><div class="popup_content" id="popup_content"></div><div class="popup_footer"></div></div>')
				.appendTo('body')
		,alertw = $popup.width()
		,alerth = $popup.height();

		$popup.css( 'left', (windowW-alertw)/2 );
		$popup.find('.popup_close').click(function(){
			$popup.fadeOut();
			$mask.fadeOut();
		});
	var obj = {popup: {
		alert: function(options){
			defaults = {
				'title': '这是标题',
				'msg': '这是弹出框内容',
				'position': 'top',
				'okmsg': '确认',
				'okCallback':function(){

				}
			}
			$.extend( defaults, options );
			$popup.find('#popup_title').html(defaults.title);
			$popup.find('#popup_content').html(defaults.msg);
			var $btn = $('<button class="popup_btn btn_ok">'+defaults.okmsg+'</button>')
				.click(function(){
					$popup.fadeOut();
					$mask.fadeOut();
					defaults.okCallback();
				});
			$popup.find('.popup_footer').html($btn);

			if("bottom"==$.trim(defaults.position)){
				$popup.css("bottom",50);
			}else if("top"==$.trim(defaults.position)){
				$popup.css("top",50);
			}else if("middle"==$.trim(defaults.position)){
				$popup.css("bottom",(windowH-alerth)/2);
			}else{
				$popup.css("top",50);
			}
			$mask.fadeIn();
			$popup.fadeIn();
		},
		confirm: function(options){
			defaults = {
				'title': '这是标题',
				'msg': '这是弹出框内容',
				'position': 'top',
				'okmsg': '确认',
				'offmsg': '取消',
				'okCallback':function(){

				},
				'offCallback':function(){

				}
			}
			$.extend( defaults, options );
			$popup.find('#popup_title').html(defaults.title);
			$popup.find('#popup_content').html(defaults.msg);
			var $btn_ok = $('<button class="popup_btn btn_ok">'+defaults.okmsg+'</button>')
				.click(function(){
					$popup.fadeOut();
					$mask.fadeOut();
					defaults.okCallback();
				}),
				$btn_off = $('<button class="popup_btn btn_off">'+defaults.offmsg+'</button>')
				.click(function(){
					$popup.fadeOut();
					$mask.fadeOut();
					defaults.offCallback();
				});
			$popup.find('.popup_footer').html($btn_ok).append($btn_off);

			if("bottom"==$.trim(defaults.position)){
				$popup.css("bottom",50);
			}else if("top"==$.trim(defaults.position)){
				$popup.css("top",50);
			}else if("middle"==$.trim(defaults.position)){
				$popup.css("bottom",(windowH-alerth)/2);
			}else{
				$popup.css("top",50);
			}
			$mask.fadeIn();
			$popup.fadeIn();

		}
	}};

	$.extend( obj );
})(window, document, $);