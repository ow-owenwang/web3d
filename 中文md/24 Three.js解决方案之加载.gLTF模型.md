
我这里提供几个上找到的 glTF 文件资源，方便自己练习使用。

**一个黄色的小鸭子：**

1. https://vr.josh.earth/assets/models/duck/duck.gltf
2. https://vr.josh.earth/assets/models/duck/duck.bin
3. https://vr.josh.earth/assets/models/duck/duck.png



**一个简易3D社区**

https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf

> 这个小区模型比较大，你需要适当调整一下镜头参数，才可以看清楚全貌



<br>

**一个酷酷的头盔**

https://cdn.khronos.org/assets/api/gltf/DamagedHelmet.glb



<br>

**一个宇航员**

https://modelviewer.dev/shared-assets/models/Astronaut.glb

> 真的好酷！





<br>

## 谷歌开源的一个JS库：model-viewer

在搜索 glTF 相关文章时，我无意中发现另外谷歌公司开源的一个 JS 项目： model-viewer



项目 Github 地址：https://github.com/google/model-viewer

项目官网：https://modelviewer.dev/

项目介绍：Easily display interactive 3D models on the web & in AR

> 简单来说就是：在 Web 或 AR 中，一个简单的用来显示 3D 模型的 JS 库。



<br>

具体用法：

```
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>

<model-viewer src="shared-assets/models/Astronaut.glb" alt="A 3D model of an astronaut" auto-rotate camera-controls></model-viewer>
```

> 确实够简单了，就是引入 viewer ，然后可以使用 <model-viewer> 标签插入模型渲染显示标签。
>
> 简直和插入图片标签 <img> 没啥区别。



<br>

交互效果：除了可以渲染出 3D 模型文件，还默认配备有类似 OrbitControls 相同的交互效果。



<br>

兼容性：目前 苹果浏览器 Safari、火狐 Firefox 并不支持。



<br>

至此，关于如何加载 glTF 文件已讲解完毕。



**但是有一点我们没有提到，就是使用 glTF 中自带的灯光、镜头、动画等内容。**

由于目前我还不会在 Blender 创建动画，所以这一块我们暂且保留，等待以后有机会再继续学习。



<br>

在 Three.js 中，还有很多其他文件格式的加载器，我们就不逐个讲解了，具体的可以查阅官方文档。



<br>

你以为本文结束了？没有！

在上面示例中，我们实际上漏掉了一个非常重要的知识点：加载被压缩过的 .glb 文件



<br>

## glTF文件压缩和加载(解压)——Draco

在本文的示例中，所演示加载的 .glb 文件是我自己在 Blender 中创建导出的。

如同图片文件一样，也有专门针对 .glb 文件压缩的工具，最为著名的就是谷歌公司开源的：draco



### Draco简介

Draco 是一种库，用于压缩和解压缩 3D 几何网格(geometric mesh) 和 点云(point cloud)

draco官网：https://google.github.io/draco/

draco源码：https://github.com/google/draco



<br>

draco 底层是使用 c++ 编写的。

draco 可以在不牺牲模型效果的前提下，将 .glb 文件压缩体积减小很多。

> 就好像将普通文件压缩成 .zip 一样

> 至于文件减少多少，这个暂时没有查询到



<br>

#### Draco使用流程是：

1. 使用 Draco 将模型压缩，最终压缩后的文件格式为 .drc 或 .glb

   > Draco 可以压缩众多 3D 格式文件，.glb 仅仅是其中一种

2. 在 .glb 文件内部有一个特殊字段，用来表述本文件是否经过了 draco 压缩

3. 当客户端(JS) 使用 GLTFLoader 去加载某个 .glb 文件时会去读取该标识

4. 若判断该 .glb 文件未被压缩则直接进行加载和解析

5. 若判断该 .glb 文件是被 draco 压缩过的，则会尝试调用 draco 解压类，下载 .glb 文件的同时进行解压，最终将下载、解压后的 .glb 数据传递给 GLTFLoader 使用

   > 这就引申出来一个事情：我们需要提前将负责 draco 解压的类传递给 GLTFLoader，具体如何做请看后面的讲解。



<br>

#### 如何使用 Draco 压缩 .glb 文件？

具体如何操作实现，暂时我也没有学习，先搁置一下。

> 敬请期待以后的更新



<br>

#### 如何在Three.js 中加载压缩过的 .glb 文件？

关于 Draco 的介绍，可以查看 Three.js 对于 Draco 的介绍描述：

