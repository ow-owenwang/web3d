<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper, BufferAttribute, BufferGeometry, CircleGeometry, DirectionalLight, DoubleSide,
  Mesh, MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera, PlaneGeometry, RepeatWrapping, Scene,
  SphereGeometry,
  TextureLoader,
  WebGLRenderer
} from "three";

function getModel() {

  const geometry = new PlaneGeometry(2000, 2000);
//纹理贴图加载器TextureLoader
  const texLoader = new TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
  const texture = texLoader.load('/瓷砖.jpg');

// 设置阵列
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
// uv两个方向纹理重复数量
  texture.repeat.set(30, 30);//注意选择合适的阵列数量


  const material = new MeshLambertMaterial({
    // color: 0x00ffff,
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    map: texture,//map表示材质的颜色贴图属性
  });


  const mesh = new Mesh(geometry, material);

// 旋转矩形平面
  mesh.rotateX(-Math.PI / 2);
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