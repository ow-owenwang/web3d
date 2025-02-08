<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper, BufferAttribute, BufferGeometry, CircleGeometry, DirectionalLight, DoubleSide, GridHelper,
  Mesh, MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera, PlaneGeometry, RepeatWrapping, Scene,
  SphereGeometry,
  TextureLoader,
  WebGLRenderer
} from "three";

function getModel() {

// 一个矩形平面几何体用来表示传送带
  const geometry = new PlaneGeometry(200, 20);
//纹理贴图加载器TextureLoader
  const texLoader = new TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
  const texture = texLoader.load('/纹理3.jpg');

  const material = new MeshLambertMaterial({
    map: texture,//map表示材质的颜色贴图属性
  });
  const mesh = new Mesh(geometry, material);
  mesh.rotateX(-Math.PI / 2);

// 设置阵列
  texture.wrapS = RepeatWrapping;
// uv两个方向纹理重复数量
  texture.repeat.x = 50;//注意选择合适的阵列数量

  return {mesh, texture};
}

const canvasRef = ref()

onMounted(() => {
  const scene = new Scene();
  const {mesh, texture} = getModel()
  scene.add(mesh); //模型对象添加到场景中


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
    texture.offset.x += 0.1;//设置纹理动画
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