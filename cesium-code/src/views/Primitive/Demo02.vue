<script setup lang="ts">
var buildingHighlight1, buildingHighlight2
function addBoxClassificationPrimitive () {
  let length = 39.0, width = 18.0, height = 4.0, baseHeight = -14.5 //楼的长宽高和基地高
  let center = { //楼中心点位置
        x: -2025016.752089428,
        y: 5532291.539549444,
        z: 2436368.8372620787
      },
      modelMatrix = Transforms.eastNorthUpToFixedFrame(center);
  hprRotation = Matrix3.fromHeadingPitchRoll(
      new HeadingPitchRoll(Math.toRadians(-6), 0.0, 0.0)
  );
  hpr = Matrix4.fromRotationTranslation(
      hprRotation,
      new Cartesian3(0.0, 0.0, baseHeight) //楼层高度上的偏移
  );
  Matrix4.multiply(modelMatrix, hpr, modelMatrix);
  buildingHighlight1 = viewer.scene.primitives.add(
      new ClassificationPrimitive({
            geometryInstances: new GeometryInstance({
              geometry: BoxGeometry.fromDimensions({
                vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
                dimensions: new Cartesian3(length, width, height),
              }),
              modelMatrix: modelMatrix,
              attributes: {
                color: ColorGeometryInstanceAttribute.fromColor(
                    new Color(1.0, 0.0, 0.0, 0.5)设置高亮颜色
            ),
            show: new ShowGeometryInstanceAttribute(true),设置初始化后是否显示
          },
          id: "BoxClassificationPrimitive1",
}),
  classificationType: ClassificationType.CESIUM_3D_TILE,//只绘制在3dtiles上
})
);
  let modelMatrix2 = Transforms.eastNorthUpToFixedFrame(center);
  hpr = Matrix4.fromRotationTranslation(
      hprRotation,
      new Cartesian3(0.0, 0.0, baseHeight + height)
  );
  Matrix4.multiply(modelMatrix2, hpr, modelMatrix2);
  buildingHighlight2 = viewer.scene.primitives.add(
      new ClassificationPrimitive({
        geometryInstances: new GeometryInstance({
          geometry: BoxGeometry.fromDimensions({
            vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
            dimensions: new Cartesian3(39.0, 18.0, 4.0),
          }),
          modelMatrix: modelMatrix2,
          attributes: {
            color: ColorGeometryInstanceAttribute.fromColor(
                new Color(0.0, 1.0, 0.0, 0.5)
            ),
            show: new ShowGeometryInstanceAttribute(true),设置初始化后是否显示
          },
          id: "BoxClassificationPrimitive2",
        }),
        classificationType: ClassificationType.CESIUM_3D_TILE,//只绘制在3dtiles上
      })
  );
}
</script>

<template>

</template>

<style scoped>

</style>
