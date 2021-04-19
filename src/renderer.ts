const main = () => {
  const canvas = <HTMLCanvasElement>document.getElementById("glCanvas");

  const gl: WebGLRenderingContext = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    console.log(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(1.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
};

main();
