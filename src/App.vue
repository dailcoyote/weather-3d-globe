<script setup>
import { onMounted, ref, watch, reactive, computed, onBeforeMount } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import VRSpace from "./virtuality/VRSpace";
import {
  createMotionControls,
  animate,
  startCameraMovement,
} from "./virtuality/Motion";
import GeoRadar from "./map/GeoRadar";
import OpenWeatherMap from "./map/OpenWeatherMap";
import WeatherComposition from "./types/WeatherComposition";
import WeatherForecastCard from "./components/WeatherForecastCard.vue";

const isMobile = (function () {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
})();
const canvasContainerRef = ref();
const cameraControlIconRef = ref();
const weatherPopupRef = ref();
const searchTermRef = ref("");
const weatherForecastViewDataRef = ref();

let vrSpace = undefined;

const state = reactive({
  relevanceLocationVector: [],
  selectedLocationVector: new Array(),
  activeVRMarkerID: null,
  weatherForecastViewData: {
    id: undefined,
    locationFormatText: "",
    humidity: -1,
    windSpeed: -1,
    pressure: -1,
    visibility: -1,
    tempCelsius: -1,
    tempMaxCelsius: -1,
    tempMinCelsius: -1,
    weatherDescription: "",
    weatherParameterGroup: "",
  },
  openWeatherLoadingErrorMsg: "",
  asyncLoading: false,
});
// a computed ref
const relevanceResultVisible = computed(() => {
  return searchTermRef.value.length > 0;
});

library.add(fas);

const utils = {
  partialWeatherUpdate(id, fragment) {
    const mutatedVector = state.selectedLocationVector.map((cursor) =>
      cursor.id == id ? { ...cursor, ...fragment } : cursor
    );
    state.selectedLocationVector = [...mutatedVector];
  },
  isAlreadyLocationMarked(id) {
    return state.selectedLocationVector.some((cursor) => cursor.id == id);
  },
  getSelectedLocation(id) {
    return state.selectedLocationVector.find((cursor) => cursor.id === id);
  },
};

function setup() {
  const VRContainer = canvasContainerRef.value;
  const VRCameraControlIcon = cameraControlIconRef.value;
  vrSpace = new VRSpace(VRContainer, VRCameraControlIcon, isMobile);
  createMotionControls(VRContainer, vrSpace, isMobile);
  animate(VRContainer, vrSpace);
}

function onRelevationItemSelect(id) {
  const iLocation = state.relevanceLocationVector.find(
    (item) => item.id === id
  );
  if (iLocation && !utils.isAlreadyLocationMarked(id)) {
    vrSpace.createVirtualMarker(id, iLocation.coord?.lat, iLocation.coord?.lon);
    state.selectedLocationVector.push({ ...iLocation });
    searchTermRef.value = "";
  }
}

async function onVRMarkerFocus(id) {
  if (id && utils.isAlreadyLocationMarked(id)) {
    state.activeVRMarkerID = id;
    state.openWeatherLoadingErrorMsg = "";
    const weatherPopupHTMLElement = weatherPopupRef.value;
    const { position } =
      vrSpace.selectVirtualMarker(
        state.activeVRMarkerID,
        weatherPopupHTMLElement
      ) || {};
    if (position) {
      state.asyncLoading = true;
      startCameraMovement(position);
      let { coord } = utils.getSelectedLocation(state.activeVRMarkerID);
      try {
        const { id, main, name, sys, visibility, weather, wind, timezone, dt } =
          await OpenWeatherMap.fetchForecastWeatherData(
            coord.lat,
            coord.lon,
            "Metric"
          );
        state.weatherForecastViewData = {
          id,
          locationFormatText: sys.country + "," + name,
          humidity: main.humidity,
          windSpeed: wind.speed,
          pressure: main.pressure,
          visibility,
          tempCelsius: main.temp.toFixed(0),
          tempMaxCelsius: main.temp_max.toFixed(1),
          tempMinCelsius: main.temp_min.toFixed(1),
          weatherDescription: weather[0]?.description,
          weatherParameterGroup: weather[0]?.main,
          timezone,
        };
        utils.partialWeatherUpdate(id, {
          tempCelsius: state.weatherForecastViewData.tempCelsius,
          weatherDescription: state.weatherForecastViewData.weatherDescription,
        });
      } catch (error) {
        state.openWeatherLoadingErrorMsg = error.name
          ? error.name + error.message
          : "network error";
      } finally {
        state.asyncLoading = false;
      }
    }
  }
}

onMounted(() => {
  setup();
});

watch(searchTermRef, async (newTerms) => {
  if (newTerms && newTerms.length >= 3) {
    state.relevanceLocationVector = [...GeoRadar.search(newTerms)];
  }
  if (!newTerms && state.relevanceLocationVector.length > 0) {
    state.relevanceLocationVector = [];
  }
});
</script>

