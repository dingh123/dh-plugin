# PopoverQrcode 二维码网址显示
基于ElementUI的popover组件，实现网址弹窗显示，包含二维码，下载二维码，访问链接，复制链接等功能

### 使用方式

在 ``script`` 中引用组件 

```javascript
import PopoverQrcode from '@/components/PopoverQrcode/index.vue';
export default {
    components: {PopoverQrcode}
}
```

在 ``template`` 中使用组件

```html
<popover-qrcode url="https://www.dingsky.com/">
    <el-button slot="reference" type="danger">邀请好友帮忙</el-button>
</popover-qrcode>
```

### 属性说明

|属性名|类型|默认值|说明|可选值|
|---|----|---|---|---|
|url|String|-|url链接|
|title|String|'二维码（右击保存）'|标题|-|
|placement|String|'bottom'|出现位置|'top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end'|
|trigger|String|'click'|触发方式|'click/focus/hover/manual'|
