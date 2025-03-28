<script setup lang="ts">
import {onMounted, ref} from "vue";
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  Clock,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  Scene,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {CSS2DObject, CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";

const canvasRef = ref();

function getModel() {
  const loader = new GLTFLoader()
  const model = new Group()
  loader.load("/工厂.glb", function (gltf) {
    model.add(gltf.scene);

    const div = document.querySelector('#tag')
    const tag = new CSS2DObject(div)
    // 可以通过调整tag的css来改变它的位置
    // tag.style.left = "20px"

    console.log(gltf.scene)


    /*
    因为标签默认是在坐标原点的，所以可以让美术在建模软件中把坐标原点放到合适的位置。

    除了上面调整局部坐标系方式，还有一种更灵活、更方便的标注方式。就是在你的三维建模软件中，
    任何你想标注的位置，创建一个空对象（空的模型对象，没有任何模型顶点数据）。空对象放到对应模型的组里！
    const obj = gltf.scene.getObjectByName("我是空对象")
    obj.add(tag)
     */

    // TODO：为什么没有标注到设备A
    const obj = gltf.scene.getObjectByName("设备A")
    const axesHelper = new AxesHelper(30)
    obj.add(axesHelper);

    obj.add(tag)
  })





  const group = new Group()
  model.add(group)


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

  const css2Renderer = new CSS2DRenderer()
  css2Renderer.setSize(width, height)
  document.body.appendChild(css2Renderer.domElement)
  css2Renderer.domElement.style.position = "absolute"
  css2Renderer.domElement.style.top = "0px"
  css2Renderer.domElement.style.pointerEvents = "none"

  function render() {
    // model.rotateY(0.01);
    css2Renderer.render(scene, camera)
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();


  const controls = new OrbitControls(camera, renderer.domElement);
});
</script>

<template>
  <div id="tag">存储设备</div>
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
