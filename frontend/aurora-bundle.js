(() => {
  // frontend/ogl.js
  function ct(s) {
    let t = s[0], e = s[1], i = s[2];
    return Math.sqrt(t * t + e * e + i * i);
  }
  function bt(s, t) {
    return s[0] = t[0], s[1] = t[1], s[2] = t[2], s;
  }
  function ws(s, t, e, i) {
    return s[0] = t, s[1] = e, s[2] = i, s;
  }
  function ae(s, t, e) {
    return s[0] = t[0] + e[0], s[1] = t[1] + e[1], s[2] = t[2] + e[2], s;
  }
  function he(s, t, e) {
    return s[0] = t[0] - e[0], s[1] = t[1] - e[1], s[2] = t[2] - e[2], s;
  }
  function Es(s, t, e) {
    return s[0] = t[0] * e[0], s[1] = t[1] * e[1], s[2] = t[2] * e[2], s;
  }
  function Ms(s, t, e) {
    return s[0] = t[0] / e[0], s[1] = t[1] / e[1], s[2] = t[2] / e[2], s;
  }
  function vt(s, t, e) {
    return s[0] = t[0] * e, s[1] = t[1] * e, s[2] = t[2] * e, s;
  }
  function As(s, t) {
    let e = t[0] - s[0], i = t[1] - s[1], r = t[2] - s[2];
    return Math.sqrt(e * e + i * i + r * r);
  }
  function _s(s, t) {
    let e = t[0] - s[0], i = t[1] - s[1], r = t[2] - s[2];
    return e * e + i * i + r * r;
  }
  function oe(s) {
    let t = s[0], e = s[1], i = s[2];
    return t * t + e * e + i * i;
  }
  function bs(s, t) {
    return s[0] = -t[0], s[1] = -t[1], s[2] = -t[2], s;
  }
  function vs(s, t) {
    return s[0] = 1 / t[0], s[1] = 1 / t[1], s[2] = 1 / t[2], s;
  }
  function Tt(s, t) {
    let e = t[0], i = t[1], r = t[2], n = e * e + i * i + r * r;
    return n > 0 && (n = 1 / Math.sqrt(n)), s[0] = t[0] * n, s[1] = t[1] * n, s[2] = t[2] * n, s;
  }
  function le(s, t) {
    return s[0] * t[0] + s[1] * t[1] + s[2] * t[2];
  }
  function ce(s, t, e) {
    let i = t[0], r = t[1], n = t[2], a = e[0], o = e[1], h = e[2];
    return s[0] = r * h - n * o, s[1] = n * a - i * h, s[2] = i * o - r * a, s;
  }
  function ue(s, t, e, i) {
    let r = t[0], n = t[1], a = t[2];
    return s[0] = r + i * (e[0] - r), s[1] = n + i * (e[1] - n), s[2] = a + i * (e[2] - a), s;
  }
  function Ts(s, t, e, i, r) {
    const n = Math.exp(-i * r);
    let a = t[0], o = t[1], h = t[2];
    return s[0] = e[0] + (a - e[0]) * n, s[1] = e[1] + (o - e[1]) * n, s[2] = e[2] + (h - e[2]) * n, s;
  }
  function Rs(s, t, e) {
    let i = t[0], r = t[1], n = t[2], a = e[3] * i + e[7] * r + e[11] * n + e[15];
    return a = a || 1, s[0] = (e[0] * i + e[4] * r + e[8] * n + e[12]) / a, s[1] = (e[1] * i + e[5] * r + e[9] * n + e[13]) / a, s[2] = (e[2] * i + e[6] * r + e[10] * n + e[14]) / a, s;
  }
  function Fs(s, t, e) {
    let i = t[0], r = t[1], n = t[2], a = e[3] * i + e[7] * r + e[11] * n + e[15];
    return a = a || 1, s[0] = (e[0] * i + e[4] * r + e[8] * n) / a, s[1] = (e[1] * i + e[5] * r + e[9] * n) / a, s[2] = (e[2] * i + e[6] * r + e[10] * n) / a, s;
  }
  function Ls(s, t, e) {
    let i = t[0], r = t[1], n = t[2];
    return s[0] = i * e[0] + r * e[3] + n * e[6], s[1] = i * e[1] + r * e[4] + n * e[7], s[2] = i * e[2] + r * e[5] + n * e[8], s;
  }
  function Ss(s, t, e) {
    let i = t[0], r = t[1], n = t[2], a = e[0], o = e[1], h = e[2], l = e[3], c = o * n - h * r, u = h * i - a * n, d = a * r - o * i, f = o * d - h * u, g = h * c - a * d, x = a * u - o * c, p = l * 2;
    return c *= p, u *= p, d *= p, f *= 2, g *= 2, x *= 2, s[0] = i + c + f, s[1] = r + u + g, s[2] = n + d + x, s;
  }
  var zs = /* @__PURE__ */ (function() {
    const s = [0, 0, 0], t = [0, 0, 0];
    return function(e, i) {
      bt(s, e), bt(t, i), Tt(s, s), Tt(t, t);
      let r = le(s, t);
      return r > 1 ? 0 : r < -1 ? Math.PI : Math.acos(r);
    };
  })();
  function Ps(s, t) {
    return s[0] === t[0] && s[1] === t[1] && s[2] === t[2];
  }
  var _ = class __ extends Array {
    constructor(t = 0, e = t, i = t) {
      return super(t, e, i), this;
    }
    get x() {
      return this[0];
    }
    get y() {
      return this[1];
    }
    get z() {
      return this[2];
    }
    set x(t) {
      this[0] = t;
    }
    set y(t) {
      this[1] = t;
    }
    set z(t) {
      this[2] = t;
    }
    set(t, e = t, i = t) {
      return t.length ? this.copy(t) : (ws(this, t, e, i), this);
    }
    copy(t) {
      return bt(this, t), this;
    }
    add(t, e) {
      return e ? ae(this, t, e) : ae(this, this, t), this;
    }
    sub(t, e) {
      return e ? he(this, t, e) : he(this, this, t), this;
    }
    multiply(t) {
      return t.length ? Es(this, this, t) : vt(this, this, t), this;
    }
    divide(t) {
      return t.length ? Ms(this, this, t) : vt(this, this, 1 / t), this;
    }
    inverse(t = this) {
      return vs(this, t), this;
    }
    len() {
      return ct(this);
    }
    distance(t) {
      return t ? As(this, t) : ct(this);
    }
    squaredLen() {
      return oe(this);
    }
    squaredDistance(t) {
      return t ? _s(this, t) : oe(this);
    }
    negate(t = this) {
      return bs(this, t), this;
    }
    cross(t, e) {
      return e ? ce(this, t, e) : ce(this, this, t), this;
    }
    scale(t) {
      return vt(this, this, t), this;
    }
    normalize() {
      return Tt(this, this), this;
    }
    dot(t) {
      return le(this, t);
    }
    equals(t) {
      return Ps(this, t);
    }
    applyMatrix3(t) {
      return Ls(this, this, t), this;
    }
    applyMatrix4(t) {
      return Rs(this, this, t), this;
    }
    scaleRotateMatrix4(t) {
      return Fs(this, this, t), this;
    }
    applyQuaternion(t) {
      return Ss(this, this, t), this;
    }
    angle(t) {
      return zs(this, t);
    }
    lerp(t, e) {
      return ue(this, this, t, e), this;
    }
    smoothLerp(t, e, i) {
      return Ts(this, this, t, e, i), this;
    }
    clone() {
      return new __(this[0], this[1], this[2]);
    }
    fromArray(t, e = 0) {
      return this[0] = t[e], this[1] = t[e + 1], this[2] = t[e + 2], this;
    }
    toArray(t = [], e = 0) {
      return t[e] = this[0], t[e + 1] = this[1], t[e + 2] = this[2], t;
    }
    transformDirection(t) {
      const e = this[0], i = this[1], r = this[2];
      return this[0] = t[0] * e + t[4] * i + t[8] * r, this[1] = t[1] * e + t[5] * i + t[9] * r, this[2] = t[2] * e + t[6] * i + t[10] * r, this.normalize();
    }
  };
  var fe = new _();
  var Cs = 1;
  var Ns = 1;
  var de = false;
  var $ = class {
    constructor(t, e = {}) {
      t.canvas || console.error("gl not passed as first argument to Geometry"), this.gl = t, this.attributes = e, this.id = Cs++, this.VAOs = {}, this.drawRange = { start: 0, count: 0 }, this.instancedCount = 0, this.gl.renderer.bindVertexArray(null), this.gl.renderer.currentGeometry = null, this.glState = this.gl.renderer.state;
      for (let i in e) this.addAttribute(i, e[i]);
    }
    addAttribute(t, e) {
      if (this.attributes[t] = e, e.id = Ns++, e.size = e.size || 1, e.type = e.type || (e.data.constructor === Float32Array ? this.gl.FLOAT : e.data.constructor === Uint16Array ? this.gl.UNSIGNED_SHORT : this.gl.UNSIGNED_INT), e.target = t === "index" ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER, e.normalized = e.normalized || false, e.stride = e.stride || 0, e.offset = e.offset || 0, e.count = e.count || (e.stride ? e.data.byteLength / e.stride : e.data.length / e.size), e.divisor = e.instanced || 0, e.needsUpdate = false, e.usage = e.usage || this.gl.STATIC_DRAW, e.buffer || this.updateAttribute(e), e.divisor) {
        if (this.isInstanced = true, this.instancedCount && this.instancedCount !== e.count * e.divisor) return console.warn("geometry has multiple instanced buffers of different length"), this.instancedCount = Math.min(this.instancedCount, e.count * e.divisor);
        this.instancedCount = e.count * e.divisor;
      } else t === "index" ? this.drawRange.count = e.count : this.attributes.index || (this.drawRange.count = Math.max(this.drawRange.count, e.count));
    }
    updateAttribute(t) {
      const e = !t.buffer;
      e && (t.buffer = this.gl.createBuffer()), this.glState.boundBuffer !== t.buffer && (this.gl.bindBuffer(t.target, t.buffer), this.glState.boundBuffer = t.buffer), e ? this.gl.bufferData(t.target, t.data, t.usage) : this.gl.bufferSubData(t.target, 0, t.data), t.needsUpdate = false;
    }
    setIndex(t) {
      this.addAttribute("index", t);
    }
    setDrawRange(t, e) {
      this.drawRange.start = t, this.drawRange.count = e;
    }
    setInstancedCount(t) {
      this.instancedCount = t;
    }
    createVAO(t) {
      this.VAOs[t.attributeOrder] = this.gl.renderer.createVertexArray(), this.gl.renderer.bindVertexArray(this.VAOs[t.attributeOrder]), this.bindAttributes(t);
    }
    bindAttributes(t) {
      t.attributeLocations.forEach((e, { name: i, type: r }) => {
        if (!this.attributes[i]) {
          console.warn(`active attribute ${i} not being supplied`);
          return;
        }
        const n = this.attributes[i];
        this.gl.bindBuffer(n.target, n.buffer), this.glState.boundBuffer = n.buffer;
        let a = 1;
        r === 35674 && (a = 2), r === 35675 && (a = 3), r === 35676 && (a = 4);
        const o = n.size / a, h = a === 1 ? 0 : a * a * 4, l = a === 1 ? 0 : a * 4;
        for (let c = 0; c < a; c++) this.gl.vertexAttribPointer(e + c, o, n.type, n.normalized, n.stride + h, n.offset + c * l), this.gl.enableVertexAttribArray(e + c), this.gl.renderer.vertexAttribDivisor(e + c, n.divisor);
      }), this.attributes.index && this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer);
    }
    draw({ program: t, mode: e = this.gl.TRIANGLES }) {
      this.gl.renderer.currentGeometry !== `${this.id}_${t.attributeOrder}` && (this.VAOs[t.attributeOrder] || this.createVAO(t), this.gl.renderer.bindVertexArray(this.VAOs[t.attributeOrder]), this.gl.renderer.currentGeometry = `${this.id}_${t.attributeOrder}`), t.attributeLocations.forEach((r, { name: n }) => {
        const a = this.attributes[n];
        a.needsUpdate && this.updateAttribute(a);
      });
      let i = 2;
      this.attributes.index?.type === this.gl.UNSIGNED_INT && (i = 4), this.isInstanced ? this.attributes.index ? this.gl.renderer.drawElementsInstanced(e, this.drawRange.count, this.attributes.index.type, this.attributes.index.offset + this.drawRange.start * i, this.instancedCount) : this.gl.renderer.drawArraysInstanced(e, this.drawRange.start, this.drawRange.count, this.instancedCount) : this.attributes.index ? this.gl.drawElements(e, this.drawRange.count, this.attributes.index.type, this.attributes.index.offset + this.drawRange.start * i) : this.gl.drawArrays(e, this.drawRange.start, this.drawRange.count);
    }
    getPosition() {
      const t = this.attributes.position;
      if (t.data) return t;
      if (!de) return console.warn("No position buffer data found to compute bounds"), de = true;
    }
    computeBoundingBox(t) {
      t || (t = this.getPosition());
      const e = t.data, i = t.size;
      this.bounds || (this.bounds = { min: new _(), max: new _(), center: new _(), scale: new _(), radius: 1 / 0 });
      const r = this.bounds.min, n = this.bounds.max, a = this.bounds.center, o = this.bounds.scale;
      r.set(1 / 0), n.set(-1 / 0);
      for (let h = 0, l = e.length; h < l; h += i) {
        const c = e[h], u = e[h + 1], d = e[h + 2];
        r.x = Math.min(c, r.x), r.y = Math.min(u, r.y), r.z = Math.min(d, r.z), n.x = Math.max(c, n.x), n.y = Math.max(u, n.y), n.z = Math.max(d, n.z);
      }
      o.sub(n, r), a.add(r, n).divide(2);
    }
    computeBoundingSphere(t) {
      t || (t = this.getPosition());
      const e = t.data, i = t.size;
      this.bounds || this.computeBoundingBox(t);
      let r = 0;
      for (let n = 0, a = e.length; n < a; n += i) fe.fromArray(e, n), r = Math.max(r, this.bounds.center.squaredDistance(fe));
      this.bounds.radius = Math.sqrt(r);
    }
    remove() {
      for (let t in this.VAOs) this.gl.renderer.deleteVertexArray(this.VAOs[t]), delete this.VAOs[t];
      for (let t in this.attributes) this.gl.deleteBuffer(this.attributes[t].buffer), delete this.attributes[t];
    }
  };
  var Is = 1;
  var pe = {};
  var X = class {
    constructor(t, { vertex: e, fragment: i, uniforms: r = {}, transparent: n = false, cullFace: a = t.BACK, frontFace: o = t.CCW, depthTest: h = true, depthWrite: l = true, depthFunc: c = t.LEQUAL } = {}) {
      t.canvas || console.error("gl not passed as first argument to Program"), this.gl = t, this.uniforms = r, this.id = Is++, e || console.warn("vertex shader not supplied"), i || console.warn("fragment shader not supplied"), this.transparent = n, this.cullFace = a, this.frontFace = o, this.depthTest = h, this.depthWrite = l, this.depthFunc = c, this.blendFunc = {}, this.blendEquation = {}, this.stencilFunc = {}, this.stencilOp = {}, this.transparent && !this.blendFunc.src && (this.gl.renderer.premultipliedAlpha ? this.setBlendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA) : this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)), this.vertexShader = t.createShader(t.VERTEX_SHADER), this.fragmentShader = t.createShader(t.FRAGMENT_SHADER), this.program = t.createProgram(), t.attachShader(this.program, this.vertexShader), t.attachShader(this.program, this.fragmentShader), this.setShaders({ vertex: e, fragment: i });
    }
    setShaders({ vertex: t, fragment: e }) {
      if (t && (this.gl.shaderSource(this.vertexShader, t), this.gl.compileShader(this.vertexShader), this.gl.getShaderInfoLog(this.vertexShader) !== "" && console.warn(`${this.gl.getShaderInfoLog(this.vertexShader)}
Vertex Shader
${ge(t)}`)), e && (this.gl.shaderSource(this.fragmentShader, e), this.gl.compileShader(this.fragmentShader), this.gl.getShaderInfoLog(this.fragmentShader) !== "" && console.warn(`${this.gl.getShaderInfoLog(this.fragmentShader)}
Fragment Shader
${ge(e)}`)), this.gl.linkProgram(this.program), !this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) return console.warn(this.gl.getProgramInfoLog(this.program));
      this.uniformLocations = /* @__PURE__ */ new Map();
      let i = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
      for (let a = 0; a < i; a++) {
        let o = this.gl.getActiveUniform(this.program, a);
        this.uniformLocations.set(o, this.gl.getUniformLocation(this.program, o.name));
        const h = o.name.match(/(\w+)/g);
        o.uniformName = h[0], o.nameComponents = h.slice(1);
      }
      this.attributeLocations = /* @__PURE__ */ new Map();
      const r = [], n = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
      for (let a = 0; a < n; a++) {
        const o = this.gl.getActiveAttrib(this.program, a), h = this.gl.getAttribLocation(this.program, o.name);
        h !== -1 && (r[h] = o.name, this.attributeLocations.set(o, h));
      }
      this.attributeOrder = r.join("");
    }
    setBlendFunc(t, e, i, r) {
      this.blendFunc.src = t, this.blendFunc.dst = e, this.blendFunc.srcAlpha = i, this.blendFunc.dstAlpha = r, t && (this.transparent = true);
    }
    setBlendEquation(t, e) {
      this.blendEquation.modeRGB = t, this.blendEquation.modeAlpha = e;
    }
    setStencilFunc(t, e, i) {
      this.stencilRef = e, this.stencilFunc.func = t, this.stencilFunc.ref = e, this.stencilFunc.mask = i;
    }
    setStencilOp(t, e, i) {
      this.stencilOp.stencilFail = t, this.stencilOp.depthFail = e, this.stencilOp.depthPass = i;
    }
    applyState() {
      this.depthTest ? this.gl.renderer.enable(this.gl.DEPTH_TEST) : this.gl.renderer.disable(this.gl.DEPTH_TEST), this.cullFace ? this.gl.renderer.enable(this.gl.CULL_FACE) : this.gl.renderer.disable(this.gl.CULL_FACE), this.blendFunc.src ? this.gl.renderer.enable(this.gl.BLEND) : this.gl.renderer.disable(this.gl.BLEND), this.cullFace && this.gl.renderer.setCullFace(this.cullFace), this.gl.renderer.setFrontFace(this.frontFace), this.gl.renderer.setDepthMask(this.depthWrite), this.gl.renderer.setDepthFunc(this.depthFunc), this.blendFunc.src && this.gl.renderer.setBlendFunc(this.blendFunc.src, this.blendFunc.dst, this.blendFunc.srcAlpha, this.blendFunc.dstAlpha), this.gl.renderer.setBlendEquation(this.blendEquation.modeRGB, this.blendEquation.modeAlpha), this.stencilFunc.func || this.stencilOp.stencilFail ? this.gl.renderer.enable(this.gl.STENCIL_TEST) : this.gl.renderer.disable(this.gl.STENCIL_TEST), this.gl.renderer.setStencilFunc(this.stencilFunc.func, this.stencilFunc.ref, this.stencilFunc.mask), this.gl.renderer.setStencilOp(this.stencilOp.stencilFail, this.stencilOp.depthFail, this.stencilOp.depthPass);
    }
    use({ flipFaces: t = false } = {}) {
      let e = -1;
      this.gl.renderer.state.currentProgram === this.id || (this.gl.useProgram(this.program), this.gl.renderer.state.currentProgram = this.id), this.uniformLocations.forEach((r, n) => {
        let a = this.uniforms[n.uniformName];
        for (const o of n.nameComponents) {
          if (!a) break;
          if (o in a) a = a[o];
          else {
            if (Array.isArray(a.value)) break;
            a = void 0;
            break;
          }
        }
        if (!a) return me(`Active uniform ${n.name} has not been supplied`);
        if (a && a.value === void 0) return me(`${n.name} uniform is missing a value parameter`);
        if (a.value.texture) return e = e + 1, a.value.update(e), Rt(this.gl, n.type, r, e);
        if (a.value.length && a.value[0].texture) {
          const o = [];
          return a.value.forEach((h) => {
            e = e + 1, h.update(e), o.push(e);
          }), Rt(this.gl, n.type, r, o);
        }
        Rt(this.gl, n.type, r, a.value);
      }), this.applyState(), t && this.gl.renderer.setFrontFace(this.frontFace === this.gl.CCW ? this.gl.CW : this.gl.CCW);
    }
    remove() {
      this.gl.deleteProgram(this.program);
    }
  };
  function Rt(s, t, e, i) {
    i = i.length ? Ds(i) : i;
    const r = s.renderer.state.uniformLocations.get(e);
    if (i.length) if (r === void 0 || r.length !== i.length) s.renderer.state.uniformLocations.set(e, i.slice(0));
    else {
      if (Os(r, i)) return;
      r.set ? r.set(i) : Bs(r, i), s.renderer.state.uniformLocations.set(e, r);
    }
    else {
      if (r === i) return;
      s.renderer.state.uniformLocations.set(e, i);
    }
    switch (t) {
      case 5126:
        return i.length ? s.uniform1fv(e, i) : s.uniform1f(e, i);
      case 35664:
        return s.uniform2fv(e, i);
      case 35665:
        return s.uniform3fv(e, i);
      case 35666:
        return s.uniform4fv(e, i);
      case 35670:
      case 5124:
      case 35678:
      case 36306:
      case 35680:
      case 36289:
        return i.length ? s.uniform1iv(e, i) : s.uniform1i(e, i);
      case 35671:
      case 35667:
        return s.uniform2iv(e, i);
      case 35672:
      case 35668:
        return s.uniform3iv(e, i);
      case 35673:
      case 35669:
        return s.uniform4iv(e, i);
      case 35674:
        return s.uniformMatrix2fv(e, false, i);
      case 35675:
        return s.uniformMatrix3fv(e, false, i);
      case 35676:
        return s.uniformMatrix4fv(e, false, i);
    }
  }
  function ge(s) {
    let t = s.split(`
`);
    for (let e = 0; e < t.length; e++) t[e] = e + 1 + ": " + t[e];
    return t.join(`
`);
  }
  function Ds(s) {
    const t = s.length, e = s[0].length;
    if (e === void 0) return s;
    const i = t * e;
    let r = pe[i];
    r || (pe[i] = r = new Float32Array(i));
    for (let n = 0; n < t; n++) r.set(s[n], n * e);
    return r;
  }
  function Os(s, t) {
    if (s.length !== t.length) return false;
    for (let e = 0, i = s.length; e < i; e++) if (s[e] !== t[e]) return false;
    return true;
  }
  function Bs(s, t) {
    for (let e = 0, i = s.length; e < i; e++) s[e] = t[e];
  }
  var Ft = 0;
  function me(s) {
    Ft > 100 || (console.warn(s), Ft++, Ft > 100 && console.warn("More than 100 program warnings - stopping logs."));
  }
  var Lt = new _();
  var Us = 1;
  var ks = class {
    constructor({ canvas: t = document.createElement("canvas"), width: e = 300, height: i = 150, dpr: r = 1, alpha: n = false, depth: a = true, stencil: o = false, antialias: h = false, premultipliedAlpha: l = false, preserveDrawingBuffer: c = false, powerPreference: u = "default", autoClear: d = true, webgl: f = 2 } = {}) {
      const g = { alpha: n, depth: a, stencil: o, antialias: h, premultipliedAlpha: l, preserveDrawingBuffer: c, powerPreference: u };
      this.dpr = r, this.alpha = n, this.color = true, this.depth = a, this.stencil = o, this.premultipliedAlpha = l, this.autoClear = d, this.id = Us++, f === 2 && (this.gl = t.getContext("webgl2", g)), this.isWebgl2 = !!this.gl, this.gl || (this.gl = t.getContext("webgl", g)), this.gl || console.error("unable to create webgl context"), this.gl.renderer = this, this.setSize(e, i), this.state = {}, this.state.blendFunc = { src: this.gl.ONE, dst: this.gl.ZERO }, this.state.blendEquation = { modeRGB: this.gl.FUNC_ADD }, this.state.cullFace = false, this.state.frontFace = this.gl.CCW, this.state.depthMask = true, this.state.depthFunc = this.gl.LEQUAL, this.state.premultiplyAlpha = false, this.state.flipY = false, this.state.unpackAlignment = 4, this.state.framebuffer = null, this.state.viewport = { x: 0, y: 0, width: null, height: null }, this.state.textureUnits = [], this.state.activeTextureUnit = 0, this.state.boundBuffer = null, this.state.uniformLocations = /* @__PURE__ */ new Map(), this.state.currentProgram = null, this.extensions = {}, this.isWebgl2 ? (this.getExtension("EXT_color_buffer_float"), this.getExtension("OES_texture_float_linear")) : (this.getExtension("OES_texture_float"), this.getExtension("OES_texture_float_linear"), this.getExtension("OES_texture_half_float"), this.getExtension("OES_texture_half_float_linear"), this.getExtension("OES_element_index_uint"), this.getExtension("OES_standard_derivatives"), this.getExtension("EXT_sRGB"), this.getExtension("WEBGL_depth_texture"), this.getExtension("WEBGL_draw_buffers")), this.getExtension("WEBGL_compressed_texture_astc"), this.getExtension("EXT_texture_compression_bptc"), this.getExtension("WEBGL_compressed_texture_s3tc"), this.getExtension("WEBGL_compressed_texture_etc1"), this.getExtension("WEBGL_compressed_texture_pvrtc"), this.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"), this.vertexAttribDivisor = this.getExtension("ANGLE_instanced_arrays", "vertexAttribDivisor", "vertexAttribDivisorANGLE"), this.drawArraysInstanced = this.getExtension("ANGLE_instanced_arrays", "drawArraysInstanced", "drawArraysInstancedANGLE"), this.drawElementsInstanced = this.getExtension("ANGLE_instanced_arrays", "drawElementsInstanced", "drawElementsInstancedANGLE"), this.createVertexArray = this.getExtension("OES_vertex_array_object", "createVertexArray", "createVertexArrayOES"), this.bindVertexArray = this.getExtension("OES_vertex_array_object", "bindVertexArray", "bindVertexArrayOES"), this.deleteVertexArray = this.getExtension("OES_vertex_array_object", "deleteVertexArray", "deleteVertexArrayOES"), this.drawBuffers = this.getExtension("WEBGL_draw_buffers", "drawBuffers", "drawBuffersWEBGL"), this.parameters = {}, this.parameters.maxTextureUnits = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS), this.parameters.maxAnisotropy = this.getExtension("EXT_texture_filter_anisotropic") ? this.gl.getParameter(this.getExtension("EXT_texture_filter_anisotropic").MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
    }
    setSize(t, e) {
      this.width = t, this.height = e, this.gl.canvas.width = t * this.dpr, this.gl.canvas.height = e * this.dpr, this.gl.canvas.style && Object.assign(this.gl.canvas.style, { width: t + "px", height: e + "px" });
    }
    setViewport(t, e, i = 0, r = 0) {
      this.state.viewport.width === t && this.state.viewport.height === e || (this.state.viewport.width = t, this.state.viewport.height = e, this.state.viewport.x = i, this.state.viewport.y = r, this.gl.viewport(i, r, t, e));
    }
    setScissor(t, e, i = 0, r = 0) {
      this.gl.scissor(i, r, t, e);
    }
    enable(t) {
      this.state[t] !== true && (this.gl.enable(t), this.state[t] = true);
    }
    disable(t) {
      this.state[t] !== false && (this.gl.disable(t), this.state[t] = false);
    }
    setBlendFunc(t, e, i, r) {
      this.state.blendFunc.src === t && this.state.blendFunc.dst === e && this.state.blendFunc.srcAlpha === i && this.state.blendFunc.dstAlpha === r || (this.state.blendFunc.src = t, this.state.blendFunc.dst = e, this.state.blendFunc.srcAlpha = i, this.state.blendFunc.dstAlpha = r, i !== void 0 ? this.gl.blendFuncSeparate(t, e, i, r) : this.gl.blendFunc(t, e));
    }
    setBlendEquation(t, e) {
      t = t || this.gl.FUNC_ADD, !(this.state.blendEquation.modeRGB === t && this.state.blendEquation.modeAlpha === e) && (this.state.blendEquation.modeRGB = t, this.state.blendEquation.modeAlpha = e, e !== void 0 ? this.gl.blendEquationSeparate(t, e) : this.gl.blendEquation(t));
    }
    setCullFace(t) {
      this.state.cullFace !== t && (this.state.cullFace = t, this.gl.cullFace(t));
    }
    setFrontFace(t) {
      this.state.frontFace !== t && (this.state.frontFace = t, this.gl.frontFace(t));
    }
    setDepthMask(t) {
      this.state.depthMask !== t && (this.state.depthMask = t, this.gl.depthMask(t));
    }
    setDepthFunc(t) {
      this.state.depthFunc !== t && (this.state.depthFunc = t, this.gl.depthFunc(t));
    }
    setStencilMask(t) {
      this.state.stencilMask !== t && (this.state.stencilMask = t, this.gl.stencilMask(t));
    }
    setStencilFunc(t, e, i) {
      this.state.stencilFunc === t && this.state.stencilRef === e && this.state.stencilFuncMask === i || (this.state.stencilFunc = t || this.gl.ALWAYS, this.state.stencilRef = e || 0, this.state.stencilFuncMask = i || 0, this.gl.stencilFunc(t || this.gl.ALWAYS, e || 0, i || 0));
    }
    setStencilOp(t, e, i) {
      this.state.stencilFail === t && this.state.stencilDepthFail === e && this.state.stencilDepthPass === i || (this.state.stencilFail = t, this.state.stencilDepthFail = e, this.state.stencilDepthPass = i, this.gl.stencilOp(t, e, i));
    }
    activeTexture(t) {
      this.state.activeTextureUnit !== t && (this.state.activeTextureUnit = t, this.gl.activeTexture(this.gl.TEXTURE0 + t));
    }
    bindFramebuffer({ target: t = this.gl.FRAMEBUFFER, buffer: e = null } = {}) {
      this.state.framebuffer !== e && (this.state.framebuffer = e, this.gl.bindFramebuffer(t, e));
    }
    getExtension(t, e, i) {
      return e && this.gl[e] ? this.gl[e].bind(this.gl) : (this.extensions[t] || (this.extensions[t] = this.gl.getExtension(t)), e ? this.extensions[t] ? this.extensions[t][i].bind(this.extensions[t]) : null : this.extensions[t]);
    }
    sortOpaque(t, e) {
      return t.renderOrder !== e.renderOrder ? t.renderOrder - e.renderOrder : t.program.id !== e.program.id ? t.program.id - e.program.id : t.zDepth !== e.zDepth ? t.zDepth - e.zDepth : e.id - t.id;
    }
    sortTransparent(t, e) {
      return t.renderOrder !== e.renderOrder ? t.renderOrder - e.renderOrder : t.zDepth !== e.zDepth ? e.zDepth - t.zDepth : e.id - t.id;
    }
    sortUI(t, e) {
      return t.renderOrder !== e.renderOrder ? t.renderOrder - e.renderOrder : t.program.id !== e.program.id ? t.program.id - e.program.id : e.id - t.id;
    }
    getRenderList({ scene: t, camera: e, frustumCull: i, sort: r }) {
      let n = [];
      if (e && i && e.updateFrustum(), t.traverse((a) => {
        if (!a.visible) return true;
        a.draw && (i && a.frustumCulled && e && !e.frustumIntersectsMesh(a) || n.push(a));
      }), r) {
        const a = [], o = [], h = [];
        n.forEach((l) => {
          l.program.transparent ? l.program.depthTest ? o.push(l) : h.push(l) : a.push(l), l.zDepth = 0, !(l.renderOrder !== 0 || !l.program.depthTest || !e) && (l.worldMatrix.getTranslation(Lt), Lt.applyMatrix4(e.projectionViewMatrix), l.zDepth = Lt.z);
        }), a.sort(this.sortOpaque), o.sort(this.sortTransparent), h.sort(this.sortUI), n = a.concat(o, h);
      }
      return n;
    }
    render({ scene: t, camera: e, target: i = null, update: r = true, sort: n = true, frustumCull: a = true, clear: o }) {
      i === null ? (this.bindFramebuffer(), this.setViewport(this.width * this.dpr, this.height * this.dpr)) : (this.bindFramebuffer(i), this.setViewport(i.width, i.height)), (o || this.autoClear && o !== false) && (this.depth && (!i || i.depth) && (this.enable(this.gl.DEPTH_TEST), this.setDepthMask(true)), (this.stencil || !i || i.stencil) && (this.enable(this.gl.STENCIL_TEST), this.setStencilMask(255)), this.gl.clear((this.color ? this.gl.COLOR_BUFFER_BIT : 0) | (this.depth ? this.gl.DEPTH_BUFFER_BIT : 0) | (this.stencil ? this.gl.STENCIL_BUFFER_BIT : 0))), r && t.updateMatrixWorld(), e && e.updateMatrixWorld(), this.getRenderList({ scene: t, camera: e, frustumCull: a, sort: n }).forEach((l) => {
        l.draw({ camera: e });
      });
    }
  };
  function xe(s, t) {
    return s[0] = t[0], s[1] = t[1], s[2] = t[2], s[3] = t[3], s;
  }
  function ye(s, t, e, i, r) {
    return s[0] = t, s[1] = e, s[2] = i, s[3] = r, s;
  }
  function we(s, t) {
    let e = t[0], i = t[1], r = t[2], n = t[3], a = e * e + i * i + r * r + n * n;
    return a > 0 && (a = 1 / Math.sqrt(a)), s[0] = e * a, s[1] = i * a, s[2] = r * a, s[3] = n * a, s;
  }
  function Ee(s, t) {
    return s[0] * t[0] + s[1] * t[1] + s[2] * t[2] + s[3] * t[3];
  }
  function Gs(s) {
    return s[0] = 0, s[1] = 0, s[2] = 0, s[3] = 1, s;
  }
  function $s(s, t, e) {
    e = e * 0.5;
    let i = Math.sin(e);
    return s[0] = i * t[0], s[1] = i * t[1], s[2] = i * t[2], s[3] = Math.cos(e), s;
  }
  function Me(s, t, e) {
    let i = t[0], r = t[1], n = t[2], a = t[3], o = e[0], h = e[1], l = e[2], c = e[3];
    return s[0] = i * c + a * o + r * l - n * h, s[1] = r * c + a * h + n * o - i * l, s[2] = n * c + a * l + i * h - r * o, s[3] = a * c - i * o - r * h - n * l, s;
  }
  function Ws(s, t, e) {
    e *= 0.5;
    let i = t[0], r = t[1], n = t[2], a = t[3], o = Math.sin(e), h = Math.cos(e);
    return s[0] = i * h + a * o, s[1] = r * h + n * o, s[2] = n * h - r * o, s[3] = a * h - i * o, s;
  }
  function Xs(s, t, e) {
    e *= 0.5;
    let i = t[0], r = t[1], n = t[2], a = t[3], o = Math.sin(e), h = Math.cos(e);
    return s[0] = i * h - n * o, s[1] = r * h + a * o, s[2] = n * h + i * o, s[3] = a * h - r * o, s;
  }
  function qs(s, t, e) {
    e *= 0.5;
    let i = t[0], r = t[1], n = t[2], a = t[3], o = Math.sin(e), h = Math.cos(e);
    return s[0] = i * h + r * o, s[1] = r * h - i * o, s[2] = n * h + a * o, s[3] = a * h - n * o, s;
  }
  function Ys(s, t, e, i) {
    let r = t[0], n = t[1], a = t[2], o = t[3], h = e[0], l = e[1], c = e[2], u = e[3], d, f, g, x, p;
    return f = r * h + n * l + a * c + o * u, f < 0 && (f = -f, h = -h, l = -l, c = -c, u = -u), 1 - f > 1e-6 ? (d = Math.acos(f), g = Math.sin(d), x = Math.sin((1 - i) * d) / g, p = Math.sin(i * d) / g) : (x = 1 - i, p = i), s[0] = x * r + p * h, s[1] = x * n + p * l, s[2] = x * a + p * c, s[3] = x * o + p * u, s;
  }
  function js(s, t) {
    let e = t[0], i = t[1], r = t[2], n = t[3], a = e * e + i * i + r * r + n * n, o = a ? 1 / a : 0;
    return s[0] = -e * o, s[1] = -i * o, s[2] = -r * o, s[3] = n * o, s;
  }
  function Hs(s, t) {
    return s[0] = -t[0], s[1] = -t[1], s[2] = -t[2], s[3] = t[3], s;
  }
  function Ks(s, t) {
    let e = t[0] + t[4] + t[8], i;
    if (e > 0) i = Math.sqrt(e + 1), s[3] = 0.5 * i, i = 0.5 / i, s[0] = (t[5] - t[7]) * i, s[1] = (t[6] - t[2]) * i, s[2] = (t[1] - t[3]) * i;
    else {
      let r = 0;
      t[4] > t[0] && (r = 1), t[8] > t[r * 3 + r] && (r = 2);
      let n = (r + 1) % 3, a = (r + 2) % 3;
      i = Math.sqrt(t[r * 3 + r] - t[n * 3 + n] - t[a * 3 + a] + 1), s[r] = 0.5 * i, i = 0.5 / i, s[3] = (t[n * 3 + a] - t[a * 3 + n]) * i, s[n] = (t[n * 3 + r] + t[r * 3 + n]) * i, s[a] = (t[a * 3 + r] + t[r * 3 + a]) * i;
    }
    return s;
  }
  function Qs(s, t, e = "YXZ") {
    let i = Math.sin(t[0] * 0.5), r = Math.cos(t[0] * 0.5), n = Math.sin(t[1] * 0.5), a = Math.cos(t[1] * 0.5), o = Math.sin(t[2] * 0.5), h = Math.cos(t[2] * 0.5);
    return e === "XYZ" ? (s[0] = i * a * h + r * n * o, s[1] = r * n * h - i * a * o, s[2] = r * a * o + i * n * h, s[3] = r * a * h - i * n * o) : e === "YXZ" ? (s[0] = i * a * h + r * n * o, s[1] = r * n * h - i * a * o, s[2] = r * a * o - i * n * h, s[3] = r * a * h + i * n * o) : e === "ZXY" ? (s[0] = i * a * h - r * n * o, s[1] = r * n * h + i * a * o, s[2] = r * a * o + i * n * h, s[3] = r * a * h - i * n * o) : e === "ZYX" ? (s[0] = i * a * h - r * n * o, s[1] = r * n * h + i * a * o, s[2] = r * a * o - i * n * h, s[3] = r * a * h + i * n * o) : e === "YZX" ? (s[0] = i * a * h + r * n * o, s[1] = r * n * h + i * a * o, s[2] = r * a * o - i * n * h, s[3] = r * a * h - i * n * o) : e === "XZY" && (s[0] = i * a * h - r * n * o, s[1] = r * n * h - i * a * o, s[2] = r * a * o + i * n * h, s[3] = r * a * h + i * n * o), s;
  }
  var Zs = xe;
  var Js = ye;
  var ti = Ee;
  var ei = we;
  var Z = class extends Array {
    constructor(t = 0, e = 0, i = 0, r = 1) {
      super(t, e, i, r), this.onChange = () => {
      }, this._target = this;
      const n = ["0", "1", "2", "3"];
      return new Proxy(this, { set(a, o) {
        const h = Reflect.set(...arguments);
        return h && n.includes(o) && a.onChange(), h;
      } });
    }
    get x() {
      return this[0];
    }
    get y() {
      return this[1];
    }
    get z() {
      return this[2];
    }
    get w() {
      return this[3];
    }
    set x(t) {
      this._target[0] = t, this.onChange();
    }
    set y(t) {
      this._target[1] = t, this.onChange();
    }
    set z(t) {
      this._target[2] = t, this.onChange();
    }
    set w(t) {
      this._target[3] = t, this.onChange();
    }
    identity() {
      return Gs(this._target), this.onChange(), this;
    }
    set(t, e, i, r) {
      return t.length ? this.copy(t) : (Js(this._target, t, e, i, r), this.onChange(), this);
    }
    rotateX(t) {
      return Ws(this._target, this._target, t), this.onChange(), this;
    }
    rotateY(t) {
      return Xs(this._target, this._target, t), this.onChange(), this;
    }
    rotateZ(t) {
      return qs(this._target, this._target, t), this.onChange(), this;
    }
    inverse(t = this._target) {
      return js(this._target, t), this.onChange(), this;
    }
    conjugate(t = this._target) {
      return Hs(this._target, t), this.onChange(), this;
    }
    copy(t) {
      return Zs(this._target, t), this.onChange(), this;
    }
    normalize(t = this._target) {
      return ei(this._target, t), this.onChange(), this;
    }
    multiply(t, e) {
      return e ? Me(this._target, t, e) : Me(this._target, this._target, t), this.onChange(), this;
    }
    dot(t) {
      return ti(this._target, t);
    }
    fromMatrix3(t) {
      return Ks(this._target, t), this.onChange(), this;
    }
    fromEuler(t, e) {
      return Qs(this._target, t, t.order), e || this.onChange(), this;
    }
    fromAxisAngle(t, e) {
      return $s(this._target, t, e), this.onChange(), this;
    }
    slerp(t, e) {
      return Ys(this._target, this._target, t, e), this.onChange(), this;
    }
    fromArray(t, e = 0) {
      return this._target[0] = t[e], this._target[1] = t[e + 1], this._target[2] = t[e + 2], this._target[3] = t[e + 3], this.onChange(), this;
    }
    toArray(t = [], e = 0) {
      return t[e] = this[0], t[e + 1] = this[1], t[e + 2] = this[2], t[e + 3] = this[3], t;
    }
  };
  var si = 1e-6;
  function ii(s, t) {
    return s[0] = t[0], s[1] = t[1], s[2] = t[2], s[3] = t[3], s[4] = t[4], s[5] = t[5], s[6] = t[6], s[7] = t[7], s[8] = t[8], s[9] = t[9], s[10] = t[10], s[11] = t[11], s[12] = t[12], s[13] = t[13], s[14] = t[14], s[15] = t[15], s;
  }
  function ri(s, t, e, i, r, n, a, o, h, l, c, u, d, f, g, x, p) {
    return s[0] = t, s[1] = e, s[2] = i, s[3] = r, s[4] = n, s[5] = a, s[6] = o, s[7] = h, s[8] = l, s[9] = c, s[10] = u, s[11] = d, s[12] = f, s[13] = g, s[14] = x, s[15] = p, s;
  }
  function ni(s) {
    return s[0] = 1, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = 1, s[6] = 0, s[7] = 0, s[8] = 0, s[9] = 0, s[10] = 1, s[11] = 0, s[12] = 0, s[13] = 0, s[14] = 0, s[15] = 1, s;
  }
  function ai(s, t) {
    let e = t[0], i = t[1], r = t[2], n = t[3], a = t[4], o = t[5], h = t[6], l = t[7], c = t[8], u = t[9], d = t[10], f = t[11], g = t[12], x = t[13], p = t[14], m = t[15], M = e * o - i * a, E = e * h - r * a, A = e * l - n * a, y = i * h - r * o, w = i * l - n * o, b = r * l - n * h, z = c * x - u * g, R = c * p - d * g, v = c * m - f * g, S = u * p - d * x, T = u * m - f * x, F = d * m - f * p, L = M * F - E * T + A * S + y * v - w * R + b * z;
    return L ? (L = 1 / L, s[0] = (o * F - h * T + l * S) * L, s[1] = (r * T - i * F - n * S) * L, s[2] = (x * b - p * w + m * y) * L, s[3] = (d * w - u * b - f * y) * L, s[4] = (h * v - a * F - l * R) * L, s[5] = (e * F - r * v + n * R) * L, s[6] = (p * A - g * b - m * E) * L, s[7] = (c * b - d * A + f * E) * L, s[8] = (a * T - o * v + l * z) * L, s[9] = (i * v - e * T - n * z) * L, s[10] = (g * w - x * A + m * M) * L, s[11] = (u * A - c * w - f * M) * L, s[12] = (o * R - a * S - h * z) * L, s[13] = (e * S - i * R + r * z) * L, s[14] = (x * E - g * y - p * M) * L, s[15] = (c * y - u * E + d * M) * L, s) : null;
  }
  function Ae(s) {
    let t = s[0], e = s[1], i = s[2], r = s[3], n = s[4], a = s[5], o = s[6], h = s[7], l = s[8], c = s[9], u = s[10], d = s[11], f = s[12], g = s[13], x = s[14], p = s[15], m = t * a - e * n, M = t * o - i * n, E = t * h - r * n, A = e * o - i * a, y = e * h - r * a, w = i * h - r * o, b = l * g - c * f, z = l * x - u * f, R = l * p - d * f, v = c * x - u * g, S = c * p - d * g, T = u * p - d * x;
    return m * T - M * S + E * v + A * R - y * z + w * b;
  }
  function _e(s, t, e) {
    let i = t[0], r = t[1], n = t[2], a = t[3], o = t[4], h = t[5], l = t[6], c = t[7], u = t[8], d = t[9], f = t[10], g = t[11], x = t[12], p = t[13], m = t[14], M = t[15], E = e[0], A = e[1], y = e[2], w = e[3];
    return s[0] = E * i + A * o + y * u + w * x, s[1] = E * r + A * h + y * d + w * p, s[2] = E * n + A * l + y * f + w * m, s[3] = E * a + A * c + y * g + w * M, E = e[4], A = e[5], y = e[6], w = e[7], s[4] = E * i + A * o + y * u + w * x, s[5] = E * r + A * h + y * d + w * p, s[6] = E * n + A * l + y * f + w * m, s[7] = E * a + A * c + y * g + w * M, E = e[8], A = e[9], y = e[10], w = e[11], s[8] = E * i + A * o + y * u + w * x, s[9] = E * r + A * h + y * d + w * p, s[10] = E * n + A * l + y * f + w * m, s[11] = E * a + A * c + y * g + w * M, E = e[12], A = e[13], y = e[14], w = e[15], s[12] = E * i + A * o + y * u + w * x, s[13] = E * r + A * h + y * d + w * p, s[14] = E * n + A * l + y * f + w * m, s[15] = E * a + A * c + y * g + w * M, s;
  }
  function hi(s, t, e) {
    let i = e[0], r = e[1], n = e[2], a, o, h, l, c, u, d, f, g, x, p, m;
    return t === s ? (s[12] = t[0] * i + t[4] * r + t[8] * n + t[12], s[13] = t[1] * i + t[5] * r + t[9] * n + t[13], s[14] = t[2] * i + t[6] * r + t[10] * n + t[14], s[15] = t[3] * i + t[7] * r + t[11] * n + t[15]) : (a = t[0], o = t[1], h = t[2], l = t[3], c = t[4], u = t[5], d = t[6], f = t[7], g = t[8], x = t[9], p = t[10], m = t[11], s[0] = a, s[1] = o, s[2] = h, s[3] = l, s[4] = c, s[5] = u, s[6] = d, s[7] = f, s[8] = g, s[9] = x, s[10] = p, s[11] = m, s[12] = a * i + c * r + g * n + t[12], s[13] = o * i + u * r + x * n + t[13], s[14] = h * i + d * r + p * n + t[14], s[15] = l * i + f * r + m * n + t[15]), s;
  }
  function oi(s, t, e) {
    let i = e[0], r = e[1], n = e[2];
    return s[0] = t[0] * i, s[1] = t[1] * i, s[2] = t[2] * i, s[3] = t[3] * i, s[4] = t[4] * r, s[5] = t[5] * r, s[6] = t[6] * r, s[7] = t[7] * r, s[8] = t[8] * n, s[9] = t[9] * n, s[10] = t[10] * n, s[11] = t[11] * n, s[12] = t[12], s[13] = t[13], s[14] = t[14], s[15] = t[15], s;
  }
  function li(s, t, e, i) {
    let r = i[0], n = i[1], a = i[2], o = Math.hypot(r, n, a), h, l, c, u, d, f, g, x, p, m, M, E, A, y, w, b, z, R, v, S, T, F, L, C;
    return Math.abs(o) < si ? null : (o = 1 / o, r *= o, n *= o, a *= o, h = Math.sin(e), l = Math.cos(e), c = 1 - l, u = t[0], d = t[1], f = t[2], g = t[3], x = t[4], p = t[5], m = t[6], M = t[7], E = t[8], A = t[9], y = t[10], w = t[11], b = r * r * c + l, z = n * r * c + a * h, R = a * r * c - n * h, v = r * n * c - a * h, S = n * n * c + l, T = a * n * c + r * h, F = r * a * c + n * h, L = n * a * c - r * h, C = a * a * c + l, s[0] = u * b + x * z + E * R, s[1] = d * b + p * z + A * R, s[2] = f * b + m * z + y * R, s[3] = g * b + M * z + w * R, s[4] = u * v + x * S + E * T, s[5] = d * v + p * S + A * T, s[6] = f * v + m * S + y * T, s[7] = g * v + M * S + w * T, s[8] = u * F + x * L + E * C, s[9] = d * F + p * L + A * C, s[10] = f * F + m * L + y * C, s[11] = g * F + M * L + w * C, t !== s && (s[12] = t[12], s[13] = t[13], s[14] = t[14], s[15] = t[15]), s);
  }
  function ci(s, t) {
    return s[0] = t[12], s[1] = t[13], s[2] = t[14], s;
  }
  function be(s, t) {
    let e = t[0], i = t[1], r = t[2], n = t[4], a = t[5], o = t[6], h = t[8], l = t[9], c = t[10];
    return s[0] = Math.hypot(e, i, r), s[1] = Math.hypot(n, a, o), s[2] = Math.hypot(h, l, c), s;
  }
  function ui(s) {
    let t = s[0], e = s[1], i = s[2], r = s[4], n = s[5], a = s[6], o = s[8], h = s[9], l = s[10];
    const c = t * t + e * e + i * i, u = r * r + n * n + a * a, d = o * o + h * h + l * l;
    return Math.sqrt(Math.max(c, u, d));
  }
  var ve = /* @__PURE__ */ (function() {
    const s = [1, 1, 1];
    return function(t, e) {
      let i = s;
      be(i, e);
      let r = 1 / i[0], n = 1 / i[1], a = 1 / i[2], o = e[0] * r, h = e[1] * n, l = e[2] * a, c = e[4] * r, u = e[5] * n, d = e[6] * a, f = e[8] * r, g = e[9] * n, x = e[10] * a, p = o + u + x, m = 0;
      return p > 0 ? (m = Math.sqrt(p + 1) * 2, t[3] = 0.25 * m, t[0] = (d - g) / m, t[1] = (f - l) / m, t[2] = (h - c) / m) : o > u && o > x ? (m = Math.sqrt(1 + o - u - x) * 2, t[3] = (d - g) / m, t[0] = 0.25 * m, t[1] = (h + c) / m, t[2] = (f + l) / m) : u > x ? (m = Math.sqrt(1 + u - o - x) * 2, t[3] = (f - l) / m, t[0] = (h + c) / m, t[1] = 0.25 * m, t[2] = (d + g) / m) : (m = Math.sqrt(1 + x - o - u) * 2, t[3] = (h - c) / m, t[0] = (f + l) / m, t[1] = (d + g) / m, t[2] = 0.25 * m), t;
    };
  })();
  function fi(s, t, e, i) {
    let r = ct([s[0], s[1], s[2]]);
    const n = ct([s[4], s[5], s[6]]), a = ct([s[8], s[9], s[10]]);
    Ae(s) < 0 && (r = -r), e[0] = s[12], e[1] = s[13], e[2] = s[14];
    const h = s.slice(), l = 1 / r, c = 1 / n, u = 1 / a;
    h[0] *= l, h[1] *= l, h[2] *= l, h[4] *= c, h[5] *= c, h[6] *= c, h[8] *= u, h[9] *= u, h[10] *= u, ve(t, h), i[0] = r, i[1] = n, i[2] = a;
  }
  function di(s, t, e, i) {
    const r = s, n = t[0], a = t[1], o = t[2], h = t[3], l = n + n, c = a + a, u = o + o, d = n * l, f = n * c, g = n * u, x = a * c, p = a * u, m = o * u, M = h * l, E = h * c, A = h * u, y = i[0], w = i[1], b = i[2];
    return r[0] = (1 - (x + m)) * y, r[1] = (f + A) * y, r[2] = (g - E) * y, r[3] = 0, r[4] = (f - A) * w, r[5] = (1 - (d + m)) * w, r[6] = (p + M) * w, r[7] = 0, r[8] = (g + E) * b, r[9] = (p - M) * b, r[10] = (1 - (d + x)) * b, r[11] = 0, r[12] = e[0], r[13] = e[1], r[14] = e[2], r[15] = 1, r;
  }
  function pi(s, t) {
    let e = t[0], i = t[1], r = t[2], n = t[3], a = e + e, o = i + i, h = r + r, l = e * a, c = i * a, u = i * o, d = r * a, f = r * o, g = r * h, x = n * a, p = n * o, m = n * h;
    return s[0] = 1 - u - g, s[1] = c + m, s[2] = d - p, s[3] = 0, s[4] = c - m, s[5] = 1 - l - g, s[6] = f + x, s[7] = 0, s[8] = d + p, s[9] = f - x, s[10] = 1 - l - u, s[11] = 0, s[12] = 0, s[13] = 0, s[14] = 0, s[15] = 1, s;
  }
  function gi(s, t, e, i, r) {
    let n = 1 / Math.tan(t / 2), a = 1 / (i - r);
    return s[0] = n / e, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = n, s[6] = 0, s[7] = 0, s[8] = 0, s[9] = 0, s[10] = (r + i) * a, s[11] = -1, s[12] = 0, s[13] = 0, s[14] = 2 * r * i * a, s[15] = 0, s;
  }
  function mi(s, t, e, i, r, n, a) {
    let o = 1 / (t - e), h = 1 / (i - r), l = 1 / (n - a);
    return s[0] = -2 * o, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = -2 * h, s[6] = 0, s[7] = 0, s[8] = 0, s[9] = 0, s[10] = 2 * l, s[11] = 0, s[12] = (t + e) * o, s[13] = (r + i) * h, s[14] = (a + n) * l, s[15] = 1, s;
  }
  function xi(s, t, e, i) {
    let r = t[0], n = t[1], a = t[2], o = i[0], h = i[1], l = i[2], c = r - e[0], u = n - e[1], d = a - e[2], f = c * c + u * u + d * d;
    f === 0 ? d = 1 : (f = 1 / Math.sqrt(f), c *= f, u *= f, d *= f);
    let g = h * d - l * u, x = l * c - o * d, p = o * u - h * c;
    return f = g * g + x * x + p * p, f === 0 && (l ? o += 1e-6 : h ? l += 1e-6 : h += 1e-6, g = h * d - l * u, x = l * c - o * d, p = o * u - h * c, f = g * g + x * x + p * p), f = 1 / Math.sqrt(f), g *= f, x *= f, p *= f, s[0] = g, s[1] = x, s[2] = p, s[3] = 0, s[4] = u * p - d * x, s[5] = d * g - c * p, s[6] = c * x - u * g, s[7] = 0, s[8] = c, s[9] = u, s[10] = d, s[11] = 0, s[12] = r, s[13] = n, s[14] = a, s[15] = 1, s;
  }
  function Te(s, t, e) {
    return s[0] = t[0] + e[0], s[1] = t[1] + e[1], s[2] = t[2] + e[2], s[3] = t[3] + e[3], s[4] = t[4] + e[4], s[5] = t[5] + e[5], s[6] = t[6] + e[6], s[7] = t[7] + e[7], s[8] = t[8] + e[8], s[9] = t[9] + e[9], s[10] = t[10] + e[10], s[11] = t[11] + e[11], s[12] = t[12] + e[12], s[13] = t[13] + e[13], s[14] = t[14] + e[14], s[15] = t[15] + e[15], s;
  }
  function Re(s, t, e) {
    return s[0] = t[0] - e[0], s[1] = t[1] - e[1], s[2] = t[2] - e[2], s[3] = t[3] - e[3], s[4] = t[4] - e[4], s[5] = t[5] - e[5], s[6] = t[6] - e[6], s[7] = t[7] - e[7], s[8] = t[8] - e[8], s[9] = t[9] - e[9], s[10] = t[10] - e[10], s[11] = t[11] - e[11], s[12] = t[12] - e[12], s[13] = t[13] - e[13], s[14] = t[14] - e[14], s[15] = t[15] - e[15], s;
  }
  function yi(s, t, e) {
    return s[0] = t[0] * e, s[1] = t[1] * e, s[2] = t[2] * e, s[3] = t[3] * e, s[4] = t[4] * e, s[5] = t[5] * e, s[6] = t[6] * e, s[7] = t[7] * e, s[8] = t[8] * e, s[9] = t[9] * e, s[10] = t[10] * e, s[11] = t[11] * e, s[12] = t[12] * e, s[13] = t[13] * e, s[14] = t[14] * e, s[15] = t[15] * e, s;
  }
  var U = class extends Array {
    constructor(t = 1, e = 0, i = 0, r = 0, n = 0, a = 1, o = 0, h = 0, l = 0, c = 0, u = 1, d = 0, f = 0, g = 0, x = 0, p = 1) {
      return super(t, e, i, r, n, a, o, h, l, c, u, d, f, g, x, p), this;
    }
    get x() {
      return this[12];
    }
    get y() {
      return this[13];
    }
    get z() {
      return this[14];
    }
    get w() {
      return this[15];
    }
    set x(t) {
      this[12] = t;
    }
    set y(t) {
      this[13] = t;
    }
    set z(t) {
      this[14] = t;
    }
    set w(t) {
      this[15] = t;
    }
    set(t, e, i, r, n, a, o, h, l, c, u, d, f, g, x, p) {
      return t.length ? this.copy(t) : (ri(this, t, e, i, r, n, a, o, h, l, c, u, d, f, g, x, p), this);
    }
    translate(t, e = this) {
      return hi(this, e, t), this;
    }
    rotate(t, e, i = this) {
      return li(this, i, t, e), this;
    }
    scale(t, e = this) {
      return oi(this, e, typeof t == "number" ? [t, t, t] : t), this;
    }
    add(t, e) {
      return e ? Te(this, t, e) : Te(this, this, t), this;
    }
    sub(t, e) {
      return e ? Re(this, t, e) : Re(this, this, t), this;
    }
    multiply(t, e) {
      return t.length ? e ? _e(this, t, e) : _e(this, this, t) : yi(this, this, t), this;
    }
    identity() {
      return ni(this), this;
    }
    copy(t) {
      return ii(this, t), this;
    }
    fromPerspective({ fov: t, aspect: e, near: i, far: r } = {}) {
      return gi(this, t, e, i, r), this;
    }
    fromOrthogonal({ left: t, right: e, bottom: i, top: r, near: n, far: a }) {
      return mi(this, t, e, i, r, n, a), this;
    }
    fromQuaternion(t) {
      return pi(this, t), this;
    }
    setPosition(t) {
      return this.x = t[0], this.y = t[1], this.z = t[2], this;
    }
    inverse(t = this) {
      return ai(this, t), this;
    }
    compose(t, e, i) {
      return di(this, t, e, i), this;
    }
    decompose(t, e, i) {
      return fi(this, t, e, i), this;
    }
    getRotation(t) {
      return ve(t, this), this;
    }
    getTranslation(t) {
      return ci(t, this), this;
    }
    getScaling(t) {
      return be(t, this), this;
    }
    getMaxScaleOnAxis() {
      return ui(this);
    }
    lookAt(t, e, i) {
      return xi(this, t, e, i), this;
    }
    determinant() {
      return Ae(this);
    }
    fromArray(t, e = 0) {
      return this[0] = t[e], this[1] = t[e + 1], this[2] = t[e + 2], this[3] = t[e + 3], this[4] = t[e + 4], this[5] = t[e + 5], this[6] = t[e + 6], this[7] = t[e + 7], this[8] = t[e + 8], this[9] = t[e + 9], this[10] = t[e + 10], this[11] = t[e + 11], this[12] = t[e + 12], this[13] = t[e + 13], this[14] = t[e + 14], this[15] = t[e + 15], this;
    }
    toArray(t = [], e = 0) {
      return t[e] = this[0], t[e + 1] = this[1], t[e + 2] = this[2], t[e + 3] = this[3], t[e + 4] = this[4], t[e + 5] = this[5], t[e + 6] = this[6], t[e + 7] = this[7], t[e + 8] = this[8], t[e + 9] = this[9], t[e + 10] = this[10], t[e + 11] = this[11], t[e + 12] = this[12], t[e + 13] = this[13], t[e + 14] = this[14], t[e + 15] = this[15], t;
    }
  };
  function wi(s, t, e = "YXZ") {
    return e === "XYZ" ? (s[1] = Math.asin(Math.min(Math.max(t[8], -1), 1)), Math.abs(t[8]) < 0.99999 ? (s[0] = Math.atan2(-t[9], t[10]), s[2] = Math.atan2(-t[4], t[0])) : (s[0] = Math.atan2(t[6], t[5]), s[2] = 0)) : e === "YXZ" ? (s[0] = Math.asin(-Math.min(Math.max(t[9], -1), 1)), Math.abs(t[9]) < 0.99999 ? (s[1] = Math.atan2(t[8], t[10]), s[2] = Math.atan2(t[1], t[5])) : (s[1] = Math.atan2(-t[2], t[0]), s[2] = 0)) : e === "ZXY" ? (s[0] = Math.asin(Math.min(Math.max(t[6], -1), 1)), Math.abs(t[6]) < 0.99999 ? (s[1] = Math.atan2(-t[2], t[10]), s[2] = Math.atan2(-t[4], t[5])) : (s[1] = 0, s[2] = Math.atan2(t[1], t[0]))) : e === "ZYX" ? (s[1] = Math.asin(-Math.min(Math.max(t[2], -1), 1)), Math.abs(t[2]) < 0.99999 ? (s[0] = Math.atan2(t[6], t[10]), s[2] = Math.atan2(t[1], t[0])) : (s[0] = 0, s[2] = Math.atan2(-t[4], t[5]))) : e === "YZX" ? (s[2] = Math.asin(Math.min(Math.max(t[1], -1), 1)), Math.abs(t[1]) < 0.99999 ? (s[0] = Math.atan2(-t[9], t[5]), s[1] = Math.atan2(-t[2], t[0])) : (s[0] = 0, s[1] = Math.atan2(t[8], t[10]))) : e === "XZY" && (s[2] = Math.asin(-Math.min(Math.max(t[4], -1), 1)), Math.abs(t[4]) < 0.99999 ? (s[0] = Math.atan2(t[6], t[5]), s[1] = Math.atan2(t[8], t[0])) : (s[0] = Math.atan2(-t[9], t[10]), s[1] = 0)), s;
  }
  var Fe = new U();
  var Le = class extends Array {
    constructor(t = 0, e = t, i = t, r = "YXZ") {
      super(t, e, i), this.order = r, this.onChange = () => {
      }, this._target = this;
      const n = ["0", "1", "2"];
      return new Proxy(this, { set(a, o) {
        const h = Reflect.set(...arguments);
        return h && n.includes(o) && a.onChange(), h;
      } });
    }
    get x() {
      return this[0];
    }
    get y() {
      return this[1];
    }
    get z() {
      return this[2];
    }
    set x(t) {
      this._target[0] = t, this.onChange();
    }
    set y(t) {
      this._target[1] = t, this.onChange();
    }
    set z(t) {
      this._target[2] = t, this.onChange();
    }
    set(t, e = t, i = t) {
      return t.length ? this.copy(t) : (this._target[0] = t, this._target[1] = e, this._target[2] = i, this.onChange(), this);
    }
    copy(t) {
      return this._target[0] = t[0], this._target[1] = t[1], this._target[2] = t[2], this.onChange(), this;
    }
    reorder(t) {
      return this._target.order = t, this.onChange(), this;
    }
    fromRotationMatrix(t, e = this.order) {
      return wi(this._target, t, e), this.onChange(), this;
    }
    fromQuaternion(t, e = this.order, i) {
      return Fe.fromQuaternion(t), this._target.fromRotationMatrix(Fe, e), i || this.onChange(), this;
    }
    fromArray(t, e = 0) {
      return this._target[0] = t[e], this._target[1] = t[e + 1], this._target[2] = t[e + 2], this;
    }
    toArray(t = [], e = 0) {
      return t[e] = this[0], t[e + 1] = this[1], t[e + 2] = this[2], t;
    }
  };
  var it = class {
    constructor() {
      this.parent = null, this.children = [], this.visible = true, this.matrix = new U(), this.worldMatrix = new U(), this.matrixAutoUpdate = true, this.worldMatrixNeedsUpdate = false, this.position = new _(), this.quaternion = new Z(), this.scale = new _(1), this.rotation = new Le(), this.up = new _(0, 1, 0), this.rotation._target.onChange = () => this.quaternion.fromEuler(this.rotation, true), this.quaternion._target.onChange = () => this.rotation.fromQuaternion(this.quaternion, void 0, true);
    }
    setParent(t, e = true) {
      this.parent && t !== this.parent && this.parent.removeChild(this, false), this.parent = t, e && t && t.addChild(this, false);
    }
    addChild(t, e = true) {
      ~this.children.indexOf(t) || this.children.push(t), e && t.setParent(this, false);
    }
    removeChild(t, e = true) {
      ~this.children.indexOf(t) && this.children.splice(this.children.indexOf(t), 1), e && t.setParent(null, false);
    }
    updateMatrixWorld(t) {
      this.matrixAutoUpdate && this.updateMatrix(), (this.worldMatrixNeedsUpdate || t) && (this.parent === null ? this.worldMatrix.copy(this.matrix) : this.worldMatrix.multiply(this.parent.worldMatrix, this.matrix), this.worldMatrixNeedsUpdate = false, t = true);
      for (let e = 0, i = this.children.length; e < i; e++) this.children[e].updateMatrixWorld(t);
    }
    updateMatrix() {
      this.matrix.compose(this.quaternion, this.position, this.scale), this.worldMatrixNeedsUpdate = true;
    }
    traverse(t) {
      if (!t(this)) for (let e = 0, i = this.children.length; e < i; e++) this.children[e].traverse(t);
    }
    decompose() {
      this.matrix.decompose(this.quaternion._target, this.position, this.scale), this.rotation.fromQuaternion(this.quaternion);
    }
    lookAt(t, e = false) {
      e ? this.matrix.lookAt(this.position, t, this.up) : this.matrix.lookAt(t, this.position, this.up), this.matrix.getRotation(this.quaternion._target), this.rotation.fromQuaternion(this.quaternion);
    }
  };
  var Ei = new U();
  var Mi = new _();
  var Ai = new _();
  function _i(s, t) {
    return s[0] = t[0], s[1] = t[1], s[2] = t[2], s[3] = t[4], s[4] = t[5], s[5] = t[6], s[6] = t[8], s[7] = t[9], s[8] = t[10], s;
  }
  function bi(s, t) {
    let e = t[0], i = t[1], r = t[2], n = t[3], a = e + e, o = i + i, h = r + r, l = e * a, c = i * a, u = i * o, d = r * a, f = r * o, g = r * h, x = n * a, p = n * o, m = n * h;
    return s[0] = 1 - u - g, s[3] = c - m, s[6] = d + p, s[1] = c + m, s[4] = 1 - l - g, s[7] = f - x, s[2] = d - p, s[5] = f + x, s[8] = 1 - l - u, s;
  }
  function vi(s, t) {
    return s[0] = t[0], s[1] = t[1], s[2] = t[2], s[3] = t[3], s[4] = t[4], s[5] = t[5], s[6] = t[6], s[7] = t[7], s[8] = t[8], s;
  }
  function Ti(s, t, e, i, r, n, a, o, h, l) {
    return s[0] = t, s[1] = e, s[2] = i, s[3] = r, s[4] = n, s[5] = a, s[6] = o, s[7] = h, s[8] = l, s;
  }
  function Ri(s) {
    return s[0] = 1, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 1, s[5] = 0, s[6] = 0, s[7] = 0, s[8] = 1, s;
  }
  function Fi(s, t) {
    let e = t[0], i = t[1], r = t[2], n = t[3], a = t[4], o = t[5], h = t[6], l = t[7], c = t[8], u = c * a - o * l, d = -c * n + o * h, f = l * n - a * h, g = e * u + i * d + r * f;
    return g ? (g = 1 / g, s[0] = u * g, s[1] = (-c * i + r * l) * g, s[2] = (o * i - r * a) * g, s[3] = d * g, s[4] = (c * e - r * h) * g, s[5] = (-o * e + r * n) * g, s[6] = f * g, s[7] = (-l * e + i * h) * g, s[8] = (a * e - i * n) * g, s) : null;
  }
  function Se(s, t, e) {
    let i = t[0], r = t[1], n = t[2], a = t[3], o = t[4], h = t[5], l = t[6], c = t[7], u = t[8], d = e[0], f = e[1], g = e[2], x = e[3], p = e[4], m = e[5], M = e[6], E = e[7], A = e[8];
    return s[0] = d * i + f * a + g * l, s[1] = d * r + f * o + g * c, s[2] = d * n + f * h + g * u, s[3] = x * i + p * a + m * l, s[4] = x * r + p * o + m * c, s[5] = x * n + p * h + m * u, s[6] = M * i + E * a + A * l, s[7] = M * r + E * o + A * c, s[8] = M * n + E * h + A * u, s;
  }
  function Li(s, t, e) {
    let i = t[0], r = t[1], n = t[2], a = t[3], o = t[4], h = t[5], l = t[6], c = t[7], u = t[8], d = e[0], f = e[1];
    return s[0] = i, s[1] = r, s[2] = n, s[3] = a, s[4] = o, s[5] = h, s[6] = d * i + f * a + l, s[7] = d * r + f * o + c, s[8] = d * n + f * h + u, s;
  }
  function Si(s, t, e) {
    let i = t[0], r = t[1], n = t[2], a = t[3], o = t[4], h = t[5], l = t[6], c = t[7], u = t[8], d = Math.sin(e), f = Math.cos(e);
    return s[0] = f * i + d * a, s[1] = f * r + d * o, s[2] = f * n + d * h, s[3] = f * a - d * i, s[4] = f * o - d * r, s[5] = f * h - d * n, s[6] = l, s[7] = c, s[8] = u, s;
  }
  function zi(s, t, e) {
    let i = e[0], r = e[1];
    return s[0] = i * t[0], s[1] = i * t[1], s[2] = i * t[2], s[3] = r * t[3], s[4] = r * t[4], s[5] = r * t[5], s[6] = t[6], s[7] = t[7], s[8] = t[8], s;
  }
  function Pi(s, t) {
    let e = t[0], i = t[1], r = t[2], n = t[3], a = t[4], o = t[5], h = t[6], l = t[7], c = t[8], u = t[9], d = t[10], f = t[11], g = t[12], x = t[13], p = t[14], m = t[15], M = e * o - i * a, E = e * h - r * a, A = e * l - n * a, y = i * h - r * o, w = i * l - n * o, b = r * l - n * h, z = c * x - u * g, R = c * p - d * g, v = c * m - f * g, S = u * p - d * x, T = u * m - f * x, F = d * m - f * p, L = M * F - E * T + A * S + y * v - w * R + b * z;
    return L ? (L = 1 / L, s[0] = (o * F - h * T + l * S) * L, s[1] = (h * v - a * F - l * R) * L, s[2] = (a * T - o * v + l * z) * L, s[3] = (r * T - i * F - n * S) * L, s[4] = (e * F - r * v + n * R) * L, s[5] = (i * v - e * T - n * z) * L, s[6] = (x * b - p * w + m * y) * L, s[7] = (p * A - g * b - m * E) * L, s[8] = (g * w - x * A + m * M) * L, s) : null;
  }
  var pt = class extends Array {
    constructor(t = 1, e = 0, i = 0, r = 0, n = 1, a = 0, o = 0, h = 0, l = 1) {
      return super(t, e, i, r, n, a, o, h, l), this;
    }
    set(t, e, i, r, n, a, o, h, l) {
      return t.length ? this.copy(t) : (Ti(this, t, e, i, r, n, a, o, h, l), this);
    }
    translate(t, e = this) {
      return Li(this, e, t), this;
    }
    rotate(t, e = this) {
      return Si(this, e, t), this;
    }
    scale(t, e = this) {
      return zi(this, e, t), this;
    }
    multiply(t, e) {
      return e ? Se(this, t, e) : Se(this, this, t), this;
    }
    identity() {
      return Ri(this), this;
    }
    copy(t) {
      return vi(this, t), this;
    }
    fromMatrix4(t) {
      return _i(this, t), this;
    }
    fromQuaternion(t) {
      return bi(this, t), this;
    }
    fromBasis(t, e, i) {
      return this.set(t[0], t[1], t[2], e[0], e[1], e[2], i[0], i[1], i[2]), this;
    }
    inverse(t = this) {
      return Fi(this, t), this;
    }
    getNormalMatrix(t) {
      return Pi(this, t), this;
    }
  };
  var Ci = 0;
  var W = class extends it {
    constructor(t, { geometry: e, program: i, mode: r = t.TRIANGLES, frustumCulled: n = true, renderOrder: a = 0 } = {}) {
      super(), t.canvas || console.error("gl not passed as first argument to Mesh"), this.gl = t, this.id = Ci++, this.geometry = e, this.program = i, this.mode = r, this.frustumCulled = n, this.renderOrder = a, this.modelViewMatrix = new U(), this.normalMatrix = new pt(), this.beforeRenderCallbacks = [], this.afterRenderCallbacks = [];
    }
    onBeforeRender(t) {
      return this.beforeRenderCallbacks.push(t), this;
    }
    onAfterRender(t) {
      return this.afterRenderCallbacks.push(t), this;
    }
    draw({ camera: t } = {}) {
      t && (this.program.uniforms.modelMatrix || Object.assign(this.program.uniforms, { modelMatrix: { value: null }, viewMatrix: { value: null }, modelViewMatrix: { value: null }, normalMatrix: { value: null }, projectionMatrix: { value: null }, cameraPosition: { value: null } }), this.program.uniforms.projectionMatrix.value = t.projectionMatrix, this.program.uniforms.cameraPosition.value = t.worldPosition, this.program.uniforms.viewMatrix.value = t.viewMatrix, this.modelViewMatrix.multiply(t.viewMatrix, this.worldMatrix), this.normalMatrix.getNormalMatrix(this.modelViewMatrix), this.program.uniforms.modelMatrix.value = this.worldMatrix, this.program.uniforms.modelViewMatrix.value = this.modelViewMatrix, this.program.uniforms.normalMatrix.value = this.normalMatrix), this.beforeRenderCallbacks.forEach((i) => i && i({ mesh: this, camera: t }));
      let e = this.program.cullFace && this.worldMatrix.determinant() < 0;
      this.program.use({ flipFaces: e }), this.geometry.draw({ mode: this.mode, program: this.program }), this.afterRenderCallbacks.forEach((i) => i && i({ mesh: this, camera: t }));
    }
  };
  var ze = new Uint8Array(4);
  var Ce = { black: "#000000", white: "#ffffff", red: "#ff0000", green: "#00ff00", blue: "#0000ff", fuchsia: "#ff00ff", cyan: "#00ffff", yellow: "#ffff00", orange: "#ff8000" };
  function Ne(s) {
    s.length === 4 && (s = s[0] + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]);
    const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(s);
    return t || console.warn(`Unable to convert hex string ${s} to rgb values`), [parseInt(t[1], 16) / 255, parseInt(t[2], 16) / 255, parseInt(t[3], 16) / 255];
  }
  function Ii(s) {
    return s = parseInt(s), [(s >> 16 & 255) / 255, (s >> 8 & 255) / 255, (s & 255) / 255];
  }
  function Ie(s) {
    return s === void 0 ? [0, 0, 0] : arguments.length === 3 ? arguments : isNaN(s) ? s[0] === "#" ? Ne(s) : Ce[s.toLowerCase()] ? Ne(Ce[s.toLowerCase()]) : (console.warn("Color format not recognised"), [0, 0, 0]) : Ii(s);
  }
  var zt = class extends Array {
    constructor(t) {
      return Array.isArray(t) ? super(...t) : super(...Ie(...arguments));
    }
    get r() {
      return this[0];
    }
    get g() {
      return this[1];
    }
    get b() {
      return this[2];
    }
    set r(t) {
      this[0] = t;
    }
    set g(t) {
      this[1] = t;
    }
    set b(t) {
      this[2] = t;
    }
    set(t) {
      return Array.isArray(t) ? this.copy(t) : this.copy(Ie(...arguments));
    }
    copy(t) {
      return this[0] = t[0], this[1] = t[1], this[2] = t[2], this;
    }
  };
  function Di(s, t) {
    return s[0] = t[0], s[1] = t[1], s;
  }
  function Oi(s, t, e) {
    return s[0] = t, s[1] = e, s;
  }
  function De(s, t, e) {
    return s[0] = t[0] + e[0], s[1] = t[1] + e[1], s;
  }
  function Oe(s, t, e) {
    return s[0] = t[0] - e[0], s[1] = t[1] - e[1], s;
  }
  function Bi(s, t, e) {
    return s[0] = t[0] * e[0], s[1] = t[1] * e[1], s;
  }
  function Ui(s, t, e) {
    return s[0] = t[0] / e[0], s[1] = t[1] / e[1], s;
  }
  function Pt(s, t, e) {
    return s[0] = t[0] * e, s[1] = t[1] * e, s;
  }
  function ki(s, t) {
    var e = t[0] - s[0], i = t[1] - s[1];
    return Math.sqrt(e * e + i * i);
  }
  function Vi(s, t) {
    var e = t[0] - s[0], i = t[1] - s[1];
    return e * e + i * i;
  }
  function Be(s) {
    var t = s[0], e = s[1];
    return Math.sqrt(t * t + e * e);
  }
  function Gi(s) {
    var t = s[0], e = s[1];
    return t * t + e * e;
  }
  function $i(s, t) {
    return s[0] = -t[0], s[1] = -t[1], s;
  }
  function Wi(s, t) {
    return s[0] = 1 / t[0], s[1] = 1 / t[1], s;
  }
  function Xi(s, t) {
    var e = t[0], i = t[1], r = e * e + i * i;
    return r > 0 && (r = 1 / Math.sqrt(r)), s[0] = t[0] * r, s[1] = t[1] * r, s;
  }
  function qi(s, t) {
    return s[0] * t[0] + s[1] * t[1];
  }
  function Ue(s, t) {
    return s[0] * t[1] - s[1] * t[0];
  }
  function Yi(s, t, e, i) {
    var r = t[0], n = t[1];
    return s[0] = r + i * (e[0] - r), s[1] = n + i * (e[1] - n), s;
  }
  function ji(s, t, e, i, r) {
    const n = Math.exp(-i * r);
    let a = t[0], o = t[1];
    return s[0] = e[0] + (a - e[0]) * n, s[1] = e[1] + (o - e[1]) * n, s;
  }
  function Hi(s, t, e) {
    var i = t[0], r = t[1];
    return s[0] = e[0] * i + e[3] * r + e[6], s[1] = e[1] * i + e[4] * r + e[7], s;
  }
  function Ki(s, t, e) {
    let i = t[0], r = t[1];
    return s[0] = e[0] * i + e[4] * r + e[12], s[1] = e[1] * i + e[5] * r + e[13], s;
  }
  function Qi(s, t) {
    return s[0] === t[0] && s[1] === t[1];
  }
  var V = class _V extends Array {
    constructor(t = 0, e = t) {
      return super(t, e), this;
    }
    get x() {
      return this[0];
    }
    get y() {
      return this[1];
    }
    set x(t) {
      this[0] = t;
    }
    set y(t) {
      this[1] = t;
    }
    set(t, e = t) {
      return t.length ? this.copy(t) : (Oi(this, t, e), this);
    }
    copy(t) {
      return Di(this, t), this;
    }
    add(t, e) {
      return e ? De(this, t, e) : De(this, this, t), this;
    }
    sub(t, e) {
      return e ? Oe(this, t, e) : Oe(this, this, t), this;
    }
    multiply(t) {
      return t.length ? Bi(this, this, t) : Pt(this, this, t), this;
    }
    divide(t) {
      return t.length ? Ui(this, this, t) : Pt(this, this, 1 / t), this;
    }
    inverse(t = this) {
      return Wi(this, t), this;
    }
    len() {
      return Be(this);
    }
    distance(t) {
      return t ? ki(this, t) : Be(this);
    }
    squaredLen() {
      return this.squaredDistance();
    }
    squaredDistance(t) {
      return t ? Vi(this, t) : Gi(this);
    }
    negate(t = this) {
      return $i(this, t), this;
    }
    cross(t, e) {
      return e ? Ue(t, e) : Ue(this, t);
    }
    scale(t) {
      return Pt(this, this, t), this;
    }
    normalize() {
      return Xi(this, this), this;
    }
    dot(t) {
      return qi(this, t);
    }
    equals(t) {
      return Qi(this, t);
    }
    applyMatrix3(t) {
      return Hi(this, this, t), this;
    }
    applyMatrix4(t) {
      return Ki(this, this, t), this;
    }
    lerp(t, e) {
      return Yi(this, this, t, e), this;
    }
    smoothLerp(t, e, i) {
      return ji(this, this, t, e, i), this;
    }
    clone() {
      return new _V(this[0], this[1]);
    }
    fromArray(t, e = 0) {
      return this[0] = t[e], this[1] = t[e + 1], this;
    }
    toArray(t = [], e = 0) {
      return t[e] = this[0], t[e + 1] = this[1], t;
    }
  };
  var gt = class extends $ {
    constructor(t, { attributes: e = {} } = {}) {
      Object.assign(e, { position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) }, uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) } }), super(t, e);
    }
  };
  var J = new _();
  var Y = new V();
  var H = new V();
  var ir = new V();
  var rr = new V();
  var nr = new V();
  var Ct = new _();
  var Ve = new _();
  var Ge = new _();
  var ar = new _();
  var hr = new _();
  var or = new _();
  var $e = new _();
  var Nt = new _();
  var We = new _();
  var Xe = new _();
  var lr = new _();
  var qe = new U();
  var It = "catmullrom";
  var Dt = "cubicbezier";
  var Ye = "quadraticbezier";
  var rt = new _();
  var nt = new _();
  var mt = new _();
  var je = new _();
  function ur(s, t, e = 0.168, i = 0.168) {
    if (t < 1 ? rt.sub(s[1], s[0]).scale(e).add(s[0]) : rt.sub(s[t + 1], s[t - 1]).scale(e).add(s[t]), t > s.length - 3) {
      const r = s.length - 1;
      nt.sub(s[r - 1], s[r]).scale(i).add(s[r]);
    } else nt.sub(s[t], s[t + 2]).scale(i).add(s[t + 1]);
    return [rt.clone(), nt.clone()];
  }
  function He(s, t, e, i) {
    const r = 1 - s;
    rt.copy(t).scale(r ** 2), nt.copy(e).scale(2 * r * s), mt.copy(i).scale(s ** 2);
    const n = new _();
    return n.add(rt, nt).add(mt), n;
  }
  function Ke(s, t, e, i, r) {
    const n = 1 - s;
    rt.copy(t).scale(n ** 3), nt.copy(e).scale(3 * n ** 2 * s), mt.copy(i).scale(3 * n * s ** 2), je.copy(r).scale(s ** 3);
    const a = new _();
    return a.add(rt, nt).add(mt).add(je), a;
  }
  var lt = class _lt {
    constructor({ points: t = [new _(0, 0, 0), new _(0, 1, 0), new _(1, 1, 0), new _(1, 0, 0)], divisions: e = 12, type: i = It } = {}) {
      this.points = t, this.divisions = e, this.type = i;
    }
    _getQuadraticBezierPoints(t = this.divisions) {
      const e = [], i = this.points.length;
      if (i < 3) return console.warn("Not enough points provided."), [];
      const r = this.points[0];
      let n = this.points[1], a = this.points[2];
      for (let h = 0; h <= t; h++) {
        const l = He(h / t, r, n, a);
        e.push(l);
      }
      let o = 3;
      for (; i - o > 0; ) {
        r.copy(a), n = a.scale(2).sub(n), a = this.points[o];
        for (let h = 1; h <= t; h++) {
          const l = He(h / t, r, n, a);
          e.push(l);
        }
        o++;
      }
      return e;
    }
    _getCubicBezierPoints(t = this.divisions) {
      const e = [], i = this.points.length;
      if (i < 4) return console.warn("Not enough points provided."), [];
      let r = this.points[0], n = this.points[1], a = this.points[2], o = this.points[3];
      for (let l = 0; l <= t; l++) {
        const c = Ke(l / t, r, n, a, o);
        e.push(c);
      }
      let h = 4;
      for (; i - h > 1; ) {
        r.copy(o), n = o.scale(2).sub(a), a = this.points[h], o = this.points[h + 1];
        for (let l = 1; l <= t; l++) {
          const c = Ke(l / t, r, n, a, o);
          e.push(c);
        }
        h += 2;
      }
      return e;
    }
    _getCatmullRomPoints(t = this.divisions, e = 0.168, i = 0.168) {
      const r = [];
      if (this.points.length <= 2) return this.points;
      let a;
      return this.points.forEach((o, h) => {
        if (h === 0) a = o;
        else {
          const [l, c] = ur(this.points, h - 1, e, i), u = new _lt({ points: [a, l, c, o], type: Dt });
          r.pop(), r.push(...u.getPoints(t)), a = o;
        }
      }), r;
    }
    getPoints(t = this.divisions, e = 0.168, i = 0.168) {
      const r = this.type;
      return r === Ye ? this._getQuadraticBezierPoints(t) : r === Dt ? this._getCubicBezierPoints(t) : r === It ? this._getCatmullRomPoints(t, e, i) : this.points;
    }
  };
  lt.CATMULLROM = It, lt.CUBICBEZIER = Dt, lt.QUADRATICBEZIER = Ye;
  var gr = new _();
  var xr = new _();
  var wr = new _();
  var at = new _();
  var Je = new U();
  var yt = new _();
  var ht = new _();
  var $t = new V();
  var wt = new _();
  var Wt = new _();
  var Xt = new Z();
  var qt = new _();
  var ts = new _();
  var es = new Z();
  var ss = new _();
  var rs = new U();
  var ot = new _();
  var os = new _();
  var Xr = new _();
  var qr = new _();
  var Yr = new _();
  var ls = new Z();
  var jr = new Z();
  var Hr = new Z();
  var Kr = new Z();
  var us = new U();
  var Qr = new U();
  var ft = new _();
  var Mt = new _();
  var dt = new _();
  var Zt = new _();
  var Jt = new _();

  // frontend/aurora.js
  var VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
  var FRAG = `#version 300 es
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

float snoise(vec2 v){
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

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {                int index = 0;                                              for (int i = 0; i < 2; i++) {                                    ColorStop currentColor = colors[i];                         bool isInBetween = currentColor.position <= factor;         index = int(mix(float(index), float(i), float(isInBetween)));   }                                                           ColorStop currentColor = colors[index];                     ColorStop nextColor = colors[index + 1];                    float range = nextColor.position - currentColor.position;   float lerpFactor = (factor - currentColor.position) / range;   finalColor = mix(currentColor.color, nextColor.color, lerpFactor); }

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
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  if (uLightMode > 0.5) {
    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);
    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86);
    vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    fragColor = vec4(mix(vec3(1.0), chroma, min(coverage * 1.08, 0.94)), 1.0);
  } else {
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
}
`;
  var AuroraEffect = class {
    constructor(containerId, options = {}) {
      this.ctn = document.getElementById(containerId);
      if (!this.ctn) return;
      const isLightMode = document.documentElement.getAttribute("data-theme") !== "dark";
      this.options = {
        colorStops: ["#5227FF", "#7cff67", "#5227FF"],
        // Default colors
        amplitude: 1,
        blend: 0.5,
        lightMode: options.lightMode !== void 0 ? options.lightMode : isLightMode,
        speed: 1,
        ...options
      };
      this.renderer = new ks({
        alpha: true,
        premultipliedAlpha: true,
        antialias: true
      });
      this.gl = this.renderer.gl;
      this.gl.clearColor(0, 0, 0, 0);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.canvas.style.backgroundColor = "transparent";
      this.gl.canvas.style.width = "100%";
      this.gl.canvas.style.height = "100%";
      this.program = null;
      this.animateId = 0;
      this.time = 0;
      this.init();
    }
    init() {
      const geometry = new gt(this.gl);
      if (geometry.attributes.uv) {
        delete geometry.attributes.uv;
      }
      const colorStopsArray = this.options.colorStops.map((hex) => {
        const c = new zt(hex);
        return [c.r, c.g, c.b];
      });
      this.program = new X(this.gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: this.options.amplitude },
          uColorStops: { value: colorStopsArray },
          uResolution: { value: [this.ctn.offsetWidth, this.ctn.offsetHeight] },
          uBlend: { value: this.options.blend },
          uLightMode: { value: this.options.lightMode ? 1 : 0 }
        }
      });
      this.mesh = new W(this.gl, { geometry, program: this.program });
      this.ctn.appendChild(this.gl.canvas);
      this.resize = this.resize.bind(this);
      window.addEventListener("resize", this.resize);
      this.resize();
      this.update = this.update.bind(this);
      this.animateId = requestAnimationFrame(this.update);
    }
    resize() {
      if (!this.ctn) return;
      const width = this.ctn.offsetWidth;
      const height = this.ctn.offsetHeight;
      this.renderer.setSize(width, height);
      if (this.program) {
        this.program.uniforms.uResolution.value = [width, height];
      }
    }
    update(t) {
      this.animateId = requestAnimationFrame(this.update);
      this.time = t * 0.01;
      this.program.uniforms.uTime.value = this.time * this.options.speed * 0.1;
      const isLightMode = document.documentElement.getAttribute("data-theme") !== "dark";
      this.program.uniforms.uLightMode.value = isLightMode ? 1 : 0;
      this.renderer.render({ scene: this.mesh });
    }
    destroy() {
      cancelAnimationFrame(this.animateId);
      window.removeEventListener("resize", this.resize);
      if (this.ctn && this.gl.canvas.parentNode === this.ctn) {
        this.ctn.removeChild(this.gl.canvas);
      }
      this.gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  };
  var initAurora = () => {
    alert("Aurora Script is Running!");
    console.log("Aurora init started!");
    const bg = document.getElementById("aurora-bg");
    if (bg) {
      console.log("aurora-bg found!");
    } else {
      console.error("aurora-bg NOT found!");
    }
    new AuroraEffect("aurora-bg", {
      colorStops: ["#5227FF", "#7cff67", "#5227FF"]
      // Purple and green
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAurora);
  } else {
    initAurora();
  }
})();
