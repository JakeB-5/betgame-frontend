<template>
  <header class="">
    <div class="mask"></div>
    <div class="nav-menus">
      <div class="header-top">
        <div></div>
        <div class="network-health">
          <div class="ic-status"></div>
          <div class="network-name">SOLANA - devnet</div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-between w-100">
        <div class="d-flex align-items-center">
          <div class="logo-container">
            <router-link to="/">
              <div class="logo"><img src="../assets/bi.svg"/></div>
            </router-link>
          </div>
        </div>
        <div class="auth">
          <WalletComponent/>
        </div>
      </div>
    </div>
  </header>

</template>

<script lang="ts">
import WalletComponent from "@/components/WalletComponent.vue";
import {defineComponent} from "vue";

const AppHeader = defineComponent({
  name: "AppHeader",
  components: {WalletComponent},
  setup(props) {

    return {}
  }
})

export default AppHeader
</script>

<style lang="scss" scoped>
header {
  z-index: 50;
  height: 86px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  .nav-bar {
    //  aling-items: flex-start;
  }

  .mask {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    height: 86px;
    background: linear-gradient(0, transparent, #0000007a);
    backdrop-filter: blur(12px);
    border-bottom: 2px solid #ffc20000;
    -webkit-mask-image: linear-gradient(180deg, black 50%, transparent);

  }

  .nav-menus {
    position: relative;
    width: 100%;
    max-width: 1440px;
    padding: 0 30px;
    padding-top: .5rem;
    margin: 0 auto;
  }

  .logo {
    margin-right: 1rem;

    img {
      height: 2rem;
    }
  }

  .auth {
  }

  .header-top {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .network-health {
      display: flex;
      align-items: center;

      .ic-status {
        background: #fff;
        -webkit-animation: pulseHealth 2s ease-out infinite;
        animation: pulseHealth 2s ease-out infinite;

        width: 1em;
        height: 1em;
        border-radius: 50%;
        font-size: .5em;

        margin-right: 1em;
        position: relative;
      }

      .network-name {
        font-size: .75rem;
        line-height: 1;
      }

    }
  }
}

@keyframes pulseHealth {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
  }

  70% {
    -webkit-box-shadow: 0 0 0 .75em rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 .75em rgba(255, 255, 255, 0.2);
  }

  100% {
    -webkit-box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
  }
}

</style>
