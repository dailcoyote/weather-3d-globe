import AudioPlayer from "./AudioPlayer";

const mouse = {
    x: 0,
    y: 0,
    down: false,
    xPrev: undefined,
    yPrev: undefined,
    audioActivated: false,
    cursorGrabActivated: false,
};

function updateFrame(VRContainer, vrSpace) {
    if (!mouse.down) {
        vrSpace.rotatePlanetY();
    }

    // update the picking ray with the camera and pointer position
    vrSpace.updateRay(mouse.x, mouse.y);

    VRContainer.style.cursor = mouse.cursorCrossesWeatherCanvas
        ? "grab"
        : "default";

    vrSpace.render();
}

function animate(VRContainer, vrSpace) {
    updateFrame(VRContainer, vrSpace);
    requestAnimationFrame(animate.bind(this, VRContainer, vrSpace));
}

function createMotionControls(VRContainer, vrSpace, hasMobileDevice) {

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

        if (!mouse.audioActivated) {
            AudioPlayer.play();
            mouse.audioActivated = !mouse.audioActivated;
        }
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
        if (offsetY >= 10 && offsetY <= 40) {
            vrSpace.cameraNewZoom(offsetY);
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

export { createMotionControls, animate }