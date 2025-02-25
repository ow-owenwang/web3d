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
  MeshBasicMaterial, MeshLambertMaterial,
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
  // Sprite和矩形平面Mesh的区别在于，当旋转三维场景时，Sprite平面始终平行于Canvas画布或者说屏幕，而Mesh的姿态角度会跟着旋转而旋转。
  const material = new SpriteMaterial({
    color: 0x00ffff,
  })

  const sprite = new Sprite(material)

  // 控制大小
  console.log(sprite.scale)
  sprite.scale.set(50, 25, 1) // 只需要设置x,y即可

  // 设置位置
  sprite.position.set(0, 50, 0)

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
  const camera = new PerspectiveCamera(30, width / height, 1, 3000)
  camera.position.set(292, 223, 185);
  // camera.position.set(2, 2, 1)
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
