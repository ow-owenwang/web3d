<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  ArcCurve,
  AxesHelper,
  BufferGeometry,
  DirectionalLight,
  Line,
  LineBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";

function getModel() {

// 参数1和2表示椭圆中心坐标  参数3和4表示x和y方向半径
// const arc = new EllipseCurve(0, 0, 120, 50);
// const arc = new EllipseCurve(0, 0, 50, 50);//x和y方向半径相同就是圆形效果
// 圆弧，参数3表示半径
// const arc = new ArcCurve(0, 0, 60);

// 逆时针绘制圆弧，参数5默认false，就是逆时针
  const arc = new ArcCurve(0, 0, 100, 0, Math.PI/2,false);
// 顺时针绘制圆弧
// const arc = new ArcCurve(0, 0, 100, 0, Math.PI/2,true);

//曲线上取点，参数表示取点细分精度
  const pointsArr = arc.getPoints(50); //分段数50，返回51个顶点
// const pointsArr = arc.getPoints(10);//取点数比较少，圆弧线不那么光滑

  const geometry = new BufferGeometry();
// 把数组pointsArr里面的坐标数据提取出来，赋值给`geometry.attributes.position`属性
  geometry.setFromPoints(pointsArr);

// 线材质
  const material = new LineBasicMaterial({
    color: 0x00fffff
  });
// 线模型
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