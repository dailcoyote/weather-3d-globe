<script setup>
import { onMounted, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import VRSpace from "./virtuality/VRSpace";
import { createMotionControls, animate } from "./virtuality/Motion";

const isMobile = (function () {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
})();
const canvasContainerRef = ref();
const locations = [
  { name: "New York", country: "USA" },
  { name: "New London", country: "Australia" },
  { name: "New Deli", country: "India" },
  { name: "New Amsterdam", country: "Canada" },
];

onMounted(() => {
  const VRContainer = canvasContainerRef.value;
  const vrSpace = new VRSpace(VRContainer, isMobile);
  createMotionControls(VRContainer, vrSpace, isMobile);
  animate(VRContainer, vrSpace);
});

library.add(fas);
</script>

<template>
  <div class="flex h-screen bg-black">
    <!-- SYSTEM PANEL -->
    <div
      class="w-1/3 flex flex-col py-8 px-10"
      style="border-right: 0.76px solid #646cff"
    >
      <div class="row-auto">
        <form id="search-box">
          <input type="text" placeholder="Search location..." />
        </form>
      </div>
      <ul
        id="suggestion-short-list"
        role="list"
        class="divide-y divide-gray-50 my-4"
      >
        <li
          v-for="item in locations"
          :key="item.name"
          class="flex gap-x-6 py-4"
        >
          <div class="flex min-w-0 gap-x-4">
            <FontAwesomeIcon
              icon="fa-solid fa-location-arrow"
              class="fa-2x"
              style="color: aqua"
            />
          </div>
          <div class="min-w-0 flex-auto px-4">
            <p class="truncate text-md leading-5 text-white">
              {{ item.name }}
            </p>
            <p class="mt-1 text-sm font-semibold leading-4 text-white">
              {{ item.country }}
            </p>
          </div>
        </li>
      </ul>
      <h3 class="text-white font-exo">
        CHALLENGES THE STANDARD OF SPACE EXPLORATION
      </h3>
    </div>
    <!-- CANVAS CONTAINER -->
    <div class="w-2/3" ref="canvasContainerRef">
      <canvas></canvas>
    </div>
  </div>
</template>

<style scoped>
#search-box {
  position: relative;
}

#search-box > input {
  background: #eceef2;
  width: 100%;
  height: 41px;
  padding: 12px 15px;
  box-sizing: border-box;
  border-radius: 7px;
  border: none;
  font-weight: bold;
  font-size: 16px;
  line-height: 38px;
  /* identical to box height */
  color: #000000;
}

#suggestion-short-list > li {
  cursor: pointer;
}
</style>