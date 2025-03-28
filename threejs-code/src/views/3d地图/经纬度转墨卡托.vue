<script setup lang="ts">
import {onMounted, ref} from "vue";
import {
  AmbientLight,
  AxesHelper, Box3,
  BufferAttribute,
  BufferGeometry,
  DoubleSide, ExtrudeGeometry,
  FileLoader,
  Group,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial, MeshLambertMaterial,
  OrthographicCamera,
  PointLight,
  Scene,
  Shape,
  ShapeGeometry,
  Vector2, Vector3,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {lonLat2Mercator} from "../../utils";

const canvasRef = ref()

function createLoopLine(arr) {
  const points = []
  arr.forEach(a => {
    a[0].forEach((item) => {
      points.push(item[0], item[1], 0)
    })
  })
  const geometry = new BufferGeometry()
  const vertices = new Float32Array(points)
  geometry.attributes.position = new BufferAttribute(vertices, 3)
  const material = new LineBasicMaterial({
    color: 0x00ffff
  })
  return new LineLoop(geometry, material)
}

function createShape(arr) {
  const shapeArr = []
  arr.forEach(a => {
    const vector2Arr = []
    a[0].forEach((item) => {
      const coord = lonLat2Mercator(item[0], item[1])
      vector2Arr.push(new Vector2(coord.x, coord.y))
    })
    const shape = new Shape(vector2Arr)
    shapeArr.push(shape)
  })
  const material = new MeshBasicMaterial({
    color: 0x004444,
    side: DoubleSide
  })
  const geometry = new ShapeGeometry(shapeArr)
  return new Mesh(geometry, material)
}

// 拉伸
function extrudeMesh(pointsArr, height) {
  const shapeArr = []
  pointsArr.forEach(pointArr => {
    const vector2Arr = []
    pointArr[0].forEach(a => {
      vector2Arr.push(new Vector2(a[0], a[1]))
    })
    const shape = new Shape(vector2Arr)
    shapeArr.push(shape)
  })
  const material = new MeshLambertMaterial({
    color: 0x004444,
  })
  const geometry = new ExtrudeGeometry(shapeArr, {
    depth: height,
    bevelEnabled: false // 无倒角
  })
  return new Mesh(geometry, material)
}

onMounted(() => {
  const scene = new Scene()
  const loader = new FileLoader()
  loader.setResponseType('json')

  const mapGroup = new Group()
  scene.add(mapGroup)
  const lineGroup = new Group()
  mapGroup.add(lineGroup)
  const meshGroup = new Group()
  mapGroup.add(meshGroup)
  lineGroup.position.z = 2 + 0.1 // 适当偏移解决深度冲突，此处要根据几何体大小灵活配置

  loader.load('/china.json', (data) => {
    data.features.forEach(feature => {
      /*if (feature.geometry.type === 'Polygon') {
        const pointArr = []
        feature.geometry.coordinates[0].forEach((p) => {
          pointArr.push(p[0], p[1], 0);
        })
        mapGroup.add(createLoopLine(pointArr))
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((polygon) => {
          const pointArr = []
          polygon[0].forEach((p) => {
            pointArr.push(p[0], p[1], 0);
          })
          mapGroup.add(createLoopLine(pointArr))
        })
      }*/
      if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates = [feature.geometry.coordinates];
      }
      lineGroup.add(createLoopLine(feature.geometry.coordinates))
      meshGroup.add(createShape(feature.geometry.coordinates))
    })

    const box3 = new Box3()
    box3.expandByObject(lineGroup)
    const scaleV3 = new Vector3()
    box3.getSize(scaleV3)
    console.log(scaleV3) // 根据这个设置相机参数调整几何体在屏幕上的大小

    const center = new Vector3()
    box3.getCenter(center)
    console.log(center) // 根据几何体中心设置相机位置
  })


  const point = new PointLight(0xffffff)
  point.position.set(400, 200, 300)
  scene.add(point)
  const ambient = new AmbientLight(0x444444)
  scene.add(ambient)

  const axesHelper = new AxesHelper(300)
  scene.add(axesHelper)
  const width = window.innerWidth
  const height = window.innerHeight
  // const camera = new PerspectiveCamera(30, width / height, 1, 3000)
  // camera.position.set(292, 223, 185)
  // camera.lookAt(0, 0, 0)
  const k = width / height
  // const k = height / width
  const s = 50 // 修改几何体大小，根据包围盒大小
  const camera = new OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
  camera.position.set(104.299, 28.48, 200)
  // camera.lookAt(scene.position)
  camera.lookAt(104.299, 28.48, 0) // 根据包围盒获取中心点，当几何体较小时，小数点位数很重要

  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(104.299, 28.48, 0)
  controls.update()
})
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>

<style scoped>

</style>
