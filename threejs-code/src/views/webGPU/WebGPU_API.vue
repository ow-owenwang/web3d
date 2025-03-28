<script setup lang="ts">
import {onMounted, ref} from "vue";

const canvasRef = ref()
onMounted(async () => {
  // 请求GPU适配器
  const adapter = await navigator.gpu.requestAdapter()
  // GPU设备对象
  const device = await adapter.requestDevice()

  const ctx = canvasRef.value.getContext("webgpu")
  const format = navigator.gpu.getPreferredCanvasFormat()
  ctx.configure({
    device,
    format: format
  })

  // 创建顶点缓冲区
  const vertexArray = new Float32Array([
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0
  ])
  const vertexBuffer = device.createBuffer({
    size: vertexArray.byteLength,
    // 缓冲区的用途
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  })

  device.queue.writeBuffer(vertexBuffer, 0, vertexArray)

  const vertex = `
    @vertex
    fn main(@location(0) pos:vec3<f32>) -> @builtin(position) vec4<f32> {
      var pos2 = vec4<f32>(pos, 1.0);
      pos2.x -= 0.2;
      return pos2;
    }
  `

  const fragment = `
    @fragment
    fn main() -> @location(0) vec<f32> {
      return vec4<f32>(1.0, 0.0, 0.0, 1.0);
    }
  `

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({code: vertex}),
      entryPoint: "main",
      buffers: [
        {
          arrayStride: 3 * 4, // 一个顶点数据占用的字节长度
          attributes: [
            {
              shaderLocation: 0, // GPU显存上顶点缓冲区标记存储位置
              format: "float32x3", // 表示一个顶点数据包含3个
              offset: 0, // 每组顶点数据间隔字节数
            }
          ]
        }
      ]
    },
    fragment: {
      module: device.createShaderModule({code: fragment}),
      entryPoint: "main",
      targets: [
        {
          format: format
        }
      ]
    },
    primitive: {
      topology: 'triangle-list', // 绘制三角形
    }
  })


})
</script>

<template>
  <canvas id="canvas" ref="canvasRef"></canvas>
</template>

<style scoped>
#canvas {
  width: 100vw;
  height: 100vh;
}
</style>