https://github.com/mrdoob/three.js/tree/dev/examples/js/libs/draco



Three.js 源码包中 draco 针对 gltf 文件的解压文件库：

1. draco/ 目录下有 4 个文件：draco_decoder.js、draco_decoder.wasm、draco_encoder.js、draco_wasm_wrapper.js

2. draco/gltf/ 目录下面同样有 4 个文件

   > 请注意 draco/ 和 draco/gltf/ 目录下的 4 个文件虽然是名字一样，但是他们内容并不相同。

分别解释一下这 4 个文件：

1. draco_decoder.js

   > draco 解压(解码) 相关 js

2. draco_decoder.wasm

   > .wasm 文件是 WebAssembly 解码器
   >
   > 关于 WebAssembly 更多知识，请执行查阅：https://www.wasm.com.cn/

3. draco_encoder.js

   > draco 压缩(编码) 相关 js

4. draco_wasm_wrapper.js

   > 用于封装 .wasm 解码器的 js



重点来了...

<br>

#### 第1步：拷贝 draco 文件到项目 public 中

我们将 Three.js 中 examples/js/libs/draco 目录拷贝到 React 项目的 public 目录中。

> draco 属于第 3 方库，我们目前暂时采用拷贝到 public 目录中这种形式
>
> 请记得一定拷贝的是 draco/，其中包含 draco/gltf/ 目录



#### 第2步：实例化一个 DRACOLoader，并传递给 GLTFLoader

> 关于 DRACOLoader 的详细解释，请参考官方文档：
>
> https://threejs.org/docs/#examples/zh/loaders/DRACOLoader

<br>

我们将之前 GLTFLoader  的代码修改如下：

```diff
+	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

	const gltfLoader = new GLTFLoader()

+	const dracoLoader = new DRACOLoader()
+	dracoLoader.setDecoderPath('./examples/js/libs/draco/')
+	dracoLoader.setDecoderConfig({ type: 'js' })
+	gltfLoader.setDRACOLoader(dracoLoader)

	gltfLoader.load('./model/vivo.glb', (gltf) => {
    	scene.add(gltf.scene)
	})
```



<br>

下面就针对上面 4 行核心代码进行解释说明：

1. `const dracoLoader = new DRACOLoader()`

   实例化一个 DRACOLoader

2. `dracoLoader.setDecoderPath('./examples/js/libs/draco/')`

   设置 dracoLoader 应该去哪个目录里查找 解压(解码) 文件

3. `dracoLoader.setDecoderConfig({ type: 'js' })`

   设置 dracoLoader 的配置项

4. `gltfLoader.setDRACOLoader(dracoLoader)`

   将 dracoLoader 传递给 gltfLoader，供 gltfLoader 使用

至此，结束！



<br>

虽然 draco 非常复杂，但是对于我们使用者而言却很简单，仅仅上面 4 行代码即可实现加载被 draco 压缩过的 .glb 文件。



<br>

## 加载.drc模型文件

在上面示例中，我们加载的是被 draco 压缩过的 .glb 文件。

那如果是被 draco 压缩过的 .drc 文件呢？

答：更加简单，直接使用 DRACOLoader即可。



<br>

DRACOLoader使用示例代码如下：

```
const loader = new DRACOLoader();
loader.setDecoderPath( '/examples/js/libs/draco/' );
loader.preload();

loader.load('./xxx/model.drc',
	function ( geometry ) {
		const material = new THREE.MeshStandardMaterial( { color: 0x606060 } );
		const mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );
	}
}
```



<br>

## 补充说明：修改模型位置偏差

无论加载 .obj 文件，还是本章讲解的加载 .gltf 文件，假设模型在建模软件中位置中心并不是原点，而是非常偏远的位置。

那么文件加载完成后，将模型添加到场景中，模型的位置并不在场景视角的中心位置，如果位置过于偏远，甚至有可能根本看不见模型。

我们可以通过以下方式，计算模型的位置偏差，并修正模型的位置，使其出现在视野中心位置。

```
const loader = new GLTFLoader()
loader.load('./model/lddq.gltf', (gltf) => {
    const group = gltf.scene

    const box = new Three.Box3().setFromObject(group)
    const center = box.getCenter(new Three.Vector3())

    group.position.x += (group.position.x - center.x)
    group.position.y += (group.position.y - center.y)
    group.position.z += (group.position.z - center.z)

    scene.add(group)
})
```

> Box3 的介绍请执行查阅官方文档。
