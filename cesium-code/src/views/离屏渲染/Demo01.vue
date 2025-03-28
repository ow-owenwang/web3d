<script setup lang="ts">
/*
在上一节我们通过翻转的方式，将FBO的内容正确地绘制到canvas上，在渲染场景到FBO时，我们使用的Scene类中的render方法里面的代码，代码中其实有些可能是我们不需要的，比如有时我们的离屏渲染可能并不需要天空、大气、甚至连地球也不需要，那我们可以在离屏渲染时将这些对象隐藏掉，以节省程序的性能开销。

 */

function renderToFbo(fbo, scene) {
  const frameState = scene._frameState;
  scene.globe.show=false;
  const context = scene.context;
  const us = context.uniformState;
  const view = scene._defaultView;
  scene._view = view;
  scene.updateFrameState();
  frameState.passes.render = true;
  frameState.passes.postProcess = scene.postProcessStages.hasSelected;
  frameState.tilesetPassState = renderTilesetPassState;
  let backgroundColor = defaultValue(scene.backgroundColor, Color.BLACK);
  // if (scene._hdr) {
  //     backgroundColor = Color.clone(backgroundColor, scratchBackgroundColor);
  //     backgroundColor.red = Math.pow(backgroundColor.red, scene.gamma);
  //     backgroundColor.green = Math.pow(backgroundColor.green, scene.gamma);
  //     backgroundColor.blue = Math.pow(backgroundColor.blue, scene.gamma);
  // }
  frameState.backgroundColor = backgroundColor;
  frameState.atmosphere = scene.atmosphere;
  scene.fog.update(frameState);
  us.update(frameState);
  // const shadowMap = scene.shadowMap;
  // if (defined(shadowMap) && shadowMap.enabled) {
  //     if (!defined(scene.light) || scene.light instanceof SunLight) {
  //         // Negate the sun direction so that it is from the Sun, not to the Sun
  //         Cartesian3.negate(us.sunDirectionWC, scene._shadowMapCamera.direction);
  //     } else {
  //         Cartesian3.clone(scene.light.direction, scene._shadowMapCamera.direction);
  //     }
  //     frameState.shadowMaps.push(shadowMap);
  // }
  scene._computeCommandList.length = 0;
  scene._overlayCommandList.length = 0;
  const viewport = view.viewport;
  viewport.x = 0;
  viewport.y = 0;
  viewport.width = context.drawingBufferWidth;
  viewport.height = context.drawingBufferHeight;
  const passState = view.passState;
  passState.framebuffer = fbo;
  passState.blendingEnabled = undefined;
  passState.scissorTest = undefined;
  passState.viewport = BoundingRectangle.clone(viewport, passState.viewport);
  // if (defined(scene.globe)) {
  //     scene.globe.beginFrame(frameState);
  // }
  // scene.updateEnvironment();
  scene.updateAndExecuteCommands(passState, backgroundColor);
  scene.resolveFramebuffers(passState);
  passState.framebuffer = undefined;
  //executeOverlayCommands(scene, passState);
  // if (defined(scene.globe)) {
  //     scene.globe.endFrame(frameState);
  //     if (!scene.globe.tilesLoaded) {
  //         scene._renderRequested = true;
  //     }
  // }
  context.endFrame();
  scene.globe.show = true;
}


</script>

<template>

</template>

<style scoped>

</style>
