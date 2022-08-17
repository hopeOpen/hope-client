<template>
  <router-view />
  <home />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Home from './views/home/index.vue';

export default defineComponent({
  components: {
    Home
  }
});
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}
#app {
  width: 100vw;
  height: 100vh;
}
</style>
