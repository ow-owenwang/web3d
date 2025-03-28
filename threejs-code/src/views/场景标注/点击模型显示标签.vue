<script setup lang="ts">
import {onMounted, ref} from "vue";
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer
} from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {GammaCorrectionShader} from "three/examples/jsm/shaders/GammaCorrectionShader";
import {SMAAPass} from "three/examples/jsm/postprocessing/SMAAPass";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer.js";

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

  const css2Renderer = new CSS2DRenderer()
  css2Renderer.setSize(width, height)
  document.body.appendChild(css2Renderer.domElement)
  css2Renderer.domElement.style.position = "absolute"
  css2Renderer.domElement.style.top = "0px"
  css2Renderer.domElement.style.pointerEvents = "none"


  function render() {
    // model.rotateY(0.01);
    composer.render()
    // renderer.render(scene, camera);
    css2Renderer.render(scene, camera)
    requestAnimationFrame(render);
  }

  render();


  const controls = new OrbitControls(camera, renderer.domElement);

  function getTag(){
    const div = document.getElementById("tag")
    div.style.top = '-20px'
    const tag = new CSS2DObject(div)
    return tag
  }

let chooseObj = null
  addEventListener('click', (event) => {
    const px = event.offsetX;
    const py = event.offsetY;
    const x = (px / width) * 2 - 1
    const y = -(py / height) * 2 + 1
    console.log(x, y)

    const raycaster = new Raycaster()
    raycaster.setFromCamera(new Vector2(x, y), camera)

    const cunchu = model.getObjectByName("存储罐")

    for (let i = 0; i < cunchu.children.length; i++) {
      const group = cunchu.children[i]
      group.traverse(function (child) {
        if(child.isMesh) {
          child.ancestors = group
        }
      })
    }

    const intersects = raycaster.intersectObjects(cunchu.children);

    const tag = getTag()

    if (intersects.length > 0) {
      console.log(intersects)
      outlinePass.selectedObjects = [intersects[0].object.ancestors]

      chooseObj = intersects[0].object.ancestors



      // 方式1
      // intersects[0].object.ancestors.add(tag)

      // 方式2:利用空对象
      const obj = model.getObjectByName(intersects[0].object.ancestors.name + '标注')
      obj.add(tag)
    } else {
      if (chooseObj) {
        outlinePass.selectedObjects = []
        // TODO:没有生效
        chooseObj.remove(tag)
      }
    }




  })
});
</script>

<template>
  <div id="tag" style="display: none;">存储设备</div>
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
