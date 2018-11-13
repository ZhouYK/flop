# 翻牌效果倒计时插件
> 原生js代码，不依赖任何库

## 使用

```bash
npm i time-flop -P
```

### 24小时制时间显示

```js
import flop from 'time-flop';
flop({
  format: 'hh mm ss',
  size: 'small'
})(document.getElementById('timer'))
```

### 给定时间倒计时
```js
import flop from 'time-flop';
flop({
  format: 'hhhh mm ss',
  timeType: 'countdown',
  deadline: new Date('2018-12-13 00:00:00')
})(document.getElementById('countdown'))
```
