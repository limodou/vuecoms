<template>
  <div class="upload" :style="styleObj">
    <file-upload
            class="btn btn-primary btn-xs btn-flat"
            name="upload"
            :ref="ref"
            :post-action="post_action"
            :post-data="post_data"
            :multiple="multiple"
            :directory="false"
            :thread="1"
            v-model="files"
            @input-file="inputHandler"
    >上传附件
    </file-upload>
  </div>
</template>
<script>
  import FileUpload from "vue-upload-component"
  import {Table, Row, Col} from "iview"

  export default {
    props: ['postData', 'postAction', 'multiple'],
    components: {
      FileUpload,
      Table,
      Row,
      Col
    },
    data: function () {
      var self = this;
      var ref = Math.random().toString(16).substr(2)
      var isIE9 = (navigator.appName == "Microsoft Internet Explorer" && (navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE9.0")) ? true : false;
      return {
        ref: ref,
        post_data: this.postData,
        post_action: this.postAction,
        isIE9: isIE9
      }
    },
    mounted: function () {

    },
    methods: {
      inputHandler: function (newFile, oldFile) {
        if (newFile && !oldFile) {
          // add
          // 添加文件, 置active为true, 触发上传
          var post_data = typeof this.post_data == 'function'?this.postData():typeof this.postData == 'object' ? this.postData : {}
          var data = Object.assign({}, post_data, {
            name: newFile.name,
            //size: newFile.size,
            type: newFile.type,
            lastModifieDate: new Date(),
          })
          this.$refs[this.ref].update(newFile, {data: data})
          this.$refs[this.ref].active = true
          this.$emit("upload-add", newFile)
        }
        if (newFile && oldFile) {
          // update
          if (newFile.error && !oldFile.error) {
            // error
            // 监控到错误, 置active为false, 终止上传, 并处理错误
            this.$refs[this.ref].active = false
            this.$emit("upload-error", newFile, oldFile)
          }

          if (newFile.progress !== oldFile.progress) {
            // progress
            // 监控上传过程
            this.$emit("upload-update", newFile, oldFile)
          }

          if (newFile.success && !oldFile.success) {
            // success
            // 监控到成功, 置active为false, 终止上传, 并处理成功
            this.$refs[this.ref].active = false
            if (!this.isIE9) {
              var resp = JSON.parse(newFile.response)
            } else {
              var reg = new RegExp('<pre>', "g")
              var resp = JSON.parse(newFile.response.replace(reg, ''))
            }
            this.$emit("upload-success", resp, newFile)
          }

        }

        if (!newFile && oldFile) {
          // remove
        }

      },
      getSN: function () {
        var sns = []
        for (var i in this.uploadedFiles) {
          if (this.uploadedFiles[i].sn) {
            sns.push(this.uploadedFiles[i]['sn'])
          }
        }
        return sns
      },
      removeUploadedFile: function (id) {
        for (var i = 0, len = this.uploadedFiles.length; i < len; i++) {
          if (this.uploadedFiles[i]['id'] && this.uploadedFiles[i]['id'] == id) {
            this.uploadedFiles.splice(i, 1)
            break;
          }
        }
      },
      renderSize: function (value) {
        if (null == value || value == '') {
          return " - ";
        }

        var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
        var index = 0;

        var srcsize = parseFloat(value);

        var size = Math.floor(srcsize / Math.pow(1024, (index = Math.floor(Math.log(srcsize) / Math.log(1024)))), 2);
        return size + unitArr[index];
      },
      load: function (data) {
        self.uploadedFiles = data
      }
    },
    watch: {
      mode: function (nv, ov) {
        this.mode_ = nv
      }
    }
  }
</script>
