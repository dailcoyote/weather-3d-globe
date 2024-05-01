<template>
  <div class="w-full flex justify-center">
    <div
      class="card min-w-sm max-w-sm border opacity-50 transition-shadow test shadow-lg hover:shadow-shadow-xl w-full rounded-md"
    >
      <div class="rounded-lg py-6 px-8 w-full bg-gray-900 text-white">
        <button
          type="button"
          class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <FontAwesomeIcon :icon="['fa', 'close']" class="fa-2x" />
          <span class="sr-only">Close modal</span>
        </button>
        <div class="mt-5 mb-10">
          <h2 class="font-bold text-3xl leading-none pb-1">Tuesday</h2>
          <h3 class="leading-none pb-2 pl-1">15 Jan 19</h3>
          <p class="flex aling-center opacity-75">París, FR</p>
        </div>
        <div class="space-y-2">
          <span class="flex space-x-2 items-center">
            <FontAwesomeIcon :icon="['fas', 'droplet']" />
            <span>32%</span></span
          >
          <span class="flex space-x-2 items-center"
            ><FontAwesomeIcon :icon="['fas', 'wind']" />
            <span>27 meter/sec</span></span
          >
          <span class="flex space-x-2 items-center"
            ><FontAwesomeIcon :icon="['fas', 'temperature-full']" />
            <span>1026 hPa</span></span
          >
          <span class="flex space-x-2 items-center"
            ><FontAwesomeIcon :icon="['fas', 'binoculars']" />
            <span>10 000 meter</span></span
          >
        </div>
        <div>
          <img :src="weatherIcon" width="300" height="150" />

          <div class="flex">
            <div class="w-1/2">
              <strong class="leading-none text-6xl block font-weight-bolder"
                >29ºC</strong
              >
              <b class="text-2xl block font-bold">Sunny</b>
            </div>
            <div class="w-1/2 pt-2 pl-10">
              <h2 class="leading-none pb-2">Min temp</h2>
              <h3 class="font-bold text-3xl leading-none">32ºC</h3>
              <h2 class="leading-none pt-4 pb-2">Max temp</h2>
              <h3 class="font-bold text-3xl leading-none pb-2">34ºC</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed } from "vue";

const weatherIcon = computed(() => {
  return "../assets/indicators/cloud.png";
});
</script>

