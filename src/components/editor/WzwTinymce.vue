<template>
	<div class="tiny-wrap">
		<bind-link-components @cancel="bindLinkCancel" :onSuccess="bindLinkSuccessCall" :pageEl="pageEl" :show="bindLinkDialogShow"></bind-link-components>
		<textarea :id="tinymceId"></textarea>
	</div>
</template>

<script>

import BindLinkComponents from '@/components/BindLinkComponents'
const tinyLibUrl = 'static/tinymce/tinymce.min.js';
import {uploadByTiny} from '@/components/editor/uploadByTiny'
import Vue from 'vue'

export default {
  name: 'WzwTinymce',
  components: { BindLinkComponents },
  props:{
    tinymceId:{
      type:String,
      default:'tinyEle'
    },
    content:{
        type:String,
        default:''
    }
	},
  data () {
    return {
      pageEl:null,
      bindLinkDialogShow: false,
      bindLinkIdx2: null,
      bindLinkSuccessCall(dataType, type, path, tooltip, dataItem, pageEl, idx2){

        console.log(dataType, type, path, tooltip, dataItem, pageEl, idx2)
        pageEl.bindLinkDialogShow = false;

        const ext = encodeURIComponent(JSON.stringify(dataItem))

	      var innerHtml = `<p><span class="diy-link-ele" data-ext="${ext}" data-linkType="${type}" data-url="${path}">${tooltip}</span></p>`
        window.tinymce.get(pageEl.tinymceId).insertContent(innerHtml)

      },
    }
  },
	watch:{
    content:{
	    handler(val){
        console.log('content change',val)
        if(!val)return
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || '')
        )
	    }
    }
	},
	methods:{
    bindLinkCancel(){
      this.bindLinkDialogShow = false
    },
    bindChange(){
      const content = this.getContent()
      //console.log(content)
      this.$emit('change',content)
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    // 设置编辑器内容
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    // 获取编辑器内容
    getContent() {
      return window.tinymce.get(this.tinymceId).getContent()
    },
    loadResource(){
      return new Promise((resolve, reject) => {
        var script = document.createElement('script')
        script.type = 'text/javascript';
        script.src = tinyLibUrl;
        document.getElementsByTagName('head')[0].appendChild(script);

        script.onload = function(){
          resolve(true)
        }
      })

    },
		async _init_func(){
      var that = this

			//加载各种资源
      await this.loadResource()

			//toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | table image funimgs media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | indent2em lineheight',
			//采用了折叠的配置，是方便一行显示完
			//初始化，init_instance_callback触发initDone
      tinymce.init({
        selector: `#${this.tinymceId}`,
        language: 'zh_CN',
        height: 500,
        max_height:700,
        menubar:false,
        plugins: 'funimgs code print preview searchreplace autolink directionality visualblocks visualchars fullscreen media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern lplink help emoticons autosave indent2em lineheight',
        toolbar: 'code undo redo restoredraft | removeformat forecolor backcolor lplink | styleselect alignment indent2em lineheight |  fontselect fontsizeselect | bullist numlist| table funimgs media |charmap emoticons hr pagebreak insertdatetime | blockquote subscript superscript   |  print preview fullscreen',
        toolbar_groups: {
          formatting: {
            text: '文字格式',
            tooltip: 'Formatting',
            items: 'bold italic underline | superscript subscript',
          },
          alignment: {
            icon: 'align-left',
            tooltip: 'alignment',
            items: 'alignleft aligncenter alignright alignjustify outdent indent',
          },
        },

        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
        link_list: [
          // { title: '预置链接1', value: 'http://www.tinymce.com' },
          // { title: '预置链接2', value: 'http://tinymce.ax-z.cn' }
        ],
        image_list: [
          // { title: '预置图片1', value: 'https://www.tiny.cloud/images/glyph-tinymce@2x.png' },
          // { title: '预置图片2', value: 'https://www.baidu.com/img/bd_logo1.png' }
        ],
        image_class_list: [
          { title: 'None', value: '' },
          { title: 'Some class', value: 'class-name' }
        ],
        importcss_append: true,
        //自定义文件选择器的回调内容
        file_picker_callback: function (callback, value, meta) {
          // if (meta.filetype === 'file') {
          //   callback('https://www.baidu.com/img/bd_logo1.png', { text: 'My text' });
          // }
          // if (meta.filetype === 'image') {
          //   callback('https://www.baidu.com/img/bd_logo1.png', { alt: 'My alt text' });
          // }
          // if (meta.filetype === 'media') {
          //   callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.baidu.com/img/bd_logo1.png' });
          // }
        },
        autosave_ask_before_unload: false,
        images_reuse_filename: true,
        images_upload_credentials: true,
        images_upload_handler:uploadByTiny.upload,
        init_instance_callback : function(editor) {
          console.log("Editor: " + editor.id + " is now initialized.");
          that.$emit('initDone',1)

          window.tinymce.get(that.tinymceId).vm = that
        },
        // setup: function(editor){
        //   editor.on('change',function(){
        //     that.bindChange()
        //   });
        // },
        content_css: 'static/tinymce/content.css',
      });

		}
	},
	created(){
    this._init_func()

		this.pageEl = this

	}
}
</script>
<style lang="scss" >

</style>
