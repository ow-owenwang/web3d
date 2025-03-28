<script setup lang="ts">
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {onMounted, ref} from "vue";
import {
  ACESFilmicToneMapping,
  AxesHelper,
  BoxGeometry,
  Clock,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer
} from "three";

const canvasRef = ref();

onMounted(() => {
  const scene = new Scene();

  const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      300
  );

  // 设置相机位置
  camera.position.set(0, 0, 20);
  scene.add(camera);

  const cubeGeometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({
    wireframe: true,
  });
  const redMaterial = new MeshBasicMaterial({
    color: "#ff0000",
  });

  // 1000立方体
  let cubeArr = [];
  for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
      for (let z = -5; z < 5; z++) {
        const cube = new Mesh(cubeGeometry, material);
        cube.position.set(i, j, z);
        scene.add(cube);
        cubeArr.push(cube);
      }
    }
  }

  // 创建投射光线对象
  const raycaster = new Raycaster();

  // 鼠标的位置对象
  const mouse = new Vector2();

  // window.addEventListener("mousemove", (event) => {
  //   //   console.log(event);
  //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //   mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  //   raycaster.setFromCamera(mouse, camera);
  //   let result = raycaster.intersectObjects(cubeArr);
  //   //   console.log(result);
  //   //   result[0].object.material = redMaterial;
  //   result.forEach((item) => {
  //     item.object.material = redMaterial;
  //   });
  // });

  window.addEventListener("click", (event) => {
    //   console.log(event);
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    raycaster.setFromCamera(mouse, camera);
    let result = raycaster.intersectObjects(cubeArr);
    //   console.log(result);
    //   result[0].object.material = redMaterial;
    result.forEach((item) => {
      item.object.material = redMaterial;
    });
  });

  const renderer = new WebGLRenderer({
    canvas: canvasRef.value
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 开启场景中的阴影贴图
  renderer.shadowMap.enabled = true;
  // renderer.physicallyCorrectLights = true; // 最新版已移除
  // 设置色调映射为物理正确的模式
  renderer.toneMapping = ACESFilmicToneMapping; // 是否需要设置？

  // // 使用渲染器，通过相机将场景渲染进来
  // renderer.render(scene, camera);

  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
  controls.enableDamping = true;

  // 添加坐标轴辅助器
  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);
  // 设置时钟
  const clock = new Clock();

  function render() {
    let time = clock.getElapsedTime();

    controls.update();
    renderer.render(scene, camera);
    //   渲染下一帧的时候就会调用render函数
    requestAnimationFrame(render);
  }

  render();

  // 监听画面变化，更新渲染画面
  window.addEventListener("resize", () => {
    //   console.log("画面变化了");

    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  });
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
