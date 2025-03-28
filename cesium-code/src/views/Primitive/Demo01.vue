<script setup lang="ts">
import {BoxOutlineGeometry, CircleOutlineGeometry} from "cesium";

var material = Material.fromType('Color');
material.uniforms.color = new Color(1.0, 1.0, 1.0, 0.3);//白色透明度0.3
var center = Cartesian3.fromDegrees(107.941991, 26.917029, 18000)
var dimensions = new Cartesian3(19000.0, 9000.0, 3000.0)//盒子的长、宽、高
function addBoxGeometry () {
  var modelMatrix = Transforms.eastNorthUpToFixedFrame(center);
  var hprRotation = Matrix3.fromHeadingPitchRoll(
      new HeadingPitchRoll(Math.toRadians(90), 0.0, 0.0)// 中心点水平旋转90度
  );
  var hpr = Matrix4.fromRotationTranslation(
      hprRotation,
      new Cartesian3(0.0, 0.0, 0.0)// 不平移
  );
  Matrix4.multiply(modelMatrix, hpr, modelMatrix);
  viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: BoxGeometry.fromDimensions({
            vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
            dimensions: dimensions,
          }),
          // geometry: BoxOutlineGeometry.fromDimensions({}),
          modelMatrix: modelMatrix,
          id: "BoxGeometry"
        }),
        appearance: new EllipsoidSurfaceAppearance({
          aboveGround: false,
          material: material
        })
      })
  );
}


function addRectangleGeometry () {
  let rectangle = Rectangle.fromDegrees(
      107.941991, 25.917029,
      118.941991, 28.917029,
  )
  console.log(rectangle.height)
  let geometryInstances = new GeometryInstance({
    geometry: new RectangleGeometry({
      rectangle: rectangle,
      vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT,
      height: 120000,
    }),
  })
  viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: geometryInstances,
        appearance: new EllipsoidSurfaceAppearance({
          aboveGround: false,
          material: material
        })
      })
  );
}

function addCircleGeometry () {
  viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: new CircleGeometry({
            center: center,
            radius: 2000000,
            // height: 120000, //矩形离椭球体的高度
            numberOfVerticalLines: 16 // 圆的边线条数，越多圆的形状越光滑
          }),
          // geometry: CircleOutlineGeometry({}),
          id: "CircleGeometry"
        }),
        appearance: new EllipsoidSurfaceAppearance({
          aboveGround: false,
          material: material
        })
      })
  );
}

function addCylinderGeometry () {
  var modelMatrix = Transforms.eastNorthUpToFixedFrame(center);
  var hprRotation = Matrix3.fromHeadingPitchRoll(
      new HeadingPitchRoll(0.0, Math.toRadians(30), 0.0)// 中心点水平旋转90度
  );
  var hpr = Matrix4.fromRotationTranslation(
      hprRotation,
      new Cartesian3(0.0, 0.0, 20000.0)// 不平移
  );
  Matrix4.multiply(modelMatrix, hpr, modelMatrix);
  viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: new CylinderGeometry({
            length: 20000,
            topRadius: 5000,
            bottomRadius: 10000
          }),
          id: "CircleGeometry"
        }),
        modelMatrix: modelMatrix,
        appearance: new EllipsoidSurfaceAppearance({
          aboveGround: false,
          material: material
        })
      })
  );
}

function addEllipseGeometry () {
  var center = Cartesian3.fromDegrees(108.941991, 26.917029)
  viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: new EllipseGeometry({
            center: center,//心中位置
            semiMajorAxis: 10000,//椭圆长半轴
            semiMinorAxis: 5000,//椭圆短半轴
            height: 13000,//	离椭球体的高度
            extrudedHeight: 0,// 拉伸高度.
            rotation: Math.toRadians(30),//顺时针偏北角度
            stRotation: 0,
          }),
          id: "EllipseGeometry"
        }),
        appearance: new EllipsoidSurfaceAppearance({
          aboveGround: false,
          material: material
        })
      })
  );
}


function addPolygonGeometry (withOutline = true) {
  let height = 12000
  let polygonHierarchy = new PolygonHierarchy(
      Cartesian3.fromDegreesArray([
        104.041991, 22.117029,
        104.441991, 21.817029,
        105.041991, 22.817029,
        104.541991, 23.817029,
        104.081991, 22.417029
      ]))
  let polygonGeometry = new PolygonGeometry({
    polygonHierarchy: polygonHierarchy,
    height: height,
    id: "PolygonGeometry"
  })
  viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: polygonGeometry,
        }),
        appearance: new EllipsoidSurfaceAppearance({
          aboveGround: false,
          material: material
        })
      })
  );
  if (withOutline) {
    let polygonOutlineGeometry = new PolygonOutlineGeometry({
      polygonHierarchy: polygonHierarchy,
      height: height,
      id: "PolygonOutlineGeometry"
    })
    viewer.scene.primitives.add(
        new Primitive({
          geometryInstances: new GeometryInstance({
            geometry: polygonOutlineGeometry,
          }),
          appearance: new EllipsoidSurfaceAppearance({
            aboveGround: false,
            material: outlineMaterial
          })
        })
    );
  }
}

