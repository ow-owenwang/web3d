<script setup lang="ts">
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {onMounted, ref} from "vue";
import {
  AmbientLight,
  BufferGeometry,
  CatmullRomCurve3,
  Clock,
  DirectionalLight,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";

const canvasRef = ref();

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, labelRenderer;

const clock = new Clock();
const textureLoader = new TextureLoader();

let moon;
let earth;
let chinaPosition;
let chinaLabel;
let chinaDiv;
let curve;
init();
animate();

// 创建射线

function init() {
  const EARTH_RADIUS = 1;
  const MOON_RADIUS = 0.27;

  camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      200
  );
  camera.position.set(0, 5, -10);

  scene = new Scene();

  const dirLight = new DirectionalLight(0xffffff);
  dirLight.position.set(0, 0, -1);
  scene.add(dirLight);
  const light = new AmbientLight(0xffffff, 0.5); // soft white light
  scene.add(light);

  // const axesHelper = new AxesHelper( 5 );
  // scene.add( axesHelper );

  const earthGeometry = new SphereGeometry(EARTH_RADIUS, 16, 16);
  const earthMaterial = new MeshPhongMaterial({
    specular: 0x333333,
    shininess: 5,
    map: textureLoader.load("/textures/planets/earth_atmos_2048.jpg"),
    specularMap: textureLoader.load("/textures/planets/earth_specular_2048.jpg"),
    normalMap: textureLoader.load("/textures/planets/earth_normal_2048.jpg"),
    normalScale: new Vector2(0.85, 0.85),
  });

  earth = new Mesh(earthGeometry, earthMaterial);
  // earth.rotation.y = Math.PI;
  scene.add(earth);

  const moonGeometry = new SphereGeometry(MOON_RADIUS, 16, 16);
  const moonMaterial = new MeshPhongMaterial({
    shininess: 5,
    map: textureLoader.load("/textures/planets/moon_1024.jpg"),
  });
  moon = new Mesh(moonGeometry, moonMaterial);
  scene.add(moon);

  //根据这一系列的点创建曲线
  curve = new CatmullRomCurve3(
      [
        new Vector3(-10, 0, 10),
        new Vector3(-5, 5, 5),
        new Vector3(0, 0, 5),
        new Vector3(5, -5, 5),
        new Vector3(10, 0, 10),
      ],
      true
  );

  // 在曲线里，getPoints获取51个点
  const points = curve.getPoints(500);
  console.log(points);
  const geometry = new BufferGeometry().setFromPoints(points);

  const material = new LineBasicMaterial({color: 0xff0000});

  // Create the final object to add to the scene
  const curveObject = new Line(geometry, material);
  scene.add(curveObject);

  renderer = new WebGLRenderer({
    canvas: canvasRef.value
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 5;
  controls.maxDistance = 100;

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  // labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

// // 实例化射线
// const raycaster = new Raycaster()

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();
  const time = elapsed / 10 % 1;
  const point = curve.getPoint(time);
  // console.log(point)
  moon.position.copy(point);
  // moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);
  // camera.position.copy(point);
  // camera.lookAt(earth.position)
  renderer.render(scene, camera);
}

onMounted(() => {
  init()
});
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
