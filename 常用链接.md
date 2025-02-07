# 


缓冲类型几何体BufferGeometry
three.js的长方体BoxGeometry、球体SphereGeometry等几何体都是基于BufferGeometry类构建的，它就是一个没有任何形状的空几何体，可以通过它自定义任何几何形状，具体来说就是定义顶点数据。







https://lil-gui.georgealways.com/#Guide#Installation


### 常见关键词

**场景(scene)**

场景是所有物体的容器。



**相机(camera)**

决定场景中哪些角度的内容会显示出来。



**渲染器(renderer)**

将 `相机` 中的内容渲染到浏览器页面中。


**几何体(Geometry)**

顾名思义，就是几何体，例如 球体、立方体、平面、以及自定义的几何体(汽车、动物、房子、数目等)。

在 Three.js 中，一个几何体的来源有 3 个：

1. Three.js 中内置的一些基本几何体
2. 自己创建自定义的几何体
3. 通过文件加载进来的几何体



**材质(Material)**

几何体的表面属性，包括颜色、光亮程度。

> 光亮程度是指物体表面反射光的能力值。Three.js 内置了不同的材质，不同材质对应不同的光亮程度。
>
> 内置材质 MeshBasicMaterial 是一种不可以反射光的材质，请注意这里说的不可以反射光并不是指该物体向黑洞那样连光都能吸收，而是指无论什么光源以何种角度照射到该物体上，该物体都不显示 “光亮”，而仅仅以材质本身的颜色或纹理来显示。

一个材质可以引用一个或多个纹理。

**纹理(Texture)**

纹理可以简单理解为一种图像或一张图片，用来包裹到几何体表面上。

纹理来源可以是：

1. 通过文件加载进来
2. 在画布上生成
3. 由另外一个场景渲染出



**网格(Mesh)**

一种特定的 几何体和材质 绘制出的一个特定的几何体系。

> 网格包含的内容为：几何体、几何体的材质、几何体的自身网格坐标体系

> 同一个材质和几何体可以被多个网格对象使用。
>
> 一个场景可以同时添加多个网格。

**光源(Light)**

指不同种类的光。

**视椎(frustum)**

透视镜头(PerspectiveCamera)所创造出的一种视觉可见空间。




**three.js优缺点**



**Three.js应用场景**

1. 3D数据可视化场景
2. 产品720度在线预览
3. H5/微信小游戏
4. 科技教学3D模型展示
5. 网页VR、网页VR看房


#### GAMES101-现代计算机图形学入门-闫令琪

课前必看前四节，补一下图形学基础。

https://www.bilibili.com/video/BV1X7411F744?p=1


可结合课程同步阅读

https://webglfundamentals.org
https://threejs.org/manual/#en/fundamentals
http://yxyy.name/blog/
https://thebookofshaders.com/
https://www.shadertoy.com/browse
https://mrdoob.com/



《深入理解OpenGL、WebGL 和 OpenGL ES》
《计算机图形学——几何体数据结构》
《3D图形系统设计与实现》


## 当遇到某个弃用的api且在文档里搜不到时
此时，我都会到 Three.js github 官方仓库中，在 `Pull requests` 中搜索该属性或方法。

> 搜索时请注意要把 is:open 删除掉，因为既然都被废弃了，那肯定 PR 已经是被并入过的了，状态肯定是 close，不可能是 open。

通常情况下，都可以检索出和废弃的 类、属性、方法相关 PR 信息，点击查看 PR 详情，就能够找到为什么要废弃，建议以后改用 xxx 之类的信息。


示例：
* 3D沙发产品在线预览：http://app.xuanke3d.com/apps/trayton/#/show
* 游乐园可交互场景：http://letsplay.ouigo.com/
* 跟随音乐楼房跳动：http://analysis.4sceners.de/



- 学习图形学的大学生；
- 游戏开发者；
- Webgl、threejs爱好者；
- 已工作的工程师；
- 想要更炫效果的前端开发者；
- 从事数据可视化工作者


## 如何应对高清屏？

从上面示例可以看出，浏览器中渲染的画面尺寸，完全是按照 CSS 样式尺寸来显示的。

对于高清屏(HD-DPI)来说，那 Three.js 渲染的画面又该有何应对呢？

#### 第1种策略(推荐)：不做任何策略

假设 HD-DP 比例为 3x，即原本 1 像素 则由  3 x 3 ，共 9 个像素来显示。

也就是说原本只需渲染 1 像素，现在需要渲染 9 像素，所消耗的性能是原来的 9 倍。

假设 3D 场景内容稍微复杂一些，那所带来的渲染性能要求会非常高，画面清晰的代价是更高性能的消耗，引起的卡顿 会带来不好的用户体验。

事实上高清屏本身都会做显示优化，即使不做任何处理，画面清晰度并不会明显特别差。

因此，什么都不做，其实是一个非常好的策略。

假设就是想设置成高清屏，那又该如何操作呢？

#### 第2种策略(强烈不推荐)：通过 renderer.setPixelRatio 来配置渲染分辨率倍数

在浏览器中，通过 window.devicePixelRatio 可获得当前屏幕物理分辨率与 CSS 样式分辨率的比值。

然后告知渲染器，以后任何 renderer.setSize 都按照此 比值(倍数) 进行渲染

```
renderer.setPixelRatio(window.devicePixelRatio)
```

**强烈不推荐这种做法。**


#### 第3种策略(勉强推荐)：按屏幕分辨率比值，计算出对应渲染尺寸

这种策略思路是：通过分辨率比值，计算出实际上应该渲染的最大尺寸，然后渲染出这个尺寸，再将画面内容渲染到 canvas 中。

举例：假设 HD-DP 比例为 3x，即 普通宽 1 像素对应高清屏宽 3 像素。那么可以将 renderer 渲染出比 canvas 实际大 3 倍的画面，然后再将画面以 “压缩” 3 倍的形式填充到 canvas 中，从而实现所谓的 “高清屏渲染”。

这样的操作，会使 渲染器 renderer 像正常渲染一样来执行各种渲染操作。

**对应的渲染代码为：**

```
const canvas = renderer.domElement
const ratio = window.devicePixelRatio
const newWidth = Math.floor(canvas.clientWidth * ratio)
const newHeight = Math.floor(canvas.clientHeight * ratio)
renderer.setSize(newWidth,newHeight,false) //特别注意，第 3 个参数一定要为 false
```

<br>

**尽管第 3 种策略相对第 2 种好一些，但是还是建议选择第 1 种策略，即什么也不做。**


自动驾驶中扫描周围环境得到的 3D 点云数据就是由 一个一个小点 组成的。


