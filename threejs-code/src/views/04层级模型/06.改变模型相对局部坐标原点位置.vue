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
  WebGLRenderer,
} from "three";

function getModel() {

//长方体的几何中心默认与本地坐标原点重合
  const geometry = new BoxGeometry(50, 50, 50);
  const material = new MeshLambertMaterial({color: 0x00ffff});
  const mesh = new Mesh(geometry, material);


// 平移几何体的顶点坐标,改变几何体自身相对局部坐标原点的位置
  geometry.translate(50 / 2, 0, 0,);

// .rotateY()默认绕几何体中心旋转，经过上面几何体平移变化，你会发现.rotateY()是绕长方体面上一条线旋转
  mesh.rotateY(Math.PI / 3);
  return mesh
}

const canvasRef = ref()

onMounted(() => {
  const scene = new Scene();
  const model = getModel()
  scene.add(model); //模型对象添加到场景中


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
    model.rotateY(0.01);//旋转动画
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