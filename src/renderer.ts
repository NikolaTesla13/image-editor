const gl_matrix = require("gl-matrix");

const readFile = async (path: string) => {
  const fsPromises = require("fs").promises;
  const data = await fsPromises
    .readFile(path)
    .catch((err: any) => console.error("Failed to read file", err));

  return data.toString();
};

const mat4 = gl_matrix.mat4;
const glMatrix = gl_matrix.glMatrix;
const vec3 = gl_matrix.vec3;

const main = async () => {
  const canvas = <HTMLCanvasElement>document.getElementById("glCanvas");
  const gl: WebGLRenderingContext = canvas.getContext("webgl");

  let scale = 20; // 10 - 110

  canvas.onwheel = (event) => {
    event.preventDefault();

    scale += event.deltaY * -0.1;
    scale = Math.min(scale, 110);
    scale = Math.max(scale, 10);
  }

  if (gl === null) {
    console.log(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  const vertexShaderText = await readFile("assets/shaders/simple.vert.glsl");
  const fragmentShaderText = await readFile("assets/shaders/simple.frag.glsl");

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling vertex shader!",
      gl.getShaderInfoLog(vertexShader)
    );
    return;
  }

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling fragment shader!",
      gl.getShaderInfoLog(fragmentShader)
    );
    return;
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program!", gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("ERROR validating program!", gl.getProgramInfoLog(program));
    return;
  }

  const vertices = [
    0.75,  0.75,   0.0, 0.0,
    0.75, -0.75,   0.0, 1.0,
    -0.75, -0.75,  1.0, 1.0,
    -0.75,  0.75,  1.0, 0.0
  ];
  const indices = [
   0, 1, 3,
   1, 2, 3
  ];

  var triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var triangleIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleIndexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
  var texCoordsAttribLocation = gl.getAttribLocation(program, "texCoord");
  gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.vertexAttribPointer(texCoordsAttribLocation, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(texCoordsAttribLocation);

  var boxTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, boxTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		<HTMLCanvasElement>document.getElementById('image')
	);
	gl.bindTexture(gl.TEXTURE_2D, null);

  gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

  var worldMatrix = new Float32Array(16);
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);
  mat4.identity(worldMatrix);
  var translation = vec3.create();
  vec3.set(translation, 0.0, 0.0, -6.0); // todo
  mat4.translate(viewMatrix, worldMatrix, translation);
  mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0); //todo

  gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

  var identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);

  const loop = () => {
    mat4.perspective(projMatrix, glMatrix.toRadian(scale), 1, 0.1, 1000.0); //todo and 45 is for zoom; ik total nonsens 
		gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

    gl.clearColor(0.2, 0.2, 0.2, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		gl.bindTexture(gl.TEXTURE_2D, boxTexture);
		gl.activeTexture(gl.TEXTURE0);

    gl.useProgram(program);
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

		requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
};

main();
