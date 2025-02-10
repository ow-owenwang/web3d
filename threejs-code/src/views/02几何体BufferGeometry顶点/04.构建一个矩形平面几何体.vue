<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";

function getModel() {

  const geometry = new BufferGeometry(); //创建一个几何体对象
//类型数组创建顶点数据
  const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    80, 0, 0, //顶点2坐标
    80, 80, 0, //顶点3坐标

    0, 0, 0, //顶点4坐标   和顶点1位置相同
    80, 80, 0, //顶点5坐标  和顶点3位置相同
    0, 80, 0, //顶点6坐标
  ]);
// 创建属性缓冲区对象
  const attribue = new BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
// 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribue;


  const material = new MeshBasicMaterial({
    color: 0x00ffff,
    // side: FrontSide, //默认只有正面可见
    // side: BackSide, //设置只有背面可见
    side: DoubleSide, //两面可见
  });
// 网格模型本质：一个一个三角形(面)构成
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