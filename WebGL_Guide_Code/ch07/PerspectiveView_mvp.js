// PerspectiveView_mvp.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex coordinates and color (the blue triangle is in the front)
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Get the storage locations of u_ModelMatrix, u_ViewMatrix, and u_ProjMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if (!u_ModelMatrix || !u_ViewMatrix || !u_ProjMatrix) { 
    console.log('Failed to Get the storage locations of u_ModelMatrix, u_ViewMatrix, and/or u_ProjMatrix');
    return;
  }

  var modelMatrix = new Matrix4(); // The models matrix
  var viewMatrix = new Matrix4();  // The view matrix
  var projMatrix = new Matrix4();  // The projection matrix

  // Calculate the view matrix and the projection matrix
  modelMatrix.setTranslate(0.75, 0, 0);  // Translate 0.75 units along the positive x-axis
  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
  projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  // Pass the models, view, and projection matrix to the uniform variable respectively
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles

  // Prepare the models matrix for another pair of triangles
  modelMatrix.setTranslate(-0.75, 0, 0); // Translate 0.75 units along the negative x-axis
  // Modify only the models matrix
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // Vertex coordinates and color
     0.0,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
    -0.5, -1.0,  -4.0,  0.4,  1.0,  0.4,
     0.5, -1.0,  -4.0,  1.0,  0.4,  0.4, 

     0.0,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
    -0.5, -1.0,  -2.0,  1.0,  1.0,  0.4,
     0.5, -1.0,  -2.0,  1.0,  0.4,  0.4, 

     0.0,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
    -0.5, -1.0,   0.0,  0.4,  0.4,  1.0,
     0.5, -1.0,   0.0,  1.0,  0.4,  0.4, 
  ]);
  var n = 9;

  // Create a buffer object
  var vertexColorbuffer = gl.createBuffer();  
  if (!vertexColorbuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write the vertex information and enable it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  // Assign the buffer object to a_Position and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  // Assign the buffer object to a_Color and enable the assignment
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  return n;
}
