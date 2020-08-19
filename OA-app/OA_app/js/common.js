mui('.footer_submit').on('tap', '.btn_cancel', function() {
	mui.back();
})
mui('.footer_submit_three').on('tap', '.btn_cancel', function() {
	mui.back();
})

var windheight =window.innerHeight;        
 $(window).on('resize',function(){    
	 var docheight = window.innerHeight;         
	if(docheight < windheight){            
			$('.footer_submit').css('display','none');
			$('.footer_submit_one').css('display','none');
			$('.footer_submit_three').css('display','none');
	}else{
			$('.footer_submit').css('display','block');
			$('.footer_submit_one').css('display','block');
			$('.footer_submit_three').css('display','block');
	}     
 })

var UserInfo = JSON.parse(localStorage.getItem('userInfo'));
setTimeout(function() {
	try{
		mui.hideLoading();
	}catch(e){
		//TODO handle the exception
	}
	
},8000)
//撤销审核
	function cancelExamine(id,request,self) {
		var url = '/api/SystemManage/CancelApply';
		return request.post(url,{Id: id}).then(res => {
			if(res.code == 200) {
				mui.toast('撤销成功');
				$(self).parents('li').removeClass('revenue_orange').addClass('revenue_blue').find('.revene_all_btn').html('<a class="revene_all_btn_sc">删除</a><a class="revene_all_btn_tj">提交</a>');
			}else {
				mui.toast('撤销失败！');
			}
		})
	}


function checkLength(self) {
	var text = $(self).val().substr(0,11);
	console.log(text)
	$(self).val(text);
}
function getNumber(self) {
	var text = $(self).val().replace(/[^\w\.\/]/ig,'');
	$(self).val(text);
}

var isIos = false;
mui.plusReady(function() {
	console.log(plus.os.name)
		if(plus.os.name == "iOS") {
			isIos = true;
		}
	})
var userData = JSON.parse(localStorage.getItem('userData'));
	console.log(userData)
var operationArr = [];
function getModuleName(name) {
	for(var i=0;i<userData.length;i++) {
		if(userData[i].EnglishName == name) {
			operationArr = userData[i].Perms;
			return true;
		}
	}
	return false;
}

 function openFile(url) {
		//创建一个下载任务
		var dtask = plus.downloader.createDownload(url, {timeout: 3,retry: 1,retryInterval: 1}, function(d, status) {
			console.log(JSON.stringify(d))
					console.log(JSON.stringify(status))
					mui.hideLoading()
				if(status == 200) {
						var fileUrl = d.filename;
						plus.runtime.openFile(fileUrl, {}, function(e) {
								alert('打开失败');
						});
				} else {
						alert("Download failed: " + status);
				}
		});
		dtask.start();
}

//获取收款方式列表
function paymentMethod() {
	var url = '/api/BusinessManage/PaymentTypeList';
	return request.post(url).then(function(res) {
		if (res.code == 200) {
			var data = [];
			for (var i = 0; i < res.data.length; i++) {
				var tem = {};
				tem.value = res.data[i].SUB_ID;
				tem.text = res.data[i].SUB_NM;
				data.push(tem);
			}
			return data;
		}
	})
}
//获取合同类型
function contractType() {
	var url = '/api/BusinessManage/ContractTypeList';
	return request.post(url).then(function(res) {
		if (res.code == 200) {
			var data = [];
			for (var i = 0; i < res.data.length; i++) {
				var tem = {};
				tem.value = res.data[i].SUB_ID;
				tem.text = res.data[i].SUB_NM;
				data.push(tem);
			}
			return data;
		}
	})
}
//获取盖章列表
function getSeal() {
	return request.post('/api/BusinessManage/GZList').then(function(res) {
		if (res.code == 200) {
			return res.data;
		}
	})
}

