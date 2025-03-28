#   

想象一个飞机平行于地面飞行，垂直于机身的轴为z轴，机头的方向为x轴，机翼的方向为y轴（与x轴垂直）。
heading：航向角，以Z轴为旋转轴旋转，单位弧度，控制机头的朝向位置，左右摆头，范围为0-360°
pitch：俯仰角，以Y轴为旋转轴旋转，单位弧度，控制飞机的起降朝向，上下摆头，范围为-180°-180°
roll：翻滚角，以X轴为旋转轴旋转，单位弧度，控制飞机的侧翻角度，范围为-180°-180°
https://www.youtube.com/watch?v=xDsULyNi0Ls



使用GeoJsonDataSource加载GEOJson数据

如何撒点？

自动复制需要的node_modules中Cesium包中的资源：https://www.npmjs.com/package/vite-plugin-static-copy

## 城市建筑三维白膜数据的制作与效果展示

### 城市建筑数据的获取

城市建筑数据，指的是一个城市的建筑平面轮廓图，跟某栋建筑的详规、控规图纸不一样，而是城市范围内所有建筑的轮廓，轮廓可以简单的就一个矩形，或者多边形封闭区域，表达的是在这个区域内有栋建筑，不需要详细的信息。

正常途径的话，数据更新最快，也最准确的，当然归属规划、国土相关部门了，但是这类数据往往很难拿到，如果有可能的话，也尽量从官方获取数据。

当然我们如果仅仅只是想做一些研究性的课题，或者其他技术交流、实验性质的项目的话，这个时候，我们对于数据的时效性、准确性就没那么高了，可以在网上下载免费的数据下载器工具软件，或者付费购买一些公司、大佬们写的下载软件，当然这个购买的费用也不贵，可以终生适用，还可以得到免费的升级维护服务。

当然，也有最简单的方式，就是通过一些渠道，QQ群、微信群、论坛、博客啥的，可以使用网友们共享的数据，当然这个质量就没有什么保障了，需要你懂一些基础数据的编辑，如ArcGIS、SuperMap软件的操作了。（本篇文章所涉及到的北京市建筑轮廓数据就是这种聚到获取的，格式为WGS84的shp矢量数据，仅作技术研究用途）

最后，数据获取方式千万条，但是一定不能侵权，做技术研究、做课题的一定要保管好自己的数据，不要商用，商用的话，最好使用授权的数据。免得以后引起纷争，毕竟GIS圈内的数据保密政策还是蛮厉害的。

### 城市建筑数据的三维白膜建模

白膜建模，应该属于三维建模领域里面，最原始也是最简单的建模了，模型体现的就是一个一个白色的盒子，方式就是吧建筑轮廓直接按照指定的高度拉伸即可。

城市级别的建筑体量是不能靠一个一个手动在软件中建模的，必须得自动完成。

一、纯代码绘制

这种方式处理起来也很简单，根据建筑轮廓，可以绘制多边形、墙体等Entity对象，或者PolygonGeometry、WallGeometry等Primitive对象。

二、建模软件自动建模

这种方式需要建模软件能够根据属性参数进行自动化建模，同时，还需要软件数据格式支持（CAD/SHP/GEOJSON/KML等），三维建模数据导出格式支持（OBJ/DAE/3DTILES等）。

三、SHP -> 3DTILES 建模

这种方式是最简单的，无需其他的操作，直接一步到位，但是需要有几个前提条件。

1、SHP数据格式最好是WGS84坐标系。
2、属性字段中有数值性的高度属性。
3、文件编码最好是UTF-8。

### 城市建筑模型的三维可视化

## 加载GeoServer发布的wmts服务 4326/3857

4326：epsg 4326
3857：epsg 900913，标准名：3857

```js
  new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://localhost:7777/geoserver/gwc/service/wmts/rest/testkh:anhuis/{style}/{TileMatrixSet}/{TileMatrixSet}:{TileMatrix}/{TileRow}/{TileCol}?format=image/png',
    layer: 'testkh:anhuis',
    style: '',
    tileMatrixSetID: 'EPSG:900913',
})
```

加载4326服务：

```js
   new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://localhost:7777/geoserver/gwc/service/wmts/rest/testkh:anhuis/{style}/{TileMatrixSet}/{TileMatrixSet}:{TileMatrix}/{TileRow}/{TileCol}?format=image/png',
    layer: 'testkh:anhuis',
    style: '',
    tileMatrixSetID: 'EPSG:4326',
    tilingScheme: new Cesium.GeographicTilingScheme()
})
```

