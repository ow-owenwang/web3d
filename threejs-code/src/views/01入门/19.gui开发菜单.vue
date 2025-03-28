<script setup lang="ts">


import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer
} from "three";
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

const canvasRef = ref()

onMounted(() => {
  const scene = new Scene();


// 一个网格模型
  const geometry = new SphereGeometry(50, 25, 25);
  const material = new MeshPhongMaterial({
    color: 0x00ffff,
    specular: 0x111111,
  });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh); //模型对象添加到场景中

//光源设置
  const directionalLight = new DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(400, 200, 300);
  scene.add(directionalLight);
  const ambient = new AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);

  const gui = new GUI(); //创建GUI对象 
// gui.close();//关闭菜单
//创建一个对象，对象属性的值可以被GUI库创建的交互界面改变
  const obj = {
    color: 0x00ffff,// 材质颜色
    specular: 0x111111,// 材质高光颜色
  };
// 创建材质子菜单
  const matFolder = gui.addFolder('材质');
  matFolder.close();
// 材质颜色color
  matFolder.addColor(obj, 'color').onChange(function(value){
    material.color.set(value);
  });
// 材质高光颜色specular
  matFolder.addColor(obj, 'specular').onChange(function(value){
    material.specular.set(value);
  });
// 环境光子菜单
  const ambientFolder = gui.addFolder('环境光');
  ambientFolder.close();
// 环境光强度
  ambientFolder.add(ambient, 'intensity',0,2);
// 平行光子菜单
  const dirFolder = gui.addFolder('平行光');
  dirFolder.close();
// 平行光强度
  dirFolder.add(directionalLight, 'intensity',0,2);
// 平行光位置
  dirFolder.add(directionalLight.position, 'x',-400,400);
  dirFolder.add(directionalLight.position, 'y',-400,400);
  dirFolder.add(directionalLight.position, 'z',-400,400);

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