import * as THREE from 'three';
import gsap from "gsap";
import SceneComponentBuilder from './SceneComponentBuilder';

const canvasContainer = document.querySelector('#canvasContainer');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth / canvasContainer.offsetHeight,
  0.1,
  1000
);
const raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvasContainer
});

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

scene.add(SceneComponentBuilder.createAtmosphere());
const liveGroup = new THREE.Group();
liveGroup.add(SceneComponentBuilder.createGlobe());
scene.add(liveGroup);

camera.position.z = 12;
const mouse = {
  x: 0,
  y: 0,
  down: false,
  xPrev: undefined,
  yPrev: undefined
}

function animate() {
  // renderer.render(scene, camera);
  // group.rotation.y += 0.002;    //mouse.x * 0.5;
  
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(mouse, camera);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