第1章 图元
简介
组成
优缺点
分类
几何图形
自定义图形
第2章 外观
简介
分类
Material
顶点着色器
片元着色器
数据传递
着色器编程
第3章 热力图
简介
数据
绘制
3D热力图
优化
第4章 shadertoy
网站简介
绘图基础
移植到Cesium
着色器使用技巧
纹理数据
Perlin-Worley噪声实现云图
第5章 后处理
简介
后处理类
在着色器中还原像素的世界坐标
传递数据到着色器
限制后处理的范围
根据相机距离雾化
后处理实现高度雾
后处理实现积雪效果
后处理实现淹没分析
后处理实现限高分析
后处理实现区域遮罩
第6章 阴影贴图
简介
ShadowMap类
可视域分析
场景视频融合
视频融合-多路
视频融合优化
第7章 地球材质
简介
局部等高线
局部坡度
局部坡向
局部高程
遮罩-裁剪
第8章 模型分析
模型压平
模型卷帘
第9章 着色器编程
多边形数据处理
着色器中求解模型坐标

第1章 源码环境
生产包与源码包的区别
为什么要搭建源码开发环境
使用官方源码开发环境
搭建热更新源码开发环境
第2章 渲染模块
渲染器
绘制指令
统一值状态
自动统一值
内置glsl库
第3章 渲染流程
程序入口
引擎初始化
场景渲染
流程总结
第4章 绘制指令
应用介绍
自定义图形1-顶点准备
自定义图形2-创建VAO
自定义图形3-创建绘制指令
自定义图形4-加入渲染队列
自定义图形5-法线与光照
第5章 管道图元
管道图元简介
图元分析建模
生成顶点数据
变换顶点数据
组装顶点数据
使用绘制指令
计算纹理坐标
添加管道壁厚
第6章 离屏渲染
什么是离屏渲染
Cesium离屏渲染
离屏渲染之Picking类
将场景渲染到自己的FBO中
可视化离屏渲染的结果
翻转FBO的绘制内容
隐藏不必要的渲染内容
离屏渲染之数据对比
使用自定义相机进行离屏渲染
修改自定义相机的参数
第7章 深度图应用
深度图简介
场景深度图
深度图渲染
深度坐标解析
区域高差分析
填挖方分析
两点通视分析
第8章 反射水面
反射水面原理
计算反射相机
可视化反射相机
使用反射相机进行离屏渲染
渲染结果作为材质使用
错位原因排查
剔除水面以下的东西
使用噪声干扰纹理
第9章 三维体渲染
前言
3D纹理
代理几何
复刻ThreeJS中的体渲染-柏林噪声
复刻ThreeJS中的体渲染-云朵
学以致用-Mars3D气象云三维体
第10章 地形应用
地形压平
地形压平-修改着色器实现
地形压平-修改地形数据实现
地形裁剪
地形抬升
第11章 自定义光源
光照原理
模型光源
后处理光源
第12章 体积云
体积云原理
后处理画一个Box
简单的体积云效果
逼真的体积云效果(局部)
逼真的体积云效果(全球)

```js
var tileset = this.viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
        url: "http://www.xt3d.cn/data/offset_3dtiles/tileset.json",
    })
);

tileset.readyPromise
    .then(tileset => {
        this.viewer.zoomTo(
            tileset,
        );
        xt3d.TilesetPlugin.setTilesetHeight(tileset, 55);
    })
    .otherwise(function (error) {
        console.log(error);
    })
```

```js
//禁止鼠标的所有操作，对二、三维起作用
// scene.screenSpaceCameraController.enableInputs = false
// 禁止鼠标转动操作，对二、三维起作用
scene.screenSpaceCameraController.enableRotate = false;
//禁止鼠标倾斜操作，只对三维起作用
scene.screenSpaceCameraController.enableTilt = false;
//禁止鼠标平移操作，对二维和哥伦布模式起作用
scene.screenSpaceCameraController.enableTranslate = false;
//允许鼠标缩放旋转和平移操作，对三维和哥伦布模式起作用
scene.screenSpaceCameraController.enableLook = false;
//禁止鼠标缩放操作，对二、三维起作用
scene.screenSpaceCameraController.enableZoom = false;
```

