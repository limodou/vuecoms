<template>
  <div class="u-build">
    <component v-for="item in data"
      :is="item.layoutComponent"
      v-bind="item"
      :model="value"></Snippet>
  </div>
</template>

<script>
export default {
  name: 'Build',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    plainData: true, //数据是否扁平化
    value: { // 数据存放对象
      type: Object,
      default: () => {
        return {}
      }
    }
    /*
      [
        //Snippet
        {
          name: //名字
          title: //标题
          tools: //工具
          fields: [] //字段
          layout: [] //布局
          layoutComponent： 'Snippet' //布局组件，卸省为Snippet
          boxComponent: 'Box'
        }
      ]
    */
  }
}
</script>

<style lang="less">

</style>
