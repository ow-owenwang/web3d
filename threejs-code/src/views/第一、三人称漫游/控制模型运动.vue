<script setup lang="ts">
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {
  AnimationMixer,
  Group,
  AmbientLight,
  Clock,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer, AxesHelper, GridHelper
} from "three";
import {onMounted} from "vue";

async function getModel() {
  const loader = new GLTFLoader()
  const model = new Group()
  const gltf = await loader.loadAsync("/models/person.glb")
  const player = gltf.scene
  model.add(player)

  const mixer = new AnimationMixer(player)
  console.log(gltf.animations)
  const clipAction = mixer.clipAction(gltf.animations[12])
  clipAction.play()
  return {
    model,
    mixer,
    player
  }
}

const keyStates = {
  W: false,
  A: false,
  S: false,
  D: false,
}

onMounted(async () => {
  const {model, mixer, player} = await getModel()

  const scene = new Scene()
  scene.add(model)

  const axesHelper = new AxesHelper(100)
  scene.add(axesHelper)
  const gridHelper = new GridHelper(30, 25, 0x004444, 0x004444)
  scene.add(gridHelper)

  const directionalLight = new DirectionalLight(0xffffff, 1)
  directionalLight.position.set(100, 60, 50)
  scene.add(directionalLight)
  const ambient = new AmbientLight(0xffffff, 0.4)
  scene.add(ambient)

  const width = window.innerWidth
  const height = window.innerHeight
  const camera = new PerspectiveCamera(30, width / height, 1, 3000)
  camera.position.set(0, 1.6, -5.5) // blender可以测量模型高度
  camera.lookAt(0, 1.6, 0)

  player.add(camera) // 跟着人走

  const renderer = new WebGLRenderer({
    antialias: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)


  const a = 12 // 加速度
  const clock = new Clock()
  const vMax = 5 // 最大速度
  const damping = -0.04 // 阻尼系数
// 刚开始速度为0 静止
  const v = new Vector3(0, 0, 0) // 运动速度
  function render() {
    const deltaTime = clock.getDelta()
    if (keyStates.W) {
      const front = new Vector3(0, 0, 1)
      if (v.length() < vMax) {
        // 当前速度 + 速度变化量
        v.add(front.multiplyScalar(a * deltaTime))
      }

      const deltaPos = v.clone().multiplyScalar(deltaTime)
      player.position.add(deltaPos)
    }

    if (keyStates.S) {
      const front = new Vector3(0, 0, -1)
      if (v.length() < vMax) {
        // 当前速度 + 速度变化量
        v.add(front.multiplyScalar(a * deltaTime))
      }
    }

    v.addScaledVector(v, damping) // 阻尼减速
    mixer.update(deltaTime)
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  render()

  let leftButtonBool = false
  document.addEventListener('mousedown', () => {
    leftButtonBool = true
  })
  document.addEventListener('mouseup', () => {
    leftButtonBool = false
  })
  document.addEventListener('mousemove', (e) => {
    if (leftButtonBool) {
      // 缩小一定倍数改变旋转控制的灵敏度
      player.rotation.y -= e.movementX / 600
    }
  })
})


document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyW') keyStates.W = true
  if (e.code === 'KeyA') keyStates.A = true
  if (e.code === 'KeyS') keyStates.S = true
  if (e.code === 'KeyD') keyStates.D = true
})

document.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW') keyStates.W = false
  if (e.code === 'KeyA') keyStates.A = false
  if (e.code === 'KeyS') keyStates.S = false
  if (e.code === 'KeyD') keyStates.D = false
})


</script>

<template>

</template>

<style scoped>

</style>
