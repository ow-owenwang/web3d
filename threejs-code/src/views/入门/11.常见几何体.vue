<script setup lang="ts">

import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper, BoxGeometry, CircleGeometry, Clock,
  DirectionalLight,
  DirectionalLightHelper, DoubleSide, Mesh, MeshLambertMaterial,
  PerspectiveCamera, PointLight, Scene,
  WebGLRenderer
} from "three";

const canvasRef = ref()

onMounted(() => {
  const scene = new Scene();

// 创建网格模型

//BoxGeometry：长方体
// const geometry = new BoxGeometry(100, 100, 100);
// SphereGeometry：球体
// const geometry = new SphereGeometry(50);
// CylinderGeometry：圆柱
// const geometry = new CylinderGeometry(50,50,100);
// PlaneGeometry：矩形平面
// const geometry = new PlaneGeometry(100,50);
// CircleGeometry：圆形平面
  const geometry = new CircleGeometry(50);

  const material = new MeshLambertMaterial({
    color: 0x00ffff,
    //矩形和圆形平面，如果你想看到两面，需要设置双面可见
    // side默认值FrontSide
    side: DoubleSide,//双面可见
  });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);


//光源设置
  const directionalLight = new DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(400, 200, 300);
  scene.add(directionalLight);
  const ambient = new AmbientLight(0xffffff, 0.4);
  scene.add(ambient);


//渲染器和相机
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(292, 223, 185);
  camera.lookAt(0, 0, 0);


  const renderer = new WebGLRenderer({
    canvas: canvasRef.value
  });
  renderer.setSize(width, height);


// 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);


// 渲染循环
  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();


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