//获取审批流程
function approvalProcess(_type) {
	var type = "经营管理";
	if (_type) {
		type = _type;
	}
	return request.post('/api/SystemManage/ApplyTemplate', {
		"ModuleName": type
	}).then(function(res) {
		console.log(res)
		if (res.code == 200) {
			var data = [];
			for (var i = 0; i < res.data.length; i++) {
				var item = {};
				item.value = res.data[i].Id;
				item.text = res.data[i].Title;
				data.push(item);
			}
			return data;
		}
	})
}
//获取审批流程详情图
function getProcessDetail(processId) {
	var url = '/api/SystemManage/ApplyTemplateView';
	return request.post(url, {
		Id: processId
	}).then(function(res) {
		console.log(res)
		if (res.code == 200) {
			var html = ''
			for (var i = 0; i < res.data.list.length; i++) {
				var item = res.data.list[i];
				html += '<li><div class="procedure_left"><span>' + item.Title.substring(item.Title.length - 2) +
					'</span><i></i></div>' +
					'<div class="procedure_right"><p  class="start_check">' + item.Title + '：<span>' + item.Detail + '</span></p></div></li>'
			}
			$('.list_content_procedure').html(html);
			var this_length = $('.list_content_procedure').find('li').length;
			for(var i=0;i<this_length;i++) {
				var li = $('.list_content_procedure').find('li').eq(i);
				console.log(li)
				console.log($(li).css('height'))
				$(li).find('.procedure_left').css('height',$(li).css('height'))
			}
		}
	})
}

	function processDetail(id) {
		var url = '/api/SystemManage/ApplyView';
		return request.post(url,{Id: id}).then(function(res) {
			console.log('审批流程',res);
			if (res.code == 200) {
				$('.approval_process').find('a').html(res.data.title);
				$('.process_choose').find('a').html(res.data.title);
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
						'<div class="procedure_right"><p class="start_check">' + item.detail + '<span class='+ color +'>' + item.tempStatus + '</span></p>'+
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

//项目管理 - 获取任务节点人员选择列表
function getPeople() {
	var url = '/api/CostConsult/ParticipantSelect';
	return request.post(url).then(function(res) {
		return res;
	})
}

var common = {
	getQueryUrl: function(variable) { //url截取参数
		var query = decodeURI(window.location.search).substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == variable) {
				return pair[1];
			}
		}
		return (false);
	},
	getValue: function(arr, dataList) {
		var data = [];
		for (var i = 0; i < arr.length; i++) {
			for (var j = 0; j < dataList.length; j++) {
				if (dataList[j].text == arr[i]) {
					data.push(dataList[j].value);
				}
			}
		}
		return data;
	},
	promise: function() {
		return new Promise(function(resolve, reject) {
			return resolve();
		})
	},
	getKeyValue: function(objArr, key) { //下拉列表数据,对应获取
		for (var i = 0; i < objArr.length; i++) {
			if (objArr[i].value == key) {
				return objArr[i].text;
			}
		}
		return '';
	},
	getValueToKey: function(objArr, key) { //下拉列表数据,对应获取
		for (var i = 0; i < objArr.length; i++) {
			if (objArr[i].text == key) {
				return objArr[i].value;
			}
		}
		return '';
	},
	getObjValue: function(objArr, key) { //选取数组对象下未知对象的key=value,返回该对象
		for (var i = 0; i < objArr.length; i++) {
			var obj = Object.keys(objArr[i]);
			for (var j = 0; j < obj.length; j++) {
				if (objArr[i][obj[j]] == key) {
					return objArr[i];
				}
			}
		}
	},

	/**判断是否是手机号**/
	isPhoneNumber: function(tel) {
		var reg = /^0?1[3|4|5|6|7|8][0-9]\d{8}$/;
		return reg.test(tel);
	},
	smallToLarge: function(n) { //小写转大写
		var fraction = ['角', '分'];
		var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
		var unit = [
			['元', '万', '亿'],
			['', '拾', '佰', '仟']
		];
		var head = n < 0 ? '欠' : '';
		n = Math.abs(n);

		var s = '';

		for (var i = 0; i < fraction.length; i++) {
			s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
		}
		console.log(s)
		s = s || '整';
		n = Math.floor(n);

		for (var i = 0; i < unit[0].length && n > 0; i++) {
			var p = '';
			for (var j = 0; j < unit[1].length && n > 0; j++) {
				p = digit[n % 10] + unit[1][j] + p;
				n = Math.floor(n / 10);
			}
			s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
		}
		return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');

	},
	disbledForm: function() {
		$(".mui-content input").attr("disabled", "disabled").attr('placeholder',"");
		$(".mui-content textarea").attr("disabled", "disabled"); 
		$(".mui-content input::-webkit-input-placeholder").css("opacity", "0");
	},
	unDisbledForm: function() {
		$(".mui-content input").removeAttr("disabled");
		$(".mui-content textarea").removeAttr("disabled"); 
	},
	getNotNullData: function(item) {
		if(item) {
			return item;
		}else {
			return '';
		}
	},
	arrSort: function(arr,sortvalue,sortIndex) {//数组对象排序, 1:升序
		if(sortIndex == 1) {
			arr.sort(function(a,b){ return a[sortvalue]-b[sortvalue]})
		}else {
			arr.sort(function(a,b){ return b[sortvalue]-a[sortvalue]})
		}
	},
	arrObjTrimAndNull: function(arrObj) {
		if(Array.isArray(arrObj)) {
			for(var i=0;i<arrObj.length;i++) {
				if(!Array.isArray(arrObj[i]) && Object.prototype.toString.call(arrObj[i]) !== '[object Object]'){
					if(typeof arrObj[i] !== "boolean" && typeof arrObj[i] !== "number" && arrObj[i] != 0){
						if(arrObj[i]) {
							arrObj[i] = arrObj[i].trim();
						}else {
							arrObj[i] = '';
						}
					}
					
				}else {
					common.arrObjTrimAndNull(arrObj[i]);
				}
			}
		}else if(Object.prototype.toString.call(arrObj) === '[object Object]'){
			var keys = Object.keys(arrObj);
			for(var i=0;i<keys.length;i++) {
				if(!Array.isArray(arrObj[keys[i]]) && Object.prototype.toString.call(arrObj[keys[i]]) !== '[object Object]'){
					if(typeof arrObj[keys[i]] !== "boolean" && typeof arrObj[keys[i]] !== "number" && arrObj[keys[i]] != 0) {
						if(arrObj[keys[i]]) {
							arrObj[keys[i]] = arrObj[keys[i]].trim();
						}else {
							arrObj[keys[i]] = '';
						}
					}
				}else {
					common.arrObjTrimAndNull(arrObj[keys[i]]);
				}
			}
		}
	}
}

function getTime(type, data) { //获取时间
	var date = new Date();
	if(isIos) {
		if (data) {
			data = data.replace(/\-/g, '/');
			date = new Date(data)
		}
	}else {
		if (data) {
			date = new Date(data);
		}
	}
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();

	function getNum(num) {
		if (num < 10) {
			num = '0' + num
		}
		return num
	}
	if (type == 'year') {
		return year + '-' + getNum(month + 1) + '-' + getNum(day);
	} else if (type == 'minute') {
		return year + '-' + getNum(month + 1) + '-' + getNum(day) + ' ' + getNum(hour) + ':' + getNum(minute);
	} else if (type == 'day') {
		return getNum(day);
	} else if (type == 'yearAndMonth') {
		return year + '-' + getNum(month + 1);
	} else if (type == 'week') {
		var a = new Array("日", "一", "二", "三", "四", "五", "六");
		var week = new Date().getDay();
		if(data) {
			week = new Date(data).getDay();
		}
		var str = "星期" + a[week];
		return str;
	} else if (type == 'chartoday') {
		return getNum(month + 1) + '月' + getNum(day) + '号'
	} else if (type == 'hour') {
		return hour;
	}
}

var addressList = [{
		value: 0,
		text: "北京市"
	},
	{
		value: 1,
		text: "天津市"
	},
	{
		value: 2,
		text: "上海市"
	},
	{
		value: 3,
		text: "重庆市"
	},
	{
		value: 4,
		text: "河北省"
	},
	{
		value: 5,
		text: "河南省"
	},
	{
		value: 6,
		text: "云南省"
	},
	{
		value: 7,
		text: "辽宁省"
	},
	{
		value: 8,
		text: "黑龙江省"
	},
	{
		value: 9,
		text: "湖南省"
	},
	{
		value: 10,
		text: "安徽省"
	},
	{
		value: 11,
		text: "山东省"
	},
	{
		value: 12,
		text: "新疆维吾尔自治区"
	},
	{
		value: 13,
		text: "江苏省"
	},
	{
		value: 14,
		text: "浙江省"
	},
	{
		value: 15,
		text: "江西省"
	},
	{
		value: 16,
		text: "湖北省"
	},
	{
		value: 17,
		text: "广西壮族"
	},
	{
		value: 18,
		text: "甘肃省"
	},
	{
		value: 19,
		text: "山西省"
	},
	{
		value: 20,
		text: "内蒙古自治区"
	},
	{
		value: 21,
		text: "陕西省"
	},
	{
		value: 22,
		text: "吉林省"
	},
	{
		value: 23,
		text: "福建省"
	},
	{
		value: 24,
		text: "贵州省"
	},
	{
		value: 25,
		text: "广东省"
	},
	{
		value: 26,
		text: "青海省"
	},
	{
		value: 27,
		text: "西藏"
	},
	{
		value: 28,
		text: "四川省"
	},
	{
		value: 29,
		text: "宁夏回族"
	},
	{
		value: 30,
		text: "海南省"
	},
	{
		value: 31,
		text: "台湾省"
	},
	{
		value: 32,
		text: "香港特别行政区"
	},
	{
		value: 33,
		text: "澳门特别行政区"
	}
]
