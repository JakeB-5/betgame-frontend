<template>
  <div class="ui-panel" :class="{primaryBorder: primaryBorder}">
    <div class="ui-panel-content">
      <UIHeading v-if="heading">{{heading}}</UIHeading>
    <slot name="heading" v-else>
      <UIHeading/>
    </slot>
    <slot name="default">PANEL CONTAINER</slot>
    </div>
  </div>
</template>

<script lang="ts">
import UIHeading from "@/components/UI/UIHeading.vue";
import {defineComponent} from "vue";

const UIPanel = defineComponent({
  name: "UIPanel",
  props: {
    heading: {
      type: String,
      required: false,
    },
    primaryBorder: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  components: {UIHeading}
})

export default UIPanel
</script>

<style lang="scss" scoped>
  $spacing: 20px;
  $space-gap: 12px;
  .ui-panel {
    width: 100%;
    //height: 100%;
    border-radius: $space-gap;
    //border-image: linear-gradient(90deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%) border-box;
    //border-image-slice: 1;
    border: 2px solid #fff;
    margin-bottom: $space-gap;

    & + .ui-panel {
      //margin-top: $space-gap;
    }

    &.primaryBorder {
      border: 2px solid transparent;
      background-image: linear-gradient($body-bg, $body-bg), linear-gradient(90deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%);
      background-origin: border-box;
      background-clip: content-box, border-box;
    }
    //-webkit-mask: /*4*/ linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    //-webkit-mask-composite: xor;
    //mask-composite: exclude;

    .ui-panel-content {
      box-sizing:border-box;
      width: calc(100% - $spacing);
      height: calc(100% - $spacing);
      margin: $spacing;
    }
  }
</style>
