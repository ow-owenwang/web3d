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
  Scene, Sprite, SpriteMaterial, TextureLoader, Vector2,
  WebGLRenderer
} from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {GlitchPass} from "three/examples/jsm/postprocessing/GlitchPass";

const canvasRef = ref();

function getModel() {
  const geometry = new BoxGeometry(50, 50, 50);
  const material = new MeshLambertMaterial({
    color: 0x009999
  })

  const mesh = new Mesh(geometry, material)
  const mesh2 = mesh.clone()
  mesh2.position.y = 100
  const mesh3 = mesh.clone()
  mesh3.position.x = 100
  const model = new Group()
  model.add(mesh, mesh2, mesh3)


  return {model, mesh, mesh2, mesh3};
}

onMounted(() => {
  const scene = new Scene();
  const {model, mesh} = getModel();
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

  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const v2 = new Vector2(width, height)
  const outlinePass = new OutlinePass(v2, scene, camera)
  outlinePass.selectedObjects = [mesh]
  outlinePass.visibleEdgeColor.set(0xffff00)
  outlinePass.edgeThickness = 4
  outlinePass.edgeStrength = 6
  outlinePass.pulsePeriod = 2
  composer.addPass(outlinePass)

  // 闪屏效果
  const glitchPass = new GlitchPass()
  composer.addPass(glitchPass)

  function render() {
    // model.rotateY(0.01);
    composer.render()
    // renderer.render(scene, camera);
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
