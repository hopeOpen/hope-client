<template>
  <div id="app" class="app">
    <!-- 右侧导航 -->
    <hope-nav />
    <!-- 左侧内容区域 -->
    <main class="app-main">
      <top-menu />
      <section class="app-main__section">
        <transition name="fade" mode="out-in">
          <keep-alive :include="cacheComponents">
            <router-view />
          </keep-alive>
        </transition>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import HopeNav from './views/nav/index.vue';
import TopMenu from './views/components/topMenu.vue';
export default defineComponent({
  components: {
    HopeNav,
    TopMenu,
  },
  setup() {
    const cacheComponents = ref([]);
    return {
      cacheComponents,
    };
  },
});
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}
#app {
  display: flex;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  min-width: 900px;
  min-height: 240px;
  overflow: hidden;
  .app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    &__section {
      flex: 1;
      padding: $common-padding;
      box-sizing: border-box;
      background-color: #f6f8f9;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease-out;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
