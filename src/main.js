import * as THREE from 'three';
import gsap from "gsap";
import SceneComponentBuilder from './SceneComponentBuilder';

function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

const canvasContainer = document.querySelector('#canvasContainer');
const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  isMobile ? 2000 : 1250
);

const raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvasContainer
});

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const earthTexture = new THREE
  .TextureLoader()
  .load('./textures/earth_dark_texture.jpg');
const redStarTexture =
  new THREE
    .TextureLoader()
    .load('./textures/red_star.png');
const blueStarTexture =
  new THREE
    .TextureLoader()
    .load('./textures/blue_star.png');

const RED_STARS_COUNT = 250;
const BLUE_STARS_COUNT = 500;

scene.add(SceneComponentBuilder.createUniverseStars(redStarTexture, 8, RED_STARS_COUNT));
scene.add(SceneComponentBuilder.createUniverseStars(blueStarTexture, 4, BLUE_STARS_COUNT));
scene.add(SceneComponentBuilder.createAtmosphere());
const liveGroup = new THREE.Group();
liveGroup.add(SceneComponentBuilder.createGlobe(earthTexture));
scene.add(liveGroup);

camera.position.z = isMobile ? 18 : 12;
const mouse = {
  x: 0,
  y: 0,
  down: false,
  xPrev: undefined,
  yPrev: undefined,
  audioActivated: false
}

liveGroup.rotation.offset = {
  x: 0,
  y: 0
}

function animate() {
  requestAnimationFrame(animate);

  if (!mouse.down) {
    liveGroup.rotation.y += 0.002;    //mouse.x * 0.5; 
  }

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(mouse, camera);
  renderer.render(scene, camera);
};

animate();


canvasContainer.addEventListener('mousedown', ({ clientX, clientY }) => {
  mouse.down = true;
  mouse.xPrev = clientX;
  mouse.yPrev = clientY;

  if (!mouse.audioActivated) {
    let audio = new Audio('./audio/space.mp3');
    audio.loop = true;
    audio.play();
    mouse.audioActivated = !mouse.audioActivated;
  }
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

// addEventListener('touchmove', (event) => {
//   event.clientX = event.touches[0].clientX;
//   event.clientY = event.touches[0].clientY;

//   mouse.down = true;

//   const offset = canvasContainer.getBoundingClientRect().top;
//   mouse.x = (event.clientX / innerWidth) * 2 - 1
//   mouse.y = -((event.clientY - offset) / innerHeight) * 2 + 1
//   // console.log(mouse.y)

//   const deltaX = event.clientX - mouse.xPrev;
//   const deltaY = event.clientY - mouse.yPrev;

//   liveGroup.rotation.offset.x += deltaY * 0.005;
//   liveGroup.rotation.offset.y += deltaX * 0.005;

//   gsap.to(liveGroup.rotation, {
//     y: liveGroup.rotation.offset.y,
//     x: liveGroup.rotation.offset.x,
//     duration: 4
//   });

//   mouse.xPrev = event.clientX;
//   mouse.yPrev = event.clientY;
// },
//   {
//     passive: false
//   }
// );


