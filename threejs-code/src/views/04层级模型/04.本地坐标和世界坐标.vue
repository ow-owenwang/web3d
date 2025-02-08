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
  const geometry = new BoxGeometry(20, 20, 20);
  const material = new MeshLambertMaterial({
    color: 0x00ffff
  });
  const mesh = new Mesh(geometry, material);
  mesh.position.set(50, 0, 0);
  const group = new Group();
  group.add(mesh); //网格模型添加到组中
  group.position.set(50, 0, 0);


// 声明一个三维向量用来表示某个坐标
  const worldPosition = new Vector3();
// 获取mesh的世界坐标，你会发现mesh的世界坐标受到父对象group的.position影响
  mesh.getWorldPosition(worldPosition)
  console.log('世界坐标',worldPosition);
  console.log('本地坐标',mesh.position);
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