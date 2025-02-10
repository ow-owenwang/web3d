<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

function getModel() {
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

// 删除父对象group的子对象网格模型mesh1
  group.remove(mesh1);
// 通过`.remove()`方法删除父对象的子对象之后，可以通过浏览器控制台查看`.children()`属性的变化。
  console.log('查看group的子对象',group.children);

// group.remove(mesh1,mesh2);//一次移除多个子对象
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

// scene.remove(ambient);//移除场景中环境光
// scene.remove(model);//移除场景中模型对象


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