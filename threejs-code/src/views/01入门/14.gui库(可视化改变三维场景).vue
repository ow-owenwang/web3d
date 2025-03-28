<script setup lang="ts">


import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

const canvasRef = ref()

onMounted(() => {

  const gui = new GUI();//创建GUI对象
  gui.domElement.style.right = '0px';
  gui.domElement.style.width = '300px';

//场景
  const scene = new Scene();


// 一个网格模型
  const geometry = new BoxGeometry(100, 100, 100);
  const material = new MeshLambertMaterial({color: 0x00ffff});
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);



//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);


//光源设置
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 60, 50);
  scene.add(directionalLight);
  const ambient = new AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

// 光照强度属性.intensity
  console.log('ambient.intensity',ambient.intensity);
// 通过GUI改变mesh.position对象的xyz属性
  gui.add(ambient, 'intensity', 0, 2.0);

//渲染器和相机
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(292, 223, 185);
  camera.lookAt(0, 0, 0);

  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
  });
  renderer.setSize(width, height);



// 渲染循环
  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();


  const controls = new OrbitControls(camera, renderer.domElement);

// 画布跟随窗口变化
  window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
})
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