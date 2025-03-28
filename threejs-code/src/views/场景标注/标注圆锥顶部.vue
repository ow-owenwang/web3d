<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry, ConeGeometry,
  DirectionalLight, GridHelper,
  Group,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  Sprite,
  SpriteMaterial,
  TextureLoader, Vector3,
  WebGLRenderer
} from "three";
import {CSS2DObject, CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer.js";

const canvasRef = ref();

function getModel() {
  const geometry = new ConeGeometry(25, 80);
  geometry.translate(0, 40, 0)
  const material = new MeshLambertMaterial({
    color: 0x00ffff,
  })
  const mesh = new Mesh(geometry, material)
  const axesHelper = new AxesHelper(50);
  mesh.add(axesHelper);
  mesh.position.set(50, 0, 50)
  const meshGroup = new Group()
  meshGroup.add(mesh)
  meshGroup.position.x = -100

  const div = document.querySelector('#tag')
  const tag = new CSS2DObject(div)
  tag.position.y = 80
  // 默认标注在局部坐标系的原点
  mesh.add(tag)


  const group = new Group()
  group.add(meshGroup)
  // group.add(tag)

  return group;
}

onMounted(() => {
  const scene = new Scene();
  const model = getModel();
  scene.add(model);

  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);

  const gridHelper = new GridHelper(300, 25, 0x004444, 0x004444)
  scene.add(gridHelper);

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
  // document.body.appendChild(renderer.domElement)

  const css2Renderer = new CSS2DRenderer()
  css2Renderer.setSize(width, height)
  document.body.appendChild(css2Renderer.domElement)
  css2Renderer.domElement.style.position = "absolute"
  css2Renderer.domElement.style.top = "0px"
  css2Renderer.domElement.style.pointerEvents = "none"

  function render() {
    css2Renderer.render(scene, camera)
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();


  const controls = new OrbitControls(camera, renderer.domElement);
});
</script>

<template>
  <div id="tag">标签内容</div>
  <canvas ref="canvasRef"></canvas>
</template>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}

#tag {
  padding: 10px;
  color: white;
  background-color: rgba(25, 25, 25, 0.5);
  border-radius: 5px;
  width: 65px;
}
</style>
