<script setup lang="ts">
import {onMounted, ref} from "vue";

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

// 导入water
import {Water} from "three/examples/jsm/objects/Water2";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  AxesHelper,
  Clock,
  DirectionalLight,
  DoubleSide,
  EquirectangularReflectionMapping,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer
} from "three";

const canvasRef = ref();

onMounted(() => {

  // console.log(THREE);
  // 初始化场景
  const scene = new Scene();

  // 创建透视相机
  const camera = new PerspectiveCamera(
    90,
    window.innerHeight / window.innerHeight,
    0.1,
    1000
  );
  // 设置相机位置
  // object3d具有position，属性是1个3维的向量
  camera.position.set(5, 5, 5);
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  scene.add(camera);

  // 加入辅助轴，帮助我们查看3维坐标轴
  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);

  // const water = new Water(new PlaneBufferGeometry(1, 1, 1024, 1024), {
  //   color: "#ffffff",
  //   scale: 1,
  //   flowDirection: new Vector2(1, 1),
  //   textureHeight: 1024,
  //   textureWidth: 1024,
  // });
  // water.rotation.x = -Math.PI / 2;

  // scene.add(water);

  // 加载场景背景
  const rgbeLoader = new RGBELoader();
  rgbeLoader.loadAsync("/blouberg_sunrise_2_1k.hdr").then((texture) => {
    texture.mapping = EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });

  // 加载浴缸
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("/models/yugang.glb", (gltf) => {
    console.log(gltf);
    const yugang = gltf.scene.children[0];
    yugang.material.side = DoubleSide;

    const waterGeometry = gltf.scene.children[1].geometry;
    const water = new Water(waterGeometry, {
      color: "#ffffff",
      scale: 1,
      flowDirection: new Vector2(1, 1),
      textureHeight: 1024,
      textureWidth: 1024,
    });

    scene.add(water);
    scene.add(yugang);
  });

  const light = new AmbientLight(0xffffff); // soft white light
  light.intensity = 10;
  scene.add(light);
  const directionalLight = new DirectionalLight(0xffffff, 0.5);
  scene.add(directionalLight);

  // 初始化渲染器
  const renderer = new WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true });
  // renderer.outputEncoding = sRGBEncoding;
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping;

  // 设置渲染尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 监听屏幕大小改变的变化，设置渲染的尺寸
  window.addEventListener("resize", () => {
    //   console.log("resize");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比例
    renderer.setPixelRatio(window.devicePixelRatio);
  });

  // 将渲染器添加到body
  // document.body.appendChild(renderer.domElement);

  // 初始化控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼
  controls.enableDamping = true;

  const clock = new Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();
    requestAnimationFrame(animate);
    // 使用渲染器渲染相机看这个场景的内容渲染出来
    renderer.render(scene, camera);
  }

  animate();
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
