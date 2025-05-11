<template>
  <div class="">
    <input type="text" :value="modelValue" @keypress="onlyDecimal && onKeyupDecimal($event)" @input="$emit('update:modelValue', $event.target.value)">
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, SetupContext} from "vue";

const UIInput = defineComponent({
  name: "UIInput",
  props: {
    type: { type: String, required: true, default: 'text' },
    modelValue: { default: '' },
    disabled: {required: false, default: false},
    placeholder: {required: false, default: null},
    required: {required: false, default: false},
    autocomplete: {required: false, default: null},
    readonly: {required: false, default: false},
    autofocus: {required: false, default: false},
    onlyDecimal: {required: false, default: false, type: Boolean },
  },
  setup(props, {attrs, emit}: SetupContext) {

    //const inputUid = useInputUid()
    const refInput = ref(null)

    const onKeyupDecimal = (e:KeyboardEvent) => {
      const charCode = e.which ? e.which : e.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        e.preventDefault()
        return false
      } else {

        return true
      }
    }
    return {
      onKeyupDecimal
    }
  }
})

export default UIInput
</script>

<style lang="scss" scoped>
input {
  width: 100%;
  background: transparent;
  border: 1px solid #fff;
  border-radius: 4px;
  padding: 4px 8px;
  margin-bottom: 4px;
  color: #fff;
}
</style>
