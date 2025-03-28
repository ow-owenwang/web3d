<script setup lang="ts">

import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer
} from "three";
import Stats from 'three/examples/jsm/libs/stats.module'

const canvasRef = ref()

onMounted(() => {
//创建stats对象
  const stats = new Stats();
//Stats.domElement:web页面上输出计算结果,一个div元素
  document.body.appendChild(stats.domElement);

// 三维场景
  const scene = new Scene();

// 随机创建大量的模型,测试渲染性能
  const num = 1000; //控制长方体模型数量，你可以一直增加或减少看看帧率变化，电脑性能不同结果不同
  for (let i = 0; i < num; i++) {
    const geometry = new BoxGeometry(5, 5, 5);
    const material = new MeshLambertMaterial({
      color: 0x00ffff
    });
    const mesh = new Mesh(geometry, material);
    // 随机生成长方体xyz坐标
    const x = (Math.random() - 0.5) * 200
    const y = (Math.random() - 0.5) * 200
    const z = (Math.random() - 0.5) * 200
    mesh.position.set(x, y, z)
    scene.add(mesh); // 模型对象插入场景中
  }

//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);


//光源设置
  const pointLight = new PointLight(0xffffff, 1.0);
  pointLight.position.set(400, 200, 300);
  scene.add(pointLight);
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


// 渲染循环
  function render() {
    stats.update();//渲染循环中执行stats.update()来刷新时间
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