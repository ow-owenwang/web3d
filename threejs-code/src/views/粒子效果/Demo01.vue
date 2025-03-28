<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AdditiveBlending,
  AmbientLight,
  AxesHelper,
  BoxGeometry, BufferAttribute, BufferGeometry, Clock, Color,
  DirectionalLight, Float32BufferAttribute,
  Group, MathUtils,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera, Points, PointsMaterial,
  Scene, ShaderMaterial, SphereGeometry,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  WebGLRenderer
} from "three";
import gsap from "gsap";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

const canvasRef = ref();
let scene

function getModel() {

  const material = new MeshLambertMaterial({
    color: 0x00ffff
  })

  const geometry = new SphereGeometry(25)
  // geometry.translate(0, 50, 0)

  const mesh = new Mesh(geometry, material)


  const group = new Group()
  group.add(mesh)

  return group;
}

// 创建星空背景
function createSky() {
  const vertices: any[] = [];
  for (let i = 0; i < 1000; i++) {
    const x = MathUtils.randFloatSpread(2000);
    const y = MathUtils.randFloatSpread(2000);
    const z = MathUtils.randFloatSpread(2000);
    vertices.push(x, y, z);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute(
      "position", // BufferAttribute的第一个参数是属性名称，这里我们将其命名为position，表示这个属性是用来控制点的位置的
      new Float32BufferAttribute(vertices, 3) // 3个为一组，表示一个点的xyz坐标
  );
  const material = new PointsMaterial({
    size: 1, // 点的大小
    map: mapDot, // 纹理贴图
  });
  const skyPoints = new Points(geometry, material);

  scene.add(skyPoints);
}



const initBox = (obj) => {
  obj.children.forEach((item, index) => {
    const vertices: any[] = [];
    const itemGeometry = item.geometry; // 获取模型的几何体
    const count = itemGeometry.attributes.position.count;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100 + 10;
      const y = 0
      const z = Math.random() * 100 + 10;
      vertices.push(x, y, z);
    }
    let geometry = new BufferGeometry();
    geometry.setAttribute(
        "position", // BufferAttribute的第一个参数是属性名称，这里我们将其命名为position，表示这个属性是用来控制点的位置的
        new Float32BufferAttribute(vertices, 3) // 3个为一组，表示一个点的xyz坐标
    );
    const color = new Color(Math.random(), Math.random(), Math.random());
    const material =new ShaderMaterial({
      uniforms: {
        uColor: { value: color },
        uTexture: { value: mapDot },
        uTime: {
          value: 0,
        },
      },
      vertexShader: `
        attribute vec3 aPosition;
uniform float uTime;
void main(){
    vec4 currentPosition=modelMatrix*vec4(position,1.);
    vec3 direction=aPosition-currentPosition.xyz;
    vec3 targetPosition=currentPosition.xyz+direction*.1*uTime;
    vec4 vPosition=viewMatrix*vec4(targetPosition,1.);
    gl_Position=projectionMatrix*vPosition;
    gl_PointSize=100./vPosition.z;

}

      `,
      fragmentShader: `
        uniform sampler2D uTexture;
uniform vec3 uColor;
void main(){
    vec4 uTextureColor = texture2D(uTexture, gl_PointCoord);
    gl_FragColor = vec4(uColor, uTextureColor.x);
}

      `,
      blending: AdditiveBlending,
      transparent: true,
      depthTest: false,
    });
    const points = new Points(geometry, material);
    groupOBJ.add(points);
  });
  scene.add(groupOBJ);
}

const initOBJMember = (obj) => {
  initBox(obj);
  obj.children.forEach((item, index) => {
    const itemGeometry = item.geometry; // 获取模型的几何体
    const particleSystem = new Points(
        itemGeometry,
        new PointsMaterial({
          color: 0xffffff,
        })
    );

    const itemPoints = particleSystem.geometry.getAttribute("position"); // 获取顶点位置
    let randomPositionArray = new Float32Array(itemPoints.count * 3);
    for (let i = 0; i < itemPoints.count; i++) {
      // 放大倍数
      const p = 0.5;
      randomPositionArray[i * 3] = itemPoints.array[i * 3] * p+100;
      randomPositionArray[i * 3 + 1] = itemPoints.array[i * 3 + 1] * p;
      randomPositionArray[i * 3 + 2] = itemPoints.array[i * 3 + 2] * p;
    }
    groupOBJ.children[index].geometry.setAttribute(
        "aPosition",
        new BufferAttribute(randomPositionArray, 3)
    );
    new Tween(groupOBJ.children[index].material.uniforms.uTime)
        .to({ value: 10 }, Math.random()*3000+500)
        .easing(Easing.Sinusoidal.InOut)
        // .repeat(Infinity)
        // .yoyo(true)
        .delay(1000 * Math.random())
        .onUpdate(() => {
          // countArr.needsUpdate = true; // 告诉渲染器需要更新顶点位置
        })
        .onComplete(() => {})
        .start();
  });
}

function loadOBIFN() {
  const loader = new OBJLoader();
  loader.load(
      "/models/AK47/scenes/AK47.obj",
      (obj) => initOBJMember(obj),
      function (xhr) {
        console.log("加载完成", (xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.log("An error happened: " + error);
      }
  );
}

scene = new Scene();
const model = getModel();
// scene.add(model);

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
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width, height)

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true

const clock = new Clock()
function render() {
  controls.update()

  const time = clock.getElapsedTime();

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}




onMounted(() => {

  createSky();
  loadOBIFN();
  render();



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