当鼠标在地球上时，才可以rotate 和tilt:

```js
handler.setInputAction(function (leftzDown) {
    var cartesian3 = viewer.scene.pickPosition(leftzDown.position);
    if (cartesian3) {
        scene.screenSpaceCameraController.enableRotate = true;
    }
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

handler.setInputAction(function (leftUp) {
    scene.screenSpaceCameraController.enableRotate = false;
}, Cesium.ScreenSpaceEventType.LEFT_UP);

handler.setInputAction(function (middleDown) {
    var cartesian3 = viewer.scene.pickPosition(middleDown.position);
    if (cartesian3) {
        scene.screenSpaceCameraController.enableTilt = true;
    }
}, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
handler.setInputAction(function (middleUp) {
    scene.screenSpaceCameraController.enableTilt = false;
}, Cesium.ScreenSpaceEventType.MIDDLE_UP);

handler.setInputAction(function (movement) {
    var cartesian3 = viewer.scene.pickPosition(movement.endPosition);
    if (!cartesian3) {
        scene.screenSpaceCameraController.enableTilt = false;
    }
    // mousePosition = movement.endPosition;
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
```

```js
 对应事件
var flags = {
    looking: false,
    moveForward: false,
    moveBackward: false,
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false,
};
获取对应事件

function getFlagForKeyCode(keyCode) {
    switch (keyCode) {
        case "W".charCodeAt(0):
            return "moveForward";
        case "S".charCodeAt(0):
            return "moveBackward";
        case "Q".charCodeAt(0):
            return "moveUp";
        case "E".charCodeAt(0):
            return "moveDown";
        case "D".charCodeAt(0):
            return "moveRight";
        case "A".charCodeAt(0):
            return "moveLeft";
        default:
            return undefined;
    }
}

document.addEventListener(
    "keydown",
    function (e) {
        var flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== "undefined") {
            flags[flagName] = true;
        }
    },
    false
);

document.addEventListener(
    "keyup",
    function (e) {
        var flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== "undefined") {
            flags[flagName] = false;
        }
    },
    false
);


viewer.clock.onTick.addEventListener(function (clock) {
    var camera = viewer.camera;

    if (flags.looking) {
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;

        // Coordinate (0.0, 0.0) will be where the mouse was clicked.
        var x = (mousePosition.x - startMousePosition.x) / width;
        var y = -(mousePosition.y - startMousePosition.y) / height;

        var lookFactor = 0.05;
        camera.lookRight(x * lookFactor);
        camera.lookUp(y * lookFactor);
    }

    //计算摄像机移动速度
    var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
    var moveRate = cameraHeight / 100.0;

    if (flags.moveForward) {
        camera.moveForward(moveRate);
    }
    if (flags.moveBackward) {
        camera.moveBackward(moveRate);
    }
    if (flags.moveUp) {
        camera.moveUp(moveRate);
    }
    if (flags.moveDown) {
        camera.moveDown(moveRate);
    }
    if (flags.moveLeft) {
        camera.moveLeft(moveRate);
    }
    if (flags.moveRight) {
        camera.moveRight(moveRate);
    }
})
```

HtmlOverlay

```js
const htmlOverlay = document.getElementById("htmlOverlay");
const scratch = new Cesium.Cartesian2();
const position = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
viewer.scene.preRender.addEventListener(function () {
    const canvasPosition = viewer.scene.cartesianToCanvasCoordinates(
        position,
        scratch
    );
    if (Cesium.defined(canvasPosition)) {
        htmlOverlay.style.top = `${canvasPosition.y}px`;
        htmlOverlay.style.left = `${canvasPosition.x}px`;
    }
})

```

```js
 let htmloverlay = document.createElement("div");
htmloverlay.classList.add("htmloverlay");
htmloverlay.innerHTML = "<span class='custom-style-label'>定制化文本信息</span>";
htmloverlay.style.position = "absolute";
viewer.container.appendChild(htmloverlay);

viewer.scene.preRender.addEventListener(function () {
    const canvasHeight = viewer.scene.canvas.height;
    const windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position, new Cesium.Cartesian2());

    const elWidth = htmloverlay.offsetWidth; //容器宽度
    let offsetX = -elWidth / 2;
    let offsetY = 0;

    htmloverlay.style.left = (windowPosition.x + offsetX) + "px";
    htmloverlay.style.bottom = (canvasHeight - windowPosition.y + offsetY) + "px";
})

```

