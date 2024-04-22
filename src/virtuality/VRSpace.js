import * as THREE from "three";
import gsap from "gsap";
import SceneComponentBuilder from "./SceneComponentBuilder";

let scene;
let camera;
let renderer;
let raycaster;
let planetaryShell;

const physics = {
    frictionForce: 0.006
}

class VRSpace {
    constructor(VRContainer, isSmallScreen) {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
            80,
            VRContainer.offsetWidth / VRContainer.offsetHeight,
            0.1,
            1600
        );
        raycaster = new THREE.Raycaster();
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: VRContainer.querySelector('canvas')
        });
        planetaryShell = new THREE.Group();

        camera.position.z = isSmallScreen ? 20 : 15;
        planetaryShell.rotation.offset = {
            x: 0,
            y: 0,
        };

        renderer.setSize(VRContainer.offsetWidth, VRContainer.offsetHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        planetaryShell.add(
            SceneComponentBuilder.createGlobe(
                new THREE.TextureLoader().load("./textures/8081_earthlights10k.jpg")
            )
        );
        scene.add(
            SceneComponentBuilder.createUniverseStars(
                new THREE.TextureLoader().load("./textures/red_star.png"),
                10,
                isSmallScreen ? 300 : 1500
            )
        );
        scene.add(
            SceneComponentBuilder.createUniverseStars(
                new THREE.TextureLoader().load("./textures/blue_star.png"),
                8,
                isSmallScreen ? 600 : 2100
            )
        );
        scene.add(SceneComponentBuilder.createAtmosphere());
        scene.add(planetaryShell);
    }

    getCameraPosition() {
        return camera.position;
    }

    updateRay(x, y) {
        const targetCoords = new THREE.Vector2(x, y);
        raycaster.setFromCamera(targetCoords, camera);
    }

    cameraNewZoom(value) {
        camera.position.z = value;
    }

    render() {
        // Draw a single frame
        renderer.render(scene, camera);
    }

    rotatePlanetY() {
        planetaryShell.rotation.y += 0.002; //delta->x * 0.5;
    }

    animateSmoothPlanet(vector) {
        planetaryShell.rotation.offset.x += vector.x * physics.frictionForce;
        planetaryShell.rotation.offset.y += vector.y * physics.frictionForce;

        gsap.to(planetaryShell.rotation, {
            y: planetaryShell.rotation.offset.y,
            x: planetaryShell.rotation.offset.x,
            duration: 2.5,
        });
    }
}

export default VRSpace;