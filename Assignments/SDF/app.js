 const glslify = require('glslify')
 const toy = require('gl-toy')

 const shaderText = glslify(`precision mediump float;

vec2 doModel( vec3 p );
uniform vec2  uScreenSize;
uniform float uTime;

#pragma glslify: raytrace = require('glsl-raytrace', map=doModel, steps=100)
#pragma glslify: camera   = require('glsl-camera-ray')
#pragma glslify: square   = require('glsl-square-frame')
#pragma glslify: getNormal= require('glsl-sdf-normal', map=doModel)

// primitives
#pragma glslify: sdTorus = require('glsl-sdf-primitives/sdTorus')
#pragma glslify: sdSphere = require('glsl-sdf-primitives/sdSphere')
#pragma glslify: sdCylinder = require('glsl-sdf-primitives/sdCylinder')

// operations
#pragma glslify: opU = require('glsl-sdf-ops/union')
#pragma glslify: opI = require('glsl-sdf-ops/intersection')
#pragma glslify: opS = require('glsl-sdf-ops/subtraction')
#pragma glslify: opTwist = require('glsl-sdf-ops/twist')

vec2 doModel(vec3 p) {
    float sphere = sdSphere(p,1.1);
    float torus = sdTorus(opTwist(p), vec2( 1., .5));
    float cylinder = sdCylinder(p + vec3(.3,0,-.2),vec3(.1,.5, .1));
    float op1 = opS(torus,sphere);
    float op2 = opI(cylinder,sphere);
    float finalOp = opS(op1,op2);
    vec2 result = vec2(finalOp,0.);
    return result;
}

vec3 lighting( vec3 normal ) {
    vec3 lightDir   = normalize(vec3(0, 1, 0));
    vec3 lightColor = vec3(0.7, 0.5, 0.9);
    vec3 diffuseAmt = lightColor * max(0.0, dot( lightDir, normal ));
  
    vec3 ambientAmt = vec3(0.1);
  
    return diffuseAmt + ambientAmt;
  }
  
  void main() {
    vec3 cameraPos = vec3( 0., 0., 5. );
    vec3 cameraDir = vec3( 0., 0., 0. );
  
    vec3 ray = camera( cameraPos, cameraDir, square( uScreenSize ), 2.0 );
    vec2 t   = raytrace( cameraPos, ray );
  
    vec3 color = vec3(0.);
  
    // only perform lighting if we have a "hit"
    if( t.x > -.5 ) {
      vec3 pos = cameraPos + t.x * ray;
      vec3 normal = getNormal( pos );
      color = lighting( normal );
    }
  
    gl_FragColor = vec4( color, 1. );
  }`)

 const start = Date.now()

 toy(shaderText, (gl, shader) => {
     shader.uniforms.uScreenSize = [gl.drawingBufferWidth, gl.drawingBufferHeight]
     shader.uniforms.uTime = (Date.now() - start) / 1000
 })