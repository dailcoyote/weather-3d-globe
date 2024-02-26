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

scene.add(SceneComponentBuilder.createStars());
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

liveGroup.rotation.offset = {
  x: 0,
  y: 0
}

function animate() {
  requestAnimationFrame(animate);
  liveGroup.rotation.y += 0.002;    //mouse.x * 0.5;
  
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(mouse, camera);
  renderer.render(scene, camera);
};

animate();

canvasContainer.addEventListener('mousedown', ({ clientX, clientY }) => {
  mouse.down = true;
  mouse.xPrev = clientX;
  mouse.yPrev = clientY;
});

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1

  if (mouse.down) {
    event.preventDefault();
    const deltaX = event.clientX - mouse.xPrev;
    const deltaY = event.clientY - mouse.yPrev;

    liveGroup.rotation.offset.x += deltaY * 0.005;
    liveGroup.rotation.offset.y += deltaX * 0.005;

    gsap.to(liveGroup.rotation, {
      y: liveGroup.rotation.offset.y,
      x: liveGroup.rotation.offset.x,
      duration: 2
    });

    mouse.xPrev = event.clientX;
    mouse.yPrev = event.clientY;
  }
});

addEventListener('mouseup', (event) => {
  mouse.down = false;
});
