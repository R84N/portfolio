/**
 * WebGL fluid "smoke" that follows the cursor.
 * Ported from the old project's cursor.js; the density is now written
 * in Vue/Node greens instead of the red channel only, and the canvas
 * is transparent where there is no smoke, so the page shows through.
 */

type FBO = [WebGLTexture, WebGLFramebuffer, number]
interface DoubleFBO { read: FBO; write: FBO; swap(): void }

const config = {
  TEXTURE_DOWNSAMPLE: 1,
  DENSITY_DISSIPATION: 0.98,
  VELOCITY_DISSIPATION: 0.99,
  PRESSURE_DISSIPATION: 0.8,
  PRESSURE_ITERATIONS: 25,
  CURL: 28,
  SPLAT_RADIUS: 0.001,
}

// Vue green (#42b883) and Node green (#68a063); each splat mixes between them
const VUE = [0.26, 0.72, 0.51]
const NODE = [0.41, 0.63, 0.39]

function pickColor(): [number, number, number] {
  const t = Math.random()
  const k = Math.random() * 0.9 + 0.35
  return [
    (VUE[0]! + (NODE[0]! - VUE[0]!) * t) * k,
    (VUE[1]! + (NODE[1]! - VUE[1]!) * t) * k,
    (VUE[2]! + (NODE[2]! - VUE[2]!) * t) * k,
  ]
}

const vertexSrc = `
precision highp float;
attribute vec2 aPosition;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const head = `precision highp float; precision mediump sampler2D;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;`

const shaders = {
  clear: `${head}
uniform sampler2D uTexture; uniform float value;
void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`,

  display: `${head}
uniform sampler2D uTexture;
void main () {
  vec3 c = texture2D(uTexture, vUv).rgb;
  float a = clamp(max(c.r, max(c.g, c.b)) * 1.15, 0.0, 1.0);
  gl_FragColor = vec4(min(c, vec3(a)), a);
}`,

  splat: `${head}
uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}`,

  advectionManual: `${head}
uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
vec4 bilerp (in sampler2D sam, in vec2 p) {
  vec4 st; st.xy = floor(p - 0.5) + 0.5; st.zw = st.xy + 1.0;
  vec4 uv = st * texelSize.xyxy;
  vec4 a = texture2D(sam, uv.xy); vec4 b = texture2D(sam, uv.zy);
  vec4 c = texture2D(sam, uv.xw); vec4 d = texture2D(sam, uv.zw);
  vec2 f = p - st.xy;
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
void main () {
  vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;
  gl_FragColor = dissipation * bilerp(uSource, coord);
  gl_FragColor.a = 1.0;
}`,

  advection: `${head}
uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  gl_FragColor = dissipation * texture2D(uSource, coord);
  gl_FragColor.a = 1.0;
}`,

  divergence: `${head}
uniform sampler2D uVelocity;
vec2 sampleVelocity (in vec2 uv) {
  vec2 m = vec2(1.0, 1.0);
  if (uv.x < 0.0) { uv.x = 0.0; m.x = -1.0; }
  if (uv.x > 1.0) { uv.x = 1.0; m.x = -1.0; }
  if (uv.y < 0.0) { uv.y = 0.0; m.y = -1.0; }
  if (uv.y > 1.0) { uv.y = 1.0; m.y = -1.0; }
  return m * texture2D(uVelocity, uv).xy;
}
void main () {
  float L = sampleVelocity(vL).x; float R = sampleVelocity(vR).x;
  float T = sampleVelocity(vT).y; float B = sampleVelocity(vB).y;
  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,

  curl: `${head}
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;
  gl_FragColor = vec4(R - L - T + B, 0.0, 0.0, 1.0);
}`,

  vorticity: `${head}
uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main () {
  float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x; float C = texture2D(uCurl, vUv).x;
  vec2 force = vec2(abs(T) - abs(B), 0.0);
  force *= 1.0 / length(force + 0.00001) * curl * C;
  vec2 vel = texture2D(uVelocity, vUv).xy;
  gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
}`,

  pressure: `${head}
uniform sampler2D uPressure; uniform sampler2D uDivergence;
vec2 boundary (in vec2 uv) { return min(max(uv, 0.0), 1.0); }
void main () {
  float L = texture2D(uPressure, boundary(vL)).x; float R = texture2D(uPressure, boundary(vR)).x;
  float T = texture2D(uPressure, boundary(vT)).x; float B = texture2D(uPressure, boundary(vB)).x;
  float divergence = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`,

  gradientSubtract: `${head}
uniform sampler2D uPressure; uniform sampler2D uVelocity;
vec2 boundary (in vec2 uv) { return min(max(uv, 0.0), 1.0); }
void main () {
  float L = texture2D(uPressure, boundary(vL)).x; float R = texture2D(uPressure, boundary(vR)).x;
  float T = texture2D(uPressure, boundary(vT)).x; float B = texture2D(uPressure, boundary(vB)).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`,
}

