module.exports = {

"[project]/.next-internal/server/app/machineRoom/page/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/machineRoom/MachineRoom.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>MachineRoom)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$controls$2f$OrbitControls$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/controls/OrbitControls.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/loaders/GLTFLoader.js [app-rsc] (ecmascript)");
;
;
;
// GLTF 模型加载器
const gltfLoader = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GLTFLoader"]();
//射线投射器，可基于鼠标点和相机，在世界坐标系内建立一条射线，用于选中模型
const raycaster = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Raycaster"]();
//鼠标在裁剪空间中的点位
const pointer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Vector2"]();
class MachineRoom {
    // 渲染器
    renderer;
    // 场景
    scene;
    // 相机
    camera;
    // 相机轨道控制器
    controls;
    // 存放模型文件的目录
    modelPath;
    // 纹理集合
    maps = new Map();
    // 机柜集合
    cabinets = [];
    // 鼠标划入的机柜
    curCabinet;
    //鼠标划入机柜事件，参数为机柜对象
    onMouseOverCabinet = (cabinet)=>{};
    //鼠标在机柜上移动的事件，参数为鼠标在canvas画布上的坐标位
    onMouseMoveCabinet = (x, y)=>{};
    //鼠标划出机柜的事件
    onMouseOutCabinet = ()=>{};
    // 初始化场景
    // constructor(canvas: HTMLCanvasElement, modelPath: string = "https://ycyy-cdn.oss-cn-beijing.aliyuncs.com/") {
    constructor(canvas, modelPath = "/models/machineRoom/"){
        this.renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
            canvas
        });
        this.scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Scene"]();
        this.camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PerspectiveCamera"](45, canvas.width / canvas.height, 0.1, 1000);
        this.camera.position.set(0, 10, 15);
        this.camera.lookAt(0, 0, 0);
        this.controls = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$controls$2f$OrbitControls$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["OrbitControls"](this.camera, this.renderer.domElement);
        this.modelPath = modelPath;
        this.crtTexture("cabinet-hover.jpg");
    }
    // 加载GLTF模型
    loadGLTF(modelName) {
        gltfLoader.load(this.modelPath + modelName, ({ scene: { children } })=>{
            children.forEach((obj)=>{
                const { map, color } = obj.material;
                this.changeMat(obj, map, color);
                if (obj.name.includes("cabinet")) {
                    this.cabinets.push(obj);
                }
            });
            this.scene.add(...children);
        });
    }
    // 修改材质
    // 为什么修改材质？因为浏览器加载模型后偏暗
    changeMat(obj, map, color) {
        if (map) {
            obj.material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                map: this.crtTexture(map.name)
            });
        } else {
            obj.material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                color
            });
        }
    }
    // 建立纹理对象
    crtTexture(imgName) {
        let curTexture = this.maps.get(imgName);
        if (!curTexture) {
            curTexture = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TextureLoader"]().load(this.modelPath + imgName);
            curTexture.flipY = false;
            curTexture.wrapS = 1000;
            curTexture.wrapT = 1000;
            this.maps.set(imgName, curTexture);
        }
        return curTexture;
    }
    // 选择机柜
    selectCabinet(x, y) {
        const { cabinets, renderer, camera, maps, curCabinet } = this;
        const { width, height } = renderer.domElement;
        // 鼠标的canvas坐标转裁剪坐标
        pointer.set(x / width * 2 - 1, -(y / height) * 2 + 1);
        // 基于鼠标点的裁剪坐标位和相机设置射线投射器
        raycaster.setFromCamera(pointer, camera);
        // 选择机柜
        const intersect = raycaster.intersectObjects(cabinets)[0];
        let intersectObj = intersect ? intersect.object : null;
        // 若之前已有机柜被选择，且不等于当前所选择的机柜，取消之前选择的机柜的高亮
        if (curCabinet && curCabinet !== intersectObj) {
            const material = curCabinet.material;
            material.setValues({
                map: maps.get("cabinet.jpg")
            });
        }
        /*
    若当前所选对象不为空：
      触发鼠标在机柜上移动的事件。
      若当前所选对象不等于上一次所选对象：
        更新curCabinet。
        将模型高亮。
        触发鼠标划入机柜事件。
    否则若上一次所选对象存在：
      置空curCabinet。
      触发鼠标划出机柜事件。
    */ if (intersectObj) {
            this.onMouseMoveCabinet(x, y);
            if (intersectObj !== curCabinet) {
                this.curCabinet = intersectObj;
                const material = intersectObj.material;
                material.setValues({
                    map: maps.get("cabinet-hover.jpg")
                });
                this.onMouseOverCabinet(intersectObj);
            }
        } else if (curCabinet) {
            this.curCabinet = null;
            this.onMouseOutCabinet();
        }
    }
    // 连续渲染
    animate() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(()=>{
            this.animate();
        });
    }
}
}}),
"[project]/src/app/machineRoom/api.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
// const path = "http://127.0.0.1:4523/mock/772752/cabinet/";
__turbopack_context__.s({
    "getCabinetByName": (()=>getCabinetByName)
});
const path = 'https://mock.apifox.cn/m1/772752-0-default/cabinet/';
function getCabinetByName(name) {
    return fetch(path + name).then((res)=>res.json());
}
;
}}),
"[project]/src/app/machineRoom/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$machineRoom$2f$MachineRoom$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/machineRoom/MachineRoom.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$machineRoom$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/machineRoom/api.ts [app-rsc] (ecmascript)");
;
;
;
;
//机房对象
let room;
// 画布
let canvas;
class MachineRoomPage extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].Component {
    state = {
        //信息面板的位置
        planePos: {
            left: 0,
            top: 0
        },
        // 信息面板的可见性
        planeDisplay: "none",
        // 当前机柜的详细信息
        curCabinet: {
            // 名称
            name: "Loading……",
            // 温度
            temperature: 0,
            // 容量
            capacity: 0,
            // 服务器数量
            count: 0
        }
    };
    // 组件挂载完成后，实例化机房对象，渲染机房
    componentDidMount() {
        if (!canvas) {
            return;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        room = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$machineRoom$2f$MachineRoom$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"](canvas);
        room.loadGLTF("machineRoom.gltf");
        room.animate();
        //当鼠标划入机柜，显示信息面板
        room.onMouseOverCabinet = ({ name })=>{
            this.setState({
                planeDisplay: "block"
            });
            //基于cabinet.name 获取机柜数据
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$machineRoom$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCabinetByName"])(name).then(({ temperature, capacity, count })=>{
                this.setState({
                    curCabinet: {
                        name,
                        temperature,
                        capacity,
                        count
                    }
                });
            });
        };
        //当鼠标在机柜上移动，让信息面板随鼠标移动
        room.onMouseMoveCabinet = (left, top)=>{
            this.setState({
                planePos: {
                    left,
                    top
                }
            });
        };
        //当鼠标划出机柜，隐藏信息面板
        room.onMouseOutCabinet = ()=>{
            this.setState({
                planeDisplay: "none"
            });
        };
    }
    // 鼠标移动事件
    mouseMove({ clientX, clientY }) {
        room.selectCabinet(clientX, clientY);
    }
    // 建立canvas 画布，并通过ref 获取其HTMLCanvasElement对象
    render() {
        const { planePos: { left, top }, planeDisplay: display, curCabinet: { name, temperature, capacity, count } } = this.state;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "App",
            onMouseMove: this.mouseMove,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                    id: "canvas",
                    ref: (ele)=>canvas = ele
                }, void 0, false, {
                    fileName: "[project]/src/app/machineRoom/page.tsx",
                    lineNumber: 76,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "plane",
                    style: {
                        left,
                        top,
                        display
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "机柜名称：",
                                name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/machineRoom/page.tsx",
                            lineNumber: 78,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "机柜温度：",
                                temperature,
                                "°"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/machineRoom/page.tsx",
                            lineNumber: 79,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "使用情况：",
                                count,
                                "/",
                                capacity
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/machineRoom/page.tsx",
                            lineNumber: 80,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/machineRoom/page.tsx",
                    lineNumber: 77,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/machineRoom/page.tsx",
            lineNumber: 75,
            columnNumber: 13
        }, this);
    }
}
const __TURBOPACK__default__export__ = MachineRoomPage;
}}),
"[project]/src/app/machineRoom/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/machineRoom/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=_743413bb._.js.map