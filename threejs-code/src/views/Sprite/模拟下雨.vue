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
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const canvasRef = ref();

function getModel() {
  // TODO: 考虑风和雪花旋转如何实现？
  const loader = new GLTFLoader()
  const model = new Group()
  loader.load("/工厂.glb", function (gltf) {
    model.add(gltf.scene);
  })

  const texture = new TextureLoader().load("/textures/kejiguangdian.png")
  const spriteMaterial = new SpriteMaterial({
    map: texture,
  })

  const group = new Group()
  model.add(group)

  for (let i = 0; i < 16000; i++) {
    const sprite = new Sprite(spriteMaterial)
    group.add(sprite)
    sprite.scale.set(1, 1, 1)
    const x = 1000 * (Math.random() - 0.5)
    const y = 400 * Math.random()
    const z = 1000 * (Math.random() - 0.5)
    sprite.position.set(x, y, z)
  }

  const clock = new Clock()

  function loop() {
    const t = clock.getDelta()
    group.children.forEach(child => {
      child.position.y -= t * 60
      if (child.position.y < 0) {
        child.position.y = 400
      }
    })
    requestAnimationFrame(loop);
  }

  loop()


  return model;
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
  /*
  相机在下雨的场景中，会渲染near-far范围的Sprite，距离相机0-near范围不会渲染，可以把near调整大一些，避免距离相机非常近的Sprite的非常大的现象
   */
  const camera = new PerspectiveCamera(30, width / height, 50, 3000)
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
    // model.rotateY(0.01);
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
