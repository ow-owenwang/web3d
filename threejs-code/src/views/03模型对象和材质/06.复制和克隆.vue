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

  const geometry = new BoxGeometry(50, 50, 50);
  const material = new MeshLambertMaterial({
    color: 0x00ffff,
  });
  const mesh = new Mesh(geometry, material);

  const v1 = new Vector3(1, 2, 3);
  console.log('v1', v1);
//v2是一个新的Vector3对象，和v1的.x、.y、.z属性值一样
  const v2 = v1.clone();
  console.log('v2', v2);

  const v3 = new Vector3(4, 5, 6);
//读取v1.x、v1.y、v1.z的赋值给v3.x、v3.y、v3.z
  v3.copy(v1);

// const mesh2 = new Mesh(geometry, material);
// mesh2.position.x = 100;

// 通过mesh克隆.clone()一个和mesh一样的新模型对象mesh2
  const mesh2 = mesh.clone();
  mesh2.position.x = 100;

// 通过克隆.clone()获得的新模型和原来的模型共享材质和几何体
//改变材质颜色，或者说改变mesh2颜色，mesh和mesh2颜色都会改变
// material.color.set(0xffff00);
  mesh2.material.color.set(0xffff00);

// 克隆几何体和材质，重新设置mesh2的材质和几何体属性
  mesh2.geometry = mesh.geometry.clone();
  mesh2.material = mesh.material.clone();
// 改变mesh2颜色，不会改变mesh的颜色
  mesh2.material.color.set(0xff0000);

// 改变mesh的位置，使之位于mesh2的正上方(y)，距离100。
  mesh.position.copy(mesh2.position);//1. 第1步位置重合
  mesh.position.y += 100;//1. 第2步mesh在原来y的基础上增加100
  return {mesh, mesh2};
}

const canvasRef = ref()

onMounted(() => {
  const scene = new Scene();
  const {mesh, mesh2} = getModel()
  scene.add(mesh, mesh2); //模型对象添加到场景中


//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);


//光源设置
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 60, 50);
  scene.add(directionalLight);
  const ambient = new AmbientLight(0xffffff, 0.4);
  scene.add(ambient);


//相机
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(292, 223, 185);
  camera.lookAt(0, 0, 0);

// WebGL渲染器设置
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true, //开启优化锯齿
  });
  renderer.setPixelRatio(window.devicePixelRatio); //防止输出模糊
  renderer.setSize(width, height);


// 渲染循环
  function render() {
    // 旋转动画
    // mesh.rotation.y+=0.01;
    mesh.rotateY(0.01);
    // 同步mesh2和mesh的姿态角度一样，不管mesh姿态角度怎么变化，mesh2保持同步
    mesh2.rotation.copy(mesh.rotation);
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