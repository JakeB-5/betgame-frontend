<template>
  <transition name="modal">
    <div class="modal-mask" v-if="open" @click.self="modalClose">
      <div class="modal-container">
        <div class="modal-heading">
          <slot name="modal-heading">Header Text</slot>
        </div>
        <div class="modal-contents">
          <slot name="modal-contents">Content</slot>
        </div>
        <div class="modal-actions">
          <slot name="actions"></slot>
          <button class="modal-btn-ok" @click.prevent="modalClose">OK</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {defineComponent, nextTick, watch} from "vue";

const ModalBase = defineComponent({
  name: "ModalBase",
  props: {
    open: {
      type: Boolean,
      required: false,
      default: false,
    },
    useHeader: {
      type: Boolean,
      required: false,
      default: false,
    },

  },
  setup(props, {emit}) {
    const modalClose = () => {
      emit('update:open', !props.open)
    }

    watch(() => props.open, (nv) => {
      if(nv) {
        nextTick(() => {
        setTimeout(() => {
        document.body.classList.add('modal-open')
        }, 500)
        })
      } else {
        document.body.classList.remove('modal-open')
      }
    })

    return {
      modalClose

    }
  }
})

export default ModalBase
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0, .3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity .3s ease;
}

.modal-container {
  min-width: 150px;
  max-width: 70vw;
  max-height: 80vh;
  padding: 20px 30px;
  background-color: $body-bg;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,.33);
  transition: all .3s ease;

  .modal-header {

  }
  .modal-contents {

  }
  .modal-footer {

  }

  .modal-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    .modal-btn-ok {
      background: transparent;
      border: 1px solid #ffffffc0;
      padding: .5rem 5rem;
      outline: 0;
      color: #fff;
      border-radius: 20px;
      transition: all .3s ease;
      &:hover {
        background: #fff;
        border-color: #fff;
        color: #000;
      }
    }
  }
}


.modal-enter {
  opacity: 1;
  .modal-container {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}

.modal-leave-active {
  opacity: 0;
}
.modal-enter-active {
  opacity: 1;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>
