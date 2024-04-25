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

const utils = {
    transformCoords2Vector3(lat, lng) {
        const latitude = (lat / 180) * Math.PI;
        const longitude = (lng / 180) * Math.PI;
        const radius = 5;

        const dx = radius * Math.cos(latitude) * Math.sin(longitude);
        const dy = radius * Math.sin(latitude);
        const dz = radius * Math.cos(latitude) * Math.cos(longitude);

        return [dx, dy, dz];
    }
}

const VRScreenSize = {
    width: undefined,
    height: undefined
}

const textures = {
    clouds: new THREE.TextureLoader().load("./textures/clouds.png")
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

        VRScreenSize.width = VRContainer.offsetWidth;
        VRScreenSize.height = VRContainer.offsetHeight;
        camera.position.z = isSmallScreen ? 18 : 12;

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

    getRenderer() {
        return renderer;
    }

    getCamera() {
        return camera;
    }

    updateRay(x, y) {
        const targetCoords = new THREE.Vector2(x, y);
        raycaster.setFromCamera(targetCoords, camera);
    }

    setNewCameraZoom(value) {
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

    someVirtualMarkersInRaycasterZone(id) {
        const intersects = raycaster.intersectObjects(
            planetaryShell.children.filter(mesh => {
                return mesh.geometry.type === 'BoxGeometry' && mesh.name === id
            })
        );
        
        return intersects?.length > 0;
    }

    selectVirtualMarker(id, weatherHTMLElement) {
        gsap.set(weatherHTMLElement, {
            display: 'none'
        });

        planetaryShell.children
            .filter(mesh => mesh.geometry.type === 'BoxGeometry')
            .map(mesh => {
                if (mesh.name === id) {
                    mesh.material.opacity = 0.6;
                    mesh.material.color.setHex(0xEE4B2B);
                    gsap.set(weatherHTMLElement, {
                        x: (innerWidth - VRScreenSize.width) + (VRScreenSize.width / 10),
                        y: (VRScreenSize.height) / 5
                    });
                    console.log(mesh)
                    // camera.position.z = 10;

                    setTimeout(() => {
                        const { x, y, z } = mesh.position;
                        gsap.set(weatherHTMLElement, {
                            display: 'block'
                        });
                        // camera.lookAt(new THREE.Vector3(x, y, z))
                    }, 100);

                } else {
                    if (mesh.material.color.getHex() !== 0x3BF7FF) {
                        mesh.material.color.setHex(0x3BF7FF);
                        mesh.material.opacity = 0.4;
                    }
                }
            })
    }

    createVirtualMarker(id, lat, lng) {
        const [dx, dy, dz] = utils.transformCoords2Vector3(lat, lng);
        const vrMarker = SceneComponentBuilder.createVirtualMarker(
            id,
            0.075,
            0.125,
            0.5,
            0x3BF7FF
        );

        vrMarker.position.x = dx;
        vrMarker.position.y = dy;
        vrMarker.position.z = dz;

        vrMarker.lookAt(0, 0, 0);
        vrMarker.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.025));
        planetaryShell.add(vrMarker);

        gsap.to(vrMarker.scale, {
            z: 2.0,
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            ease: 'linear',
            delay: Math.random()
        });
    }
}

export default VRSpace;