<template>
  <div class="flex h-screen bg-black">
    <!-- SYSTEM PANEL -->
    <div
      class="w-1/3 flex flex-col py-8 px-10 overflow-auto"
      style="border-right: 0.4px solid aqua"
    >
      <!-- SEARCH BOX -->
      <div class="row-auto">
        <form id="search-box">
          <input
            type="text"
            placeholder="Search location..."
            v-model="searchTermRef"
          />
        </form>
      </div>
      <!-- RELEVANCE RESULT SET -->
      <ul
        v-if="relevanceResultVisible"
        id="suggestion-short-list"
        role="list"
        class="divide-gray-50 my-4"
      >
        <li
          v-for="item in state.relevanceLocationVector"
          :key="item.id"
          class="flex gap-x-6 py-4"
          @click="onRelevationItemSelect(item.id)"
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
          <div
            v-if="utils.isAlreadyLocationMarked(item.id)"
            class="hidden shrink-0 sm:flex sm:flex-col sm:items-end"
          >
            <div class="mt-1 flex items-center gap-x-1.5">
              <div class="flex-none p-1">
                <FontAwesomeIcon icon="fa-solid fa-lock" style="color: red" />
              </div>
              <p class="text-xs leading-5 text-gray-500">Locked</p>
            </div>
          </div>
        </li>
      </ul>
      <!-- SELECTED LOCATIONS -->
      <template v-if="!relevanceResultVisible">
        <ul
          v-if="state.selectedLocationVector.length > 0"
          id="active-location-list"
          role="list"
          class="divide-y divide-gray-100 my-4"
        >
          <li
            v-for="location in state.selectedLocationVector"
            :key="location.id"
            class="flex justify-between gap-x-6 py-4"
            @click="onVRMarkerFocus(location.id)"
          >
            <div class="flex min-w-0 gap-x-4">
              <FontAwesomeIcon
                icon="fa-solid fa-location-crosshairs"
                class="fa-2x"
                style="color: aqua"
              />
            </div>
            <div class="min-w-0 flex-auto px-4">
              <p class="truncate text-md leading-5 text-white">
                {{ location.name }}
              </p>
              <p class="mt-1 text-sm font-semibold leading-4 text-white">
                {{ location.country }}
              </p>
              <p class="mt-1 text-xs leading-5 text-gray-500">
                Geo coordinates
                {{ location.coord?.lat }}° / {{ location.coord?.lon }}°
              </p>
              <template v-if="location.tempCelsius">
                <p class="mt-1 text-xs leading-5 text-gray-500">
                  {{ location.tempCelsius }}ºC {{ location.weatherDescription }}
                </p>
              </template>
            </div>
            <div
              v-if="state.activeVRMarkerID == location.id"
              class="hidden shrink-0 sm:flex sm:flex-col sm:items-end"
            >
              <div class="mt-1 flex items-center gap-x-1.5">
                <div class="flex-none rounded-full bg-rose-600/20 p-1">
                  <div class="h-1.5 w-1.5 rounded-full bg-rose-600" />
                </div>
                <p class="text-xs leading-5 text-gray-500">Active</p>
              </div>
            </div>
          </li>
        </ul>
        <dl
          v-else
          class="mt-20 mx-10 justify-space-between max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none"
        >
          <div class="flex items-center gap-x-6">
            <FontAwesomeIcon
              icon="fa-solid fa-globe"
              class="fa-3x"
              style="color: #3c5b6f"
            />
            <div>
              <p class="inline font-bold text-white-900 leading-6">
                Your location list is empty
              </p>
            </div>
          </div>
        </dl>
      </template>
    </div>
    <!-- CANVAS CONTAINER -->
    <div class="w-2/3" ref="canvasContainerRef">
      <canvas></canvas>
    </div>
    <div
      ref="weatherPopupRef"
      class="bg-black bg-opacity-20 fixed rounded"
      style="display: none"
    >
      <WeatherForecastCard
        :weatherForecastViewData="state.weatherForecastViewData"
        :openWeatherLoadingErrorMsg="state.openWeatherLoadingErrorMsg"
        :asyncLoading="state.asyncLoading"
      ></WeatherForecastCard>
    </div>
    <div
      ref="cameraControlIconRef"
      class="bg-black bg-opacity-40 fixed rounded p-8"
      style="display: none"
    >
      <FontAwesomeIcon
        :icon="['fas', 'video']"
        class="fa-3x"
        style="color: white"
      />
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

#active-location-list > li,
#suggestion-short-list > li {
  cursor: pointer;
}
</style>