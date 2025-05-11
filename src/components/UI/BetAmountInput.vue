<template>
<div class="input-control-container">
  <input type="text" :value="value" @keypress="onKeyupDecimal($event)" @input="onInput($event,$event.target.value)">
  <div class="append">ITT</div>
</div>
</template>

<script lang="ts">
import {Amount} from "@/sdk/utils/Amount";
import {BN} from "@project-serum/anchor";
import {computed, defineComponent, PropType, ref, watch} from "vue";

const BetAmountInput = defineComponent({
  name: "BetAmountInput",
  props: {
    type: {
      type: String,
      required: true,
      default: 'text'
    },
    modelValue: {
      type: Object as PropType<BN>,
      default: new BN(0)
    },
    disabled: {required: false, default: false},
    readonly: {required: false, default: false},
    autofocus: {required: false, default: false},
    onlyDecimal: {required: false, default: false, type: Boolean },

    min: {required: false, default: new BN(0)},
    max: {
      type: Object as PropType<BN>,
      required: true, default: new BN(0)},
  },
  setup(props, {attrs, emit}) {


    const value = ref(''+Amount.toNumber(props.modelValue, 6))

    const onInput = (e:any, v:string) => {
      const rawUpdateValue = Amount.fromNumber(v, 6)
      value.value = v
      let updateValue = rawUpdateValue


      //updateValue = rawUpdateValue
      if(rawUpdateValue.gt(props.max)) {
        //e.preventDefault()
        updateValue = props.max
        //return false
      }

      //console.log(updateValue.toNumber())

      value.value = ''+Amount.toNumber(updateValue, 6)
      emit('update:modelValue', updateValue)

    }

    const onKeyupDecimal = (e:KeyboardEvent) => {
      const charCode = e.which ? e.which : e.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        e.preventDefault()
        return false
      } else {

        return true
      }
    }
    watch(()=>props.modelValue, (nv) => {
      value.value = ''+Amount.toNumber(props.modelValue,6)
    })
    return {
      onKeyupDecimal,
      onInput,
      value
    }
  }
})

export default BetAmountInput
</script>

<style lang="scss" scoped>
.input-control-container {
  position: relative;
  width: 100%;
  .append {
    position: absolute;
    top: 0;
    //bottom: 0;
    height: calc(2.5rem + 2px);
    line-height: calc(2.5rem + 2px);
    font-size: 1rem;
    right: 1rem;
    color: #fff;
    //font-weight: 500;
    letter-spacing: -.02rem;

  }
  input {
    width: 100%;
    //border: 1px solid #fff;
    border-radius: 8px;
    background: #ffffff2a;
    border: 0;
    color: #fff;
    //background: transparent;
    outline: 0;
    font-weight: 300;
    font-size: 1rem;
    line-height: 1.5rem;
    text-align: right;
    padding: .5rem 2.8rem .5rem 1rem;
  }
}

</style>
