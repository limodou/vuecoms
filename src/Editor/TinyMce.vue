<template>
  <div>
    <textarea :id="id" :name="name"></textarea>
  </div>
</template>

<script>
import {uuid} from '../utils/utils'

const INIT = 1
const CHANGE = 2

export default {
  name: 'TinyMceEditor',
  data () {
    let id = uuid()
    return {
      id: id,
      status: null
    }
  },
  props: {
    name: String, 
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    init () {
      let self = this
      let default_options = {
        selector: `#${this.id}`,
        height: 360,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        language:"zh_CN",
        menubar: false,
        branding: false,
        elementpath: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor textcolor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table contextmenu paste code help wordcount'
        ],
        toolbar: 'insert | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | help',
        init_instance_callback: editor => {
          if (this.value) {
            editor.setContent(this.value)
          }
          this.status = INIT
          editor.on('input change undo redo', () => {
            this.status = CHANGE
            this.$emit('input', editor.getContent())
          })
        }
      }
      let opts = Object.assign({}, default_options, this.options)
      tinymce.init(opts)
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    value: {
      handler (val) {
        if (this.status == INIT || tinymce.get(this.id).getContent() != val){  
          tinymce.get(this.id).setContent(val)
        }  
      }
    }
  },
  beforeDestroy () {
    tinymce.get(this.id).destroy()
  }
}
</script>
