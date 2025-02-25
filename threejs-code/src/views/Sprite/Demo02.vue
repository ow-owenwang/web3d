<script setup lang="ts">
import {onMounted, ref} from "vue";
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Clock, DirectionalLight,
  Mesh,
  MeshBasicMaterial, MeshLambertMaterial, OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene, Sprite, SpriteMaterial,
  WebGLRenderer
} from "three";

const canvasRef = ref();

function getModel() {
  const geometry = new PlaneGeometry(50, 25)
  // 精灵模型默认是一个矩形形状，默认长度都是1，默认在坐标原点位置。Sprite默认尺寸为1，如果在画布上看不清楚，可以适当调整相机参数。
  // 对于透视投影相机而言，Sprite和Mesh一样遵循近大远小的投影规律。
  const material = new SpriteMaterial({
    color: 0x00ffff,
  })

  const sprite = new Sprite(material)

  return sprite;
}

onMounted(() => {
  const scene = new Scene();
  const model = getModel();
  scene.add(model);

  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);

  const directionalLight = new DirectionalLight(0xffffff, 1)
  directionalLight.position.set(100, 60, 50)
  scene.add(directionalLight)
  const ambient = new AmbientLight(0xffffff, 0.4)
  scene.add(ambient)

  const width = window.innerWidth
  const height = window.innerHeight
  const k = width / height
  const s = 0.5 // 可以更改这个值进行测试
  const camera = new OrthographicCamera(-s * k, s * k, s, -s, 1, 8000)
  camera.position.set(2, 2, 1)
  camera.lookAt(0, 0, 0)

  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)

  function render() {
    model.rotateY(0.01);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();


  const controls = new OrbitControls(camera, renderer.domElement);
});
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