```js
let htmloverlay = document.createElement("div");
htmloverlay.classList.add("htmloverlay");
htmloverlay.innerHTML = ` 
<div class="popup-container">
    <div class="popup-header">
        <span class="popup-title">摄像头信息</span>
        <span class="popup-close xt3d-popup-close-button" title="关闭">×</span>
    </div>
    <div class="popup-body">
        <div class="popup-info-item">
            <span class="popup-ifno-label">名称：</span><span class="popup-ifno-text">海康监控枪机204</span>
        </div>
        <div class="popup-info-item">
            <span class="popup-ifno-label">IP地址：</span><span class="popup-ifno-text">192.168.2.47</span> 
        </div>
        <div class="popup-info-item"> 
            <span class="popup-ifno-label">状态：</span><span class="popup-ifno-text">在线</span> 
        </div>
        <div class="popup-info-item"> 
            <span class="popup-ifno-label">管辖民警：</span><span class="popup-ifno-text">张世勋</span> 
        </div>
        <div class="popup-info-item"> 
            <span class="popup-ifno-label">电话：</span><span class="popup-ifno-text">110110110</span>
        </div>
    </div>
</div>`;
htmloverlay.style.position = "absolute";
viewer.container.appendChild(htmloverlay);
viewer.scene.preRender.addEventListener(function () {
    const canvasHeight = viewer.scene.canvas.height;
    const windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position, new Cesium.Cartesian2());
    const elWidth = htmloverlay.offsetWidth; //容器宽度
    let offsetX = -elWidth / 2;
    let offsetY = 0;
    htmloverlay.style.left = (windowPosition.x + offsetX) + "px";
    htmloverlay.style.bottom = (canvasHeight - windowPosition.y + offsetY) + "px";
});

```

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>cesium|xt3d</title>
    <!-- 引入Cesium -->
    <script src="https://unpkg.com/cesium@1.84.0/Build/Cesium/Cesium.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/cesium@1.84.0/Build/Cesium/Widgets/widgets.css">

    <!--  引入xt3d -->
    <script src="http://www.xt3d.cn/xt3dlib/xt3d.min.js"></script>

    <style>
        html,
        body,
        #map3d {
            width: 100%;
            height: 100%;
            margin: 0px;
            padding: 0px;
        }
    </style>
</head>

<body>
<div id="map3d"></div>
<script>
    let xt3dInit = {
        init(el) {
            this.initViewer(el);
            this.load3dtiles();

            this.initMonitors();
            this.viewer.selectedEntityChanged.addEventListener(e => {
                this.selectedEntityChanged(e);
            });
        },

        //初始化viewer
        initViewer(el) {
            this.viewer = new Cesium.Viewer(el, {
                infoBox: false,
                selectionIndicator: false,
                navigation: false,
                animation: false,
                timeline: false,
                baseLayerPicker: false,
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                navigationHelpButton: false,
                shouldAnimate: false,
                imageryProvider: new Cesium.UrlTemplateImageryProvider({
                    url: "https://t7.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=tdtTk"
                })
            });
            this.viewer.scene.globe.depthTestAgainstTerrain = true;
        },

        //初始化点位
        initMonitors() {
            let monitors = [{
                name: "北京西路与北京路交叉口",
                ip: "42.23.33.23",
                type: "固定枪机",
                state: "在线",
                position: {
                    x: -1573842.0351617213,
                    y: 5327906.719968858,
                    z: 3122733.541764769
                }
            }, {
                name: "阿化修理店门口",
                ip: "42.23.33.22",
                type: "固定枪机",
                state: "在线",
                position: {
                    x: -1573743.4786981696,
                    y: 5327995.971373521,
                    z: 3122666.986937621
                }
            }, {
                name: "瑞安市钢材市场(东新路店)",
                ip: "42.23.33.12",
                type: "固定枪机",
                state: "在线",
                position: {
                    x: -1573711.889710824,
                    y: 5328072.134580926,
                    z: 3122643.841939998
                }
            }, {
                name: "安心大药房(上旺西路店)",
                ip: "42.23.33.25",
                type: "固定枪机",
                state: "在线",
                position: {
                    x: -1573778.4103380782,
                    y: 5327948.310818552,
                    z: 3122695.792699967
                }
            },]

            monitors.forEach(item => {
                this.viewer.entities.add({
                    position: item.position,
                    info: item,
                    billboard: {
                        image: '/data.xt3d.cn/assets/images/marker/bluecamera.png',
                        scaleByDistance: new Cesium.NearFarScalar(500, 1, 1200, 0.8),
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                    }
                })
            })
        },

        //实体选中事件
        selectedEntityChanged(e) {
            if (this.window) {
                this.window.close();
                this.window = undefined;
            }
            if (!e) return;
            this.window = new xt3d.Map3dWindow.MultiFieldAdaptWindow(this.viewer, e.position._value, "监控信息", ["监控名称", "IP地址", "监控类型", "监控状态"], [e.info.name, e.info.ip, e.info.type, e.info.state]);
        },

        //加载3dtiles数据
        load3dtiles() {
            var tileset = this.viewer.scene.primitives.add(
                    new Cesium.Cesium3DTileset({
                        url: "http://www.xt3d.cn/data/offset_3dtiles/tileset.json",
                    })
            );

            tileset.readyPromise
                    .then(tileset => {
                        this.viewer.zoomTo(
                                tileset,
                        );
                        xt3d.TilesetPlugin.setTilesetHeight(tileset, 55);
                    })
                    .otherwise(function (error) {
                        console.log(error);
                    });
        },

        destroy() {
            this.viewer.entities.removeAll();
            this.viewer.imageryLayers.removeAll(true);
            this.viewer.destroy();
        }
    }

    xt3dInit.init("map3d");
