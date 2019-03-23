<template>
  <FileUpload
    :class="customClass"
    :post-action="postAction"
    :size="size"
    :multiple="multiple"
    :headers="headers"
    :data="data"
    :value="value"
    :extensions="extensions"
    :input-id="inputId"
    :accept="accept"
    :inputId="inputId"
    :name="name"
    @input="handleUpdateFiles"
    @input-file="handleInputFile"
    ref="upload">
    <slot></slot>
  </FileUpload>
</template>

<script>
import FileUpload from "./vue-upload-component"
import {uuid} from './utils/utils'

export default {
  name: 'uploader-file',
  components: {FileUpload},
  props: {
    value: {},
    size: {},
    multiple: {
      type: Boolean,
      default: false
    },
    headers: {},
    data: {},
    accept: {},
    inputId: {
      type: String,
      default () {
        return uuid()
      }
    },
    name: {},
    extensions: {},
    postAction: {},
    customClass: {
      type: String,
      default: 'ivu-btn ivu-primary'
    },
    inputFile: {}, // 文件上传处理函数，如果未提供，则使用看缺省函数
    autoUpload: {
      type: Boolean,
      default: true
    }, // 是否自动上传，缺省为 true
    onStart: {}, // 开始上传
    onProgress: {}, // 传输中
    onSuccess: {}, // 成功
    onError: {}, // 出错
    onUpload: {}, // 上传
    onDelete: {}, // 删除
  },
  components: {FileUpload},
  methods: {
    handleInputFile (newFile, oldFile) {
      if (this.inputFile) this.inputFile(newFile, oldFile)
      else this.defaultInputFile(newFile, oldFile)
    },

    defaultInputFile (newFile, oldFile) {
      if (newFile && !oldFile) {
        // 添加文件
        this.onUpload && this.onUpload(newFile)
      }

      if (newFile && oldFile) {
        // 更新文件

        // 开始上传
        if (newFile.active !== oldFile.active) {
          console.log('start', newFile.active, newFile)
          this.onStart && this.onStart(newFile)
        }

        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          console.log('progress', newFile.progress, newFile)
          this.onProgress && this.onProgress(newFile.progress, newFile)
        }

        // 上传错误
        if (newFile.error !== oldFile.error) {
          console.log('error', newFile.error, newFile)
          this.onError && this.onError(newFile.error, newFile)
        }

        // 上传成功
        if (newFile.success !== oldFile.success) {
          console.log('success', newFile.success, newFile)
          this.onSuccess && this.onSuccess(newFile.success, newFile)
        }
      }

      if (!newFile && oldFile) {
        // 删除文件
        this.onDelete && this.onDelete(newFile)
      }

      // 自动上传
      if (this.autoUpload && (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error)) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    },
    handleUpdateFiles (v) {
      for(let f of v){
        let status = f.error ? 'error' : f.success ? 'success' : f.active ? 'active' : ''
        f.status = status
      }
      this.$emit('input', v)
    },
    clear () {
      this.$refs.upload.clear()
    }
  }
}
</script>