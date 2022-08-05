<template>
  <div class="page-container">
    <header class="page-container__header"></header>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'PageContainer',
};
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;

  &__header {
    height: 55px;
  }
}
</style>
