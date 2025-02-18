import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "cesium/Build/Cesium/Widgets/widgets.css";

createApp(App).use(router).mount("#app");
