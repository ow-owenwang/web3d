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
  Scene, SphereGeometry,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  WebGLRenderer
} from "three";

const canvasRef = ref();

function getModel() {

  const material = new MeshLambertMaterial({
    color: 0x00ffff
  })

  const geometry = new SphereGeometry(25)
  // geometry.translate(0, 50, 0)

  const mesh = new Mesh(geometry, material)


  const group = new Group()
  group.add(mesh)

  return group;
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
  camera.lookAt(0, 0, 0)

  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)

  let directionX = 1; // 1: 向右, -1: 向左
  let directionY = 1; // 1: 向上, -1: 向下
  function render() {
    model.position.x += 0.5 * directionX;
    if (model.position.x > 100 || model.position.x < -100) {
      directionX *= -1; // 反转方向
    }

    // 更新 Y 轴位置
    model.position.y += 0.5 * directionY;
    if (model.position.y > 20 || model.position.y < -20) {
      directionY *= -1; // 反转方向
    }
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
