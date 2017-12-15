<template>
  <div class="u-buttons">
    <ButtonGroup v-for="btnGroup in buttons" :size="size">
      <Button v-for="btn in btnGroup" :type="btn.type"
        :disabled="btn.disabled"
        @click.prevent="handleButtonClick(btn)">
          <Icon v-if="btn.icon" :type="btn.icon"></Icon>
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
        btn.onClick(this.target, this.data)
      }
    }
  }

}
</script>

<style>
.u-buttons {
  display: inline-block;
}
</style>
