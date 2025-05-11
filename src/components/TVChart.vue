<template>
  <div class="">
    <div class="tv-chart-container">
    <div id="TVChartContainer" ref="chartContainer" />
    <div id="TVChartContainer2"></div>
  </div>
  </div>
</template>

<script lang="ts">
import UIHeading from "@/components/UI/UIHeading.vue";
import {RootState} from "@/store";
//import {
//  ChartingLibraryWidgetOptions,
//  IChartingLibraryWidget, ResolutionString,
//  TradingTerminalWidgetOptions, widget
//} from "../../public/charting_library";
import {computed, defineComponent, nextTick, onMounted, onUnmounted, ref} from "vue";
import {useStore} from "vuex";

declare let window: any



const TVChart = defineComponent({
  name: "TVChart",
  components: { },
  setup(props) {
    const store = useStore<RootState>()
    const gameCount = computed(() => store.getters['game/program/gameCount'])
    const latestGame = computed(() => store.getters['game/program/beforeGame'])
    const chartContainer = ref()

   // const tvWidget = ref<IChartingLibraryWidget|null>(null)

    const tvWidget = ref()

    onMounted(() => {
      nextTick(() => {

     /*   const widgetOptions: ChartingLibraryWidgetOptions | TradingTerminalWidgetOptions = {
          container: chartContainer.value, datafeed: new window.Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com'), interval: '60' as ResolutionString, locale: 'ko',
          symbol: "AAPL",
          library_path: '/charting_library/'

        }
        try {
          tvWidget.value = new widget(widgetOptions);
        } catch (e) {
          console.log(e)
        }*/
        const widget = new window.TradingView.widget(
          {
            "autosize": true,
            "symbol": "BINANCE:BTCUSDTPERP",
            "interval": "3",
            "timezone": "Asia/Seoul",
            "theme": "dark",
            "style": "1",
            "locale": "kr",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_side_toolbar": false,
            //"extended_hours": true,
            "save_image": false,
            "container_id": "TVChartContainer"
          }
        );
        tvWidget.value = widget
        //console.log(widget)

      })
    })

    onUnmounted(() => {
      /*if(tvWidget.value !== null) {
        tvWidget.value.remove()
        tvWidget.value = null
      }*/
    })

    return {
      gameCount,
      latestGame,
      chartContainer,
    }
  }
})
export default TVChart
</script>

<style lang="scss" scoped>

#TVChartContainer {
  height: 560px;
  border-radius:10px;
  overflow:hidden;

  @include media-breakpoint-down(md) {
    height: 30vh;
    margin-bottom: 15px;
  }
}
</style>
