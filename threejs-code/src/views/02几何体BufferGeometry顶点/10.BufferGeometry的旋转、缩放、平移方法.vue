<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer
} from "three";

function getModel() {
  const geometry = new PlaneGeometry(100, 100); //矩形平面几何体

// 几何体xyz三个方向都放大2倍
  geometry.scale(2, 2, 2);
// 几何体沿着x轴平移50
  geometry.translate(50, 0, 0);
// 几何体绕着x轴旋转45度
  geometry.rotateX(Math.PI / 4);
// 居中：偏移的几何体居中，你可以看到几何体重新与坐标原点重合
// geometry.center();

// 几何体旋转、缩放或平移之后，查看几何体顶点位置坐标的变化
// BufferGeometry的旋转、缩放、平移等方法本质上就是改变顶点的位置坐标
  console.log('顶点位置数据', geometry.attributes.position);


  const material = new MeshLambertMaterial({
    color: 0x00ffff,
    // wireframe: true, //线条模式渲染mesh对应的三角形数据
    side: DoubleSide, //两面可见
  });
  const mesh = new Mesh(geometry, material);

  return mesh;
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