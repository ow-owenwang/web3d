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

// 批量创建多个长方体表示高层楼
  const group1 = new Group(); //所有高层楼的父对象
  for (let i = 0; i < 5; i++) {
    const geometry = new BoxGeometry(20, 60, 10);
    const material = new MeshLambertMaterial({
      color: 0x00ffff
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.x = i * 30; // 网格模型mesh沿着x轴方向阵列
    group1.add(mesh); //添加到组对象group1
  }
// 平移父对象group1，所有子对象跟着平移
  group1.position.y = 30;
// 旋转父对象group1，所有子对象跟着旋转
// group1.rotateY(Math.PI/2);


  const group2 = new Group();
// 批量创建多个长方体表示洋房
  for (let i = 0; i < 5; i++) {
    const geometry = new BoxGeometry(20, 30, 10);
    const material = new MeshLambertMaterial({
      color: 0x00ffff
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.x = i * 30;
    group2.add(mesh); //添加到组对象group2
  }
  group2.position.z = 50;
  group2.position.y = 15;

  const model = new Group();
  model.add(group1, group2);
// 整体平移model里面的所有模型对象
  model.position.set(-50, 0, -25);
  return model
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