</script>
</body>

</html>

```

```html
 <!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>cesium|xt3d</title>
    <!-- 引入Cesium -->
    <script src="https://unpkg.com/cesium@1.84.0/Build/Cesium/Cesium.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/cesium@1.84.0/Build/Cesium/Widgets/widgets.css">

    <script src='http://www.xt3d.cn/libs/turf.min.js'></script>

    <!--  引入xt3d -->
    <script src="http://www.xt3d.cn/xt3dlib/xt3d.min.js"></script>
    <style>
        html,
        body,
        #map3d {
            width: 100%;
            height: 100%;
            margin: 0px;
            padding: 0px;
        }

        .btn-container {
            position: absolute;
            left: 10px;
            top: 90px;
            padding: 10px 15px;
            border-radius: 4px;
            border: 1px solid rgba(128, 128, 128, 0.5);
            color: #ffffff;
            background: rgba(0, 0, 0, 0.4);
            box-shadow: 0 3px 14px rgb(128 128 128 / 50%);
            max-width: 380px;
        }

        button {
            background: transparent;
            border: 1px solid #00d0ffb8;
            color: white;
            padding: 7px 9px;
            border-radius: 2px;
            margin: 3px;
            cursor: pointer
        }

        .tip-item {
            margin: 2px 0px;
            padding: 5px 1px;
        }
    </style>
</head>

<body>
<div id="map3d"></div>
<div class="btn-container">
    <button onclick="drawActivate(0)">简单文本</button>
    <button onclick="drawActivate(1)">渐变文本</button>
    <button onclick="clearDraw()">清空</button>
    <button onclick="save()">保存</button>

    <div class="tip-item">点击“简单文本”按钮后在场景中鼠标左键点击添加标注对象</div>
    <div class="tip-item">点击“渐变文本”按钮后在场景中鼠标左键点击添加渐变色标注对象</div>

    <div class="tip-item">选中对象后按钮底部的小圆点进行位置的拖动</div>

    <div class="tip-item">点击“清空”按钮删除所有标注</div>
    <div class="tip-item">点击“保存”按钮将所有标注保存到json文件（支持从json文件导入）</div>
