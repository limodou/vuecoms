/*
 * 生成静态单选或多选组件
 */

 <template>
   <div class="condition-col">
     <!-- 条件标签 -->
      <span class="condition-col-label">
        {{info.label}}
      </span>

      <!-- 条件选项 -->
      <div class="condition-col-body">
        <ul :class="{'condition-choices':true, fixed:info.width}">
          <li
            v-for="item in cal_choices"
            :class="{active:item.active}"
          >
            <a
              @click.prevent="handleSelect(item.value, item.title)"
              href="#"
              >
              {{ item.title }}
            </a>
          </li>
        </ul>
      </div>

      <!-- 条件控制 -->
      <div class="condition-col-control">
        <button class="btn">多选</button>
      </div>
   </div>
 </template>

 <script>
 export default {
   data () {
     return {
     }
   },

   computed: {
     //计算choices，返回形式为 [{value:xxx, title:xxx},...]
     //同时计算选中值的标题，并发出 change-title 事件，用于父元素更新选中条件
     cal_choices () {
       let item
       let result = []
       let choice
       let titles = []
       let value = this.info.value
       for(let i=0, _len=this.info.choices.length; i<_len; i++) {
         item = this.info.choices[i]
         if (Array.isArray(item)) {
            choice = {value:item[0], title:item[1]}
         }
         else {
            choice = {value:item.value, title:item.title}
         }
         if (Array.isArray(value)) {
           choice.active = value.indexOf(choice.value) > -1
         } else if (value == choice.value) {
           choice.active = true
           titles.push(choice.title)
         }

         result.push(choice)
       }

       //通知父结点标题发生了变化
       let title = titles.join(',')
       this.$emit('change-title', this.info.name, title)
       return result
     }
   },

   props: {
     // {
     //   name      字段名称
     //   label     条件显示标签
     //   choices   条件值 [(value, title),...] [{vlue:xxx, title:xxx},...]
     //   value     当前值
     //   multiple  是否多选
     //   width     如果为0，表示浮动模式，否则使用固定模式
     // }
     info: {
       type: Object,
       default: {}
     }
   },

   methods: {
     handleSelect (value, title) {
       this.$emit('input', value, this.info.name)
     }
   }
 }
 </script>