export function startFluid(canvas: HTMLCanvasElement): () => void {
  const params = { alpha: true, depth: false, stencil: false, antialias: false, premultipliedAlpha: true }
  let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext | WebGLRenderingContext | null
  const isWebGL2 = !!gl
  if (!gl) gl = canvas.getContext('webgl', params) as WebGLRenderingContext | null
  if (!gl) return () => {}
  const g = gl

  let halfFloatType: number
  let linear: unknown
  if (isWebGL2) {
    g.getExtension('EXT_color_buffer_float')
    linear = g.getExtension('OES_texture_float_linear')
    halfFloatType = (g as WebGL2RenderingContext).HALF_FLOAT
  } else {
    const hf = g.getExtension('OES_texture_half_float')
    linear = g.getExtension('OES_texture_half_float_linear')
    if (!hf) return () => {}
    halfFloatType = hf.HALF_FLOAT_OES
  }
  g.clearColor(0, 0, 0, 0)

  const supportsFormat = (internal: number, format: number) => {
    const tex = g.createTexture()
    g.bindTexture(g.TEXTURE_2D, tex)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.NEAREST)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST)
    g.texImage2D(g.TEXTURE_2D, 0, internal, 4, 4, 0, format, halfFloatType, null)
    const fbo = g.createFramebuffer()
    g.bindFramebuffer(g.FRAMEBUFFER, fbo)
    g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tex, 0)
    return g.checkFramebufferStatus(g.FRAMEBUFFER) === g.FRAMEBUFFER_COMPLETE
  }

  const getFormat = (internal: number, format: number): { internal: number; format: number } | null => {
    if (supportsFormat(internal, format)) return { internal, format }
    if (!isWebGL2) return null
    const g2 = g as WebGL2RenderingContext
    if (internal === g2.R16F) return getFormat(g2.RG16F, g2.RG)
    if (internal === g2.RG16F) return getFormat(g2.RGBA16F, g2.RGBA)
    return null
  }

  const g2 = g as WebGL2RenderingContext
  const rgba = isWebGL2 ? getFormat(g2.RGBA16F, g2.RGBA) : getFormat(g.RGBA, g.RGBA)
  const rg = isWebGL2 ? getFormat(g2.RG16F, g2.RG) : getFormat(g.RGBA, g.RGBA)
  const r = isWebGL2 ? getFormat(g2.R16F, g2.RED) : getFormat(g.RGBA, g.RGBA)
  if (!rgba || !rg || !r) return () => {}

  const compile = (type: number, src: string) => {
    const s = g.createShader(type)!
    g.shaderSource(s, src)
    g.compileShader(s)
    if (!g.getShaderParameter(s, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(s) ?? 'shader error')
    return s
  }

  const vertex = compile(g.VERTEX_SHADER, vertexSrc)

  class Program {
    uniforms: Record<string, WebGLUniformLocation | null> = {}
    program: WebGLProgram
    constructor(fragSrc: string) {
      this.program = g.createProgram()!
      g.attachShader(this.program, vertex)
      g.attachShader(this.program, compile(g.FRAGMENT_SHADER, fragSrc))
      g.bindAttribLocation(this.program, 0, 'aPosition')
      g.linkProgram(this.program)
      if (!g.getProgramParameter(this.program, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(this.program) ?? 'link error')
      const count = g.getProgramParameter(this.program, g.ACTIVE_UNIFORMS)
      for (let i = 0; i < count; i++) {
        const name = g.getActiveUniform(this.program, i)!.name
        this.uniforms[name] = g.getUniformLocation(this.program, name)
      }
    }
    bind() { g.useProgram(this.program) }
  }

  const clearProgram = new Program(shaders.clear)
  const displayProgram = new Program(shaders.display)
  const splatProgram = new Program(shaders.splat)
  const advectionProgram = new Program(linear ? shaders.advection : shaders.advectionManual)
  const divergenceProgram = new Program(shaders.divergence)
  const curlProgram = new Program(shaders.curl)
  const vorticityProgram = new Program(shaders.vorticity)
  const pressureProgram = new Program(shaders.pressure)
  const gradientProgram = new Program(shaders.gradientSubtract)

  const createFBO = (texId: number, w: number, h: number, internal: number, format: number, param: number): FBO => {
    g.activeTexture(g.TEXTURE0 + texId)
    const tex = g.createTexture()!
    g.bindTexture(g.TEXTURE_2D, tex)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, param)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, param)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
    g.texImage2D(g.TEXTURE_2D, 0, internal, w, h, 0, format, halfFloatType, null)
    const fbo = g.createFramebuffer()!
    g.bindFramebuffer(g.FRAMEBUFFER, fbo)
    g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tex, 0)
    g.viewport(0, 0, w, h)
    g.clear(g.COLOR_BUFFER_BIT)
    return [tex, fbo, texId]
  }

  const createDoubleFBO = (texId: number, w: number, h: number, internal: number, format: number, param: number): DoubleFBO => {
    let a = createFBO(texId, w, h, internal, format, param)
    let b = createFBO(texId + 1, w, h, internal, format, param)
    return {
      get read() { return a },
      get write() { return b },
      swap() { const t = a; a = b; b = t },
    }
  }

  let texW = 0
  let texH = 0
  let density!: DoubleFBO
  let velocity!: DoubleFBO
  let divergence!: FBO
  let curl!: FBO
  let pressure!: DoubleFBO

  const initFramebuffers = () => {
    texW = g.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE
    texH = g.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE
    const filter = linear ? g.LINEAR : g.NEAREST
    density = createDoubleFBO(2, texW, texH, rgba.internal, rgba.format, filter)
    velocity = createDoubleFBO(0, texW, texH, rg.internal, rg.format, filter)
    divergence = createFBO(4, texW, texH, r.internal, r.format, g.NEAREST)
    curl = createFBO(5, texW, texH, r.internal, r.format, g.NEAREST)
    pressure = createDoubleFBO(6, texW, texH, r.internal, r.format, g.NEAREST)
  }

  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
  initFramebuffers()

  g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer())
  g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), g.STATIC_DRAW)
  g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, g.createBuffer())
  g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), g.STATIC_DRAW)
  g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0)
  g.enableVertexAttribArray(0)

  const blit = (target: WebGLFramebuffer | null) => {
    g.bindFramebuffer(g.FRAMEBUFFER, target)
    g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0)
  }

  const splat = (x: number, y: number, dx: number, dy: number, color: number[]) => {
    splatProgram.bind()
    g.uniform1i(splatProgram.uniforms.uTarget!, velocity.read[2])
    g.uniform1f(splatProgram.uniforms.aspectRatio!, canvas.width / canvas.height)
    g.uniform2f(splatProgram.uniforms.point!, x / canvas.width, 1.0 - y / canvas.height)
    g.uniform3f(splatProgram.uniforms.color!, dx, -dy, 1.0)
    g.uniform1f(splatProgram.uniforms.radius!, config.SPLAT_RADIUS)
    blit(velocity.write[1])
    velocity.swap()

    g.uniform1i(splatProgram.uniforms.uTarget!, density.read[2])
    g.uniform3f(splatProgram.uniforms.color!, color[0]!, color[1]!, color[2]!)
    blit(density.write[1])
    density.swap()
  }

  const multipleSplats = (amount: number) => {
    for (let i = 0; i < amount; i++) {
      splat(
        canvas.width * Math.random(),
        canvas.height * Math.random(),
        1000 * (Math.random() - 0.5),
        1000 * (Math.random() - 0.5),
        pickColor().map(c => c * 0.6),
      )
    }
  }

  // pointer state (one for the mouse, more for multi-touch)
  interface Pointer { id: number; x: number; y: number; dx: number; dy: number; moved: boolean; color: number[] }
  const newPointer = (): Pointer => ({ id: -1, x: 0, y: 0, dx: 0, dy: 0, moved: false, color: pickColor() })
  const pointers: Pointer[] = [newPointer()]
  let hasMouse = false

  const onMouseMove = (e: MouseEvent) => {
    const p = pointers[0]!
    if (!hasMouse) { p.x = e.clientX; p.y = e.clientY; hasMouse = true }
    p.dx = (e.clientX - p.x) * 10.0
    p.dy = (e.clientY - p.y) * 10.0
    p.x = e.clientX
    p.y = e.clientY
    p.moved = true
    p.color = pickColor()
  }

  const onTouchStart = (e: TouchEvent) => {
    for (let i = 0; i < e.touches.length; i++) {
      if (i >= pointers.length) pointers.push(newPointer())
      const t = e.touches[i]!
      const p = pointers[i]!
      p.id = t.identifier
      p.x = t.clientX
      p.y = t.clientY
      p.color = pickColor()
    }
  }

  const onTouchMove = (e: TouchEvent) => {
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i]!
      const p = pointers[i]
      if (!p) continue
      p.dx = (t.clientX - p.x) * 10.0
      p.dy = (t.clientY - p.y) * 10.0
      p.x = t.clientX
      p.y = t.clientY
      p.moved = true
    }
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })

  let lastTime = performance.now()
  let raf = 0
  multipleSplats(Math.floor(Math.random() * 12) + 6)

  const update = () => {
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      initFramebuffers()
    }

    const now = performance.now()
    const dt = Math.min((now - lastTime) / 1000, 0.016)
    lastTime = now

    g.viewport(0, 0, texW, texH)

    advectionProgram.bind()
    g.uniform2f(advectionProgram.uniforms.texelSize!, 1 / texW, 1 / texH)
    g.uniform1i(advectionProgram.uniforms.uVelocity!, velocity.read[2])
    g.uniform1i(advectionProgram.uniforms.uSource!, velocity.read[2])
    g.uniform1f(advectionProgram.uniforms.dt!, dt)
    g.uniform1f(advectionProgram.uniforms.dissipation!, config.VELOCITY_DISSIPATION)
    blit(velocity.write[1])
    velocity.swap()

    g.uniform1i(advectionProgram.uniforms.uVelocity!, velocity.read[2])
    g.uniform1i(advectionProgram.uniforms.uSource!, density.read[2])
    g.uniform1f(advectionProgram.uniforms.dissipation!, config.DENSITY_DISSIPATION)
    blit(density.write[1])
    density.swap()

    for (const p of pointers) {
      if (p.moved) {
        splat(p.x, p.y, p.dx, p.dy, p.color)
        p.moved = false
      }
    }

    curlProgram.bind()
    g.uniform2f(curlProgram.uniforms.texelSize!, 1 / texW, 1 / texH)
    g.uniform1i(curlProgram.uniforms.uVelocity!, velocity.read[2])
    blit(curl[1])

    vorticityProgram.bind()
    g.uniform2f(vorticityProgram.uniforms.texelSize!, 1 / texW, 1 / texH)
    g.uniform1i(vorticityProgram.uniforms.uVelocity!, velocity.read[2])
    g.uniform1i(vorticityProgram.uniforms.uCurl!, curl[2])
    g.uniform1f(vorticityProgram.uniforms.curl!, config.CURL)
    g.uniform1f(vorticityProgram.uniforms.dt!, dt)
    blit(velocity.write[1])
    velocity.swap()

    divergenceProgram.bind()
    g.uniform2f(divergenceProgram.uniforms.texelSize!, 1 / texW, 1 / texH)
    g.uniform1i(divergenceProgram.uniforms.uVelocity!, velocity.read[2])
    blit(divergence[1])

    clearProgram.bind()
    let pressureTexId = pressure.read[2]
    g.activeTexture(g.TEXTURE0 + pressureTexId)
    g.bindTexture(g.TEXTURE_2D, pressure.read[0])
    g.uniform1i(clearProgram.uniforms.uTexture!, pressureTexId)
    g.uniform1f(clearProgram.uniforms.value!, config.PRESSURE_DISSIPATION)
    blit(pressure.write[1])
    pressure.swap()

    pressureProgram.bind()
    g.uniform2f(pressureProgram.uniforms.texelSize!, 1 / texW, 1 / texH)
    g.uniform1i(pressureProgram.uniforms.uDivergence!, divergence[2])
    pressureTexId = pressure.read[2]
    g.uniform1i(pressureProgram.uniforms.uPressure!, pressureTexId)
    g.activeTexture(g.TEXTURE0 + pressureTexId)
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      g.bindTexture(g.TEXTURE_2D, pressure.read[0])
      blit(pressure.write[1])
      pressure.swap()
    }

    gradientProgram.bind()
    g.uniform2f(gradientProgram.uniforms.texelSize!, 1 / texW, 1 / texH)
    g.uniform1i(gradientProgram.uniforms.uPressure!, pressure.read[2])
    g.uniform1i(gradientProgram.uniforms.uVelocity!, velocity.read[2])
    blit(velocity.write[1])
    velocity.swap()

    g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight)
    displayProgram.bind()
    g.uniform1i(displayProgram.uniforms.uTexture!, density.read[2])
    blit(null)

    raf = requestAnimationFrame(update)
  }
  raf = requestAnimationFrame(update)

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
    g.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