</div>
</div>
<script>
    let xt3dInit = {
        init(el) {
            this.initViewer(el);
            this.load3dtiles();
            this.initEntityDraw();

            this.labelLayer = new xt3d.LabelPlotting.HtmlPlot.PlotLayer(this.viewer);
            this.labelLayer.setPlotSelectable(true);

            this.htmlPlotEdit = new xt3d.LabelPlotting.HtmlPlot.PlotEdit(
                    xt3dInit.viewer,
                    xt3dInit.labelLayer
            );

            this.initDatas();
        },

        //初始化viewer
        initViewer(el) {
            this.viewer = new Cesium.Viewer(el, {
                infoBox: false,
                selectionIndicator: false,
                navigation: false,
                animation: false,
                timeline: false,
                baseLayerPicker: false,
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                navigationHelpButton: false,
                shouldAnimate: true,
                imageryProvider: new Cesium.UrlTemplateImageryProvider({
                    url: "https://t7.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=tdtTk"
                })
            });
            this.viewer.scene.globe.depthTestAgainstTerrain = true;
        },

        //加载数据
        initDatas() {
            fetch("/data.xt3d.cn/assets/data/labelplotting/1602424629194.json").then(res => {
                return res.json();
            }).then(res => {
                let features = res.features;
                features.forEach(feature => {
                    this.labelLayer.addPlot(feature);
                })
            }).catch(err => {
                console.log(err)
            })
        },

        //初始化绘制
        initEntityDraw() {
            this.entityDraw = new xt3d.Map3dTools.EntityDraw(this.viewer);
            this.entityDraw.DrawEndEvent.addEventListener((result, positions) => {
                result.remove();
                this.addLabel(positions[0]);
            })
        },

        //添加标注
        addLabel(position) {
            const plotType = this.labelType == 0 ? "simplelabel" : "gradientslabel";
            var geoFeature = {
                type: "Feature",
                properties: {
                    plotCode: xt3d.LabelPlotting.getPlotCode(),
                    plotType: plotType,
                    attr: {
                        label: "标注内容",
                    }
                },
                geometry: {
                    type: "Point",
                    coordinates: xt3d.LabelPlotting.cartesian3ToCoordinates(position)
                }
            };
            this.labelLayer.addPlot(geoFeature);
        },

        //激活绘制工具
        drawActivate(type) {
            this.labelType = type;
            this.entityDraw.activate("Point");
        },

        //保存内容
        savePlots() {
            const features = [];
            this.labelLayer.plots.forEach(plot => {
                features.push(plot.toGeoJson());
            })
            let geojson = {
                "type": "FeatureCollection",
                "features": features
            }
            let data = JSON.stringify(geojson);

            var blob = new Blob([data], {
                type: 'text/json'
            });
            var e = document.createEvent('MouseEvents');
            var a = document.createElement('a');
            a.download = new Date().getTime() + ".json";
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        },

        //清空所有
        clear() {
            this.labelLayer.clear();
        },

        //加载3dtiles数据
        load3dtiles() {
            var tileset = this.viewer.scene.primitives.add(
                    new Cesium.Cesium3DTileset({
                        url: "http://www.xt3d.cn/data/offset_3dtiles/tileset.json",
                    })
            );

            tileset.readyPromise
                    .then(tileset => {
                        this.viewer.zoomTo(
                                tileset,
                        );
                        xt3d.TilesetPlugin.setTilesetHeight(tileset, 55);
                    })
                    .otherwise(function (error) {
                        console.log(error);
                    });
        },

        destroy() {
            this.viewer.entities.removeAll();
            this.viewer.imageryLayers.removeAll(true);
            this.viewer.destroy();
        }
    }

    xt3dInit.init("map3d");

    function drawActivate(type) {
        xt3dInit.drawActivate(type);
    }

    function clearDraw() {
        xt3dInit.clear();
    }

    function save() {
        xt3dInit.savePlots();
    }
</script>
</body>

</html>

```

视频融合

```html
 <!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>cesium|xt3d</title>
    <!-- 引入Cesium -->
    <script src="https://unpkg.com/cesium@1.84.0/Build/Cesium/Cesium.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/cesium@1.84.0/Build/Cesium/Widgets/widgets.css">

    <script src='http://www.xt3d.cn/libs/turf.min.js'></script>

    <!-- 使用vue绑定控件 -->
    <script src="https://unpkg.com/vue@2.6.14/dist/vue.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/element-ui@2.15.5/lib/theme-chalk/index.css">
    <script src="https://unpkg.com/element-ui@2.15.5/lib/index.js"></script>

    <!--  引入xt3d -->
    <script src="http://www.xt3d.cn/xt3dlib/xt3d.min.js"></script>
    <style>
        html,
        body,
        #map3d {
            width: 100%;
            height: 100%;
            margin: 0px;
            padding: 0px;
        }

        .form-container {
            position: absolute;
            left: 10px;
            top: 90px;
            padding: 10px 15px;
            border-radius: 4px;
            border: 1px solid rgba(128, 128, 128, 0.5);
            color: #ffffff;
            background: rgba(0, 0, 0, 0.4);
            box-shadow: 0 3px 14px rgb(128 128 128 / 50%);
            max-width: 300px;
        }

        button {
            background: transparent;
            border: 1px solid #00d0ffb8;
            color: white;
            padding: 7px 9px;
            border-radius: 2px;
            margin: 3px;
            cursor: pointer
        }

        .el-form-item__label {
            color: white;
        }
    </style>
