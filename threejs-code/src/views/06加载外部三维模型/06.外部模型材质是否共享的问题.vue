<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

function getModel() {

  const loader = new GLTFLoader(); //创建一个GLTF加载器

  const model = new Group(); //声明一个组对象，用来添加加载成功的三维场景

  loader.load("/简易小区-共享材质.glb", function (gltf) {
    const mesh1 = gltf.scene.getObjectByName("1号楼");
    //1. 改变1号楼Mesh材质颜色
    // 由于不同的Mesh共享了1号楼Mesh的材质，当你mesh1.material改变mesh1材质，本质上是改变所有楼Mesh的材质
    // mesh1.material.color.set(0xff0000);

    //2. 通过.name标记材质，测试mesh1和mesh2是否共享了材质
    mesh1.material.name = '楼房材质';//通过name标记mesh1对应材质
    const mesh2 = gltf.scene.getObjectByName("2号楼");
    //通过name相同，可以判断mesh1.material和mesh2.material共享了同一个材质对象
    console.log('mesh2.material.name', mesh2.material.name);

    //3. 用代码方式解决mesh共享材质问题
    gltf.scene.getObjectByName("小区房子").traverse(function (obj) {
      if (obj.isMesh) {
        // .material.clone()返回一个新材质对象，和原来一样，重新赋值给.material属性
        obj.material = obj.material.clone();
      }
    });
    mesh1.material.color.set(0xffff00);
    mesh2.material.color.set(0x00ff00);

    model.add(gltf.scene);
  })
  return model;
}

const canvasRef = ref()

onMounted(() => {
  const scene = new Scene();
  scene.add(getModel()); //模型对象添加到场景中


//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);


//光源设置
  const directionalLight = new DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(400, 200, 300);
  scene.add(directionalLight);
  const ambient = new AmbientLight(0xffffff, 0.4);
  scene.add(ambient);


//渲染器和相机
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
// camera.position.set(292, 223, 185);
  camera.position.set(200, 200, 200);//根据渲染范围尺寸数量级设置相机位置
  camera.lookAt(0, 0, 0);

  const renderer = new WebGLRenderer({
    canvas: canvasRef.value
  });
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