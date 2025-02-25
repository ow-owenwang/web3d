<script setup lang="ts">
import {onMounted, ref} from "vue";
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Clock, DirectionalLight, Group,
  Mesh,
  MeshBasicMaterial, MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene, Sprite, SpriteMaterial, TextureLoader,
  WebGLRenderer
} from "three";

const canvasRef = ref();

function getModel() {
  const texture = new TextureLoader().load("/textures/kejiguangdian.png")
  const spriteMaterial = new SpriteMaterial({
    map: texture,
  })

  const material = new MeshLambertMaterial({
    color: 0x00ffff
  })

  const geometry = new BoxGeometry(25, 100, 50)
  geometry.translate(0, 50, 0)

  const sprite = new Sprite(spriteMaterial)
  const mesh = new Mesh(geometry, material)

  sprite.scale.set(16, 16, 1)
  sprite.position.set(0, 100 + 16 / 2, 0)

  const group = new Group()
  group.add(mesh)
  group.add(sprite)

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
