<template>
  <div class="u-sort" :class="{up:dir==='asc', down:dir==='desc'}" @click.stop.prevent="handleSort">
    <i class="ivu-icon ivu-icon-md-arrow-dropup u-sort-up"></i>
    <i class="ivu-icon ivu-icon-md-arrow-dropdown u-sort-down"></i>
  </div>
</template>

<script>
import {mapState} from '../utils/utils.js'

export default {
  name: 'Sort',

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
    height: 10px;
    color: #999;
    cursor: pointer;
    top: 50%;
    right: 8px;
    transform: translate(0,-50%);

    .u-sort-up {
      position: absolute;
      top: -5px;
    }

    .u-sort-down {
      position: absolute;
      bottom: -5px;
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
