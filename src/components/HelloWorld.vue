<template>
  <div class="container-fluid" style="max-width: 1440px">
    <ManagerControlPanel class="manager-control-panel" v-if="false"/>
    <div class="grid-layout" :class="[`tab-selected-${selectedTab}`]">
      <TVChart class="tv-chart c1 hs2 r1 tab-pane-game" v-if="true"/>
      <LeaderBoard class="leader-board c1 r2 tab-pane-rank" v-if="useGame"/>
      <LatestGameResult class="latest-game-result c2 r2 tab-pane-stats" v-if="useGame"/>
      <div class="c3 r1 r1s2">
        <CurrentGame class="current-game tab-pane-game" v-if="useGame"/>
        <RecentlyStatistics class="recently-statistics tab-pane-stats" v-if="useGame"/>
      </div>
      <div class="c4 r1 r1s2">
        <MyInformation class="my-information tab-pane-my" v-if="useGame"/>
        <GameHistory class="game-history tab-pane-stats" v-if="useGame"/>
      </div>

    </div>

    <div class="tab-menu">
      <div class="tab-item" :class="[key, {active:selectedTab === key}]" v-for="(name,key) in tabs" :key="`mm-tab-${key}`" @click.prevent="onClickTab(key)">
        <div class="logo"><img :src="getTabMenuLogo(key)"/></div>
        <div class="name">{{name}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CurrentGame from "@/components/Game/CurrentGame.vue";
import GameHistory from "@/components/GameHistory.vue";
import LatestGameResult from "@/components/LatestGameResult.vue";
import LeaderBoard from "@/components/LeaderBoard.vue";
import ManagerControlPanel from "@/components/Manager/ManagerControlPanel.vue";
import MyInformation from "@/components/MyInformation.vue";
import RecentlyStatistics from "@/components/RecentlyStatistics.vue";
import TVChart from "@/components/TVChart.vue";
import WalletComponent from "@/components/WalletComponent.vue";
import WalletInformation from "@/components/WalletInformation.vue";
import {RootState} from "@/store";
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";

const HelloWorld = defineComponent({
  name: "HelloWorld",
  props: {},
  components: {


    RecentlyStatistics,
    MyInformation, LatestGameResult, LeaderBoard, GameHistory, ManagerControlPanel, CurrentGame, TVChart},
  setup(props) {
    const store = useStore<RootState>()
    const useGame = ref(true)

    const selectedTab = ref('game')
    const tabs = ref({
      game: 'Game',
      rank: 'Rank',
      stats: 'Stats',
      my: 'My'
    })

    const onClickTab = (key: string) => {
      selectedTab.value = key
    }
    //const program = computed(() => store.getters['game/program/GET_PROGRAM'])
    //const globalConfig = computed(() => store.getters['game/program/globalConfig'])

    // watch(globalConfig, () => {
    //   console.log('gc changed')
    //   console.log(globalConfig.value.currentStartTime.toNumber())
    // })
    //
    // onMounted(() => {
    //   console.log(globalConfig.value)
    //   /*program.value.addEventListener('change', (ev:any, slot:number) => {
    //     console.log('event emitted')
    //     console.log(ev)
    //     console.log(slot)
    //   })*/
    // })

    const getTabMenuLogo = (menuKey: string) => {
      const images = require.context('../assets', false, /\.svg$/)
      return images(`./tab-${menuKey}.svg`)
    }

    onMounted(() => {

      document.addEventListener('backbutton', async () => {
        if(selectedTab.value !== 'game') {
          selectedTab.value = 'game'
          return
        }
      }, false)

    })

    return {
      useGame,
      tabs,
      selectedTab,
      onClickTab,
      getTabMenuLogo
    }
  }
})

export default HelloWorld
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.container-fluid {
  @include media-breakpoint-up(lg) {
    max-width: 1440px;
    min-width: 1280px;

  }

}
.tab-menu {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  //height: 56px;
  padding:0 15px;

  background-color: #1a1a1a;
  box-shadow: 0px 0px 12px #0000009e;
  z-index: 800;

  @include media-breakpoint-down(md) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tab-item {
    padding: 8px 1rem;
    height: 100%;
    //border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
    align-items:center;
    justify-content: center;
    opacity: .6;
    cursor: pointer;
    position:relative;
    transition: all .3s ease;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #fff;
      opacity: 0;
      transition: all .3s ease;
    }
    .logo {
      width: 32px;
      height: 32px;
      margin-bottom: .5rem;
      //border: 1px solid #eee;
      img {
        width: 32px;
        height: 32px;
      }
    }
    .name {
      line-height: 1;
      font-size: .75em;
//      color: #ffffffa0;
    }

    &.active {
      opacity: 1;
      &:after {
        opacity: 1;
      }
      .name {
 //       color: #ffffffa0;
      }
    }

    &:last-child {
      border-right: 0;
    }
  }
}

@include media-breakpoint-down(md) {
  [class^='tab-selected-'] {

  }
  [class*='tab-pane-'] {
    display: none;
    margin: 0 auto;
    max-width: 480px;
  }
  .tv-chart {
    max-width: 100%;
  }

  .tab-selected-game {
    .tab-pane-game {
      display: block;
    }
  }
  .tab-selected-rank {
    .tab-pane-rank {
      display: block;
    }
  }
  .tab-selected-stats {
    .tab-pane-stats {
      display: block;
    }
  }
  .tab-selected-my {
    .tab-pane-my {
      display: block;
    }
  }
  .ui-panel {
    margin-bottom: 15px;
  }
}

@include media-breakpoint-down(xs) {
  [class*='tab-pane-'] {
    max-width: 100%;
  }

}
.grid-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @include media-breakpoint-down(md) {
    display: block;
    padding-bottom: 72px;
  }
  height: auto;
  gap: 12px;
  .c1 {
    grid-column: 1;

  }
  .hs2 {
    grid-column: 1 / span 2;
  }
  .c2 {
    grid-column: 2;
  }
  .c3 {
    grid-column: 3;
  }
  .c4 {
    grid-column: 4;
  }
  .r1 {
    grid-row: 1;
    &.r1s2 {
      grid-row: 1 / span 2;
    }
  }
  .r2 {
    grid-row: 2;
  }
  .c1r1 {
    grid-row: 1;
  }
  .c1r2 {
    grid-column: 4;
    grid-row: 1 / span 2;
  }
  .c1r2{
    grid-column: 1;
    grid-row: 2;
  }

}
</style>
