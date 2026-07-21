import * as THREE from 'three'

/**
 * Costruisce la geometria 3D del logo ufficiale Hertz.
 *
 * Port FEDELE della pipeline legacy `makeLogoFormation.build()`
 * (hero3d-scenes.jsx:93-327): PNG-alpha → marching squares →
 * walk-loops → Chaikin ×4 → arc-length resample → gerarchia fori →
 * THREE.Shape+holes → ExtrudeGeometry (bevel OFF) → weld normali laterali.
 *
 * La geometria (= forma del logo) è preservata identica al brand asset.
 * Il MATERIALE non è portato: nel nuovo progetto è un materiale sobrio
 * on-token (vedi HertzLogo3D), non il ShaderMaterial legacy a 9 modi.
 *
 * Richiede un'immagine già caricata + `getImageData` → SOLO client-side.
 */

type Pt = [number, number]
type Loop = Pt[]

const DEPTH = 0.5 // profondità estrusione (const legacy)
const WORLD_W = 5.0 // larghezza in unità mondo (const legacy W)

export function buildHertzLogoGeometry(
  image: HTMLImageElement | ImageBitmap,
): THREE.ExtrudeGeometry {
  const imgW = image.width
  const imgH = image.height
  const aspect = imgW / imgH
  const W = WORLD_W
  const H = W / aspect

  /* ── 1. Campionamento alpha ad alta risoluzione ── */
  const sampW = 500
  const sampH = Math.round(sampW / aspect)
  const cnv = document.createElement('canvas')
  cnv.width = sampW
  cnv.height = sampH
  const cx = cnv.getContext('2d')!
  cx.drawImage(image, 0, 0, sampW, sampH)
  const data = cx.getImageData(0, 0, sampW, sampH).data
  const A = new Uint8Array(sampW * sampH)
  for (let i = 0; i < sampW * sampH; i++) A[i] = data[i * 4 + 3]

  /* ── 2. Marching squares → segmenti di contorno orientati ── */
  const threshold = 140
  const segs: [Pt, Pt][] = []
  for (let y = 0; y < sampH - 1; y++) {
    for (let x = 0; x < sampW - 1; x++) {
      const tl = A[y * sampW + x] >= threshold ? 1 : 0
      const tr = A[y * sampW + x + 1] >= threshold ? 2 : 0
      const br = A[(y + 1) * sampW + x + 1] >= threshold ? 4 : 0
      const bl = A[(y + 1) * sampW + x] >= threshold ? 8 : 0
      const idx = tl + tr + br + bl
      if (idx === 0 || idx === 15) continue
      const Nm: Pt = [x + 0.5, y]
      const Em: Pt = [x + 1, y + 0.5]
      const Sm: Pt = [x + 0.5, y + 1]
      const Wm: Pt = [x, y + 0.5]
      switch (idx) {
        case 1: segs.push([Wm, Nm]); break
        case 2: segs.push([Nm, Em]); break
        case 3: segs.push([Wm, Em]); break
        case 4: segs.push([Em, Sm]); break
        case 5: segs.push([Wm, Nm]); segs.push([Em, Sm]); break
        case 6: segs.push([Nm, Sm]); break
        case 7: segs.push([Wm, Sm]); break
        case 8: segs.push([Sm, Wm]); break
        case 9: segs.push([Sm, Nm]); break
        case 10: segs.push([Nm, Em]); segs.push([Sm, Wm]); break
        case 11: segs.push([Sm, Em]); break
        case 12: segs.push([Em, Wm]); break
        case 13: segs.push([Em, Nm]); break
        case 14: segs.push([Nm, Wm]); break
      }
    }
  }

  /* ── 3. Cammina i segmenti → loop chiusi ── */
  const key = (p: Pt) => ((p[0] * 2) | 0) + ',' + ((p[1] * 2) | 0)
  const startMap = new Map<string, number[]>()
  for (let i = 0; i < segs.length; i++) {
    const k = key(segs[i][0])
    if (!startMap.has(k)) startMap.set(k, [])
    startMap.get(k)!.push(i)
  }
  const used = new Uint8Array(segs.length)
  const rawLoops: Loop[] = []
  for (let s = 0; s < segs.length; s++) {
    if (used[s]) continue
    const loop: Loop = []
    let cur: number | undefined = s
    let safety = segs.length + 1
    while (cur !== undefined && !used[cur] && safety-- > 0) {
      used[cur] = 1
      loop.push(segs[cur][0])
      const endK = key(segs[cur][1])
      const cands = startMap.get(endK) || []
      cur = undefined
      for (const i of cands) {
        if (!used[i]) { cur = i; break }
      }
    }
    if (loop.length >= 8) rawLoops.push(loop)
  }

  /* ── 4. Mappa in world space (centrato, Y up) ── */
  const wLoops: Loop[] = rawLoops.map((loop) =>
    loop.map(([x, y]): Pt => [
      (x / sampW - 0.5) * W,
      -(y / sampH - 0.5) * H,
    ]),
  )

  /* ── 5. Smoothing: 4 passate di Chaikin ── */
  const smoothLoop = (loop: Loop): Loop => {
    const out: Loop = []
    for (let i = 0; i < loop.length; i++) {
      const a = loop[i]
      const b = loop[(i + 1) % loop.length]
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25])
      out.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75])
    }
    return out
  }
  const smoothed = wLoops
    .map(smoothLoop).map(smoothLoop).map(smoothLoop).map(smoothLoop)

  /* ── 5b. Resample arc-length → spaziatura vertici uniforme ── */
  const resampleLoop = (loop: Loop): Loop => {
    const arcs = [0]
    for (let i = 0; i < loop.length; i++) {
      const a = loop[i], b = loop[(i + 1) % loop.length]
      arcs.push(arcs[i] + Math.hypot(b[0] - a[0], b[1] - a[1]))
    }
    const total = arcs[arcs.length - 1]
    const n = Math.max(32, Math.round(total / 0.03))
    const out: Loop = []
    for (let k = 0; k < n; k++) {
      const t = (k / n) * total
      let lo = 0, hi = loop.length - 1
      while (lo < hi - 1) { const mid = (lo + hi) >> 1; if (arcs[mid] <= t) lo = mid; else hi = mid }
      const s = (t - arcs[lo]) / (arcs[lo + 1] - arcs[lo] + 1e-10)
      const a = loop[lo], b = loop[(lo + 1) % loop.length]
      out.push([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s])
    }
    return out
  }
  const finalLoops = smoothed.map(resampleLoop)

  /* ── 6. Area con segno + point-in-polygon ── */
  const signedArea = (loop: Loop): number => {
    let a = 0
    for (let i = 0; i < loop.length; i++) {
      const [x1, y1] = loop[i]
      const [x2, y2] = loop[(i + 1) % loop.length]
      a += x1 * y2 - x2 * y1
    }
    return a * 0.5
  }
  const pip = (px: number, py: number, loop: Loop): boolean => {
    let ins = false
    for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
      const [xi, yi] = loop[i]
      const [xj, yj] = loop[j]
      if (((yi > py) !== (yj > py)) &&
        (px < ((xj - xi) * (py - yi)) / (yj - yi + 1e-9) + xi)) {
        ins = !ins
      }
    }
    return ins
  }

  /* ── 7. Gerarchia annidamento: ogni loop → parent più stretto ── */
  type LoopInfo = {
    idx: number; loop: Loop; area: number; absArea: number
    cx: number; cy: number; parent: number; depth: number
  }
  const info: LoopInfo[] = finalLoops.map((loop, i) => {
    const area = signedArea(loop)
    let cx = 0, cy = 0
    for (const p of loop) { cx += p[0]; cy += p[1] }
    cx /= loop.length; cy /= loop.length
    return { idx: i, loop, area, absArea: Math.abs(area), cx, cy, parent: -1, depth: 0 }
  })
  info.forEach((L) => {
    let parent = -1, parentArea = Infinity
    for (const P of info) {
      if (P.idx === L.idx) continue
      if (P.absArea <= L.absArea) continue
      if (pip(L.cx, L.cy, P.loop)) {
        if (P.absArea < parentArea) { parent = P.idx; parentArea = P.absArea }
      }
    }
    L.parent = parent
  })
  info.forEach((L) => {
    let d = 0
    let cur: LoopInfo = L
    while (cur.parent !== -1) { d++; cur = info[cur.parent]; if (d > 20) break }
    L.depth = d
  })

  /* ── 8. Costruzione Shapes (depth pari = outer, dispari = hole) ── */
  const shapes: THREE.Shape[] = []
  info.filter((L) => L.depth % 2 === 0).forEach((O) => {
    const shape = new THREE.Shape()
    let pts = O.loop
    if (O.area < 0) pts = pts.slice().reverse() // outer CCW
    shape.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i][0], pts[i][1])
    shape.closePath()
    info.forEach((Hh) => {
      if (Hh.parent !== O.idx) return
      const hole = new THREE.Path()
      let hpts = Hh.loop
      if (Hh.area > 0) hpts = hpts.slice().reverse() // hole CW
      hole.moveTo(hpts[0][0], hpts[0][1])
      for (let i = 1; i < hpts.length; i++) hole.lineTo(hpts[i][0], hpts[i][1])
      hole.closePath()
      shape.holes.push(hole)
    })
    shapes.push(shape)
  })

  /* ── 9. Estrusione, bevel OFF (fianchi netti — coerente col master statico) ── */
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: DEPTH,
    bevelEnabled: false,
    curveSegments: 1,
    steps: 1,
  })
  geo.translate(0, 0, -DEPTH / 2) // pivot al centro
  geo.computeVertexNormals()

  /* ── 9b. Weld normali laterali per posizione XY → shading liscio sui fianchi ── */
  {
    const posArr = geo.attributes.position.array as ArrayLike<number>
    const normArr = geo.attributes.normal.array as Float32Array
    const vc = posArr.length / 3
    const EPS = 1.5e-3
    const buckets = new Map<string, number[]>()
    for (let i = 0; i < vc; i++) {
      const kx = Math.round(posArr[i * 3] / EPS)
      const ky = Math.round(posArr[i * 3 + 1] / EPS)
      const k = kx + '|' + ky
      if (!buckets.has(k)) buckets.set(k, [])
      buckets.get(k)!.push(i)
    }
    for (const bucket of buckets.values()) {
      if (bucket.length < 2) continue
      let ax = 0, ay = 0, az = 0, cnt = 0
      for (const i of bucket) {
        if (Math.abs(normArr[i * 3 + 2]) < 0.7) {
          ax += normArr[i * 3]; ay += normArr[i * 3 + 1]; az += normArr[i * 3 + 2]; cnt++
        }
      }
      if (cnt < 2) continue
      const len = Math.sqrt(ax * ax + ay * ay + az * az) + 1e-10
      ax /= len; ay /= len; az /= len
      for (const i of bucket) {
        if (Math.abs(normArr[i * 3 + 2]) < 0.7) {
          normArr[i * 3] = ax; normArr[i * 3 + 1] = ay; normArr[i * 3 + 2] = az
        }
      }
    }
    geo.attributes.normal.needsUpdate = true
  }

  return geo
}
