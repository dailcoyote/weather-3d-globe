import * as THREE from 'three';
import gsap from "gsap";
import SceneComponentBuilder from './SceneComponentBuilder';

let isMobile = (function () {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
})()

const canvasContainer = document.querySelector('#canvasContainer');
const scene = new THREE.Scene();
const audio = new Audio('./audio/space.mp3');
audio.loop = true;

let camera = new THREE.PerspectiveCamera(
  85,
  innerWidth / innerHeight,
  0.1,
  2000
);

const raycaster = new THREE.Raycaster();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvasContainer
});
const liveGroup = new THREE.Group();
const mouse = {
  x: 0,
  y: 0,
  down: false,
  xPrev: undefined,
  yPrev: undefined,
  audioActivated: false
};

liveGroup.rotation.offset = {
  x: 0,
  y: 0
}
camera.position.z = isMobile ? 20 : 16;

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const redStarTexture =
  new THREE
    .TextureLoader()
    .load('./textures/red_star.png');
const blueStarTexture =
  new THREE
    .TextureLoader()
    .load('./textures/blue_star.png');

const RED_STARS_COUNT = 1500;
const BLUE_STARS_COUNT = 2000;

scene.add(SceneComponentBuilder.createUniverseStars(redStarTexture, 10, RED_STARS_COUNT));
scene.add(SceneComponentBuilder.createUniverseStars(blueStarTexture, 8, BLUE_STARS_COUNT));

scene.add(SceneComponentBuilder.createAtmosphere());
liveGroup.add(SceneComponentBuilder.createGlobe(
  new THREE
    .TextureLoader()
    .load('./textures/earth_dark_texture.jpg'))
);
scene.add(liveGroup);


function updateFrame() {
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(mouse, camera);

  document.getElementById("canvasContainer").style.cursor =
    raycaster.intersectObject(liveGroup.getObjectByName('globe'), true)
      .length > 0
      ? 'grab'
      : 'default';

  renderer.render(scene, camera);
}

function animate() {
  renderer.render(scene, camera);

  if (!mouse.down) {
    liveGroup.rotation.y += 0.002;    //mouse.x * 0.5; 
  }


  updateFrame();
  requestAnimationFrame(animate);
};

animate();

/*
    D E S K T O P   L I S T E N E R S
*/

canvasContainer.addEventListener('mousedown', (event) => {
  if (!isMobile) {
    let { clientX, clientY } = event;
    mouse.down = true;
    mouse.xPrev = clientX;
    mouse.yPrev = clientY;
  }

  if (!mouse.audioActivated) {
    audio.play();
    mouse.audioActivated = !mouse.audioActivated;
  }
});

if (!isMobile) {
  addEventListener("wheel", (event) => {
    let deltaY = event.deltaY / 1000;
    let offsetY = camera.position.z + deltaY;
    if (offsetY >= 12 && offsetY <= 36) {
      camera.position.z = offsetY;
    }
  });

  addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY / innerHeight) * 2 + 1

    // if (innerWidth >= 1280) {
    //   mouse.x = ((event.clientX - innerWidth / 2) / (innerWidth / 2)) * 2 - 1;
    //   mouse.y = -(event.clientX / innerHeight) * 2 + 1;
    // } else {
    //   const offset = canvasContainer.getBoundingClientRect().top;
    //   mouse.x = (event.clientX / innerWidth) * 2 - 1
    //   mouse.y = -((event.clientY - offset) / innerHeight) * 2 + 1
    // }

    if (mouse.down) {
      event.preventDefault();
      const deltaX = event.clientX - mouse.xPrev;
      const deltaY = event.clientY - mouse.yPrev;

      liveGroup.rotation.offset.x += deltaY * 0.006;
      liveGroup.rotation.offset.y += deltaX * 0.006;

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
}

/*
    M O B I L E   L I S T E N E R S
*/

if (isMobile) {
  canvasContainer.addEventListener('touchstart', (event) => {
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;

    mouse.down = true;
    mouse.xPrev = event.clientX;
    mouse.yPrev = event.clientY;
  });

  addEventListener('touchmove', (event) => {
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;

    if (mouse.down) {
      event.preventDefault();
      const offset = canvasContainer.getBoundingClientRect().top;
      mouse.x = (event.clientX / innerWidth) * 2 - 1
      mouse.y = -((event.clientY - offset) / innerHeight) * 2 + 1

      const deltaX = event.clientX - mouse.xPrev;
      const deltaY = event.clientY - mouse.yPrev;

      liveGroup.rotation.offset.x += deltaY * 0.002;
      liveGroup.rotation.offset.y += deltaX * 0.002;

      gsap.to(liveGroup.rotation, {
        y: liveGroup.rotation.offset.y,
        x: liveGroup.rotation.offset.x,
        duration: 1.5
      });
    }
  },
    {
      passive: false
    }
  );

  addEventListener('touchend', (event) => {
    mouse.down = false;
  });
}


