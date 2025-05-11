<template>
  <div class="heading-container">
    <span class="heading-text">
    <slot>Heading Text</slot>
    </span>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

const UIHeading = defineComponent({
  name: "UIHeading"
})

export default UIHeading
</script>

<style lang="scss" scoped>

.heading-container {
  .heading-text {
    color: $high-font-color;
    font-size: 1.35em;
    font-weight: bold;
  }
}
</style>
