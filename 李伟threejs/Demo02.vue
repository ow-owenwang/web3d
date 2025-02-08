<template>
  <div>
    <div id="container"></div>
    <div class="controls-box">
      <el-collapse accordion>
        <div>
          <el-collapse-item :title="item.name" v-for="item in vertices" :key="item.name">
            <el-col>
              <el-col :span="2">
                <span class="vertice-span">x</span>
              </el-col>
              <el-col :span="20">
                <el-slider v-model="item.value.x" :min="-10" :max="10" :format-tooltip="formatTooltip"></el-slider>
              </el-col>
              <el-col :span="2">
                <span class="vertice-span">{{ item.value.x }}</span>
              </el-col>
            </el-col>
            <el-col>
              <el-col :span="2">
                <span class="vertice-span">y</span>
              </el-col>
              <el-col :span="20">
                <el-slider v-model="item.value.y" :min="-10" :max="10" :format-tooltip="formatTooltip"></el-slider>
              </el-col>
              <el-col :span="2">
                <span class="vertice-span">{{ item.value.y }}</span>
              </el-col>
            </el-col>
            <el-col>
              <el-col :span="2">
                <span class="vertice-span">z</span>
              </el-col>
              <el-col :span="20">
                <el-slider v-model="item.value.z" :min="-10" :max="10" :format-tooltip="formatTooltip"></el-slider>
              </el-col>
              <el-col :span="2">
                <span class="vertice-span">{{ item.value.z }}</span>
              </el-col>
            </el-col>

          </el-collapse-item>
        </div>

      </el-collapse>
      <el-button type="primary" class="controls-button" size="mini" @click="clone">clone</el-button>
      <el-button type="primary" class="controls-button" size="mini" @click="outputObjects">printGemoetry</el-button>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// import {SceneUtils} from 'three/examples/jsm/utils/SceneUtils.js'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'

