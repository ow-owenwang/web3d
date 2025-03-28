<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AdditiveBlending,
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  TextureLoader,
  WebGLRenderer
} from "three";

const canvasRef = ref();

onMounted(() => {
  const scene = new Scene();

  // 创建透视相机
  const camera = new PerspectiveCamera(
    75,
    window.innerHeight / window.innerHeight,
    0.1,
    1000
  );
  // 设置相机位置
  // object3d具有position，属性是1个3维的向量
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  camera.position.set(0, 0, 5);
  scene.add(camera);

  // 加入辅助轴，帮助我们查看3维坐标轴
  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);

  // const geometry = new BufferGeometry();
  // const positions = new Float32Array([0,0,0]);
  // geometry.setAttribute('position',new BufferAttribute(positions,3));

  // 点材质
  // const material = new PointsMaterial({
  //   color:0xff0000,
  //   size:10,
  //   sizeAttenuation:true
  // })

  // 导入纹理
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load("/textures/particles/10.png");
  const texture1 = textureLoader.load("/textures/particles/9.png");
  const texture2 = textureLoader.load("/textures/particles/11.png");

  // 点着色器材质
  // const material = new ShaderMaterial({
  //   uniforms:{
  //     uTexture:{
  //       value:texture
  //     }
  //   },
  //   vertexShader:vertexShader,
  //   fragmentShader:fragmentShader,
  //   transparent:true
  // })

  // // 生成点
  // const points = new Points(geometry,material)
  // scene.add(points)
  let geometry = null;
  let points = null;

  // 设置星系的参数
  const params = {
    count: 1000,
    size: 0.1,
    radius: 5,
    branches: 4,
    spin: 0.5,
    color: "#ff6030",
    outColor: "#1b3984",
  };

  // GalaxyColor
  let galaxyColor = new Color(params.color);
  let outGalaxyColor = new Color(params.outColor);
  let material;
  const generateGalaxy = () => {
    // 如果已经存在这些顶点，那么先释放内存，在删除顶点数据
    if (points !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(points);
    }
    // 生成顶点几何
    geometry = new BufferGeometry();
    //   随机生成位置
    const positions = new Float32Array(params.count * 3);
    const colors = new Float32Array(params.count * 3);

    const scales = new Float32Array(params.count);

    //图案属性
    const imgIndex = new Float32Array(params.count);

    //   循环生成点
    for (let i = 0; i < params.count; i++) {
      const current = i * 3;

      // 计算分支的角度 = (计算当前的点在第几个分支)*(2*Math.PI/多少个分支)
      const branchAngel =
        (i % params.branches) * ((2 * Math.PI) / params.branches);

      const radius = Math.random() * params.radius;
      // 距离圆心越远，旋转的度数就越大
      // const spinAngle = radius * params.spin;

      // 随机设置x/y/z偏移值
      const randomX =
        Math.pow(Math.random() * 2 - 1, 3) *
        0.5 *
        (params.radius - radius) *
        0.3;
      const randomY =
        Math.pow(Math.random() * 2 - 1, 3) *
        0.5 *
        (params.radius - radius) *
        0.3;
      const randomZ =
        Math.pow(Math.random() * 2 - 1, 3) *
        0.5 *
        (params.radius - radius) *
        0.3;

      // 设置当前点x值坐标
      positions[current] = Math.cos(branchAngel) * radius + randomX;
      // 设置当前点y值坐标
      positions[current + 1] = randomY;
      // 设置当前点z值坐标
      positions[current + 2] = Math.sin(branchAngel) * radius + randomZ;

      const mixColor = galaxyColor.clone();
      mixColor.lerp(outGalaxyColor, radius / params.radius);

      //   设置颜色
      colors[current] = mixColor.r;
      colors[current + 1] = mixColor.g;
      colors[current + 2] = mixColor.b;

      // 顶点的大小
      scales[current] = Math.random();

      // 根据索引值设置不同的图案；
      imgIndex[current] = i % 3;
    }
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("color", new BufferAttribute(colors, 3));
    geometry.setAttribute("aScale", new BufferAttribute(scales, 1));
    geometry.setAttribute("imgIndex", new BufferAttribute(imgIndex, 1));

    //   设置点材质
    //   material = new PointsMaterial({
    //     color: new Color(0xffffff),
    //     size: params.size,
    //     sizeAttenuation: true,
    //     depthWrite: false,
    //     blending: AdditiveBlending,
    //     map: particlesTexture,
    //     alphaMap: particlesTexture,
    //     transparent: true,
    //     vertexColors: true,
    //   });

    //   设置点的着色器材质
    material = new ShaderMaterial({
      vertexShader: `
      
varying vec2 vUv;

attribute float imgIndex;
attribute float aScale;
varying float vImgIndex;

uniform float uTime;

varying vec3 vColor;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    

    // 获取定点的角度
    float angle = atan(modelPosition.x,modelPosition.z);
    // 获取顶点到中心的距离
    float distanceToCenter = length(modelPosition.xz);
    // 根据顶点到中心的距离，设置旋转偏移度数
    float angleOffset = 1.0/distanceToCenter*uTime;
    // 目前旋转的度数
    angle+=angleOffset;

    modelPosition.x = cos(angle)*distanceToCenter;
    modelPosition.z = sin(angle)*distanceToCenter;

    vec4 viewPosition = viewMatrix*modelPosition;
    gl_Position =  projectionMatrix * viewPosition;

    // 设置点的大小
    // gl_PointSize = 100.0;
    // 根据viewPosition的z坐标决定是否原理摄像机
    gl_PointSize =200.0/-viewPosition.z*aScale;
    vUv = uv;
    vImgIndex=imgIndex;
    vColor = color;
}
      `,
      fragmentShader: `
      

varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
varying float vImgIndex;
varying vec3 vColor;
void main(){
    
    // gl_FragColor = vec4(gl_PointCoord,0.0,1.0);

    // 设置渐变圆
    // float strength = distance(gl_PointCoord,vec2(0.5));
    // strength*=2.0;
    // strength = 1.0-strength;
    // gl_FragColor = vec4(strength);

    // 圆形点
    // float strength = 1.0-distance(gl_PointCoord,vec2(0.5));
    // strength = step(0.5,strength);
    // gl_FragColor = vec4(strength);

    // 根据纹理设置图案
    // vec4 textureColor = texture2D(uTexture,gl_PointCoord);
    // gl_FragColor = vec4(textureColor.rgb,textureColor.r) ;
    vec4 textureColor;
    if(vImgIndex==0.0){
       textureColor = texture2D(uTexture,gl_PointCoord);
    }else if(vImgIndex==1.0){
       textureColor = texture2D(uTexture1,gl_PointCoord);
    }else{
       textureColor = texture2D(uTexture2,gl_PointCoord);
    }
    

    gl_FragColor = vec4(vColor,textureColor.r) ;
    

}
      `,

      transparent: true,
      vertexColors: true,
      blending: AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },
        uTexture: {
          value: texture,
        },
        uTexture1: {
          value: texture1,
        },
        uTexture2: {
          value: texture2,
        },
        uTime: {
          value: 0,
        },
        uColor: {
          value: galaxyColor,
        },
      },
    });

    //   生成点
    points = new Points(geometry, material);
    scene.add(points);
    console.log(points);
    //   console.log(123);
  };

  generateGalaxy();

  // 初始化渲染器
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
  });
  renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = BasicShadowMap;
  // renderer.shadowMap.type = VSMShadowMap;

  // 设置渲染尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 监听屏幕大小改变的变化，设置渲染的尺寸
  window.addEventListener("resize", () => {
    //   console.log("resize");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比例
    renderer.setPixelRatio(window.devicePixelRatio);
  });

  // 将渲染器添加到body
  // document.body.appendChild(renderer.domElement);

  // 初始化控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼
  controls.enableDamping = true;
  // // 设置自动旋转
  // controls.autoRotate = true;

  const clock = new Clock();

  function animate() {
    //   controls.update();
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;
    requestAnimationFrame(animate);
    // 使用渲染器渲染相机看这个场景的内容渲染出来
    renderer.render(scene, camera);
  }

  animate();
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
