<script setup lang="ts">
import {onMounted, ref} from "vue";
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight, AnimationClip, AnimationMixer,
  AxesHelper, BoxGeometry,
  Clock,
  DirectionalLight,
  Group, KeyframeTrack, LoopOnce, Mesh, MeshLambertMaterial,
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
  const geometry = new BoxGeometry(15, 15, 15)
  const material = new MeshLambertMaterial({
    color: 0xff0000,
  })
  const mesh = new Mesh(geometry, material)

  mesh.name = "Box"

  const times = [0, 3, 6]
  const values = [0, 0, 0, 100, 0, 0, 0, 0, 100]
  const posKF = new KeyframeTrack("Box.position", times, values)
  const colorKF = new KeyframeTrack("Box.material.color", [2, 5], [1, 0, 0, 0, 0, 1])

  const clip = new AnimationClip("test", 6, [posKF, colorKF])

  const mixer = new AnimationMixer(mesh)
  const clipAction = mixer.clipAction(clip)
  clipAction.loop = LoopOnce
  clipAction.clampWhenFinished = true // 结束时，停在最后的位置
  clipAction.timeScale = 2 // 两倍速
  // clipAction.paused
  clipAction.play()

  const clock = new Clock()
  function loop(){
    requestAnimationFrame(loop)
    // TODO: 为什么不运动
    const frameT = clock.getDelta()
    mixer.update(frameT)
  }

  loop()

  return mesh;
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

  renderer.render(scene, camera);
  /*function render() {
    // model.rotateY(0.01);

    requestAnimationFrame(render);
  }*/

  // render();


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
