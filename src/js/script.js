import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import stars from "../img/stars.jpg";
import sunTexture from "../img/sunmap.jpg";
import mercuryTexture from "../img/mercurymap.jpg";
import venusTexture from "../img/venusmap.jpg";
import earthTexture from "../img/earthMap1k.jpg";
import marsTexure from "../img/mars.jpg";
import jupiterTexture from "../img/jupitermap.jpg";
import saturnTexture from "../img/saturnmap.jpg";
import saturnRingTexture from "../img/saturnringcolor.png";
import uranusTexture from "../img/uranusmap.jpg";
import uranusRingTexture from "../img/uranusringcolour.jpg";
import neptuneTexture from "../img/neptunemap.jpg";
import plutoTexture from "../img/plutomap.jpg";

//Instanciando o renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//CRIANDO A CENA
const scene = new THREE.Scene();

// Criando a câmera
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//CONTROLE DO MOUSE EM FORMA DE ORBITA
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

//LUX AMBIENTE DA CENA
const ambientLight = new THREE.AmbientLight(0x333333, 3);
scene.add(ambientLight);

//ADICIONANDO TEXTURA NO BACKGROUND DA CENA
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  stars,
  stars,
  stars,
  stars,
  stars,
  stars,
]);

const textureLoader = new THREE.TextureLoader(); //LOADER DE TEXTURAS

//CRIANDO O SOL
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

//FUNÇÃO PARA CRIAR PLANETAS
function createPlanet(size, texture, position, ring) {
  const geo = new THREE.SphereGeometry(size, 30, 28);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);

  if (ring) {
    const ringGeo = new THREE.RingGeometry(
        ring.innerRadius, 
        ring.outerRadius, 
        32);
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(obj);
  mesh.position.x = position;
  return { mesh, obj };
}

//PLANETS
const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(6, venusTexture, 50);
const saturn = createPlanet(10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture,
  
});



//POINTLIGHT
//Parâmetros: cor, intensidade, distancia
const pointLight = new THREE.PointLight(0xffffff, 20000, 300);
scene.add(pointLight);

//FUNÇÃO ANIMATE
function animate() {
  sun.rotateY(0.0004);
  mercury.mesh.rotateY(0.008);
  mercury.obj.rotateY(0.004);
  saturn.mesh.rotateY(0.038);
  saturn.obj.rotateY(0.0009);
  venus.mesh.rotateY(0.004);
  venus.obj.rotateY(0.003);

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

//RESPONSIVIDADE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
