<template>
  <div>
    <div id="container"></div>
    <div class="controls-box">
      <span class="demonstration">rotationSpeed</span>
      <el-slider v-model="rotationSpeed" :max="50" :format-tooltip="formatTooltip">
      </el-slider>
      <span class="demonstration">fogValue</span>
      <el-slider v-model="fogValue" :max="50" :format-tooltip="formatFogTooltip">
      </el-slider>
      <br>
      <el-button type="primary" class="controls-button" size="small" @click="addCube">addCube</el-button>
      <el-button type="primary" class="controls-button" size="small" @click="removeCube">removeCube</el-button>
      <el-button type="primary" class="controls-button" size="small" @click="outputObjects">printScene</el-button>
    </div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {onMounted, ref} from "vue";

const rotationSpeed = ref(2)
const fogValue = ref(2)
let camera = null,
    scene = null,
    renderer = null,
    planeGeometry = null,
    plane = null,
    controls = null

onMounted(() => {
  init()
})

function formatTooltip(val) {
  return val / 100
}

function formatFogTooltip(val) {
  return val / 1000
}

function init() {
  createScene() // 创建场景
  createMesh() // 创建网格模型
  createLight() // 创建光源
  createCamera() // 创建相机
  createRender() // 创建渲染器
  createControls() // 创建控件对象
  addFog() // 添加雾化效果
  render() // 渲染
}

// 创建场景
function createScene() {
  scene = new THREE.Scene()
}

// 创建网格模型
function createMesh() {
  planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1) // 创建一个平面对象PlaneGeometry
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
  }) // 材质对象Material
  plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.receiveShadow = true

  // 设置平面位置
  plane.rotation.x = -0.5 * Math.PI
  plane.position.set(0, 0, 0)

  // 平面对象添加到场景中
  scene.add(plane)
}

// 创建光源
function createLight() {
  // 添加聚光灯
  const spotLight = new THREE.SpotLight(0xffffff, 1)
  spotLight.position.set(-40, 60, -10)
  spotLight.castShadow = true
  scene.add(spotLight) // 聚光灯添加到场景中
  // 环境光
  const ambientLight = new THREE.AmbientLight(0x0c0c0c)
  scene.add(ambientLight)
}

// 创建相机
function createCamera() {
  const element = document.getElementById('container')
  const width = element.clientWidth // 窗口宽度
  const height = element.clientHeight // 窗口高度
  const k = width / height // 窗口宽高比
  // PerspectiveCamera( fov, aspect, near, far )
  camera = new THREE.PerspectiveCamera(45, k, 0.1, 1000)

  camera.position.set(-30, 40, 30) // 设置相机位置
  camera.lookAt(scene.position) // 设置相机方向
  scene.add(camera)
}

// 创建渲染器
function createRender() {
  const element = document.getElementById('container')
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(element.clientWidth, element.clientHeight) // 设置渲染区域尺寸
  renderer.setClearColor(0x3f3f3f, 1) // 设置背景颜色
  renderer.shadowMapEnabled = true
  element.appendChild(renderer.domElement)
}

function render() {
  scene.traverse(function (e) {
    if (e instanceof THREE.Mesh && e !== plane) {
      e.rotation.x += rotationSpeed.value / 100
      e.rotation.y += rotationSpeed.value / 100
      e.rotation.z += rotationSpeed.value / 100
    }
  })

  // THIS.scene.traverse(fun) 与 THIS.scene.children.forEach(fun) 是一样的功能都是去遍历scene对象的成员
  /* THIS.scene.children.forEach(function (e) {
    if (e instanceof THREE.Mesh && e !== THIS.plane) {
      e.rotation.x += THIS.rotationSpeed / 100
      e.rotation.y += THIS.rotationSpeed / 100
      e.rotation.z += THIS.rotationSpeed / 100
    }
  }) */
  addFog()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

// 创建控件对象
function createControls() {
  controls = new OrbitControls(camera, renderer.domElement)
}

// 给平面中添加方块
function addCube() {
  const cubeSize = Math.ceil(Math.random() * 3)
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
  const cubeMaterial = new THREE.MeshBasicMaterial({
  // const cubeMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random())
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.castShadow = true
  cube.name = 'cube-' + scene.children.length

  // 给方块设置随机坐标
  cube.position.x =
      -30 + Math.round(Math.random() * planeGeometry.parameters.width)
  cube.position.y = Math.round(Math.random() * 5)
  cube.position.z =
      -20 + Math.round(Math.random() * planeGeometry.parameters.height)
  // 将生成的方块添加到场景
  scene.add(cube)
  // scene.children.push(cube)  //与 scene.add(cube) 一样的效果 也是scene.add()操作的本质
}

// 删除一个方块
function removeCube() {
  const allChildren = scene.children
  const lastChildren = allChildren[allChildren.length - 1]
  if (lastChildren instanceof THREE.Mesh) {
    scene.remove(lastChildren)
  }
  // scene.children.pop() //整个removeCube函数其实就是做这个操作
}

// 打印scene对象子元素
function outputObjects() {
  console.log(scene)
}

// 添加雾化效果
function addFog() {
  // scene.fog = new THREE.Fog(0xefefef, 0.15, 100)
  scene.fog = new THREE.FogExp2(0xffffff, fogValue.value / 1000)
}
</script>

<style>
#container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.controls-box {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 300px;
  height: 180px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #c3c3c3;
}

.controls-button {
  margin: 3px 0px;
}
</style>

