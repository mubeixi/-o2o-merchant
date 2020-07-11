<template>
	<div class="tiny-wrap">
		<textarea id="tinyEle">Hello, World!</textarea>
	</div>
</template>

<script>
const tinyLibUrl = '/static/tinymce/tinymce.min.js';
import {uploadByTiny} from '@/components/editor/uploadByTiny'

export default {
  name: 'WzwTinymce',
  data () {
    return {}
  },
	methods:{
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

			//初始化，init_instance_callback触发initDone
      tinymce.init({
        selector: '#tinyEle',
        language: 'zh_CN',
        plugins: 'axupimgs code print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave indent2em autoresize lineheight formatpainter',
        toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | table image axupimgs media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | indent2em lineheight formatpainter',
        min_height: 400,
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
        link_list: [
          { title: '预置链接1', value: 'http://www.tinymce.com' },
          { title: '预置链接2', value: 'http://tinymce.ax-z.cn' }
        ],
        image_list: [
          { title: '预置图片1', value: 'https://www.tiny.cloud/images/glyph-tinymce@2x.png' },
          { title: '预置图片2', value: 'https://www.baidu.com/img/bd_logo1.png' }
        ],
        image_class_list: [
          { title: 'None', value: '' },
          { title: 'Some class', value: 'class-name' }
        ],
        importcss_append: true,
        //自定义文件选择器的回调内容
        file_picker_callback: function (callback, value, meta) {
          if (meta.filetype === 'file') {
            callback('https://www.baidu.com/img/bd_logo1.png', { text: 'My text' });
          }
          if (meta.filetype === 'image') {
            callback('https://www.baidu.com/img/bd_logo1.png', { alt: 'My alt text' });
          }
          if (meta.filetype === 'media') {
            callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.baidu.com/img/bd_logo1.png' });
          }
        },
        autosave_ask_before_unload: false,
        images_reuse_filename: true,
        images_upload_credentials: true,
        images_upload_handler:uploadByTiny.upload,
        init_instance_callback : function(editor) {
          console.log("Editor: " + editor.id + " is now initialized.");
          that.$emit('initDone',1)
        }
      });

		}
	},
	created(){
    this._init_func()
	}
}
</script>
<style scoped>

</style>
