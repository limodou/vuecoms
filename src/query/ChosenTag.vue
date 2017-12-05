/*
 * 生成条件Tag
 */

 <template>
   <span class="condition-tag" @click.prevent="handleClick" :title="title">
     <!-- 条件标签 -->
      <a
        href="#"
      >
        <span class="tag-label">{{label}}</span>
        <span class="tag-value">{{title}}</span>
      </a>

      <b> &times; </b>
   </span>
 </template>

 <script>
 export default {
   props:['name', 'title', 'label'],

   methods: {
     handleClick () {
       this.$emit('click', this.name)
     }
   }
 }
 </script>

 <style>
 .condition-tag {
   position: relative;
   border:1px solid #eee;
   padding: 0px 20px 0px 4px;
   line-height: 24px;
   max-width: 130px;
   width: auto !important;
   margin-right:5px;
   margin-top:5px;
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
 }
 .condition-tag a {
   text-decoration: none;
   color: black;
 }
 .condition-tag b {
   position: absolute;
   right: 0px;
   top: 0px;
   font-weight: normal;
   font-size: 2em;
   vertical-align: middle;
 }
 .condition-tag:hover {
   border:1px solid red;
   cursor: pointer;
 }
 .condition-tag:hover b {
   background-color: red;
   color: white;
 }
 .condition-tag .tag-value {
   color: red;
 }
 </style>
