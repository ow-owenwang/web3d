<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  Line,
  LineBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";

function getModel() {

  const geometry = new BufferGeometry(); //创建一个几何体对象
// 三维样条曲线
  const curve = new CatmullRomCurve3([
    new Vector3(-50, 20, 90),
    new Vector3(-10, 40, 40),
    new Vector3(0, 0, 0),
    new Vector3(60, -60, 0),
    new Vector3(70, 0, 80)
  ]);
  const pointsArr = curve.getSpacedPoints(100); //曲线取点      
  geometry.setFromPoints(pointsArr); //pointsArr赋值给顶点位置属性     


  const pos = geometry.attributes.position;
  const count = pos.count; //顶点数量
// 计算每个顶点的颜色值
  const colorsArr = [];
// 根据顶点距离起点远近进行颜色插值计算
  const c1 = new Color(0x00ffff); //曲线起点颜色 青色
  const c2 = new Color(0xffff00); //曲线结束点颜色 黄色
  for (let i = 0; i < count; i++) {
    const percent = i / count; //点索引值相对所有点数量的百分比
    //根据顶点位置顺序大小设置颜色渐变
    const c = c1.clone().lerp(c2, percent);//颜色插值计算
    colorsArr.push(c.r, c.g, c.b);
  }

//类型数组创建顶点颜色color数据
  const colors = new Float32Array(colorsArr);
// 设置几何体attributes属性的颜色color属性
  geometry.attributes.color = new BufferAttribute(colors, 3);


  const material = new LineBasicMaterial({
    vertexColors: true, //使用顶点颜色渲染
  });
  const line = new Line(geometry, material);
  return line;
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
  camera.position.set(292, 223, 185);
  camera.lookAt(0, 0, 0);

// WebGL渲染器设置
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true, //开启优化锯齿
  });
  renderer.setPixelRatio(window.devicePixelRatio); //防止输出模糊
  renderer.setSize(width, height);




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