function addPolylineGeometry () {
  let ps = Cartesian3.fromDegreesArrayHeights([
    104.041991, 22.117029, 12000,
    104.441991, 21.817029, 12000,
    105.041991, 22.817029, 35000,
    104.541991, 23.817029, 12000,
    104.081991, 22.417029, 13000,
  ])
  let polylineGeometry = new PolylineGeometry({
    positions: ps,
    width: 5,
    id: "polylineGeometry"
  })
  viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: polylineGeometry,
        }),
        // vertexFormat: PolylineColorAppearance.VERTEX_FORMAT,
        appearance: new PolylineColorAppearance({
          aboveGround: false,
          material: outlineMaterial
        })
      })
  );
}

function addSimplePolylineGeometry () {
  let ps = Cartesian3.fromDegreesArrayHeights([
    104.141991, 22.117029, 12000,
    104.341991, 21.917029, 12000,
    104.831991, 22.817029, 35000,
    104.441991, 23.817029, 12000,
    104.061991, 22.417029, 13000,
  ])
  let polylineGeometry = new SimplePolylineGeometry({
    positions: ps,
    width: 5,
    id: "SimplePolylineGeometry"
  })
  viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: polylineGeometry,
        }),
        appearance: new EllipsoidSurfaceAppearance({
          aboveGround: false,
          material: outlineMaterial
        })
      })
  );
}

function addPolylineVolumeGeometry (withOutline = true) {
  let ps = Cartesian3.fromDegreesArrayHeights([
    104.141991, 22.117029, 42000,
    104.341991, 21.917029, 42000,
    104.831991, 22.817029, 45000,
    104.441991, 23.817029, 42000,
    104.061991, 22.417029, 43000,
  ])
  let shape = computeCircle(700, 12)
  let polylineVolumeGeometry = new PolylineVolumeGeometry({
    polylinePositions: ps,
    shapePositions: shape,
    id: "PolylineVolumeGeometry"
  })
  viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: polylineVolumeGeometry,
        }),
        appearance: new EllipsoidSurfaceAppearance({
          aboveGround: false,
          material: material
        })
      })
  );
  if (withOutline) {
    let polylineVolumeOutlineGeometry = new PolylineVolumeOutlineGeometry({
      polylinePositions: ps,
      shapePositions: shape,
      id: "PolylineVolumeOutlineGeometry"
    })
    viewer.scene.primitives.add(
        new Primitive({
          geometryInstances: new GeometryInstance({
            geometry: polylineVolumeOutlineGeometry,
          }),
          appearance: new EllipsoidSurfaceAppearance({
            aboveGround: false,
            material: outlineMaterial
          })
        })
    );
  }
}

function addGroundPolylineGeometry () {
  var instance = new GeometryInstance({
    geometry: new GroundPolylineGeometry({
      positions: Cartesian3.fromDegreesArray([
        107.141991, 26.117029,
        107.341991, 25.917029,
        107.831991, 26.817029,
        107.441991, 27.817029,
        107.061991, 26.417029
      ]),
      width: 4.0
    }),
    id: 'GroundPolylineGeometry',
    attributes: {
      color: ColorGeometryInstanceAttribute.fromColor(Color.AQUA)
    }
  });
  viewer.scene.groundPrimitives.add(new GroundPolylinePrimitive({
    geometryInstances: instance,
    classificationType: ClassificationType.BOTH,
    appearance: new PolylineColorAppearance()
  }));
}


function addWallGeometry (withOutline = true) {
  let ps = Cartesian3.fromDegreesArray([
    107.041991, 22.117029,
    107.441991, 21.817029,
    109.041991, 22.817029,
    107.541991, 23.817029,
    107.081991, 22.417029
  ])
  let shape = computeCircle(700, 12)
  let wallGeometry = new WallGeometry({
    positions: ps,
    maximumHeights: [20000, 30000, 40000, 20000, 30000],
    minimumHeights: [0, 0, 0, 0, 0],
    id: "WallGeometry"
  })
  viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: wallGeometry,
        }),
        appearance: new EllipsoidSurfaceAppearance({
          aboveGround: false,
          material: material
        })
      })
  );
  if (withOutline) {
    let wallGeometry = new WallOutlineGeometry({
      positions: ps,
      maximumHeights: [20000, 30000, 40000, 20000, 30000],
      minimumHeights: [0, 0, 0, 0, 0],
      id: "WallGeometry"
    })
    viewer.scene.primitives.add(
        new Primitive({
          geometryInstances: new GeometryInstance({
            geometry: wallGeometry,
          }),
          appearance: new EllipsoidSurfaceAppearance({
            aboveGround: false,
            material: outlineMaterial
          })
        })
    );
  }
}


function invertClassification (checked) {
  let scene = viewer.scene
  if (checked && !scene.invertClassificationSupported) {
    window.alert("This browser does not support invert classification");
  }

  scene.invertClassification = checked;
  scene.invertClassificationColor = new Color(
      0.15,
      0.15,
      0.15,
      1.0,
  );
  let v = ShowGeometryInstanceAttribute.toValue(!checked);
  let attr = buildingHighlight1.getGeometryInstanceAttributes("BoxClassificationPrimitive1")
  attr.show = v;
  attr = buildingHighlight2.getGeometryInstanceAttributes("BoxClassificationPrimitive2")
  attr.show = v;

}


var handler = new ScreenSpaceEventHandler(scene.canvas);
handler.setInputAction(function (movement) {
  checked = !checked
  invertClassification(checked)
  var pickedObject = scene.pick(movement.position);
  if (defined(pickedObject) && defined(pickedObject.id)) {
    modelid = pickedObject.id
  }
})
</script>

<template>

</template>

<style scoped>

</style>
