import {
  AxesHelper,
  Group,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Pane } from 'tweakpane'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats

let group: Group

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000)
  camera.position.set(0, 0, 500)
  camera.lookAt(0, 0, 0)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(500)
  scene.add(axesHelper)

  // Object
  group = new Group()
  scene.add(group)
  // 点材质 PointsMaterial
  addPointsMaterial()
  // 基础线材质 LineBasicMaterial
  addLineBasicMaterial()
  // 虚线材质 LineDashedMaterial
  addLineDashedMaterial()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Stats
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Pane
  initPane()

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function addPointsMaterial() {
  // 球体几何对象
  const geometry = new SphereGeometry(100, 25, 25)
  // 点材质对象
  const material = new PointsMaterial({
    color: 0xFF0000,
    size: 3, // 点渲染尺寸
  })
  // 点模型对象
  const point = new Points(geometry, material)
  point.position.x = -220
  group.add(point)
}

function addLineBasicMaterial() {
  // 球体几何对象
  const geometry = new SphereGeometry(100, 25, 25)
  // 直线基础材质对象
  const material = new LineBasicMaterial({
    color: 0x00FF00,
  })
  // 线模型对象
  const line = new Line(geometry, material)
  group.add(line)
}

// FIXME: LineDashedMaterial 不生效
function addLineDashedMaterial() {
  // 球体几何对象
  const geometry = new SphereGeometry(100, 25, 25)
  // 虚线材质对象
  const material = new LineDashedMaterial({
    color: 0x0000FF,
    dashSize: 10, // 显示线段的大小。默认为 3。
    gapSize: 5, // 间隙的大小。默认为 1
  })
  // 线模型对象
  const line = new Line(geometry, material)
  // 计算 LineDashedMaterial 所需的距离数组
  line.computeLineDistances()
  line.position.x = 220
  group.add(line)
}

function initPane() {
  const pane = new Pane()
  const groupFolder = pane.addFolder({ title: 'Group' })
  groupFolder.addBinding(group.rotation, 'x', {
    min: 0,
    max: Math.PI * 2,
  })
  groupFolder.addBinding(group.rotation, 'y', {
    min: 0,
    max: Math.PI * 2,
  })
  groupFolder.addBinding(group.rotation, 'z', {
    min: 0,
    max: Math.PI * 2,
  })
  const cameraFolder = pane.addFolder({ title: 'Camera' })
  cameraFolder.addBinding(camera.position, 'z', {
    min: 0,
    max: 1000,
  })
}

function onResize() {
  const { width, height } = renderer.domElement
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  if (width !== W || height !== H) {
    camera.aspect = W / H
    camera.updateProjectionMatrix()

    renderer.setSize(W, H)
    renderer.setPixelRatio(DPI)
  }
}

function onDestroy() {
  try {
    window.cancelAnimationFrame(animateId)
    window.removeEventListener('destroy', onDestroy, false)
    window.removeEventListener('resize', onResize, false)
    renderer.dispose()
    renderer.forceContextLoss()
    const gl = renderer.domElement.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    scene.clear()
  }
  catch (error) {
    console.error('Failed to destroy Three.js: ', error)
  }
}

function animate() {
  animateId = window.requestAnimationFrame(animate)

  render()
  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
