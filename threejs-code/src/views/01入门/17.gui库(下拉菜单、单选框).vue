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
  const gui = new GUI(); //创建GUI对象
  gui.domElement.style.right = '0px';
  gui.domElement.style.width = '300px';

//场景
  const scene = new Scene();


// 一个网格模型
  const geometry = new BoxGeometry(30, 30, 30);
  const material = new MeshLambertMaterial({
    color: 0x00ffff
  });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

//创建一个对象，对象属性的值可以被GUI库创建的交互界面改变
  const obj = {
    x: 30,
    scale: 0,
    bool: false,
  };

// 1. 参数3、参数4数据类型：数字(拖动条)
  gui.add(obj, 'x', 0, 180).onChange(function (value) {
    mesh.position.x = value;
  });
// 2. 参数3数据类型：数组(下拉菜单)
  gui.add(obj, 'scale', [-100, 0, 100]).name('y坐标').onChange(function (value) {
    mesh.position.y = value;
  });
// 3. 参数3数据类型：对象(下拉菜单)
  gui.add(obj, 'scale', {
    left: -100,
    center: 0,
    right: 100
    // 左: -100,//可以用中文
    // 中: 0,
    // 右: 100
  }).name('位置选择').onChange(function (value) {
    mesh.position.x = value;
  });
// 3. 参数3数据类型：布尔值(单选框)
  gui.add(obj, 'bool').name('是否旋转');
// gui.add(obj, 'bool').onChange(function (value) {
//     // 点击单选框，控制台打印obj.bool变化
//     console.log('obj.bool',value);
// });

//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);


//光源设置
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 60, 50);
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
    canvas: canvasRef.value,
  });
  renderer.setSize(width, height);



// 渲染循环
  function render() {
    // 当gui界面设置obj.bool为true,mesh执行旋转动画
    if (obj.bool) mesh.rotateY(0.01);
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