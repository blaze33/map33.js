import "./index.css";
import Stats from "stats.js";
import {
  Scene,
  PerspectiveCamera,
  Vector3,
  WebGLRenderer,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  Color,
  FogExp2,

  LinearEncoding,
  AmbientLight,
  DirectionalLight,
  AxesHelper
} from "three";
import {
  MapControls,
} from "three/examples/jsm/controls/OrbitControls.js";

import InfiniteGridHelper from "./three.modules/InfiniteGridHelper";

import {Map, Source, MapPicker} from '../..'

import {WindowResize} from './three.modules/WindowResize'

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1e6
);

camera.up = new Vector3(0, 0, 1);
camera.position.set(0, -1000, 700);
camera.rollAngle = 0;
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
controls.autoRotate = true
controls.maxPolarAngle = Math.PI * 0.3
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

const grid = new InfiniteGridHelper(50, 300);
scene.add(grid);

// let position = [46.5763, 7.9904]
// let position = [45.8671, 7.3087]
let position = [45.916216, 6.860973];

// const source = new Source('mapbox', process.env.REACT_APP_MAPBOX_TOKEN)
const source = new Source('maptiler', process.env.REACT_APP_MAPTILER_TOKEN)
const map = new Map(scene, camera, source, position, 3, 11)
window.map = map
const mapPicker = new MapPicker(camera, map, renderer.domElement, controls)
window.mapPicker = mapPicker
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

WindowResize(renderer, camera)

export {mapPicker}
