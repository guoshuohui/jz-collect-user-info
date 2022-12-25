
// 初始化环境（必要）
$collectUserInfo.config.set({
	type: 1,
	user: '用户1234',
	avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562582742788&di=5d0928e1931269a7a436e2ae2d8ca75f&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201510%2F08%2F20151008192345_uPC5U.jpeg',
	openid: 'o3Rbg1ZoomxVm8YsG3bI2PviP7TA'
});

// 信息显示区域
var content = document.getElementById('content');

// 获取配置信息
document.getElementById('test1').onclick = () => {
	var config = $collectUserInfo.config.get();
	let html = '';
	for (var j in config) {
		(function(i) {
			html += '<div><strong>' + i + '</strong>：' + config[i] + '</div>';
		})(j);
	}
	content.innerHTML = html;
}

// 获取设备信息
document.getElementById('test2').onclick = () => {
	content.innerHTML = navigator.userAgent;
}

// 新增信息
document.getElementById('test3').onclick = () => {
	var random = (Math.random() * 1000).toFixed(1);
	$collectUserInfo.collect.set({
		type: 2,
		detail: (Math.random() * 1000).toFixed(1)
	})
}

// 显示最终效果
document.getElementById('test4').onclick = () => {
	$collectUserInfo.collect.print('content');
}

// 获取文本嘻嘻
document.getElementById('test5').onclick = () => {
	content.innerHTML = $collectUserInfo.collect.print();
}

// console.log($collectUserInfo.device.system());

//$collectUserInfo.collect.print();