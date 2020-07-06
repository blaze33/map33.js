import "./index.css";
import Stats from "stats.js";
import {
  Scene,
  PerspectiveCamera,
  Vector2,
  Vector3,
  Matrix4,
  WebGLRenderer,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  Color,
  FogExp2,
  Mesh,
  SphereBufferGeometry,
  MeshBasicMaterial,
  WebGLRenderTarget,
  DepthTexture,
  MeshDepthMaterial,

  // Water imports
  PlaneBufferGeometry,
  TextureLoader,
  RepeatWrapping,
  LOD,
  LinearEncoding,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  AmbientLight,
  DirectionalLight,
  AxesHelper
} from "three";
// import * as THREE from 'three'
import {
  OrbitControls,
  MapControls,
} from "three/examples/jsm/controls/OrbitControls.js";
import ThreeGeo from "three-geo/src";

import InfiniteGridHelper from "./three.modules/InfiniteGridHelper";

import {Map, MapPicker} from './map'

// global.THREE = THREE
const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1e6
);

camera.up = new Vector3(0, 0, 1);
// camera.position.set(-500, 0, 700)
// camera.position.set(-70, -475, 275)
// // camera.position.set(170, -500, 180)
// camera.lookAt(0, 0, 0)
camera.position.set(0, -700, 1200);
camera.lookAt(0, 0, 0);
camera.rollAngle = 0;
camera.userData = {
  terrainKeysUnder: [],
};
camera.updateMatrixWorld();
camera.updateProjectionMatrix();

var renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: false,
});

window.scene = scene
window.camera = camera
window.renderer = renderer

renderer.outputEncoding = LinearEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.bias = 0.001;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = true;
renderer.physicallyCorrectLights = true;
// renderer.toneMapping = ACESFilmicToneMapping;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const stats = new Stats();
document.body.appendChild(stats.dom);

const controls = new MapControls(camera, renderer.domElement);
window.controls = controls

var axesHelper = new AxesHelper(2000)
scene.add(axesHelper)

scene.background = new Color(0x91abb5);
scene.fog = new FogExp2(0x91abb5, 0.0000001);

const ambientLight = new AmbientLight(0x404040, 2.5) // soft white light
const dirLight = new DirectionalLight(0xffffff, 3.5)
dirLight.castShadow = true
dirLight.position.set(10000, 10000, 10000)
scene.add(ambientLight)
scene.add(dirLight)

const grid = new InfiniteGridHelper(100, 500);
scene.add(grid);

const material = new MeshStandardMaterial({
  metalness: 0.5,
  roughness: 0.5
});
const buildTile = (heightmap, size, segments) => {
  const geometry = new PlaneBufferGeometry(size, size, segments + 2, segments + 2)
  const nPosition = Math.sqrt(geometry.attributes.position.count)
  const nHeightmap = Math.sqrt(heightmap.length)
  const ratio = nHeightmap / (nPosition)
  let x, y
  for (let i = nPosition; i < geometry.attributes.position.count - nPosition; i++) {
    if (
      i % (nPosition) === 0 ||
      i % (nPosition) === nPosition - 1
      ) continue
      x = Math.floor(i / (nPosition))
      y = i % (nPosition)
      geometry.attributes.position.setZ(
    i,
    heightmap[Math.round(Math.round(x * ratio) * nHeightmap + y * ratio)] * 0.075
    )
  }
  geometry.computeVertexNormals()
  const mesh = new Mesh(geometry, material);
  mesh.receiveShadow = true
  mesh.receiveShadow = true
  return mesh
}

// const tileURL =
//   "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/10/531/365.png";

// let dem2mesh;
// const initdem2mesh = import("dem2mesh").then((pkg) => {
//   dem2mesh = pkg;
//   dem2mesh.init();
// });
// // dem2mesh.init()
// const fetchpng = fetch(tileURL)
//   .then((res) => res.arrayBuffer())
//   .then((arrayBuffer) => new Uint8Array(arrayBuffer))
// Promise.all([initdem2mesh, fetchpng]).then(([_, png]) => {
//   const heightmap = dem2mesh.png2elevation(png)
//   const tile = buildTile(heightmap, 1000, 254)
//   scene.add(tile)
//   window.tile = tile
// })
window.ThreeGeo = ThreeGeo
const tgeo = new ThreeGeo({
  tokenMapbox: 'pk.eyJ1IjoibWF4bXJlIiwiYSI6ImNrYzd5MTM1cTEzbmUyc3FwazZjYWxrb3UifQ.Gp9n0wzvtr5Dm1tB4_KDRg',                // <---- set your Mapbox API token here
  unitsSide: 1.0,
});

// params: [lat, lng], terrain's radius (km), satellite zoom resolution, callbacks
// Beware the value of radius; for zoom 12, radius > 5.0 (km) could trigger huge number of tile API calls!!
// const radius = 1e-10
const radius = 5.
const onRgbDemCb = (meshes) => {
  meshes.forEach((mesh) => {
    const scale = radius * Math.pow(2, 0.5) * 100;
    mesh.scale.set(scale, scale, scale);
    scene.add(mesh);
  });
  window.meshes = meshes;
};
// let position = [46.5763, 7.9904]
// let position = [45.8671, 7.3087]
let position = [45.916216, 6.860973];
// tgeo.getTerrain(position, radius, 12, {
//   onRgbDem: onRgbDemCb,
//   onSatelliteMat: mesh => {                 // your implementation when terrain's satellite texture is obtained
//     // const map = mesh.material.map
//     // const material = new MeshStandardMaterial({
//     //   metalness: 0.15,
//     //   roughness: 0.4,
//     //   map,
//     //   // normalMap: map
//     // });
//     // mesh.material = material
//   },
// });
window.tgeo = tgeo

const map = new Map(scene, camera, position, 4)
const mapPicker = new MapPicker(camera, map, renderer.domElement)
console.log(map)

let lastTimestamp = 0;
var mainLoop = (timestamp) => {
  requestAnimationFrame(mainLoop);
  const delta = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  renderer.render(scene, camera);

  controls.update()

  stats.update();
};

mainLoop(0);
