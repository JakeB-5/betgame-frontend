<template>
  <AppHeader v-if="true"/>
  <div class="content-container">
  <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  //color: #2c3e50;
}

.content-container {
  //padding-top: 86px;
  padding-top: 96px;
  //padding-top: 20px;

}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
import AppHeader from "@/components/AppHeader";
export default {
  components: { AppHeader}
}
</script>
