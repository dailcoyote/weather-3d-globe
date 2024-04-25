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

let markerids = []

function updateFrame(VRContainer, vrSpace) {
    // if (auto.planetRotationEnabled && !mouse.down) {
    //     vrSpace.rotatePlanetY();
    // }

    // update the picking ray with the camera and pointer position
    vrSpace.updateRay(mouse.x, mouse.y);

    VRContainer.style.cursor = mouse.cursorCrossesWeatherCanvas
        ? "grab"
        : "default";

    let ret = vrSpace.someVirtualMarkersInRaycasterZone(markerids[0] || '')
    if (!ret) {
        vrSpace.rotatePlanetY();
    } else {
        console.log(ret)
    }

    // controls.update();
    // camera.rotation.y += Math.PI/2;

    vrSpace.render();
}

function setMarkerID(id) {
    markerids.push(id)
}

function animate(VRContainer, vrSpace) {
    camera = vrSpace.getCamera();
    updateFrame(VRContainer, vrSpace);
    requestAnimationFrame(animate.bind(this, VRContainer, vrSpace));
}

function createMotionControls(VRContainer, vrSpace, hasMobileDevice) {

    controls = new OrbitControls(vrSpace.getCamera(), vrSpace.getRenderer().domElement);
    // // controls.autoRotate = true;
    controls.update();

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
        if (offsetY >= 6 && offsetY <= 24) {
            vrSpace.setNewCameraZoom(offsetY);
        }
    });

    addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / innerHeight) * 2 + 1;

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
    console.log(mouse)
}

export { createMotionControls, animate, printMouseData, setMarkerID }