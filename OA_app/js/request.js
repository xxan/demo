var request = {};
var baseUrl = 'http://47.93.22.234:6082';
var token = '';
request.get = function(url, headers) {
	// if(!headers) {
	// 	headers = {"content-type": "application/text; charset=utf-8"}
	// }
	token = localStorage.getItem('token');
	// data.token = token;
	if(url.indexOf('Token') == -1 && url.indexOf('password') == -1) {
		url += '?Token=' + token;
	}
	return new Promise(function(resolve, reject) {
		$.ajax({
			type: "get",
			url: baseUrl + url,
			headers: headers,
			dataType: "json",
			success: function(data) {
				console.log(JSON.stringify(data))
				return resolve(data);
			},
			error: function(data) {
				console.log('err:',JSON.stringify(data))
				if(data.responseJSON.code == 401) {
					window.location.href = '/OA_app/page/user/login.html';
					return;
				}
				return reject(data);
			}
		})
	})
}

request.post = function(url, data, headers) {
	if(!headers) {
		// headers = {"content-type": "application/json; charset=utf-8"}
		 headers = {"content-type": "application/x-www-form-urlencoded; charset=utf-8"}
	}
	token = localStorage.getItem('token');
	// data.token = token;
	if(url.indexOf('Token') == -1 && url.indexOf('password') == -1) {
		if(url.indexOf('?') == -1) {
			url += '?Token=' + token;
		}else {
			url += '&Token=' + token;
		}
	}
	return new Promise(function(resolve, reject) {
		$.ajax({
			type: "post",
			url: baseUrl + url,
			dataType: "json",
			data: data,
			headers: headers,
			success: function(data) {
				return resolve(data);
			},
			error: function(data) {
				if(data.responseJSON.code == 401) {
					window.location.href = '/OA_app/page/user/login.html';
					return;
				}
				return reject(data);
			}
		})
	})
}

request.postNoToken = function(url, data, headers) {
	if(!headers) {
		// headers = {"content-type": "application/json; charset=utf-8"}
		 headers = {"content-type": "application/x-www-form-urlencoded; charset=utf-8"}
	}
	return new Promise(function(resolve, reject) {
		$.ajax({
			type: "post",
			url: baseUrl + url,
			dataType: "json",
			data: data,
			headers: headers,
			success: function(data) {
				return resolve(data);
			},
			error: function(data) {
				if(data.responseJSON.code == 401) {
					window.location.href = '/OA_app/page/user/login.html';
					return;
				}
				return reject(data);
			}
		})
	})
}

request.upload = function(url, data) {
	token = localStorage.getItem('token');
	if(url.indexOf('Token') == -1 && url.indexOf('password') == -1) {
		if(url.indexOf('?') == -1) {
			url += '?Token=' + token;
		}else {
			url += '&Token=' + token;
		}
	}

	return new Promise(function(resolve, reject) {
		$.ajax({
			type: "post",
			url: baseUrl + url,
			dataType: "json",
			data: data,
			contentType: false,
			processData: false,
			success: function(data) {
				return resolve(data);
			},
			error: function(data) {
				if(data.responseJSON.code == 401) {
					window.location.href = '/OA_app/page/user/login.html';
					return;
				}
				return reject(data);
			}
		})
	})
}

