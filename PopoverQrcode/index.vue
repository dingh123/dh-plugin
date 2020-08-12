<template>
    <el-popover :placement="placement" trigger="click">
        <div class="popup-content">
            <div class="title">{{ title }}</div>
            <div class="qrcode" ref="qrcode"></div>
            <div class="button-group">
                <el-link class="link-button" type="primary" @click="downloadQrcode">下载二维码</el-link>
                <el-link class="link-button" type="primary" :href="url" target="_blank">进入链接</el-link>
            </div>

            <div class="popup-footer">
                <div class="footer-title">链接地址</div>
                <div class="flex-between">
                    <div class="flex-grow url-text">{{ url }}</div>
                    <el-button class="flex-shrink" type="text" icon="el-icon-document-copy" @click="copy">复制</el-button>
                </div>
            </div>
        </div>
        <slot slot="reference" name="reference"></slot>
    </el-popover>
</template>

<script>
import QRCode from 'qrcodejs2';
export default {
    name: 'PopoverQrcode',
    props: {
        url: {
            required: true,
            type: String,
        },
        placement: {
            type: String,
        },
        trigger: {
            type: String,
            default: 'click',
        },
        title: {
            type: String,
            default: '二维码（右击保存）',
        },
    },
    watch: {
        url(newV, oldV) {
            this.$nextTick(function() {
                this.createQrcode();
            });
        },
    },
    created() {
        this.$nextTick(function() {
            this.createQrcode();
        });
    },
    methods: {
        createQrcode() {
            this.$refs.qrcode.innerHTML = '';
            new QRCode(this.$refs.qrcode, {
                width: 150,
                height: 150,
                text: this.url,
            });
        },
        downloadQrcode() {
            // 获取base64的图片节点
            let img = this.$refs.qrcode.getElementsByTagName('img')[0];
            // 构建画布
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            // 构造url
            let url = canvas.toDataURL('image/png');
            // 构造a标签并模拟点击
            let downloadLink = document.createElement('a');
            downloadLink.setAttribute('href', url);
            downloadLink.setAttribute('download', '二维码.png');
            downloadLink.click();
        },
        copy() {
            let oInput = document.createElement('input');
            oInput.value = this.url;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象;
            document.execCommand('Copy'); // 执行浏览器复制命令
            this.$message({
                message: '复制成功',
                type: 'success',
            });
            oInput.remove();
        },
    },
};
</script>

<style lang="scss" scoped>
.popup-content {
    width: 260px;
    padding: 10px;
    .title {
        text-align: center;
        font-size: 14px;
        color: #333;
    }
    .qrcode {
        width: 130px;
        height: 130px;
        display: block;
        margin: 20px auto 0;

        img,
        ::v-deep img,
        canvas,
        ::v-deep canvas {
            width: 100%;
            height: 100%;
        }
    }
    .button-group {
        text-align: center;
        padding: 10px 0;
        .link-button {
            margin: 0 10px;
        }
    }
    .popup-footer {
        border-top: 1px solid #d8d8d8;
        margin-top: 8px;
        padding-top: 10px;
        .footer-title {
            text-align: center;
            font-size: 14px;
            color: #333;
        }
        .url-text {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
    }
}
</style>
