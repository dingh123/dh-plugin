# CountDown 倒计时

组件搬运自vant 2.8.6，抽离了 cowndown 这么一个组件

### 使用方式

在 ``script`` 中引用组件 

```javascript
import CountDown from '@/components/CountDown/index.vue';
export default {
    components: {CountDown}
}
```

在 ``template`` 中使用组件

```html
<count-down :time="time" />
```

## 代码演示

### 基本用法

`time`属性表示倒计时总时长，单位为毫秒

```html
<count-down time="{{ time }}" />
```

```js
Page({
  data: {
    time: 30 * 60 * 60 * 1000,
  },
});
```

### 自定义格式

通过`format`属性设置倒计时文本的内容

```html
<count-down time="{{ time }}" format="DD 天 HH 时 mm 分 ss 秒" />
```

### 毫秒级渲染

倒计时默认每秒渲染一次，设置`millisecond`属性可以开启毫秒级渲染

```html
<count-down millisecond time="{{ time }}" format="HH:mm:ss:SSS" />
```

### 自定义样式

设置`use-slot`属性后可以自定义倒计时样式，需要通过`bind:change`事件获取`timeData`对象并自行渲染，格式见下方表格

```html
<count-down class="count-down" :time="time">
    <template v-slot="timeData">
        <span> 活动剩余 </span>
        <span class="main-color">{{ timeData.days }}</span>
        <span> 天 </span>
        <span class="main-color">{{ timeData.hours }}</span>
        <span> 时 </span>
        <span class="main-color">{{ timeData.minutes }}</span>
        <span> 分 </span>
        <span class="main-color">{{ timeData.seconds }}</span>
        <span> 秒 </span>
    </template>
</count-down>
```

```js
export default {
  data() {
    return {
      time: 30 * 60 * 60 * 1000,
    }
  },
};
```

```css
.item {
  display: inline-block;
  width: 22px;
  margin-right: 5px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background-color: #1989fa;
  border-radius: 2px;
}
```

### 手动控制

通过 `selectComponent` 选择器获取到组件实例后，可以调用`start`、`pause`、`reset`方法

```html
<count-down
  class="control-count-down"
  ref="countDown"
  millisecond
  time="{{ 3000 }}"
  auto-start="{{ false }}"
  format="ss:SSS"
  @finish="finished"
/>

<ul>
  <li @click="start">开始</li>
  <li @click="pause">暂停</li>
  <li @click="reset">重置</li>
</ul>
```

```js
export default {
  data() {
    return {
      time: 30 * 60 * 60 * 1000,
    }
  },
  methods: {
    start() {
      const countDown = this.$ref.countDown;
      countDown.start();
    },

    pause() {
      const countDown = this.$ref.countDown;
      countDown.pause();
    },

    reset() {
      const countDown = this.$ref.countDown;
      countDown.reset();
    },

    finished() {
      Toast('倒计时结束');
    },
  }
};
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| time | 倒计时时长，单位毫秒 | _number_ | - | - |
| format | 时间格式，DD-日，HH-时，mm-分，ss-秒，SSS-毫秒 | _string_ | `HH:mm:ss` | - |
| auto-start | 是否自动开始倒计时 | _boolean_ | `true` | - |
| millisecond | 是否开启毫秒级渲染 | _boolean_ | `false` | - |
| use-slot | 是否使用自定义样式插槽 | _boolean_ | `false` | - |

### Events

| 事件名 | 说明                                         | 回调参数 |
| ------ | -------------------------------------------- | -------- |
| finish | 倒计时结束时触发                             | -        |
| change | 时间变化时触发，仅在开启`use-slot`后才会触发 | timeData |

### timeData 格式

| 名称         | 说明     | 类型     |
| ------------ | -------- | -------- |
| days         | 剩余天数 | _number_ |
| hours        | 剩余小时 | _number_ |
| minutes      | 剩余分钟 | _number_ |
| seconds      | 剩余秒数 | _number_ |
| milliseconds | 剩余毫秒 | _number_ |

### 方法

通过 selectComponent 可以获取到 CountDown 实例并调用实例方法

| 方法名 | 参数 | 返回值 | 介绍 |
| --- | --- | --- | --- |
| start | - | - | 开始倒计时 |
| pause | - | - | 暂停倒计时 |
| reset | - | - | 重设倒计时，若`auto-start`为`true`，重设后会自动开始倒计时 |
