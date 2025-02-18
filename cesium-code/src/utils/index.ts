import { Ion, Viewer } from "cesium";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiODM2NzczYS04NDhmLTQyNTYtYjkwOS0zODdiODlmOWYzY2QiLCJpZCI6MjYyMzk1LCJpYXQiOjE3MzQxNjE1NzV9.QDNVMAkaZB66ctF29zEO8njoVdxykBprPqVesf5e-aM";

export function createViewer(
  domEl: string = "cesiumContainer",
  options?: Viewer.ConstructorOptions
) {
  Ion.defaultAccessToken = ACCESS_TOKEN;

  // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
  return new Viewer(domEl, options);
}
