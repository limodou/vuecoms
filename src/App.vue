<template>
  <div id="app">
    <alert type="success">
      <p>You successfully read this important alert message.</p>
    </alert>
  </div>
</template>

<script>
import {alert} from '@/index.js'

export default {
  name: 'app',
  components: {
    alert
  }
}
</script>
