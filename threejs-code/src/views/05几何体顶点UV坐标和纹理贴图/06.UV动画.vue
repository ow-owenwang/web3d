<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  TextureLoader,
  WebGLRenderer
} from "three";

function getModel() {

  const geometry = new PlaneGeometry(200, 20);
//纹理贴图加载器TextureLoader
  const texLoader = new TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
  const texture = texLoader.load('/纹理1.jpg');

  const material = new MeshLambertMaterial({
    map: texture,//map表示材质的颜色贴图属性
  });
  const mesh = new Mesh(geometry, material);
  mesh.rotateX(-Math.PI / 2);

// texture.offset.x +=0.5;//纹理U方向偏移
// 设置.wrapS也就是U方向，纹理映射模式(包裹模式)
  texture.wrapS = RepeatWrapping;//对应offste.x偏移


// texture.offset.y +=0.5;//纹理V方向偏移
// 设置.wrapT也就是V方向，纹理映射模式
// texture.wrapT = RepeatWrapping;//对应offste.y偏移

  return {mesh, texture};
}

const canvasRef = ref()

onMounted(() => {
  const scene = new Scene();
  const {mesh, texture} = getModel();
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
    texture.offset.x += 0.001;//设置纹理动画
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