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
  Scene, Sprite, SpriteMaterial, SRGBColorSpace, TextureLoader, Vector2,
  WebGLRenderer
} from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {outline} from "three/examples/jsm/tsl/display/OutlineNode";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {GammaCorrectionShader} from "three/examples/jsm/shaders/GammaCorrectionShader";
import FXAANode from "three/examples/jsm/tsl/display/FXAANode";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";
import {SMAAPass} from "three/examples/jsm/postprocessing/SMAAPass";

const canvasRef = ref();

function getModel() {
  const loader = new GLTFLoader()
  const model = new Group()
  loader.load("/工厂.glb", function (gltf) {
    model.add(gltf.scene);
  })

  return model
}

let modelObj: null
let outlinePass

function onClick(val: string) {
  const model = modelObj.getObjectByName(val)
  outlinePass.selectedObjects = [model]
}

onMounted(() => {
  const scene = new Scene();
  const model = getModel();
  scene.add(model);
  modelObj = model

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
  renderer.outputColorSpace = SRGBColorSpace
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)

  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const v2 = new Vector2(width, height)
  outlinePass = new OutlinePass(v2, scene, camera)
  // outlinePass.selectedObjects = [mesh]
  outlinePass.visibleEdgeColor.set(0xffff00)
  outlinePass.edgeThickness = 4
  outlinePass.edgeStrength = 6
  outlinePass.pulsePeriod = 2
  composer.addPass(outlinePass)
  // 颜色的校正
  const gammaPass = new ShaderPass(GammaCorrectionShader)
  composer.addPass(gammaPass)

  // 抗锯齿
  const pixelRatio = renderer.getPixelRatio()
  // const FXAAPass = new ShaderPass(FXAAShader)
  // FXAAPass.uniforms.resolution.value.x = 1 / (width * pixelRatio)
  // FXAAPass.uniforms.resolution.value.y = 1 / (height * pixelRatio)
  // composer.addPass(FXAAPass)
  const smaaPass = new SMAAPass(width*pixelRatio, height*pixelRatio)
  composer.addPass(smaaPass)


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
  <div style="position: absolute; z-index: 100; color: #fff; left: 0; top: 0;">
    <span id="A" @click="onClick('设备A')">设备a</span>
    <span id="B" @click="onClick('设备B')">设备b</span>
  </div>
</template>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
