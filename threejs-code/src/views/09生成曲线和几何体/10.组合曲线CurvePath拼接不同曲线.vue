<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  ArcCurve,
  AxesHelper,
  BufferGeometry,
  CurvePath,
  DirectionalLight,
  Group,
  Line,
  LineBasicMaterial,
  LineCurve,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector2,
  WebGLRenderer
} from "three";

function getModel() {

  const R = 80;//圆弧半径
  const H = 200;//直线部分高度
// 直线1
  const line1 = new LineCurve(new Vector2(R, H), new Vector2(R, 0));
// 圆弧
  const arc = new ArcCurve(0, 0, R, 0, Math.PI, true);
// 直线2
  const line2 = new LineCurve(new Vector2(-R, 0), new Vector2(-R, H));

// CurvePath创建一个组合曲线对象
  const curvePath = new CurvePath();
//line1, arc, line2拼接出来一个U型轮廓曲线，注意顺序
  curvePath.curves.push(line1, arc, line2);

// 执行.getPoints()，直线部分不会像曲线返回中间多余点，只需要起始点即可。
  const pointsArr = curvePath.getPoints(16); //曲线上获取点
  const geometry = new BufferGeometry();
  geometry.setFromPoints(pointsArr); //读取坐标数据赋值给几何体顶点

  const material = new LineBasicMaterial({
    color: 0x00fffff
  });
// 线模型
  const line = new Line(geometry, material);


// 可视化curve.getPoints从曲线上获取的点坐标
  const material2 = new PointsMaterial({
    color: 0xff00ff,
    size: 10,
  });
//点模型对象
  const points = new Points(geometry, material2);

  const group = new Group();
  group.add(line, points);

  return group;
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
  camera.position.set(592, 423, 385);
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