<template>
  <router-view />
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  setup() {
    const store = useStore();
    const hasToken = computed(() => store.getters.getToken);
    const isHasToken = ref(true);
    watch(hasToken, () => {
      console.log(hasToken, isHasToken);
    });
    return {
      hasToken: store.getters.getToken
    };
  }
});
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}
* {
  ::after,
  ::before {
    box-sizing: border-box;
  }
}
#app {
  width: 100vw;
  height: 100vh;
  color: #333;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
