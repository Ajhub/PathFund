// Aurora WebGL2 background — pure WebGL, no external libraries
// Translated from the React/OGL version to raw WebGL2

(function () {
  const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop { vec3 color; float position; };

#define COLOR_RAMP(colors, factor, finalColor) {                              \
  int index = 0;                                                              \
  for (int i = 0; i < 2; i++) {                                               \
    ColorStop cc = colors[i];                                                 \
    bool inBetween = cc.position <= factor;                                   \
    index = int(mix(float(index), float(i), float(inBetween)));               \
  }                                                                           \
  ColorStop cur  = colors[index];                                             \
  ColorStop nxt  = colors[index + 1];                                         \
  float range    = nxt.position - cur.position;                               \
  float lerpF    = (factor - cur.position) / range;                           \
  finalColor = mix(cur.color, nxt.color, lerpF);                             \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity  = 0.6 * height;
  float midPoint   = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  vec3  auroraColor = intensity * rampColor;

  if (uLightMode > 0.5) {
    float energy   = clamp(max(intensity, 0.0), 0.0, 1.0);
    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86);
    vec3  chroma   = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
    float peak     = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(peak, 0.0001);
    fragColor = vec4(mix(vec3(1.0), chroma, min(coverage * 1.08, 0.94)), coverage);
  } else {
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
}`;

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  }

  function compileShader(gl, type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function initAurora() {
    const container = document.getElementById('aurora-bg');
    if (!container) { console.error('aurora-bg not found'); return; }

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false, antialias: true });
    if (!gl) { console.error('WebGL2 not supported'); return; }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Full-screen triangle (covers NDC with one triangle)
    const verts = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const posLoc     = gl.getAttribLocation(prog, 'position');
    const uTimeLoc   = gl.getUniformLocation(prog, 'uTime');
    const uAmpLoc    = gl.getUniformLocation(prog, 'uAmplitude');
    const uStopsLoc  = gl.getUniformLocation(prog, 'uColorStops');
    const uResLoc    = gl.getUniformLocation(prog, 'uResolution');
    const uBlendLoc  = gl.getUniformLocation(prog, 'uBlend');
    const uLightLoc  = gl.getUniformLocation(prog, 'uLightMode');

    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const colorStops = ['#5227FF', '#7cff67', '#5227FF'];
    const flatStops  = colorStops.flatMap(hexToRgb);

    function resize() {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      canvas.width  = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);
      gl.uniform2f(uResLoc, w, h);
    }
    resize();
    window.addEventListener('resize', resize);

    let animId;
    function render(t) {
      animId = requestAnimationFrame(render);
      gl.useProgram(prog);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const isLight = document.documentElement.getAttribute('data-theme') !== 'dark';

      gl.uniform1f(uTimeLoc,  t * 0.001);
      gl.uniform1f(uAmpLoc,   1.0);
      gl.uniform3fv(uStopsLoc, flatStops);
      gl.uniform1f(uBlendLoc, 0.5);
      gl.uniform1f(uLightLoc, isLight ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    animId = requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAurora);
  } else {
    initAurora();
  }
})();
