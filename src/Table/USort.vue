<template>
  <div class="u-sort" :class="{up:sortDir==='asc', down:sortDir==='desc'}" @click.stop.prevent="handleSort" :style="getStyles">
    <i class="ivu-icon ivu-icon-android-arrow-dropup u-sort-up"></i>
    <i class="ivu-icon ivu-icon-android-arrow-dropdown u-sort-down"></i>
  </div>
</template>

<script>
export default {
  name: 'Sort',
  data () {
    return {sortDir: '', top: 0, right: 8}
  },

  props: {
    store: Object,
    column: Object
  },

  computed: {
    getStyles () {
      return {top: `${this.top}px`, right: `${this.right}px`}
    }
  },

  methods: {
    handleSort () {
      let sortField = ''
      if (this.sortDir == 'asc') {
        this.sortDir = 'desc'
        sortField = `${this.column.name}.desc`
      } else if (this.sortDir == 'desc') {
        this.sortDir = ''
        sortField = ''
      } else {
        this.sortDir = 'asc'
        sortField = `${this.column.name}.asc`
      }
      this.$set(this.store.states.param, 'sortField', sortField)
      this.store.grid.loadData()
    }
  },

  mounted () {
    this.top = (this.$parent.$el.clientHeight - this.$el.clientHeight)/2
  }
}
</script>

<style lang="less">
  .u-sort {
    position: absolute;
    width: 7px;
    height: 24px;
    color: #999;
    cursor: pointer;

    .u-sort-up {
      position: absolute;
      top: 4px;
    }

    .u-sort-down {
      position: absolute;
      top: 10px;
    }

    &.up {
      .u-sort-up {
        color: black;
      }
    }

    &.down {
      .u-sort-down {
        color: black;
      }
    }
  }
</style>
