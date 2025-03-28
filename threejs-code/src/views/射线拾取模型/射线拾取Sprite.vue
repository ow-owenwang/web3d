<script setup lang="ts">
import {onMounted, ref} from "vue";
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  WebGLRenderer
} from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {GammaCorrectionShader} from "three/examples/jsm/shaders/GammaCorrectionShader";
import {SMAAPass} from "three/examples/jsm/postprocessing/SMAAPass";

const canvasRef = ref();

function getModel() {

  const geometry  = new BoxGeometry(20, 100, 50);
  const material = new MeshBasicMaterial({
    color: 0x00ffff,
  })

  const mesh = new Mesh(geometry, material);
  mesh.position.y = 50

  const model = new Group()
  model.add(mesh)
  const texture = new TextureLoader().load('/textures/kejiguangdian.png')
  const spriteMaterial = new SpriteMaterial({
    map: texture,
  })
  const sprite = new Sprite(spriteMaterial)
  sprite.scale.set(10,10,1)
  sprite.position.set(0, 100+10/2, -15)
  model.add(sprite)

  const sprite2 = sprite.clone()
  sprite2.material = sprite2.material.clone()
  sprite2.material.color.set(0xffff00)
  sprite2.position.z = 15
  model.add(sprite2)

  sprite.change = function (){
    mesh.material.color.set(0xffffff)
  }

  sprite2.change = function (){
    mesh.material.color.set(0xffff00)
  }


  return {model, sprite, sprite2}
}

let modelObj: null
let outlinePass


onMounted(() => {
  const scene = new Scene();
  const {model, sprite, sprite2} = getModel();
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


  renderer.domElement.addEventListener('click', (event) => {
    const px = event.offsetX;
    const py = event.offsetY;
    const x = (px / width) * 2 - 1
    const y = -(py / height) * 2 + 1
    console.log(x, y)

    const raycaster = new Raycaster()

    raycaster.setFromCamera(new Vector2(x,y), camera)

    const intersects = raycaster.intersectObjects([sprite, sprite2])
    if(intersects.length > 0){
      intersects[0].object.change()
    }



  })
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
