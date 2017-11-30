<template>
  <div class="u-sort" :class="{up:dir==='asc', down:dir==='desc'}" @click.stop.prevent="handleSort" :style="getStyles">
    <i class="ivu-icon ivu-icon-android-arrow-dropup u-sort-up"></i>
    <i class="ivu-icon ivu-icon-android-arrow-dropdown u-sort-down"></i>
  </div>
</template>

<script>
import {mapState} from '@/utils/utils.js'

export default {
  name: 'Sort',
  data () {
    return {top: 0, right: 8}
  },

  props: {
    store: Object,
    column: Object
  },

  computed: {
    ...mapState('param'),

    dir () {
        if (this.param.sortField === this.column.name) {
          return this.param.sortDir
        } else {
          return ''
        }
    },

    getStyles () {
      return {top: `${this.top}px`, right: `${this.right}px`}
    }
  },

  methods: {
    handleSort () {
      let sortField = this.column.name
      let sortDir = ''
      if (this.dir == 'asc') {
        sortDir = 'desc'
      } else if (this.dir == 'desc') {
        sortDir = ''
      } else {
        sortDir = 'asc'
      }
      this.$set(this.store.states.param, 'sortField', sortField)
      this.$set(this.store.states.param, 'sortDir', sortDir)
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
    height: 28px;
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
