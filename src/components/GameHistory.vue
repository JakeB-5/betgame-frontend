<template>
  <UIPanel heading="Game History">
    <div class="logs">
      <div class="log2" :class="{first:i===0, ...log.className}" v-for="(log, i) in logs" :key="`logs-${i}-${log.signature}`">
        <div class="log-info">
          <div class="signature">{{log.signature}}</div>
          <div class="time"><TimeAgo :date-time="log.time"/></div>
        </div>
        <div class="log-info">
          <div class="type">{{log.instruction}}</div>
          <div class="data">{{log.data? log.data+' ITT' : ''}}</div>
        </div>
      </div>
    </div>

  </UIPanel>
</template>

<script lang="ts">
import TimeAgo from "@/components/TimeAgo.vue";
import {ProgramLog} from "@/sdk/utils/LogParser";
import {RootState} from "@/store";
import {computed, defineComponent} from "vue";
import UIHeading from "@/components/UI/UIHeading.vue";
import UIPanel from "@/components/UI/UIPanel.vue";
import {useStore} from "vuex";

const GameHistory = defineComponent({
  name: "GameHistory",
  components: {TimeAgo, UIPanel,},
  setup(props) {
    const store = useStore<RootState>()
    const logs = computed<ProgramLog[]>(() => (store.getters['game/program/getLogs'] as Array<ProgramLog>).slice().reverse())
    return {
      logs
    }
  }
})

export default GameHistory
</script>

<style lang="scss" scoped>
.logs {
  width: 100%;
  height: 12.5rem;
  //height: 100%;
  overflow-y: auto;
  padding-right: .5rem;
  padding-top: .5rem;
  &::-webkit-scrollbar {
    width: 10px;
    background-color: #ffffff30;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #ffffffa0;
  }
  .log {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: .75em;
    gap: 8px;
    //transform: translateX(-10%);
    &.first {
      animation-duration: 1s;
      animation-name: pushed;
    }
    .time {
      width: 3rem;
      text-align: right;

    }
    .type {
      width: 4.5rem;
      text-align: center;

    }
    .data {
      flex-grow: 1;
      text-align: right;
      //background: red;
    }
    .signature {
      width: 5.5rem;
      text-align: right;

    }
  }

  .log2 {
    text-align: right;
    margin-bottom: .5rem;
    background: #ffffff10;
    border-radius: 10px;
    padding: .5rem;

    &.bet-long {
      background: #26A69A30;
    }
    &.bet-short {
      background: #ef535030;
    }
    &.first {
      animation-duration: 1s;
      animation-name: pushed;
    }
    .time {
      font-size: .75em;
    }
    .signature {
      font-size: .75em;
    }
    .log-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .type {
      font-size: .9em;
    }
    .data {
      font-size: .9em;
    }

  }
}

@keyframes pushed {
  0% { opacity: 0; transform: translateX(-50%); height: 0; }
  30% { opacity: 0; transform: translateX(-50%); height: 3.475em; }
  100% { opacity: 1; transform: translateX(0); }
}

</style>
