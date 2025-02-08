<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight, ArcCurve,
  AxesHelper, BoxGeometry,
  BufferAttribute,
  BufferGeometry, CatmullRomCurve3,
  CircleGeometry, Color, CubicBezierCurve, CurvePath, CylinderGeometry,
  DirectionalLight,
  DoubleSide, EdgesGeometry, EllipseCurve, ExtrudeGeometry,
  GridHelper,
  Group, LatheGeometry, Line,
  LineBasicMaterial, LineCurve3, LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial, Path,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial, QuadraticBezierCurve, QuadraticBezierCurve3,
  RepeatWrapping,
  Scene, Shape, ShapeGeometry,
  SphereGeometry, SplineCurve,
  SRGBColorSpace,
  TextureLoader, Vector2, Vector3,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

function getModel() {
  const loader = new GLTFLoader(); //创建一个GLTF加载器

  const model = new Group(); //声明一个组对象，用来添加加载成功的三维场景

  loader.load("/地形.glb", function (gltf) { //gltf加载成功后返回一个对象

    model.add(gltf.scene); //三维场景添加到model组对象中
    //mesh表示地形网格模型
    const mesh = gltf.scene.children[0];
    // 1. 山脉顶点数据
    const pos = mesh.geometry.attributes.position;
    const count = pos.count;//几何体顶点数量

    // 2. 计算模型y坐标高度差
    const yArr = [];//顶点所有y坐标，也就是地形高度
    for (let i = 0; i < count; i++) {
      yArr.push(pos.getY(i));//获取顶点y坐标，也就是地形高度
    }
    yArr.sort();//y坐标排序，以便于计算地形高度差
    const miny = yArr[0];
    const maxy = yArr[yArr.length - 1];
    const height = maxy - miny; //山脉整体高度

    // 3. 计算每个顶点的颜色值
    const colorsArr = [];
    const c1 = new Color(0x0000ff);//山谷颜色
    const c2 = new Color(0xff0000);//山顶颜色
    for (let i = 0; i < count; i++) {
      //当前高度和整体高度比值
      const percent = (pos.getY(i) - miny) / height;
      const c = c1.clone().lerp(c2, percent);//颜色插值计算
      colorsArr.push(c.r, c.g, c.b);
    }
    const colors = new Float32Array(colorsArr);
    // 设置几何体attributes属性的颜色color属性
    mesh.geometry.attributes.color = new BufferAttribute(colors, 3);
    // 4. 设置材质，使用顶点颜色渲染
    mesh.material = new MeshLambertMaterial({
      vertexColors:true,
    });
  })

  return model

}

const canvasRef = ref()

onMounted(() => {
  const scene = new Scene();
  scene.add(getModel()); //模型对象添加到场景中


//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);


//光源设置
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 60, 50);
  scene.add(directionalLight);
  const ambient = new AmbientLight(0xffffff, 0.4);
  scene.add(ambient);


//相机
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(452, 373, 375);
  camera.lookAt(0, 0, 0);

// WebGL渲染器设置
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true, //开启优化锯齿
  });
  renderer.setPixelRatio(window.devicePixelRatio); //防止输出模糊
  renderer.setSize(width, height);
//解决加载gltf格式模型颜色偏差问题
  renderer.outputColorSpace = SRGBColorSpace


// 渲染循环
  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();


  const controls = new OrbitControls(camera, renderer.domElement);

// 画布跟随窗口变化
  window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
})
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