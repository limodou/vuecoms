<template>
  <div class="u-buttons">
    <ButtonGroup v-for="btnGroup in buttons" :size="size">
      <Button v-for="btn in btnGroup" 
        :type="btn.type || 'default'"
        :ghost="btn.ghost || false"
        :disabled="btn.disabled || disabled"
        :shape="btn.shape"
        :size="btn.size"
        :long="btn.long"
        :loading="btn.loading"
        :icon="btn.icon"
        @click.prevent="handleButtonClick(btn)">
          {{btn.label}}
      </Button>
    </ButtonGroup>
  </div>
</template>

<script>
import {ButtonGroup, Button, Icon} from 'iview'

export default {
  name: 'Buttons',

  components: {
    ButtonGroup,
    Button,
    Icon
  },

  data() {
    return {
      disabled: false,
      btns: {}
    }
  },

  props: {
    buttons: Array,
    data: {},
    target: {},
    size: {
      default: 'small'
    }
  },

  methods: {
    handleButtonClick (btn) {
      if (btn.onClick) {
        btn.onClick.call(this, this.target, this.data)
      }
    },
    collectButtons () {
      var btns = {}
      for(let bs of this.buttons) {
        for(let b of bs) {
          if (b.name) {
            btns[b.name] = b
            this.$set(b, 'loading', b.loading || false)
          }
        }
      }
      this.btns = btns
    }
  },

  mounted () {
    this.collectButtons()
  },

  watch: {
    buttons: {
      handler () {
        this.collectButtons()
      }
    },
    deep: true
  }
}
</script>

<style>
.u-buttons {
  display: inline-block;
}
</style>