</head>

<body>
<div id="map3d"></div>

<div class="form-container">
    <video id="video" muted="muted" width="300" controls height="220" src="/data.xt3d.cn/assets/lukou.mp4"
           autoplay="autoplay" loop></video>

    <div id="formContainer">
        <el-form ref="form" :model="form" label-width="60px" label-position="left" size="mini">
            <el-form-item label="翻转">
                <el-slider v-model="form.rotation.x" :show-tooltip="true" @input="valueChange" :min="-180"
                           :max="180"></el-slider>
            </el-form-item>
            <el-form-item label="旋转">
                <el-slider v-model="form.rotation.y" :show-tooltip="true" @input="valueChange" :min="-360"
                           :max="360"></el-slider>
            </el-form-item>
            <el-form-item label="夹角">
                <el-slider v-model="form.fov" :show-tooltip="true" @input="valueChange" :min="1" :max="90"></el-slider>
            </el-form-item>

            <el-form-item label="透明">
                <el-slider v-model="form.alpha" :show-tooltip="true" @input="valueChange" :step="0.1" :min="0"
                           :max="1"></el-slider>
            </el-form-item>
            <el-form-item label="投影线">
                <el-switch v-model="form.debugFrustum" @change="setFrustumVisible" active-color="#13ce66"
                           inactive-color="#ff4949"></el-switch>
            </el-form-item>
        </el-form>
    </div>
</div>
<script>
    let xt3dInit = {
        init(el) {
            this.initViewer(el);
            this.load3dtiles();
            this.setView();
        },

        //初始化viewer
        initViewer(el) {
            this.viewer = new Cesium.Viewer(el, {
                infoBox: false,
                selectionIndicator: false,
                navigation: false,
                animation: false,
                shouldAnimate: false,
                timeline: false,
                baseLayerPicker: false,
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                navigationHelpButton: false,
                imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
                })
            });
            this.viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false
        },

        //设置视角
        setView() {
            let flyToOpts = {
                destination: {
                    x: -1715364.449942997,
                    y: 4993248.386956065,
                    z: 3566686.6600144217
                },
                orientation: {
                    heading: 6.005026929302029,
                    pitch: -1.1614799523621118,
                    roll: 6.281017982608725
                },
                duration: 1
            };
            this.viewer.scene.camera.setView(flyToOpts);
        },

        //加载三维模型
        load3dtiles() {
            let tileset = this.viewer.scene.primitives.add(
                    new Cesium.Cesium3DTileset({
                        url: "http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json"
                    })
            );

            tileset.readyPromise
                    .then(tileset => {
                        xt3d.TilesetPlugin.setTilesetHeight(tileset, 20);
                    })
                    .otherwise(function (error) {
                        console.log(error);
                    });
        },

        destroy() {
            this.viewer.entities.removeAll();
            this.viewer.imageryLayers.removeAll(true);
            this.viewer.destroy();
        }
    }

    xt3dInit.init("map3d");


    let videoEl = document.getElementById("video"); //播放成功的video标签
    let videoShed3d = new xt3d.VideoPlugin.VideoShed3d(xt3dInit.viewer, {
        video: videoEl,
        position: {
            x: 108.95941714166067,
            y: 34.219812715439865,
            z: 72.01781951233912
        },
        //旋转参数
        rotation: {
            x: -53,
            y: 3,
            z: 0
        },
        near: 0,
        far: 240, //距离
        fov: 12, //张角
        aspectRatio: 1,
        alpha: 1, //透明
        debugFrustum: true //是否显示投影线
    });

    //界面控制
    let vm = new Vue({
        el: "#formContainer",
        data() {
            return {
                form: {
                    rotation: {}
                }
            }
        },

        methods: {
            valueChange() {
                videoShed3d.updateStyle(this.form);
            },

            setFrustumVisible() {
                videoShed3d.setFrustumVisible(this.form.debugFrustum);
            }
        }
    })

    vm.form = videoShed3d.getStyle();
</script>
</body>

</html>

```

鼠标移入一个实体，显示一个消息提示，鼠标离开隐藏消息提示？


