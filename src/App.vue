<script setup>
import { onMounted, ref } from "vue";
import VRSpace from "./virtuality/VRSpace";
import { createMotionControls, animate } from "./virtuality/Motion";

const isMobile = (function () {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
})();
const canvasContainerRef = ref();

onMounted(() => {
  const VRContainer = canvasContainerRef.value;
  const vrSpace = new VRSpace(VRContainer, isMobile);
  createMotionControls(VRContainer, vrSpace, isMobile);
  animate(VRContainer, vrSpace);
});
</script>

<template>
  <div class="flex h-screen bg-black">
    <!-- SYSTEM PANEL -->
    <div class="w-1/2 flex flex-col px-8 py-4">
      <div class="row-auto">
        <form id="search-box">
          <input type="text" placeholder="Search location..." />
        </form>
      </div>
      <h3 class="text-white font-exo">
        CHALLENGES THE STANDARD OF SPACE EXPLORATION
      </h3>
    </div>
    <!-- CANVAS CONTAINER -->
    <div class="w-1/2" ref="canvasContainerRef">
      <canvas></canvas>
    </div>
  </div>
</template>