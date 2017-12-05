/*
 * 生成文本输入条件
 */

 <template>
   <div class="condition-col">
     <!-- 条件标签 -->
      <span class="condition-col-label">
        {{info.label}}
      </span>

      <!-- 条件选项 -->
      <div class="condition-col-body">
        <input type="text"
          @blur="handleInput"
          @keyup.enter="handleInput"
          @keyup.esc="handleEsc"
          ref="input"
          :value="info.value"></input>
      </div>
   </div>
 </template>

 <script>
 export default {
   data () {
     return {
     }
   },

   props: {
     // {
     //   name      字段名称
     //   label     条件显示标签
     //   choices   条件值 [(value, title),...] [{vlue:xxx, title:xxx},...]
     //   value     当前值
     //   width     如果为0，表示浮动模式，否则使用固定模式
     // }
     info: {
       type: Object,
       default: {}
     }
   },

   //每次更新时，触发 change-title 事件，用于更新父元素的 titles ，从而绘制选中的条件
   //与select不同，select是在 computed.cal_choices 中计算的
   beforeUpdate () {
     this.$emit('change-title', this.info.name, this.info.value)
   },

   methods: {
     handleInput () {
       console.log('input', this.$refs.input.value)
       this.$emit('input', this.$refs.input.value, this.info.name)
       this.$emit('change-title', this.info.name, this.info.value)
     },
     handleEsc () {
       console.log('esc')
       this.$refs.input.value = ''
     }
   }
 }
 </script>
