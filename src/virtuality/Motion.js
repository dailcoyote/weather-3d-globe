import AudioPlayer from "./AudioPlayer";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const mouse = {
    x: 0,
    y: 0,
    down: false,
    xPrev: undefined,
    yPrev: undefined,
    audioActivated: false
};

const auto = {
    planetRotationEnabled: true
}

let controls;
let camera;
let scene;
let focusingMarkersQueue = new Set();

function updateFrame(VRContainer, vrSpace) {
    VRContainer.style.cursor = mouse.cursorCrossesWeatherCanvas
        ? "grab"
        : "default";

    // controls.update();
    // camera.rotation.y += Math.PI/2;

    vrSpace.render();
}

function animate(VRContainer, vrSpace) {
    camera = vrSpace.getCamera();
    updateFrame(VRContainer, vrSpace);
    requestAnimationFrame(animate.bind(this, VRContainer, vrSpace));
}

function startCameraMovement(target) {
    // controls.autoRotate = true;
    printMouseData();
    let z = target.position.z < 0 ? -8 : 8;

    console.log("target virtual3d marker", target.position)
    camera.position.set(target.position.x, target.position.y, z);
    camera.lookAt( 0, 0, 0 );
    console.log("camera position", camera.position)
}

function stopCameraMovement(target) {
    controls.autoRotate = false;
    // focusingMarkersQueue.delete(target);
}

function createMotionControls(VRContainer, vrSpace, hasMobileDevice) {

    controls = new OrbitControls(vrSpace.getCamera(), vrSpace.getRenderer().domElement);
    controls.update();
    scene = vrSpace;

    /*
          D E S K T O P   L I S T E N E R S
    */

    VRContainer.addEventListener("mousedown", (event) => {
        if (!hasMobileDevice) {
            let { clientX, clientY } = event;
            mouse.xPrev = clientX;
            mouse.yPrev = clientY;
            mouse.down = true;
        }

        if (mouse.down && auto.planetRotationEnabled) {
            auto.planetRotationEnabled = false;
        }

        // if (!mouse.audioActivated) {
        //     AudioPlayer.play();
        //     mouse.audioActivated = !mouse.audioActivated;
        // }
    });

    VRContainer.addEventListener("mouseover", () => {
        mouse.cursorCrossesWeatherCanvas = true;
    });

    VRContainer.addEventListener("mouseout", () => {
        mouse.cursorCrossesWeatherCanvas = false;
    });

    VRContainer.addEventListener("wheel", (event) => {
        let deltaY = event.deltaY / 1000;
        let offsetY = vrSpace.getCameraPosition().z + deltaY;
        console.log("auto camera position", camera.position)
        if (offsetY >= 6 && offsetY <= 24) {
            vrSpace.setNewCameraZoom(offsetY);
        }
    });

    addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / VRContainer.offsetWidth) * 2 - 1;
        mouse.y = -(event.clientY / VRContainer.offsetHeight) * 2 + 1;

        if (mouse.down) {
            event.preventDefault();
            const deltaX = event.clientX - mouse.xPrev;
            const deltaY = event.clientY - mouse.yPrev;

            vrSpace.animateSmoothPlanet({
                x: deltaY,
                y: deltaX
            });

            mouse.xPrev = event.clientX;
            mouse.yPrev = event.clientY;
        }
    });

    addEventListener("mouseup", (event) => {
        mouse.down = false;
    });

}

function printMouseData() {
    console.log("mouse", mouse)
}

export { createMotionControls, animate, printMouseData, startCameraMovement }