export default {
  data() {
    return {
      vertices: [
        {
          name: 'Vertices1',
          value: {
            x: 3,
            y: 5,
            z: 3
          }
        },
        {
          name: 'Vertices2',
          value: {
            x: 3,
            y: 5,
            z: 0
          }
        },
        {
          name: 'Vertices3',
          value: {
            x: 3,
            y: 0,
            z: 3
          }
        },
        {
          name: 'Vertices4',
          value: {
            x: 3,
            y: 0,
            z: 0
          }
        },
        {
          name: 'Vertices5',
          value: {
            x: 0,
            y: 5,
            z: 0
          }
        },
        {
          name: 'Vertices6',
          value: {
            x: 0,
            y: 5,
            z: 3
          }
        },
        {
          name: 'Vertices7',
          value: {
            x: 0,
            y: 0,
            z: 0
          }
        },
        {
          name: 'Vertices8',
          value: {
            x: 0,
            y: 0,
            z: 3
          }
        }
      ],
      mesh: null,
      camera: null,
      scene: null,
      renderer: null,
      controls: null
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    vertices: {
      handler(newVal, oldVal) {
        if (newVal && oldVal) {
          this.createGeometryIntoSecne()
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    formatTooltip(val) {
      return val
    },
    // 初始化
    init() {
      this.createScene() // 创建场景
      this.createMesh() // 创建网格模型
      this.createGeometryIntoSecne()
      this.createLight() // 创建光源
      this.createCamera() // 创建相机
      this.createRender() // 创建渲染器
      this.createControls() // 创建控件对象
      this.render() // 渲染
    },
    // 创建场景
    createScene() {
      this.scene = new THREE.Scene()
      // 显示三维坐标系
      const axis = new THREE.AxesHelper(12)
      this.scene.add(axis)
    },
    // 创建网格模型
    createMesh() {
      const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1) // 创建一个平面对象PlaneGeometry
      const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
      }) // 材质对象Material
      const plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.receiveShadow = true

      // 设置平面位置
      plane.rotation.x = -0.5 * Math.PI
      plane.position.set(0, 0, 0)

      // 平面对象添加到场景中
      this.scene.add(plane)
    },
    // 创建光源
    createLight() {
      // 添加聚光灯
      const spotLight = new THREE.SpotLight(0xffffff)
      spotLight.position.set(-40, 60, -10)
      spotLight.castShadow = true
      this.scene.add(spotLight) // 聚光灯添加到场景中
      // 环境光
      const ambientLight = new THREE.AmbientLight(0x0c0c0c)
      this.scene.add(ambientLight)
    },
    // 创建相机
    createCamera() {
      const element = document.getElementById('container')
      const width = element.clientWidth // 窗口宽度
      const height = element.clientHeight // 窗口高度
      const k = width / height // 窗口宽高比
      // PerspectiveCamera( fov, aspect, near, far )
      this.camera = new THREE.PerspectiveCamera(45, k, 0.1, 1000)

      this.camera.position.set(-20, 25, 20) // 设置相机位置
      this.camera.lookAt(new THREE.Vector3(5, 0, 0)) // 设置相机方向
      this.scene.add(this.camera)
    },
    // 创建渲染器
    createRender() {
      const element = document.getElementById('container')
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize(element.clientWidth, element.clientHeight) // 设置渲染区域尺寸
      this.renderer.setClearColor(0x3f3f3f, 1) // 设置背景颜色
      this.renderer.shadowMapEnabled = true
      element.appendChild(this.renderer.domElement)
    },
    render() {
      this.mesh.children.forEach(e => {
        e.geometry.computeFaceNormals()
      })

      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.render)
    },
    // 创建控件对象
    createControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    },
    createGeometryIntoSecne() {
      // 移除原来的创建的立方体
      if (this.scene.getObjectByName('testgeom')) {
        this.scene.remove(this.scene.getObjectByName('testgeom'))
      }

      const vertices = []
      this.vertices.forEach(item => {
        vertices.push(
            new THREE.Vector3(item.value.x, item.value.y, item.value.z)
        )
      })
      // 通过循环创建的定点数组与如下创建的方式创建的内容一致
      /* const vertices = [
        new THREE.Vector3(3,5,3),
        new THREE.Vector3(3,5,0),
        new THREE.Vector3(3,0,3),
        new THREE.Vector3(3,0,0),
        new THREE.Vector3(0,5,0),
        new THREE.Vector3(0,5,3),
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(0,0,3)
      ] */
      console.log(vertices)
      // 创建立方体的12个三角片面
      /*const faces = [
        new THREE.Face3(0, 2, 1),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(4, 6, 5),
        new THREE.Face3(6, 7, 5),
        new THREE.Face3(4, 5, 1),
        new THREE.Face3(5, 0, 1),
        new THREE.Face3(7, 6, 2),
        new THREE.Face3(6, 3, 2),
        new THREE.Face3(5, 7, 0),
        new THREE.Face3(7, 2, 0),
        new THREE.Face3(1, 3, 4),
        new THREE.Face3(3, 6, 4)
      ]*/
      const faces = [
        new THREE.Triangle(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(1, 0, 0)
        ),
        new THREE.Triangle(
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(1, 2, 0),
            new THREE.Vector3(2, 1, 0)
        ),
        new THREE.Triangle(
            new THREE.Vector3(3, 3, 0),
            new THREE.Vector3(3, 5, 0),
            new THREE.Vector3(4, 4, 0)
        ),
        new THREE.Triangle(
            new THREE.Vector3(5, 6, 0),
            new THREE.Vector3(5, 7, 0),
            new THREE.Vector3(4, 5, 0)
        ),
        new THREE.Triangle(
            new THREE.Vector3(3, 4, 0),
            new THREE.Vector3(4, 4, 0),
            new THREE.Vector3(4, 0, 0)
        ),
        new THREE.Triangle(
            new THREE.Vector3(4, 0, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 1, 0)
        ),
        new THREE.Triangle(
            new THREE.Vector3(6, 6, 0),
            new THREE.Vector3(5, 6, 0),
            new THREE.Vector3(1, 1, 0)
        ),
        new THREE.Triangle(
            new THREE.Vector3(5, 2, 0),
            new THREE.Vector3(2, 1, 0),
            new THREE.Vector3(1, 1, 0)
        ),
        new THREE.Triangle(
            new THREE.Vector3(4, 0, 0),
            new THREE.Vector3(6, 6, 0),
            new THREE.Vector3(0, 0, 0)
        ),
        new THREE.Triangle(
            new THREE.Vector3(6, 1, 0),
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(0, 0, 0)
        ),
        new THREE.Triangle(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(2, 1, 0),
            new THREE.Vector3(3, 3, 0)
        ),
        new THREE.Triangle(
            new THREE.Vector3(2, 2, 0),
            new THREE.Vector3(5, 6, 0),
            new THREE.Vector3(3, 3, 0)
        )
      ];


      this.geom = new THREE.BufferGeometry() // 创建几何对象
      this.geom.vertices = vertices // 给几何对象vertices属性赋值
      this.geom.faces = faces // 给几何对象faces属性赋值

      // 创建材质数组
      const materials = [
        new THREE.MeshLambertMaterial({
          opacity: 0.6,
          color: 0x44ff44,
          transparent: true
        }),
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          wireframe: true // 渲染几何体线框
        })
      ]

      // 创建支持多种材质的网格对象
      this.mesh = SceneUtils.createMultiMaterialObject(this.geom, materials)
      this.mesh.name = 'testgeom'
      this.scene.add(this.mesh)
    },
    // 克隆新的方块
    clone() {
      const clonedGeometry = this.mesh.children[0].geometry.clone()
      const materials = [
        new THREE.MeshLambertMaterial({
          opacity: 0.6,
          color: 0xff44ff,
          transparent: true
        }),
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          wireframe: true
        })
      ]

      const mesh2 = SceneUtils.createMultiMaterialObject(
          clonedGeometry,
          materials
      )

      mesh2.translateX(5)
      mesh2.translateZ(5)
      mesh2.name = 'clone'
      this.scene.remove(this.scene.getObjectByName('clone'))
      this.scene.add(mesh2)
    },

    // 打印Geometry对象
    outputObjects() {
      console.log(this.geom)
    }
  }
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
  padding: 10px;
  background-color: #fff;
  border: 1px solid #c3c3c3;
}

.controls-button {
  margin: 3px 0px;
}

.vertice-span {
  line-height: 38px;
  padding-left: 8px;
}
</style>

