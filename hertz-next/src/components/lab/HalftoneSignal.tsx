'use client'

import { useEffect, useRef } from 'react'
import styles from './HalftoneSignal.module.css'

/**
 * Proto C — PRINT / HALFTONE SIGNAL.
 * La foto reale del floor viene "stampata" a retino (halftone) su carta
 * Signal, in due separazioni: Ink + Cold-Blue. Una banda di frequenza
 * attraversa la stampa, ingrossa il retino e sfasa i canali (fuori registro),
 * poi tutto TORNA a registro (ORDER). Poster vivente, non glitch.
 * Tech: WebGL (fragment shader) + progressive enhancement; fallback statico
 * CSS (retino a punti) per reduced-motion / no-WebGL.
 */
const PHOTO = '/assets/hero-booth.jpg'

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;
uniform vec2  uRes;    // canvas px (device)
uniform vec2  uImg;    // image px
uniform float uTime;
uniform float uDpr;
uniform sampler2D uTex;

const vec3 PAPER = vec3(0.639, 0.718, 0.718); // Signal #A3B7B7
const vec3 INK   = vec3(0.075, 0.078, 0.086); // ~ #131416
const vec3 COLD  = vec3(0.314, 0.467, 0.541); // Cold-Blue #50778A

float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }

// UV "cover" dell'immagine sul canvas
vec2 coverUv(vec2 fragPx){
  float scale = max(uRes.x/uImg.x, uRes.y/uImg.y);
  vec2 draw = uImg * scale;
  return (fragPx - (uRes - draw) * 0.5) / draw;
}

// campiona luminanza in HIGH-KEY: la carta Signal resta dominante (editoriale
// chiaro), solo le ombre della foto stampano come punti → mai fondo scuro.
float sampleL(vec2 fragPx){
  vec2 uv = coverUv(fragPx);
  uv = clamp(uv, 0.0, 1.0);
  float l = luma(texture2D(uTex, uv).rgb);
  return clamp(0.52 + l * 0.48, 0.0, 1.0);
}

// punto di retino: 1 dentro il punto, 0 fuori. scuro → punto grande.
float dot_(vec2 fragPx, float cell, float ang, float L){
  float s = sin(ang), c = cos(ang);
  mat2 R = mat2(c, -s, s, c);
  vec2 p = R * fragPx / cell;
  float d = length(fract(p) - 0.5) * 2.0;
  float r = sqrt(clamp(1.0 - L, 0.0, 1.0));
  return smoothstep(r + 0.09, r - 0.09, d);
}

void main(){
  vec2 fragPx = gl_FragCoord.xy;
  float x = fragPx.x / uRes.x;

  // fronte d'onda: attraversa, poi pausa (ORDER)
  float cycle = 8.0;
  float p = mod(uTime, cycle) / cycle;
  float sweep = p < 0.78 ? p / 0.78 : 1.0;
  float center = -0.2 + sweep * 1.4;
  float band = exp(-pow((x - center) / 0.14, 2.0)); // 0..1

  // dentro la banda: retino più grosso + canali fuori registro
  float cell = mix(6.5, 10.0, band) * uDpr;
  float off  = band * 6.5 * uDpr;
  float aInk = 0.2618 + band * 0.2;    // ~15° + disturbo
  float aCol = 1.309  + band * 0.2;    // ~75°

  float Li = sampleL(fragPx);
  float Lc = sampleL(fragPx + vec2(off, 0.0));

  float ink = dot_(fragPx, cell, aInk, Li);
  float col = dot_(fragPx + vec2(off, 0.0), cell * 1.03, aCol, Lc);

  vec3 c = PAPER;
  c = mix(c, COLD, col * 0.3);
  c = mix(c, INK,  ink * 0.66);

  // leggerissima barra di "passata di stampa" sul fronte
  c += band * 0.02;

  gl_FragColor = vec4(c, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('[HalftoneSignal] shader', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export default function HalftoneSignal() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const fallback = fallbackRef.current
    if (!canvas || !wrap) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // resta il fallback statico (retino CSS)

    const gl = (canvas.getContext('webgl', { antialias: false, alpha: false }) ||
      canvas.getContext('experimental-webgl', { antialias: false, alpha: false })) as WebGLRenderingContext | null
    if (!gl) return // no-WebGL → resta il fallback statico

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[HalftoneSignal] link', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uImg = gl.getUniformLocation(prog, 'uImg')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uDpr = gl.getUniformLocation(prog, 'uDpr')
    const uTex = gl.getUniformLocation(prog, 'uTex')

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    // pixel provvisorio finché la foto non è caricata
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([163, 183, 183, 255]))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    let imgW = 1
    let imgH = 1
    const img = new Image()
    img.onload = () => {
      imgW = img.naturalWidth
      imgH = img.naturalHeight
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      if (fallback) fallback.style.opacity = '0' // WebGL pronto → spegni il fallback
    }
    img.src = PHOTO

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    function resize() {
      const r = wrap!.getBoundingClientRect()
      const w = Math.max(1, Math.round(r.width * dpr))
      const h = Math.max(1, Math.round(r.height * dpr))
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w
        canvas!.height = h
      }
      gl!.viewport(0, 0, w, h)
    }
    resize()

    let raf = 0
    let running = false
    let start = 0
    function frame(now: number) {
      if (!running) return
      if (!start) start = now
      gl!.uniform2f(uRes, canvas!.width, canvas!.height)
      gl!.uniform2f(uImg, imgW, imgH)
      gl!.uniform1f(uTime, (now - start) / 1000)
      gl!.uniform1f(uDpr, dpr)
      gl!.uniform1i(uTex, 0)
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(frame)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting && !running) {
          running = true
          start = 0
          raf = requestAnimationFrame(frame)
        } else if (!e[0].isIntersecting) {
          running = false
          if (raf) cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 },
    )
    io.observe(wrap)
    running = true
    raf = requestAnimationFrame(frame)

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      gl.deleteTexture(tex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      const lose = gl.getExtension('WEBGL_lose_context')
      if (lose) lose.loseContext()
    }
  }, [])

  return (
    <div ref={wrapRef} className={styles.wrap} aria-hidden="true">
      {/* fallback statico: foto + retino CSS (reduced-motion / no-WebGL) */}
      <div ref={fallbackRef} className={styles.fallback} />
      <canvas ref={canvasRef} className={styles.canvas} />
      {/* velo Signal a sinistra: garantisce la leggibilità del testo,
          la stampa resta piena nello spazio negativo a destra */}
      <div className={styles.scrim} />
    </div>
  )
}
