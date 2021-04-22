precision mediump float;

attribute vec2 vertPosition;
attribute vec2 texCoord;
varying vec2 fragTexCoord;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
uniform float scale;

void main()
{
  fragTexCoord = texCoord;
  gl_Position = mWorld * mProj * mView * vec4(vertPosition, 1.0, 1.0);
}