/* 
attributes 数据结构:{
  a_Position: {
    size: 3,
    index:0
  }
}

  - a_Position 对应attribute变量名
  - size 系列尺寸
  - index 系列的元素索引位置

uniforms 数据结构:{
  u_Color: {
    type: 'uniform1f',
    value:1
  },
}

  - u_Color 对应uniform变量名
  - type uniform变量的修改方法
  - value uniform变量的值

maps 数据结构:{
  u_Sampler:{
    image,
    format,
    wrapS,
    wrapT,
    magFilter,
    minFilter
  },
}


- image 图形源
- format 数据类型，默认gl.RGB
- wrapS 对应纹理对象的TEXTURE_WRAP_S 属性
- wrapT 对应纹理对象的TEXTURE_WRAP_T 属性
- magFilter 对应纹理对象的TEXTURE_MAG_FILTER 属性
- minFilter对应纹理对象的TEXTURE_MIN_FILTER属性
*/



/*
- source 数据源
- sourceSize 顶点数量，数据源尺寸
- elementBytes 元素字节数
- categorySize 类目尺寸
- attributes attribute属性集合


 */
const defAttr = () => ({
    gl: null,
    type: 'POINTS',
    source: [],
    sourceSize: 0,
    elementBytes: 4,
    categorySize: 0,
    attributes: {},
    uniforms: {},
    maps: {}
})
export default class Poly {
    constructor(attr) {
        Object.assign(this, defAttr(), attr)
        this.init()
    }

    init() {
        if (!this.gl) {
            return
        }
        this.calculateSize()
        this.updateAttribute();
        this.updateUniform();
        this.updateMaps()
    }

    calculateSize() {
        const {attributes, elementBytes, source} = this
        let categorySize = 0
        Object.values(attributes).forEach(ele => {
            const {size, index} = ele
            categorySize += size
            ele.byteIndex = index * elementBytes
        })
        this.categorySize = categorySize
        this.categoryBytes = categorySize * elementBytes
        this.sourceSize = source.length / categorySize
    }

    updateAttribute() {
        const {gl, attributes, categoryBytes, source} = this
        const sourceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sourceBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(source), gl.STATIC_DRAW)
        for (let [key, {size, byteIndex}] of Object.entries(attributes)) {
            const attr = gl.getAttribLocation(gl.program, key)
            gl.vertexAttribPointer(
                attr,
                size,
                gl.FLOAT,
                false,
                categoryBytes,
                byteIndex
            )
            gl.enableVertexAttribArray(attr)
        }
    }

    updateUniform() {
        const {gl, uniforms} = this
        for (let [key, val] of Object.entries(uniforms)) {
            const {type, value} = val
            const u = gl.getUniformLocation(gl.program, key)
            if (type.includes('Matrix')) {
                gl[type](u, false, value)
            } else {
                gl[type](u, value)
            }
        }
    }

    updateMaps() {
        const {gl, maps} = this
        Object.entries(maps).forEach(([key, val], ind) => {
            const {
                format = gl.RGB,
                image,
                wrapS,
                wrapT,
                magFilter,
                minFilter
            } = val

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
            gl.activeTexture(gl[`TEXTURE${ind}`])
            const texture = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D, texture)

            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                format,
                format,
                gl.UNSIGNED_BYTE,
                image
            )

            wrapS && gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                wrapS
            )
            wrapT && gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                wrapT
            )

            magFilter && gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MAG_FILTER,
                magFilter
            )

            if (!minFilter || minFilter > 9729) {
                gl.generateMipmap(gl.TEXTURE_2D)
            }

            minFilter && gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MIN_FILTER,
                minFilter
            )

            const u = gl.getUniformLocation(gl.program, key)
            gl.uniform1i(u, ind)
        })
    }

    draw(type = this.type) {
        const {gl, sourceSize} = this
        gl.drawArrays(gl[type], 0, sourceSize);
    }
}