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

const canvasRef = ref()

function getModel() {
  const geometry = new BoxGeometry(120, 120, 120);
  const material = new MeshLambertMaterial({
    color: 0x00ffff,
  });
  const mesh = new Mesh(geometry, material);

  return mesh
}

onMounted(() => {
  const scene = new Scene();
  const model = getModel();
  scene.add(model); //模型对象添加到场景中


//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
// scene.add(axesHelper);


//光源设置
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 60, 50);
  scene.add(directionalLight);
  const ambient = new AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

// canvas画布的宽高度
  const width = 300;
  const height = 300;
//相机
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(292, 223, 185);
  camera.lookAt(0, 0, 0);

// WebGL渲染器设置
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true, //开启优化锯齿
    // 背景透明
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio); //防止输出模糊
  renderer.setSize(width, height);
// document.body.appendChild(renderer.domElement);

// renderer.setClearColor(0xff0000, 0.2); //设置背景颜色和透明度
// renderer.setClearAlpha(0.5);// 改变背景透明度值



// 渲染循环
  function render() {
    model.rotateY(0.01);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();


  const controls = new OrbitControls(camera, renderer.domElement);
})
</script>

<template>
  <img src="../../assets/1.jpeg" alt="">
  <canvas ref="canvasRef"></canvas>
</template>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>