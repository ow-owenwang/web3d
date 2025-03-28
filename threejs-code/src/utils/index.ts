
/*
使用经纬度或墨卡托来渲染，如果是世界地图的话会有明显的视觉差异，尤其是接近极地的区域。
如果只是某个城市，区别不是很大。
 */
export function lonLat2Mercator(E, N) {
    const x = E * 20037508.34 / 180
    let y = Math.log(Math.tan((90 + N) * Math.PI / 360)) / (Math.PI / 180)
    y = y * 20037508.34 / 180
    return {
        x,
        y
    }
}
