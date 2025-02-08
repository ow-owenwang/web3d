<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper, BoxGeometry, CircleGeometry, Clock,
  DirectionalLight,
  DirectionalLightHelper, DoubleSide, Mesh, MeshLambertMaterial,
  PerspectiveCamera, PointLight, Scene,
  WebGLRenderer, Group, SRGBColorSpace, CubeTextureLoader, MeshPhysicalMaterial, Vector3, PlaneGeometry,
} from "three";

function getModel() {
//创建两个网格模型mesh1、mesh2
  const geometry = new BoxGeometry(20, 20, 20);
  const material = new MeshLambertMaterial({color: 0x00ffff});
  const group = new Group();
  const mesh1 = new Mesh(geometry, material);
  const mesh2 = new Mesh(geometry, material);
  mesh2.translateX(25);

//把mesh1型插入到组group中，mesh1作为group的子对象
  group.add(mesh1);
//把mesh2型插入到组group中，mesh2作为group的子对象
  group.add(mesh2);



//沿着Y轴平移mesh1和mesh2的父对象，mesh1和mesh2跟着平移
  group.translateY(100);
//父对象缩放，子对象跟着缩放
  group.scale.set(4,4,4);
//父对象旋转，子对象跟着旋转
  group.rotateY(Math.PI/6)
  return group
}

const canvasRef = ref()

onMounted(() => {
  const scene = new Scene();
  scene.add(getModel()); //模型对象添加到场景中


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
    canvas: canvasRef.value
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