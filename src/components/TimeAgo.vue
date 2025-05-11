<template>
<span>{{convertedDateTime}}</span>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import moment from "moment";

moment.updateLocale('en', {
  relativeTime : {
    future: "in %s",
    past:   "%s ago",
    s:  "%ds ",
    m:  "1m",
    mm: "%dm",
    h:  "1h",
    hh: "%dh",
    d:  "1d",
    dd: "%dd",
    M:  "1m",
    MM: "%dm",
    y:  "1y",
    yy: "%dy"
  }
});

const TimeAgo = defineComponent({
  name: "TimeAgo",
  props: {
    dateTime: {
      required: true
    }
  },
  setup(props) {
    const convertedDateTime = ref('')
    //const formatTime = computed(() => moment(props.dateTime).format('mm:ss'))

    const calculateFromNow = () => {
      window.requestAnimationFrame(calculateFromNow)
      convertedDateTime.value =  moment(props.dateTime).fromNow()
    }

    onMounted(() => {
      convertedDateTime.value =  moment(props.dateTime).fromNow()
      setInterval(() => {
        convertedDateTime.value =  moment(props.dateTime).fromNow()
      }, 1000)
      //window.requestAnimationFrame(calculateFromNow)

    })

    return {
      convertedDateTime,
     // formatTime
    }
  }
})

export default TimeAgo
</script>

<style scoped>

</style>
