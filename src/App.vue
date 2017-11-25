<template>
  <div id="app">
    <Box title="success">
      <p>You successfully read this important alert message.</p>
    </Box>
  </div>
</template>

<script>
import {Box} from '@/index.js'

export default {
  name: 'app',
  components: {
    alert
  }
}
</script>
