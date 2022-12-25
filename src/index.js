// created by guoshuohui

(function () {

	// 全局配置
	var collectUserInfoConfig = {};

	// 书院类型
	var typeArr = {
    0: '未知',
		1: '简知书院',
		2: '精英书院',
		3: '女性传奇',
		4: '国学书院',
    5: '简知书院v2',
    6: '简知平台'
	};

	// 环境
	var envArr = {
		'dev': '开发',
		'test': '测试',
		'prod': '线上'
	};

	// 错误类型
	var errorTypeArr = {
		1: '未知',
		2: '网络',
		3: '接口',
		4: '播放',
		5: '脚本'
	};

	// userAgent
	var ua = navigator.userAgent;

	// 配置方法
	var config = {

		// 设置
		set: function (obj) {
			var params = obj || {};
			var host = location.host;
			var env = 'prod';
      // var api = '';
      var type = params.type || 0

			// 开发环境
			if (host.indexOf(':3000') > -1 || host.indexOf(':8080') > -1 || host.indexOf('localhost') > -1) {
				env = 'dev';
				// api = '';
			}

			// 测试环境
			if (host.indexOf('csy-test.') > -1) {
				env = 'test';
				// api = '';
      }

			collectUserInfoConfig = {

				// 产品类别
				type: type,

				// 产品类型名
				typeName: typeArr[type],

				// 环境
				env: env,

				// 环境名
				envName: envArr[env],

				// 当前访问域名
				api: '', //api + '',

				// 用户
				user: params.user || '',

				// 头像
				avatar: params.avatar || '',

				// 微信openid
				openid: params.openid || '无',

				// 本地存储条数上限
				storageMax: params.storageMax || 20

      };
      
			return collectUserInfoConfig;
		},

		// 获取
		get: function (prop) {

			if (!prop) return collectUserInfoConfig;

      var getProp = collectUserInfoConfig[prop];
      
			// if (prop == 'type' && !getProp) {
			// 	alert('collectUserInfo Error：请正确配置产品类型');
			// }

			// if (prop == 'env' && !getProp) {
			// 	alert('collectUserInfo Error：请正确配置环境类型');
			// }

			// if (prop == 'api' && !getProp) {
			// 	alert('collectUserInfo Error：请正确配置接口地址');
			// }

			return getProp;
		}
  };
  
  // 默认调用
  config.set()

	// 获取设备
	var device = {

		// 系统和版本
		system: function () {
			var os = '';
			var version = '';

			// iOS
			if (ua.indexOf('like Mac OS X') > -1) {
				os = 'iOS';
				version = ua.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
			}

			// Android
			if (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
				os = 'Android';
				version = ua.replace(/^.*Android ([\d.]+);.*$/, '$1');
			}

			// MacOs
			if (ua.indexOf('Macintosh') > -1) {
				os = 'Mac OS';
				version = ua.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.');
			}

			// Windows
			if (ua.indexOf('Windows') > -1) {
				os = 'Windows';
				var ver = ua.replace(/^.*Windows NT ([\d.]+);.*$/, '$1');
				var versionMap = {
					'6.4': '10',
					'6.3': '8.1',
					'6.2': '8',
					'6.1': '7',
					'6.0': 'Vista',
					'5.2': 'XP',
					'5.1': 'XP'
				}
				version = versionMap[ver] || ver;
			}

			return os + ' ' + version;
		},

		// 网络状况
		network: function () {
			var type = '未知类型';
			if (navigator.connection && navigator.connection.effectiveType) {
				type = navigator.connection.effectiveType + ' ' + navigator.connection.downlink + 'M/s'
			}
			return type;
		}
	};

	// 收集信息
	var collect = {

		// 获取本地存储的客户端信息
		get: function () {
			var userInfo = {
				info: []
			};
			var result = localStorage.getItem('collectUserInfo');
			if (result) {
				userInfo = JSON.parse(result);
			}
			return userInfo;
		},

		// 收集信息
		set: function (info) {
			var info = info || {};
			var date = new Date();

			info.time = date.getFullYear() + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());

			var options = {
				type: config.get('type'),
				env: config.get('env'),
				openid: config.get('openid'),
				system: device.system(),
				ua: ua,
				info: []
			};

			// 本地存储
			var localUserInfo = localStorage.getItem('collectUserInfo');
			if (localUserInfo) {
				options = JSON.parse(localUserInfo);

				// 条数上限时，删除第一条
				if (options.info.length >= config.get('storageMax')) {
					options.info.shift();
				}
			}

			options.info.push(info);

			localStorage.setItem('collectUserInfo', JSON.stringify(options));

			// 后端存储
			options.info = info;

      var url = config.get('api')
      if(url) {
        ajax({
          url: url,
          data: options,
          type: 'get',
          success: function (res) {
            console.log(res);
          }
        });
      }

		},

		// 打印最终格式化效果
		print: function (elmId) {

			var configUser = config.get('user');
			var configAvatar = config.get('avatar');
			var configOpenid = config.get('openid');
			var configTypeName = config.get('typeName');
			var configEnvName = config.get('envName');
			var deviceNetwork = device.network();
      var deviceSystem = device.system();
      
			var userInfo = this.get();
      userInfo.info.reverse();
      
      // 没有id时返回纯文本信息
      if (!elmId) {
        var newInfo = userInfo.info
        for (var i in newInfo) {
          newInfo[i].typeText = errorTypeArr[newInfo[i].type]
        }
        var str = configOpenid + ' ， 用户名：' + configUser + ' ， 类型：' + configTypeName + ' ， 环境：' + configEnvName + ' ， 网络：' + deviceNetwork + ' ， 终端：' + ua + ' ， 头像：' + configAvatar + ' ， 警告：' + JSON.stringify(newInfo)
        return str
      }

			var items = '';
			for (var j in userInfo.info) {
				(function (i) {
					var item = userInfo.info[i];
					var failed = '';

					// 如果未发送成功
					if (item.failed) {
						failed =
							'	<div class="mod-item error">' +
							'		<div class="mod-item-title">警告：</div>' +
							'		<div class="mod-item-main">此条信息因网络问题未成功发送到后台，点击重新发送</div>' +
							'	</div>';
					}

					items +=
						'<div class="mod">' +
						'	<div class="mod-item">' +
						'		<div class="mod-item-title">类型：</div>' +
						'		<div class="mod-item-main">' + item.type + '（' + errorTypeArr[item.type] + '）</div>' +
						'	</div>' +
						'	<div class="mod-item">' +
						'		<div class="mod-item-title">时间：</div>' +
						'		<div class="mod-item-main">' + item.time + '</div>' +
						'	</div>' +
						'	<div class="mod-item">' +
						'		<div class="mod-item-title">详情：</div>' +
						'		<div class="mod-item-main">' + item.detail + '</div>' +
						'	</div>' + failed +
						'</div>';
				})(j);
			}

			// 用户
			var userName = '';
			if (configUser) {
				userName =
					'	<div class="mod-item">' +
					'		<div class="mod-item-title">用户：</div>' +
					'		<div class="mod-item-main">' + configUser + '</div>' +
					'	</div>';
			}

			// 头像
			var avatar = '';
			if (configAvatar) {
				avatar =
					'	<div class="mod-item">' +
					'		<div class="mod-item-title">头像：</div>' +
					'		<div class="mod-item-main"><img src="' + configAvatar + '"></div>' +
					'	</div>';
			}

			var html =
				'<div class="res-content">' +
				'<div class="mod">' +
				'	<div class="mod-item">' +
				'		<div class="mod-item-title">ID：</div>' +
				'		<div class="mod-item-main">' + configOpenid + '</div>' +
				'	</div>' + userName + avatar +
				'	<div class="mod-item">' +
				'		<div class="mod-item-title">类型：</div>' +
				'		<div class="mod-item-main">' + configTypeName + '</div>' +
				'	</div>' +
				'	<div class="mod-item">' +
				'		<div class="mod-item-title">环境：</div>' +
				'		<div class="mod-item-main">' + configEnvName + '</div>' +
				'	</div>' +
				'	<div class="mod-item">' +
				'		<div class="mod-item-title">网络：</div>' +
				'		<div class="mod-item-main">' + deviceNetwork + '</div>' +
				'	</div>' +
				'	<div class="mod-item">' +
				'		<div class="mod-item-title">系统：</div>' +
				'		<div class="mod-item-main">' + deviceSystem + '</div>' +
				'	</div>' +
				'	<div class="mod-item">' +
				'		<div class="mod-item-title">UA：</div>' +
				'		<div class="mod-item-main">' + ua + '</div>' +
				'	</div>' +
				'</div>' + items +
				'</div>';

			if (elmId) {
				document.getElementById(elmId).innerHTML = html;
			} else {
				document.body.innerHTML = html;
			}

			setCss();
    }
	};

	// 挂载到window
	window.$collectUserInfo = {
		config: config,
		device: device,
		collect: collect
	};

	// 补零
	function addZero(n) {
		var num = parseInt(n);
		return num < 10 ? 0 + '' + num : num;
	}

	// 样式设置
	function setCss() {
		var code = '.res-content{padding:0 10px 30px;font-size:14px;}.mod{margin:10px 0;padding:10px 0;border-bottom:1px solid #dedede;}.mod:last-child{border-bottom:none;}.mod-item{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;margin:5px 0;}.mod-item-title{font-weight:bold;width:60px;}.mod-item-main{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;word-wrap:break-word;word-break:break-all;color:#666;}.mod-item-main img{display:block;height:50px;width:50px;margin:10px 0;}.mod-item.error,.mod-item.error .mod-item-main{color:red;}.mod-item.error:active{opacity:0.7;}';
		var style = document.createElement('style');
		style.type = 'text/css';
		style.rel = 'stylesheet';
		style.appendChild(document.createTextNode(code));
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(style);
	};

	// 请求函数
	function ajax(options) {

		//编码数据
		function setData() {

			//设置对象的遍码
			function setObjData(data, parentName) {
				function encodeData(name, value, parentName) {
					var items = [];
					name = parentName === undefined ? name : parentName + "[" + name + "]";
					if (typeof value === "object" && value !== null) {
						items = items.concat(setObjData(value, name));
					} else {
						name = encodeURIComponent(name);
						value = encodeURIComponent(value);
						items.push(name + "=" + value);
					}
					return items;
				}
				var arr = [],
					value;
				if (Object.prototype.toString.call(data) == '[object Array]') {
					for (var i = 0, len = data.length; i < len; i++) {
						value = data[i];
						arr = arr.concat(encodeData(typeof value == "object" ? i : "", value, parentName));
					}
				} else if (Object.prototype.toString.call(data) == '[object Object]') {
					for (var key in data) {
						value = data[key];
						arr = arr.concat(encodeData(key, value, parentName));
					}
				}
				return arr;
			};

			//设置字符串的遍码，字符串的格式为：a=1&b=2;
			function setStrData(data) {
				var arr = data.split("&");
				for (var i = 0, len = arr.length; i < len; i++) {
					name = encodeURIComponent(arr[i].split("=")[0]);
					value = encodeURIComponent(arr[i].split("=")[1]);
					arr[i] = name + "=" + value;
				}
				return arr;
			}

			if (data) {
				if (typeof data === "string") {
					data = setStrData(data);
				} else if (typeof data === "object") {
					data = setObjData(data);
				}
				data = data.join("&").replace("/%20/g", "+");

				//若是使用get方法或JSONP，则手动添加到URL中
				if (type === "get" || dataType === "jsonp") {
					url += url.indexOf("?") > -1 ? (url.indexOf("=") > -1 ? "&" + data : data) : "?" + data;
				}
			}
		}

		// JSONP
		function createJsonp() {
			var script = document.createElement("script"),
				timeName = new Date().getTime() + Math.round(Math.random() * 1000),
				callback = "JSONP_" + timeName;

			window[callback] = function (data) {
				clearTimeout(timeout_flag);
				document.body.removeChild(script);
				success(data);
			}
			script.src = url + (url.indexOf("?") > -1 ? "&" : "?") + "callback=" + callback;
			script.type = "text/javascript";
			document.body.appendChild(script);
			setTime(callback, script);
		}

		//设置请求超时
		function setTime(callback, script) {
			if (timeOut !== undefined) {
				timeout_flag = setTimeout(function () {
					if (dataType === "jsonp") {
						delete window[callback];
						document.body.removeChild(script);

					} else {
						timeout_bool = true;
						xhr && xhr.abort();
					}

				}, timeOut);
			}
		}

		// XHR
		function createXHR() {
			//由于IE6的XMLHttpRequest对象是通过MSXML库中的一个ActiveX对象实现的。
			//所以创建XHR对象，需要在这里做兼容处理。
			function getXHR() {
				if (window.XMLHttpRequest) {
					return new XMLHttpRequest();
				} else {
					//遍历IE中不同版本的ActiveX对象
					var versions = ["Microsoft", "msxm3", "msxml2", "msxml1"];
					for (var i = 0; i < versions.length; i++) {
						try {
							var version = versions[i] + ".XMLHTTP";
							return new ActiveXObject(version);
						} catch (e) {}
					}
				}
			}

			//创建对象。
			xhr = getXHR();
			xhr.open(type, url, async);

			//设置请求头
			if (type === "post" && !contentType) {
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
			} else if (contentType) {
				xhr.setRequestHeader("Content-Type", contentType);
			}

			//添加监听
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (timeOut !== undefined) {
						//由于执行abort()方法后，有可能触发onreadystatechange事件，
						//所以设置一个timeout_bool标识，来忽略中止触发的事件。
						if (timeout_bool) {
							return;
						}
						clearTimeout(timeout_flag);
					}
					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
						try {
							var text = typeof xhr.responseText == 'string' ? JSON.parse(xhr.responseText) : xhr.responseText;
							success(text);
						} catch (error) {
							success(error);
						}
					} else {
						error(xhr.status, xhr.statusText);
					}
				}
			};

			//发送请求
			xhr.send(type === "get" ? null : data);
			setTime(); //请求超时
		}

		var url = options.url || "", //请求的链接
			type = (options.type || "get").toLowerCase(), //请求的方法,默认为get
			data = options.data || null, //请求的数据
			contentType = options.contentType || "", //请求头
			dataType = options.dataType || "", //请求的类型
			async = options.async === undefined ? true : options.async, //是否异步，默认为true.
				timeOut = options.timeOut, //超时时间。 
				before = options.before || function () {}, //发送之前执行的函数
				error = options.error || function () {}, //错误执行的函数
				success = options.success || function () {}; //请求成功的回调函数
		var timeout_bool = false, //是否请求超时
			timeout_flag = null, //超时标识
			xhr = null; //xhr对角
		setData();
		before();
		if (dataType === "jsonp") {
			createJsonp();
		} else {
			createXHR();
		}
	}

})();