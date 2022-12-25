## 用户基础日志收集脚本

### 安装

```
npm install @jianzhikeji/jz-collect-user-info
```

### 导入

main.js中直接导入，为了兼容旧版书院webpack3打包时uglify编译失败，$collecUserInfo被自动挂载到window上，同时默认导出default

```
import 'jz-collect-user-info';

// 在登录完成后，执行配置
window.$collectUserInfo.config.set({
  type: 1,
  openid: getCookie('openid')
})
```

### 埋点

在需要捕获错误的地方执行

```
window.$collectUserInfo.collect.set({
  type: 4,
  detail: '错误描述'
});
```

| 参数        | 值                                                   |  类型    | 默认   |
| --------   | -----                                               | ----     |  ----  |
| type       |  1: '未知', 2: '网络', 3: '接口', 4: '播放', 5: '脚本' |   int   | 1      |
| detail     |   错误的详细描述                                      |  string  | 空     |


获取所有错误，返回JSON对象
```
window.$collectUserInfo.collect.set();
```

### 打印

在项目中新增任意一个页面，取名“诊断信息”，创建一个div模块，任意取个id，例如collect-info，然后执行方法传入id即可打印所有信息

```
<div id="collect-info"></div>

window.$collectUserInfo.collect.print('collect-info');
```
