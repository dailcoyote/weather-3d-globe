import AudioPlayer from "./AudioPlayer";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const mouse = {
    x: 0,
    y: 0,
    down: false,
    xPrev: undefined,
    yPrev: undefined,
    audioActivated: false,
    cursorCrossesWeatherCanvas: false
};

const auto = {
    planetRotationEnabled: true
}

let controls;
let camera;
let scene;

function updateFrame(VRContainer, vrSpace) {
    VRContainer.style.cursor = mouse.cursorCrossesWeatherCanvas
        ? "grab"
        : "default";

    controls.update();
    vrSpace.render();
}

function animate(VRContainer, vrSpace) {
    camera = vrSpace.getCamera();
    updateFrame(VRContainer, vrSpace);
    requestAnimationFrame(animate.bind(this, VRContainer, vrSpace));
}

function startCameraMovement(position) {
    console.log("target virtual3d marker", position)
    camera.position.set(position.x, position.y, position.z < 0 ? -8 : 8);
    camera.lookAt(0, 0, 0);
}

function createMotionControls(VRContainer, vrSpace) {

    controls = new OrbitControls(vrSpace.getCamera(), vrSpace.getRenderer().domElement);
    controls.update();
    scene = vrSpace;

    VRContainer.addEventListener("mouseover", () => {
        mouse.cursorCrossesWeatherCanvas = true;
    });

    VRContainer.addEventListener("mouseout", () => {
        mouse.cursorCrossesWeatherCanvas = false;
    });
}

function printMouseData() {
    console.log("mouse", mouse)
}

export { createMotionControls, animate, printMouseData, startCameraMovement }