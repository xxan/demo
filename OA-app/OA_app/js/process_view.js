	var isLeap = false;//是否越级审批
	function processDetail(id) {
		var url = '/api/SystemManage/ApplyView';
		return request.post(url,{Id: id}).then(function(res) {
			console.log('审批流程',res);
			if (res.code == 200) {
				isLeap = res.data.isLeapfrog;
				if(!res.data.isAudit) {
					$('.this_examine').hide();
				}
				$('.approval_process').find('a').html(res.data.title);
				var html = ''
				for (var i = 0; i < res.data.list.length; i++) {
					var item = res.data.list[i];
					var color = '';
					if(item.eStatus == -1) {
						color = 'red';
					}
					if(item.eStatus == 0) {
						color = 'orange';
					}
					if(item.eStatus == 1) {
						color = 'green';
					}
					if(item.eStatus == 2 || item.eStatus == 3) {
						color = 'red';
					}
					html += '<li><div class="procedure_left"><span>' + item.title +
						'</span><i></i></div>' +
						'<div class="procedure_right"><p class="start_check">' + item.detail 
						+ '<span class='+ color +'>' + item.tempStatus + '</span></p>'+
						(item.eDateTime == '无' ? '' : '<span class="opa_time">'+ item.eDateTime +'</span>') +
						(item.content ? '<p class="contents"><span>' + item.content + '</span></p>' : '')+
						(item.signFilePath != '' ? ('<p>签名：<img src='+ baseUrl + item.signFilePath +' ></p>') : '') + 
						'</div></li>'
				}
				$('.list_content_procedure').html(html);
				var this_length = $('.list_content_procedure').find('li').length;
				for(var i=0;i<this_length;i++) {
					var li = $('.list_content_procedure').find('li').eq(i);
					$(li).find('.procedure_left').css('height',$(li).css('height'))
				}
				
			}
		})
	}
	
	//上传签名
	function uploadSign(formData) {
		var url = '/api/Home/UpLoadImageBase64';
		return request.post(url, formData).then(function(res) {
			console.log('文件上传',res);
			if (res.code == 200) {
				return res.data.FilePath;
			}else {
				mui.alert('上传失败！');
			}
		})
	}
	
	//审批
	function approval(processId,content,state,urlData) {
		var url = '/api/SystemManage/SaveEOption';
		mui.showLoading('处理中...');
		common.promise().then(function() {
			var data = {
				strBase64: urlData
			}
			return uploadSign(data);
		}).then(function(res) {
			var postData = {
				Id: processId,
				EOpinion: content,
				EStatus: state,
				signFilePath: res,
				IsLeapfrog: isLeap
			}
			console.log(postData)
			request.post(url,postData).then(function(res) {
				console.log(res);
				mui.hideLoading();
				if(res.code == 200) {
					$('.htsp_modal_jj').hide();
					mui.back();
				}else {
					mui.toast('提交失败！');
				}
			})
		})
	}
	
		// canvasInit();
	function canvasInit(flag) {
		  document.body.addEventListener("touchstart", function() {
		        event.preventDefault(); //手指滑动时，浏览器会上下左右翻屏
		      });
			var oCanvas = document.getElementById("canvas");
			oCanvas.width = 300;
			oCanvas.height = 300;
			var cxt = oCanvas.getContext("2d");
			cxt.lineWidth = 3;
			var posX = 0; //x坐标
			var posY = 0; //y坐标
			var position = null;
			var strDataURI;
		
			//手指触摸屏幕可记录此时的位置作为起点
			oCanvas.addEventListener("touchstart", function() {
				var canvas = $('#canvas');
				var boxX=canvas.offset().left;
				var boxY=canvas.offset().top;
				posX = event.changedTouches[0].pageX - boxX;
				posY = event.changedTouches[0].pageY - boxY;
				cxt.moveTo(posX, posY);
			});
		
			//手指屏滑动画线
			oCanvas.addEventListener("touchmove", function() {
		        var canvas = $('#canvas');
		        var boxX=canvas.offset().left;
		        var boxY=canvas.offset().top;
		        posX = event.changedTouches[0].pageX - boxX;
		        posY = event.changedTouches[0].pageY - boxY;
		        cxt.lineTo(posX, posY);
		        cxt.stroke();
		      });
		
		mui('.canvas_btn').on('tap','span',function(e) {
			if($(e.target).hasClass('canvas_reset')) {
				cxt.clearRect(0, 0, oCanvas.width, oCanvas.height);
				cxt.beginPath();
			}else {
				strDataURI = oCanvas.toDataURL();
				$('.sign_modal').hide();
				$('body').css('overflow','auto');
				if(isShowAngree) {
					$('.htsp_modal_ty .sign_img img').attr('src',strDataURI);
				}else {
					$('.htsp_modal_jj .sign_img img').attr('src',strDataURI);
				}
			}
		})
		//拒绝
		mui('.footer_submit').on('tap', '.btn_refuse', function() {
			$('.htsp_modal_jj').show();
			$('body').addClass('body_class');
			$('.mui-content').addClass('overFlow_conten');
		});
		
		mui('.htsp_modal_jj').on('tap','.btn_sure',function() {
			if(!$('#opinioncancel').val()) {
				mui.toast('请输入意见！')
				return;
			}
			if(!strDataURI) {
				mui.toast('请签名！')
				return;
			}
			var text = $('#opinioncancel').val();
			var state = -1;
			approval(processId,text,state,strDataURI);
		})
		//同意
		mui('.footer_submit').on('tap', '.btn_agree', function() {
			isShowAngree = true;
			$('.htsp_modal_ty').show();
			$('body').addClass('body_class');
			$('.mui-content').addClass('overFlow_conten');
		});
		
		mui('.htsp_modal_ty').on('tap','.btn_sure',function() {
			if(!$('#opinionok').val() && !isShowAngree) {
				mui.toast('请输入意见！')
				return;
			}
			if(!strDataURI) {
				mui.toast('请签名！')
				return;
			}
			var text = $('#opinionok').val();
			var state = 1;
			if(isLeap) {
				state = 2;
			}
			approval(processId,text,state,strDataURI);
		})
		
		mui('.mui-modal_all_title').on('tap', '.mui-icon-close', function () {
				cxt.clearRect(0, 0, oCanvas.width, oCanvas.height);
				cxt.beginPath();
				var src = '../../../img/add_sign.png';
				if(flag) {
					src = '../../img/add_sign.png'
				}
				if(isShowAngree) {
					$('.htsp_modal_ty .sign_img img').attr('src',src);
				}else {
					$('.htsp_modal_jj .sign_img img').attr('src',src);
				}
				isShowAngree = false;
		    $('.htsp_modal_ty').hide();
		    $('.htsp_modal_jj').hide();
				$('.sign_modal').hide();
				$('.mui-content').removeClass('overFlow_conten');
				$('body').removeClass('body_class');
				$('body').css('overflow','auto');
		});
		
		mui('.htsp_modal_jj').on('tap','.sign_img',function() {
			$('.sign_modal').show();
			$('body').css('overflow','hidden');
		})
		mui('.htsp_modal_ty').on('tap','.sign_img',function() {
			$('.sign_modal').show();
			$('body').css('overflow','hidden');
		})
	}