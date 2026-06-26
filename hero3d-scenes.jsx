/* ============================================
   Hertz HERO 3D, 5 SCENES
   STACK · CYMATICS · TUNNEL · VINYL · CROWD
   Beat-driven (128 BPM faux clock).
   ============================================ */

/* ─── Palette helpers ─────────────────────── */
const HZC = {
  bg:     '#08080d',
  ink:    '#f5f5f3',
  gray:   '#9a9a9f',
  cyan:   '#00d4ff',
  yellow: '#f5f00d',
  blue:   '#2a4cff',
};

function hexToColor(THREE, hex) { return new THREE.Color(hex); }

/* ─── Soft glow sprite (additive halo) ────── */
function makeGlowTex(THREE, inner = 0.0, outer = 0.5) {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size/2, size/2, size*inner, size/2, size/2, size*outer);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

/* ─── Raver silhouette texture (procedural) ─ */
function makeRaverTex(THREE) {
  const W = 128, H = 256;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff';
  // head
  ctx.beginPath(); ctx.arc(W/2, 40, 22, 0, Math.PI*2); ctx.fill();
  // torso
  ctx.beginPath();
  ctx.moveTo(W/2 - 26, 62);
  ctx.lineTo(W/2 + 26, 62);
  ctx.lineTo(W/2 + 30, 170);
  ctx.lineTo(W/2 - 30, 170);
  ctx.closePath(); ctx.fill();
  // raised arms
  ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.strokeStyle = '#ffffff';
  ctx.beginPath(); ctx.moveTo(W/2 - 22, 70); ctx.lineTo(W/2 - 50, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W/2 + 22, 70); ctx.lineTo(W/2 + 50, 0); ctx.stroke();
  // legs
  ctx.beginPath(); ctx.moveTo(W/2 - 22, 168); ctx.lineTo(W/2 - 26, 256); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W/2 + 22, 168); ctx.lineTo(W/2 + 26, 256); ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

/* ═══════════════════════════════════════════════
   SCENE 0, LOGO 3D (voxel extrusion)
   InstancedMesh of small boxes shaped from PNG alpha.
   Real 3D geometry, full 360° rotation possible.
   4 texture modes: flat / chrome / neon / holo.
   No particles.
   ═══════════════════════════════════════════════ */
function makeLogoFormation(THREE, root, density, opts) {
  const grp = new THREE.Group(); root.add(grp);
  grp.position.y = 2.2; // raised so bottom copy has plenty of room

  const MODE_MAP = {
    flat: 0, chrome: 1, neon: 2, holo: 3,
    mercury: 4, glass: 5, concrete: 6, steel: 7, marble: 8,
  };
  const currentMode = () => MODE_MAP[(opts && opts.texture) || 'chrome'] ?? 1;

  let ready = false;
  let S = null;
  let fadeIn = 0; // 0..1 simple fade-in, no particles

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => { S = build(img); ready = true; };
  img.onerror = () => { console.warn('logo not found'); };
  img.src = 'assets/hertz-logo-official.png';

  function build(image) {
    const aspect = image.width / image.height;
    const W = 5.0;
    const H = W / aspect;
    const DEPTH = 0.5;

    /* ── 1. High-res alpha sample for marching-squares ── */
    const sampW = 500;
    const sampH = Math.round(sampW / aspect);
    const cnv = document.createElement('canvas');
    cnv.width = sampW; cnv.height = sampH;
    const cx = cnv.getContext('2d');
    cx.drawImage(image, 0, 0, sampW, sampH);
    const data = cx.getImageData(0, 0, sampW, sampH).data;
    const A = new Uint8Array(sampW * sampH);
    for (let i = 0; i < sampW * sampH; i++) A[i] = data[i*4 + 3];

    /* ── 2. Marching squares, extract oriented contour segments ── */
    const threshold = 140;
    const segs = [];
    for (let y = 0; y < sampH - 1; y++) {
      for (let x = 0; x < sampW - 1; x++) {
        const tl = A[y*sampW + x]         >= threshold ? 1 : 0;
        const tr = A[y*sampW + x + 1]     >= threshold ? 2 : 0;
        const br = A[(y+1)*sampW + x + 1] >= threshold ? 4 : 0;
        const bl = A[(y+1)*sampW + x]     >= threshold ? 8 : 0;
        const idx = tl + tr + br + bl;
        if (idx === 0 || idx === 15) continue;
        const Nm = [x + 0.5, y      ];
        const Em = [x + 1,   y + 0.5];
        const Sm = [x + 0.5, y + 1  ];
        const Wm = [x,       y + 0.5];
        switch (idx) {
          case 1:  segs.push([Wm, Nm]); break;
          case 2:  segs.push([Nm, Em]); break;
          case 3:  segs.push([Wm, Em]); break;
          case 4:  segs.push([Em, Sm]); break;
          case 5:  segs.push([Wm, Nm]); segs.push([Em, Sm]); break;
          case 6:  segs.push([Nm, Sm]); break;
          case 7:  segs.push([Wm, Sm]); break;
          case 8:  segs.push([Sm, Wm]); break;
          case 9:  segs.push([Sm, Nm]); break;
          case 10: segs.push([Nm, Em]); segs.push([Sm, Wm]); break;
          case 11: segs.push([Sm, Em]); break;
          case 12: segs.push([Em, Wm]); break;
          case 13: segs.push([Em, Nm]); break;
          case 14: segs.push([Nm, Wm]); break;
        }
      }
    }

    /* ── 3. Walk segments → closed loops ── */
    const key = (p) => ((p[0]*2)|0) + ',' + ((p[1]*2)|0);
    const startMap = new Map();
    for (let i = 0; i < segs.length; i++) {
      const k = key(segs[i][0]);
      if (!startMap.has(k)) startMap.set(k, []);
      startMap.get(k).push(i);
    }
    const used = new Uint8Array(segs.length);
    const rawLoops = [];
    for (let s = 0; s < segs.length; s++) {
      if (used[s]) continue;
      const loop = [];
      let cur = s;
      let safety = segs.length + 1;
      while (cur !== undefined && !used[cur] && safety-- > 0) {
        used[cur] = 1;
        loop.push(segs[cur][0]);
        const endK = key(segs[cur][1]);
        const cands = startMap.get(endK) || [];
        cur = undefined;
        for (const i of cands) { if (!used[i]) { cur = i; break; } }
      }
      if (loop.length >= 8) rawLoops.push(loop);
    }

    /* ── 4. Map to world space (centered, Y up) ── */
    const wLoops = rawLoops.map(loop => loop.map(([x, y]) => [
      (x / sampW - 0.5) * W,
     -(y / sampH - 0.5) * H,
    ]));

    /* ── 5. Smooth loops, 4 Chaikin passes ── */
    const smoothLoop = (loop) => {
      const out = [];
      for (let i = 0; i < loop.length; i++) {
        const a = loop[i];
        const b = loop[(i+1) % loop.length];
        out.push([a[0]*0.75 + b[0]*0.25, a[1]*0.75 + b[1]*0.25]);
        out.push([a[0]*0.25 + b[0]*0.75, a[1]*0.25 + b[1]*0.75]);
      }
      return out;
    };
    const smoothed = wLoops.map(smoothLoop).map(smoothLoop).map(smoothLoop).map(smoothLoop);

    /* ── 5b. Arc-length resample → uniform vertex spacing, removes Chaikin micro-oscillations ── */
    const resampleLoop = (loop) => {
      const arcs = [0];
      for (let i = 0; i < loop.length; i++) {
        const a = loop[i], b = loop[(i+1) % loop.length];
        arcs.push(arcs[i] + Math.hypot(b[0]-a[0], b[1]-a[1]));
      }
      const total = arcs[arcs.length-1];
      const n = Math.max(32, Math.round(total / 0.03));
      const out = [];
      for (let k = 0; k < n; k++) {
        const t = (k / n) * total;
        let lo = 0, hi = loop.length - 1;
        while (lo < hi - 1) { const mid = (lo+hi)>>1; if (arcs[mid]<=t) lo=mid; else hi=mid; }
        const s = (t - arcs[lo]) / (arcs[lo+1] - arcs[lo] + 1e-10);
        const a = loop[lo], b = loop[(lo+1) % loop.length];
        out.push([a[0]+(b[0]-a[0])*s, a[1]+(b[1]-a[1])*s]);
      }
      return out;
    };
    const finalLoops = smoothed.map(resampleLoop);

    /* ── 6. Signed area + point-in-polygon ── */
    const signedArea = (loop) => {
      let a = 0;
      for (let i = 0; i < loop.length; i++) {
        const [x1, y1] = loop[i];
        const [x2, y2] = loop[(i+1) % loop.length];
        a += (x1 * y2 - x2 * y1);
      }
      return a * 0.5;
    };
    const pip = (px, py, loop) => {
      let ins = false;
      for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
        const [xi, yi] = loop[i];
        const [xj, yj] = loop[j];
        if (((yi > py) !== (yj > py)) &&
            (px < (xj - xi) * (py - yi) / (yj - yi + 1e-9) + xi)) {
          ins = !ins;
        }
      }
      return ins;
    };

    /* ── 7. Hierarchy: each loop → its tightest containing parent ── */
    const info = finalLoops.map((loop, i) => {
      const area = signedArea(loop);
      let cx = 0, cy = 0;
      for (const p of loop) { cx += p[0]; cy += p[1]; }
      cx /= loop.length; cy /= loop.length;
      return { idx: i, loop, area, absArea: Math.abs(area), cx, cy, parent: -1, depth: 0 };
    });
    info.forEach(L => {
      let parent = -1, parentArea = Infinity;
      for (const P of info) {
        if (P.idx === L.idx) continue;
        if (P.absArea <= L.absArea) continue;
        if (pip(L.cx, L.cy, P.loop)) {
          if (P.absArea < parentArea) { parent = P.idx; parentArea = P.absArea; }
        }
      }
      L.parent = parent;
    });
    // Compute nesting depth
    info.forEach(L => {
      let d = 0, cur = L;
      while (cur.parent !== -1) { d++; cur = info[cur.parent]; if (d > 20) break; }
      L.depth = d;
    });

    /* ── 8. Build Shapes (depth 0 = outer, depth 1 = hole of that outer,
            depth 2 = a NEW outer inside the hole, etc.) ── */
    const shapes = [];
    info.filter(L => L.depth % 2 === 0).forEach(O => {
      const shape = new THREE.Shape();
      let pts = O.loop;
      if (O.area < 0) pts = pts.slice().reverse(); // outer must be CCW
      shape.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i][0], pts[i][1]);
      shape.closePath();
      // Direct holes: children whose parent === O.idx
      info.forEach(H => {
        if (H.parent !== O.idx) return;
        const hole = new THREE.Path();
        let hpts = H.loop;
        if (H.area > 0) hpts = hpts.slice().reverse(); // hole must be CW
        hole.moveTo(hpts[0][0], hpts[0][1]);
        for (let i = 1; i < hpts.length; i++) hole.lineTo(hpts[i][0], hpts[i][1]);
        hole.closePath();
        shape.holes.push(hole);
      });
      shapes.push(shape);
    });

    /* ── 9. Extrude geometry, no bevel for clean flat sides ── */
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: DEPTH,
      bevelEnabled: false,
      curveSegments: 1,
      steps: 1,
    });
    // Recenter on origin so rotation pivots through the middle
    geo.translate(0, 0, -DEPTH / 2);
    geo.computeVertexNormals();

    /* ── 9b. Weld side normals by XY position → smooth shading across all side faces ── */
    {
      const posArr  = geo.attributes.position.array;
      const normArr = geo.attributes.normal.array;
      const vc = posArr.length / 3;
      const EPS = 1.5e-3;
      const buckets = new Map();
      for (let i = 0; i < vc; i++) {
        const kx = Math.round(posArr[i*3]   / EPS);
        const ky = Math.round(posArr[i*3+1] / EPS);
        const key = kx + '|' + ky;
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(i);
      }
      for (const grp of buckets.values()) {
        if (grp.length < 2) continue;
        let ax = 0, ay = 0, az = 0, cnt = 0;
        for (const i of grp) {
          if (Math.abs(normArr[i*3+2]) < 0.7) { // side normal (XY-dominant)
            ax += normArr[i*3]; ay += normArr[i*3+1]; az += normArr[i*3+2]; cnt++;
          }
        }
        if (cnt < 2) continue;
        const len = Math.sqrt(ax*ax + ay*ay + az*az) + 1e-10;
        ax /= len; ay /= len; az /= len;
        for (const i of grp) {
          if (Math.abs(normArr[i*3+2]) < 0.7) {
            normArr[i*3] = ax; normArr[i*3+1] = ay; normArr[i*3+2] = az;
          }
        }
      }
      geo.attributes.normal.needsUpdate = true;
    }

    /* ── 10. Custom shader (no more instanceMatrix needed) ── */
    const sharedUniforms = {
      uTime:    { value: 0 },
      uMode:    { value: currentMode() },
      uAccent:  { value: new THREE.Color(HZC.cyan) },
      uPrimary: { value: new THREE.Color(HZC.cyan) },
      uOpacity: { value: 1.0 },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: sharedUniforms,
      transparent: true,
      vertexShader: `
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vLocalPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          vLocalPos = position;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: `
        uniform float uTime;
        uniform int uMode;
        uniform vec3 uAccent;
        uniform vec3 uPrimary;
        uniform float uOpacity;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vLocalPos;

        vec3 hsv2rgb(vec3 c){
          vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz)*6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        float hash3(vec3 p) {
          return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
        }

        float vnoise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f*f*(3.0-2.0*f);
          float a = hash3(i);
          float b = hash3(i + vec3(1.0,0.0,0.0));
          float c = hash3(i + vec3(0.0,1.0,0.0));
          float d = hash3(i + vec3(1.0,1.0,0.0));
          float e = hash3(i + vec3(0.0,0.0,1.0));
          float g = hash3(i + vec3(1.0,0.0,1.0));
          float h = hash3(i + vec3(0.0,1.0,1.0));
          float k = hash3(i + vec3(1.0,1.0,1.0));
          return mix(
            mix(mix(a,b,f.x), mix(c,d,f.x), f.y),
            mix(mix(e,g,f.x), mix(h,k,f.x), f.y),
            f.z
          );
        }

        float fbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * vnoise(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 N = normalize(vWorldNormal);
          vec3 keyLight  = normalize(vec3( 0.45,  0.65,  0.70));
          vec3 fillLight = normalize(vec3(-0.55,  0.30,  0.50));
          vec3 rimLight  = normalize(vec3( 0.00, -0.10, -1.00));
          float ndlKey  = max(0.0, dot(N, keyLight));
          float ndlFill = max(0.0, dot(N, fillLight));
          float ndlRim  = max(0.0, dot(N, rimLight));
          float lit = 0.22 + 0.85 * ndlKey + 0.30 * ndlFill;
          float fres = pow(1.0 - max(0.0, dot(N, vec3(0.0, 0.0, 1.0))), 2.0);

          vec3 col;
          float alpha = uOpacity;

          if (uMode == 0) {
            col = vec3(1.0) * lit;
            col += vec3(0.08) * ndlRim;
          } else if (uMode == 1) {
            float gy = clamp(vWorldPos.y * 0.25 + 0.5, 0.0, 1.0);
            col = mix(vec3(0.10, 0.12, 0.18), vec3(0.95, 0.97, 1.0), smoothstep(0.0, 1.0, gy));
            col *= 0.35 + 0.80 * ndlKey + 0.25 * ndlFill;
            col += fres * vec3(0.55, 0.58, 0.65);
          } else if (uMode == 2) {
            float sideMask = 1.0 - abs(N.z);
            vec3 emissive = uAccent * (1.4 + sideMask * 0.6);
            float pulse = 0.85 + 0.15 * sin(uTime * 1.3);
            col = emissive * pulse;
            col *= 0.65 + 0.45 * ndlKey;
          } else if (uMode == 3) {
            float h = fract(vWorldPos.x * 0.12 + vWorldPos.y * 0.08 + N.x * 0.35 + N.y * 0.15 + uTime * 0.05);
            vec3 iri = hsv2rgb(vec3(h, 0.50, 1.0));
            col = mix(vec3(0.85), iri, 0.70);
            col *= 0.4 + 0.7 * lit;
          } else if (uMode == 4) {
            vec3 fp = vWorldPos * 0.55 + vec3(uTime * 0.10, uTime * 0.06, uTime * 0.18);
            float flow = fbm(fp);
            float gy = clamp(vWorldPos.y * 0.20 + 0.5 + (flow - 0.5) * 0.55, 0.0, 1.0);
            col = mix(vec3(0.03, 0.05, 0.10), vec3(0.97, 0.98, 1.0), smoothstep(0.0, 1.0, gy));
            col *= 0.28 + 0.85 * ndlKey + 0.32 * ndlFill;
            col += fres * vec3(0.75);
            float band = smoothstep(0.05, 0.0,
              abs(fract(vWorldPos.y * 0.6 + uTime * 0.20) - 0.5) - 0.45);
            col += band * vec3(0.45);
          } else if (uMode == 5) {
            vec3 inner = vec3(0.55, 0.78, 0.98);
            vec3 edge  = vec3(1.0);
            col = mix(inner * (0.35 + 0.50 * lit), edge, fres);
            col = mix(col, uPrimary * 1.3, fres * 0.25);
            alpha *= 0.62;
          } else if (uMode == 6) {
            float n  = fbm(vWorldPos * 4.5);
            float n2 = fbm(vWorldPos * 16.0) * 0.4;
            float v  = clamp(n + n2 - 0.2, 0.0, 1.0);
            col = mix(vec3(0.38, 0.37, 0.36), vec3(0.66, 0.64, 0.62), v);
            float pit = smoothstep(0.78, 0.82, n);
            col *= 1.0 - pit * 0.45;
            col *= 0.40 + 0.70 * ndlKey + 0.22 * ndlFill;
          } else if (uMode == 7) {
            float lineN = vnoise(vec3(vWorldPos.y * 220.0, vWorldPos.x * 6.0, 0.0));
            float band  = fract(vWorldPos.y * 90.0);
            float metal = mix(0.52, 0.92, smoothstep(0.0, 1.0, lineN));
            metal -= (band > 0.5 ? 0.0 : 0.05);
            col = vec3(metal * 0.95, metal * 0.96, metal);
            col *= 0.55 + 0.55 * ndlKey + 0.20 * ndlFill;
            float aniso = pow(max(0.0, dot(N, normalize(vec3(0.0, 1.0, 1.0)))), 18.0);
            col += aniso * vec3(0.40);
            col += fres * vec3(0.18);
          } else if (uMode == 8) {
            float vp = vWorldPos.x * 2.2 + fbm(vWorldPos * 1.4) * 6.5;
            float t  = sin(vp);
            float vein = smoothstep(0.88, 1.0, abs(t));
            float dirt = fbm(vWorldPos * 6.0) * 0.10;
            col = mix(vec3(0.96, 0.95, 0.93) - dirt, vec3(0.04, 0.03, 0.05), vein * 0.85);
            col *= 0.42 + 0.65 * ndlKey + 0.25 * ndlFill;
            col += fres * vec3(0.20);
          } else {
            col = vec3(1.0) * lit;
          }

          gl_FragColor = vec4(col, alpha);
        }`,
    });

    const mesh = new THREE.Mesh(geo, mat);
    grp.add(mesh);

    /* ── Backglow, desktop only (mobile gets total black background) ── */
    let glow = null;
    if (!opts?.isMobile) {
      const glowTex = makeGlowTex(THREE);
      glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex, color: HZC.cyan, transparent: true, opacity: 0.18,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      glow.scale.set(W * 1.7, H * 2.2, 1);
      glow.position.set(0, grp.position.y, -0.8); // world-space, stays fixed
      root.add(glow);
    }

    /* ── Floor grid ── */
    const grid = new THREE.GridHelper(30, 30, 0x223344, 0x161825);
    grid.material.transparent = true;
    grid.material.opacity = 0.18;
    grid.position.y = -3.4 - grp.position.y;
    grp.add(grid);
    if (opts?.isMobile) grid.visible = false;

    /* ── Ambient dust (atmosphere, not logo particles) ── */
    let dGeo = null, dust = null;
    if (!opts?.isMobile) {
      const DN = Math.floor(300 * density);
      dGeo = new THREE.BufferGeometry();
      const dPos = new Float32Array(DN * 3);
      for (let i = 0; i < DN; i++) {
        dPos[i*3]   = (Math.random()-0.5) * 14;
        dPos[i*3+1] = -3 + Math.random() * 6;
        dPos[i*3+2] = (Math.random()-0.5) * 6;
      }
      dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
      dust = new THREE.Points(dGeo, new THREE.PointsMaterial({
        color: 0x9bb5cc, size: 0.012,
        transparent: true, opacity: 0.18,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      grp.add(dust);
    }

    return { mesh, mat, sharedUniforms, glow, grid, dGeo, dust, W, H };
  }

  return {
    grp,
    tick(time, beat, p) {
      if (!ready || !S) return;
      const { sharedUniforms, glow, grid, dGeo } = S;

      // simple fade-in (no particles, just opacity)
      if (fadeIn < 1) fadeIn = Math.min(1, fadeIn + 0.025);

      sharedUniforms.uTime.value = time;
      sharedUniforms.uMode.value = currentMode();
      sharedUniforms.uAccent.value.set(p.accentColor);
      sharedUniforms.uPrimary.value.set(p.primaryColor);
      sharedUniforms.uOpacity.value = fadeIn;

      if (glow) {
        glow.material.color.set(p.primaryColor);
        glow.material.opacity = 0.18 * fadeIn * p.bloom;
      }

      grid.material.opacity = (0.16 + 0.04 * Math.sin(time * 0.4)) * fadeIn;

      /* dust drift */
      if (dGeo) {
        const dArr = dGeo.attributes.position.array;
        const DN = dArr.length / 3;
        for (let i = 0; i < DN; i++) {
          dArr[i*3+1] += 0.0018;
          if (dArr[i*3+1] > 3) dArr[i*3+1] = -3;
        }
        dGeo.attributes.position.needsUpdate = true;
      }

      /* Continuous Y rotation, full 360°, real 3D */
      grp.rotation.y = time * 0.35 * p.speed;
      // gentle X breathing tilt
      grp.rotation.x = Math.sin(time * 0.3) * 0.08;
    },
    dispose() {
      root.remove(grp);
      // glow is in root (not grp) — remove and dispose it separately
      if (S && S.glow) {
        root.remove(S.glow);
        if (S.glow.material.map) S.glow.material.map.dispose();
        S.glow.material.dispose();
      }
      grp.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          if (Array.isArray(o.material)) o.material.forEach(m=>m.dispose());
          else o.material.dispose();
        }
      });
    },
    cameraHint: { pos: [0, 0, 7.0], look: [0, 1.5, 0] },
  };
}

/* ═══════════════════════════════════════════════
   SCENE 1, STACK (subwoofer tower)
   ═══════════════════════════════════════════════ */
function makeStack(THREE, root) {
  const grp = new THREE.Group(); root.add(grp);
  const accent = { cyan: HZC.cyan, yellow: HZC.yellow };

  // Cones with custom displacement shader
  const coneMaterials = [];
  const coneMeshes = [];
  const buildCab = (y, size = 1) => {
    const cab = new THREE.Group();
    cab.position.y = y;
    // cabinet box (wireframe-ish flat)
    const boxGeo = new THREE.BoxGeometry(2.4 * size, 1.4 * size, 1.6 * size);
    const boxMat = new THREE.MeshBasicMaterial({ color: 0x111118 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    cab.add(box);
    // edge highlights
    const edges = new THREE.EdgesGeometry(boxGeo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.12,
    }));
    cab.add(line);

    // front cone (displacement shader)
    const coneGeo = new THREE.CircleGeometry(0.55 * size, 64);
    const uniforms = {
      uTime: { value: 0 }, uKick: { value: 0 },
      uColor: { value: new THREE.Color(0x0a0a10) },
      uRim:   { value: new THREE.Color(accent.cyan) },
    };
    const coneMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        uniform float uTime; uniform float uKick;
        varying float vR; varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          float r = length(p.xy);
          vR = r;
          float wave = sin(r * 12.0 - uTime * 6.0) * 0.04 * uKick;
          float push = (1.0 - smoothstep(0.0, 0.55, r)) * uKick * 0.18;
          p.z += push + wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 uColor; uniform vec3 uRim; uniform float uKick;
        varying float vR;
        void main() {
          float center = 1.0 - smoothstep(0.0, 0.55, vR);
          float rim = smoothstep(0.45, 0.55, vR);
          vec3 col = mix(uColor, uRim * 0.5, rim);
          col += vec3(0.05) * center * uKick;
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.z = 0.81 * size;
    cab.add(cone);
    coneMaterials.push(coneMat); coneMeshes.push(cone);

    // dust cap (smaller circle)
    const cap = new THREE.Mesh(
      new THREE.CircleGeometry(0.15 * size, 24),
      new THREE.MeshBasicMaterial({ color: 0x05050a })
    );
    cap.position.z = 0.82 * size;
    cab.add(cap);

    // LEDs
    const ledY = -0.62 * size;
    const ledGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const ledYellow = new THREE.Mesh(ledGeo, new THREE.MeshBasicMaterial({ color: accent.yellow }));
    ledYellow.position.set(-0.95 * size, ledY, 0.82 * size);
    cab.add(ledYellow);
    const ledCyan = new THREE.Mesh(ledGeo, new THREE.MeshBasicMaterial({ color: accent.cyan }));
    ledCyan.position.set(0.95 * size, ledY, 0.82 * size);
    cab.add(ledCyan);

    return { cab, coneMat, ledYellow, ledCyan };
  };

  const cabs = [];
  // 4 stacked
  const positions = [-2.4, -0.8, 0.8, 2.4];
  positions.forEach((y, i) => {
    const sz = i === 0 ? 1.15 : 1.0;
    const c = buildCab(y, sz);
    grp.add(c.cab);
    cabs.push(c);
  });

  // back glow plane
  const glowTex = makeGlowTex(THREE);
  const bgGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: accent.cyan, transparent: true,
    opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  bgGlow.scale.set(12, 12, 1);
  bgGlow.position.z = -3;
  grp.add(bgGlow);

  // floor fog plane
  const fogPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 6),
    new THREE.MeshBasicMaterial({
      map: glowTex, color: 0x223344, transparent: true,
      opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  fogPlane.rotation.x = -Math.PI / 2;
  fogPlane.position.y = -4.2;
  grp.add(fogPlane);

  // particle dust
  const DUST = 600;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i*3]   = (Math.random() - 0.5) * 12;
    dustPos[i*3+1] = -4 + Math.random() * 8;
    dustPos[i*3+2] = (Math.random() - 0.5) * 6;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.025, transparent: true, opacity: 0.4,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  grp.add(dust);

  return {
    grp,
    tick(time, beat, p) {
      grp.rotation.y = Math.sin(time * 0.12 * p.speed) * 0.35;
      grp.position.y = Math.sin(time * 0.5 * p.speed) * 0.1;
      cabs.forEach((c, i) => {
        c.coneMat.uniforms.uTime.value = time;
        const myBeat = i === 0 ? beat.kick : (i === 1 ? beat.kick : beat.snare);
        c.coneMat.uniforms.uKick.value = myBeat * p.bloom;
        c.coneMat.uniforms.uRim.value.set(p.accentColor);
        c.ledYellow.material.opacity = 0.6 + beat.kick * 0.4;
        c.ledYellow.scale.setScalar(1 + beat.kick * 0.6);
        c.ledCyan.scale.setScalar(1 + beat.snare * 0.4);
      });
      bgGlow.material.color.set(p.accentColor);
      bgGlow.material.opacity = 0.25 + beat.kick * 0.3 * p.bloom;
      bgGlow.scale.setScalar(10 + beat.kick * 4);
      // dust drift
      const arr = dustGeo.attributes.position.array;
      for (let i = 0; i < DUST; i++) {
        arr[i*3+1] += 0.003;
        if (arr[i*3+1] > 4) arr[i*3+1] = -4;
      }
      dustGeo.attributes.position.needsUpdate = true;
    },
    dispose() {
      root.remove(grp);
      grp.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
          else o.material.dispose();
        }
      });
    },
    cameraHint: { pos: [0, 0.4, 6.5], look: [0, 0, 0] },
  };
}

/* ═══════════════════════════════════════════════
   SCENE 2, CYMATICS (Chladni plate)
   ═══════════════════════════════════════════════ */
function makeCymatics(THREE, root, density) {
  const grp = new THREE.Group(); root.add(grp);

  // metal plate
  const plateGeo = new THREE.CircleGeometry(3.2, 96);
  const plateMat = new THREE.MeshBasicMaterial({ color: 0x0c0c12 });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.rotation.x = -Math.PI / 2;
  grp.add(plate);
  // bevel ring
  const ringGeo = new THREE.TorusGeometry(3.2, 0.04, 6, 96);
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.18,
  }));
  ring.rotation.x = -Math.PI / 2;
  grp.add(ring);
  // outer halo
  const halo = new THREE.Mesh(
    new THREE.RingGeometry(3.2, 4.5, 64),
    new THREE.MeshBasicMaterial({
      color: HZC.cyan, transparent: true, opacity: 0.06,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = -0.005;
  grp.add(halo);

  // sand particles
  const N = Math.floor(2000 * density);
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3);
  const home = new Float32Array(N * 3);
  const tgt = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = Math.sqrt(Math.random()) * 2.9;
    const a = Math.random() * Math.PI * 2;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    pos[i*3] = x; pos[i*3+1] = 0.01; pos[i*3+2] = z;
    home[i*3] = x; home[i*3+1] = 0.01; home[i*3+2] = z;
    tgt[i*3] = x; tgt[i*3+1] = 0.01; tgt[i*3+2] = z;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: HZC.yellow, size: 0.035,
    transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const sand = new THREE.Points(geo, mat);
  grp.add(sand);

  // Chladni modes that cycle
  const modes = [ [3,2], [4,3], [5,4], [6,5], [4,5], [7,4] ];
  let modeIdx = 0;
  const recomputeTargets = () => {
    const [n, m] = modes[modeIdx];
    for (let i = 0; i < N; i++) {
      const hx = home[i*3], hz = home[i*3+2];
      // map to [-1..1]
      const u = hx / 3.0, v = hz / 3.0;
      // chladni signed
      const f = Math.sin(n * Math.PI * u) * Math.sin(m * Math.PI * v)
              - Math.sin(m * Math.PI * u) * Math.sin(n * Math.PI * v);
      // walk toward nodal line by stepping along gradient
      // estimate gradient numerically
      const eps = 0.01;
      const fx = (Math.sin(n*Math.PI*(u+eps))*Math.sin(m*Math.PI*v) - Math.sin(m*Math.PI*(u+eps))*Math.sin(n*Math.PI*v)) - f;
      const fz = (Math.sin(n*Math.PI*u)*Math.sin(m*Math.PI*(v+eps)) - Math.sin(m*Math.PI*u)*Math.sin(n*Math.PI*(v+eps))) - f;
      const g = Math.hypot(fx, fz) + 1e-6;
      const step = -f * 1.5;
      let tu = u + (fx / g) * step * 0.04;
      let tv = v + (fz / g) * step * 0.04;
      // jitter
      tu += (Math.random()-0.5) * 0.005;
      tv += (Math.random()-0.5) * 0.005;
      const tx = tu * 3.0, tz = tv * 3.0;
      // clamp to disk
      const rr = Math.hypot(tx, tz);
      if (rr > 2.9) {
        tgt[i*3] = (tx / rr) * 2.9;
        tgt[i*3+2] = (tz / rr) * 2.9;
      } else {
        tgt[i*3] = tx; tgt[i*3+2] = tz;
      }
      tgt[i*3+1] = 0.01;
    }
  };
  recomputeTargets();

  let lastBar = 0;
  return {
    grp,
    tick(time, beat, p) {
      // change pattern every bar
      if (beat.barIdx !== lastBar) {
        lastBar = beat.barIdx;
        modeIdx = (modeIdx + 1) % modes.length;
        recomputeTargets();
      }
      // ease toward targets, jolt on kick
      const arr = geo.attributes.position.array;
      const k = 0.04 + beat.kick * 0.12;
      const jitter = 0.012 * beat.kick;
      for (let i = 0; i < N; i++) {
        arr[i*3]   += (tgt[i*3]   - arr[i*3])   * k + (Math.random()-0.5) * jitter;
        arr[i*3+2] += (tgt[i*3+2] - arr[i*3+2]) * k + (Math.random()-0.5) * jitter;
        arr[i*3+1] = 0.01 + beat.kick * Math.random() * 0.04;
      }
      geo.attributes.position.needsUpdate = true;
      mat.color.set(p.accentColor);
      halo.material.color.set(p.accentColor);
      halo.material.opacity = 0.04 + beat.kick * 0.10 * p.bloom;
      grp.rotation.y += 0.0015 * p.speed;
    },
    dispose() {
      root.remove(grp);
      grp.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
    },
    cameraHint: { pos: [0, 4, 5], look: [0, 0, 0] },
  };
}

/* ═══════════════════════════════════════════════
   SCENE 3, TUNNEL (waveform rings)
   ═══════════════════════════════════════════════ */
function makeTunnel(THREE, root, density) {
  const grp = new THREE.Group(); root.add(grp);

  const N = Math.floor(50 * density);
  const SPACING = 2.2;
  const rings = [];
  for (let i = 0; i < N; i++) {
    const radius = 2.4;
    const ringGeo = new THREE.TorusGeometry(radius, 0.03, 8, 96);
    const mat = new THREE.MeshBasicMaterial({
      color: HZC.cyan,
      transparent: true, opacity: 0.7,
    });
    const m = new THREE.Mesh(ringGeo, mat);
    m.position.z = -i * SPACING;
    m.userData.idx = i;
    grp.add(m);
    rings.push(m);
  }

  // particle stream
  const PN = Math.floor(800 * density);
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PN * 3);
  for (let i = 0; i < PN; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.5 + Math.random() * 2;
    pPos[i*3]   = Math.cos(a) * r;
    pPos[i*3+1] = Math.sin(a) * r;
    pPos[i*3+2] = -Math.random() * N * SPACING;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.03, transparent: true, opacity: 0.7,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const parts = new THREE.Points(pGeo, pMat);
  grp.add(parts);

  // central core glow
  const glowTex = makeGlowTex(THREE);
  const core = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: HZC.cyan, transparent: true, opacity: 0.4,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  core.scale.set(3, 3, 1);
  core.position.z = -3;
  grp.add(core);

  let offset = 0;

  return {
    grp,
    tick(time, beat, p) {
      offset += 0.06 * p.speed;
      rings.forEach((m, i) => {
        m.position.z = -((i * SPACING - offset) % (N * SPACING));
        if (m.position.z > 4) m.position.z -= N * SPACING;
        const dist = Math.abs(m.position.z - 1.5);
        const nearK = 1 - Math.min(1, dist / (N * SPACING * 0.7));
        // every 4th ring is accent (yellow)
        const isAccent = ((i + Math.floor(offset / SPACING)) % 8) === 0;
        const baseCol = isAccent ? new THREE.Color(p.accentColor) : new THREE.Color(p.primaryColor);
        m.material.color.copy(baseCol);
        m.material.opacity = (0.15 + nearK * 0.7) * (1 + beat.kick * 0.4 * p.bloom);
        // pulse size on kick
        const s = 1 + (isAccent ? beat.kick * 0.2 : Math.sin(time * 4 + i) * 0.04);
        m.scale.set(s, s, 1);
      });
      // particles fly
      const arr = pGeo.attributes.position.array;
      for (let i = 0; i < PN; i++) {
        arr[i*3+2] += 0.15 * p.speed;
        if (arr[i*3+2] > 4) arr[i*3+2] = -N * SPACING;
      }
      pGeo.attributes.position.needsUpdate = true;
      // core
      core.material.color.set(p.accentColor);
      core.material.opacity = 0.3 + beat.kick * 0.5 * p.bloom;
      core.scale.setScalar(3 + beat.kick * 1.5);
      // subtle camera roll handled by app via cameraHint changes? keep here:
      grp.rotation.z = Math.sin(time * 0.1) * 0.1;
    },
    dispose() {
      root.remove(grp);
      grp.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
    },
    cameraHint: { pos: [0, 0, 4], look: [0, 0, -10] },
  };
}

/* ═══════════════════════════════════════════════
   SCENE 4, VINYL (close-up macro)
   ═══════════════════════════════════════════════ */
function makeVinyl(THREE, root, density) {
  const grp = new THREE.Group(); root.add(grp);
  grp.rotation.x = -0.55;

  // vinyl disk — shader for grooves and grazing light
  const diskGeo = new THREE.CircleGeometry(3.2, 128);
  const uniforms = {
    uTime:  { value: 0 },
    uKick:  { value: 0 },
    uAccent:{ value: new THREE.Color(HZC.yellow) },
    uLight: { value: new THREE.Vector2(0.8, 0.6) },
  };
  const diskMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv; varying vec3 vPos;
      void main() {
        vUv = uv;
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform float uTime; uniform float uKick;
      uniform vec3 uAccent; uniform vec2 uLight;
      varying vec2 vUv; varying vec3 vPos;
      void main() {
        vec2 c = vUv - 0.5;
        float r = length(c) * 2.0;
        float a = atan(c.y, c.x);
        // grooves — many fine concentric rings
        float grooves = sin(r * 320.0) * 0.5 + 0.5;
        grooves = smoothstep(0.45, 0.95, grooves);
        // label inner area
        float label = smoothstep(0.32, 0.30, r);
        float center = smoothstep(0.05, 0.03, r);
        // grazing light — depends on angle vs light dir
        vec2 ldir = normalize(uLight - vec2(0.5));
        vec2 cdir = normalize(c + 1e-5);
        float sheen = pow(max(0.0, dot(cdir, ldir)), 24.0);
        sheen *= smoothstep(1.0, 0.4, r);
        // base color
        vec3 base = vec3(0.04, 0.04, 0.05);
        base += grooves * vec3(0.06) * (1.0 - label);
        base += sheen * vec3(0.7, 0.7, 0.78);
        // label
        base = mix(base, uAccent * 0.5, label * (1.0 - center));
        base = mix(base, vec3(0.02), center);
        // outer cutoff
        float aMask = smoothstep(1.0, 0.99, r);
        if (r > 1.0) discard;
        gl_FragColor = vec4(base, 1.0);
      }`,
  });
  const disk = new THREE.Mesh(diskGeo, diskMat);
  grp.add(disk);

  // spindle hole
  const hole = new THREE.Mesh(
    new THREE.CircleGeometry(0.04, 24),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  hole.position.z = 0.001;
  grp.add(hole);

  // tiny "HZ." text-ish glyph on label using thin ring
  const txt = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.55, 64),
    new THREE.MeshBasicMaterial({ color: HZC.ink, transparent: true, opacity: 0.5 })
  );
  txt.position.z = 0.002;
  grp.add(txt);

  // dust particles drifting above record
  const DN = Math.floor(400 * density);
  const dGeo = new THREE.BufferGeometry();
  const dPos = new Float32Array(DN * 3);
  for (let i = 0; i < DN; i++) {
    dPos[i*3]   = (Math.random() - 0.5) * 7;
    dPos[i*3+1] = Math.random() * 3;
    dPos[i*3+2] = (Math.random() - 0.5) * 7;
  }
  dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  const dMat = new THREE.PointsMaterial({
    color: 0xfff8dc, size: 0.022, transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const dust = new THREE.Points(dGeo, dMat);
  // dust group doesn't inherit disk rotation — add to root instead
  root.add(dust);

  // back glow
  const glowTex = makeGlowTex(THREE);
  const back = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: HZC.yellow, transparent: true, opacity: 0.18,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  back.scale.set(10, 10, 1);
  back.position.set(2, 0, -2);
  root.add(back);

  return {
    grp,
    tick(time, beat, p) {
      grp.rotation.z -= 0.012 * p.speed; // 33⅓ feel
      uniforms.uTime.value = time;
      uniforms.uKick.value = beat.kick;
      uniforms.uAccent.value.set(p.accentColor);
      // moving grazing light around the disk
      uniforms.uLight.value.set(
        0.5 + Math.cos(time * 0.3) * 0.8,
        0.5 + Math.sin(time * 0.3) * 0.8,
      );
      // dust drift
      const arr = dGeo.attributes.position.array;
      for (let i = 0; i < DN; i++) {
        arr[i*3+1] += 0.002 + (i % 7) * 0.0003;
        arr[i*3] += Math.sin(time + i) * 0.0005;
        if (arr[i*3+1] > 3) arr[i*3+1] = 0;
      }
      dGeo.attributes.position.needsUpdate = true;
      back.material.opacity = 0.12 + beat.kick * 0.2 * p.bloom;
      back.material.color.set(p.accentColor);
    },
    dispose() {
      root.remove(grp); root.remove(dust); root.remove(back);
      grp.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
      dGeo.dispose(); dMat.dispose();
      back.material.dispose();
    },
    cameraHint: { pos: [0, 1.6, 4.8], look: [0, 0, 0] },
  };
}

/* ═══════════════════════════════════════════════
   SCENE 5, CROWD (silhouette ravers)
   ═══════════════════════════════════════════════ */
function makeCrowd(THREE, root, density) {
  const grp = new THREE.Group(); root.add(grp);

  const tex = makeRaverTex(THREE);
  const N = Math.floor(700 * density);

  // Use individual sprites for varied scaling/timing
  const ravers = [];
  for (let i = 0; i < N; i++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, color: 0x101015, transparent: true, opacity: 0.95,
      depthWrite: false,
    }));
    const r = Math.sqrt(Math.random()) * 7;
    const a = Math.random() * Math.PI * 2;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r - 2; // bias back
    const scale = 0.7 + Math.random() * 0.5 - Math.min(r / 14, 0.3);
    m.position.set(x, scale * 0.5 - 2, z);
    m.scale.set(scale * 0.6, scale, 1);
    m.userData.base = scale;
    m.userData.phase = Math.random();
    m.userData.row = Math.floor((-z + 5) * 2);
    grp.add(m);
    ravers.push(m);
  }

  // floor fog
  const glowTex = makeGlowTex(THREE);
  const fog = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 14),
    new THREE.MeshBasicMaterial({
      map: glowTex, color: 0x1a2a44, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  fog.rotation.x = -Math.PI / 2;
  fog.position.y = -2.4;
  grp.add(fog);

  // strobe sprite (fullscreen-ish white flash, very low default opacity)
  const strobe = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0xffffff, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  strobe.scale.set(30, 16, 1);
  strobe.position.set(0, 0, -3);
  grp.add(strobe);

  // back light beam
  const beamL = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: HZC.cyan, transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  beamL.scale.set(8, 14, 1);
  beamL.position.set(-4, 2, -6);
  grp.add(beamL);
  const beamR = beamL.clone();
  beamR.material = beamL.material.clone();
  beamR.material.color = new THREE.Color(HZC.yellow);
  beamR.position.set(4, 2, -6);
  grp.add(beamR);

  let lastBeatIdx = -1;

  return {
    grp,
    tick(time, beat, p) {
      ravers.forEach((m, i) => {
        const bob = Math.sin(time * 3 + m.userData.phase * 10) * 0.05;
        const beatPunch = (beat.kick * 0.25 + beat.snare * 0.15) *
                          (0.7 + Math.sin(m.userData.phase * 12.4) * 0.3);
        const s = m.userData.base * (1 + beatPunch + bob);
        m.scale.set(s * 0.6, s, 1);
      });
      // strobe flash on snare occasionally
      if (beat.beatIdx !== lastBeatIdx) {
        lastBeatIdx = beat.beatIdx;
        if (beat.beatIdx % 8 === 4) strobe.material.opacity = 0.35 * p.bloom;
      }
      strobe.material.opacity *= 0.85; // decay
      // beams
      beamL.material.color.set(p.primaryColor);
      beamR.material.color.set(p.accentColor);
      beamL.material.opacity = 0.4 + beat.kick * 0.3 * p.bloom;
      beamR.material.opacity = 0.4 + beat.snare * 0.3 * p.bloom;
      beamL.position.x = -4 + Math.sin(time * 0.7) * 1.5;
      beamR.position.x =  4 + Math.cos(time * 0.7) * 1.5;
      // subtle group sway
      grp.rotation.y = Math.sin(time * 0.15 * p.speed) * 0.18;
    },
    dispose() {
      root.remove(grp);
      grp.traverse(o => {
        if (o.material) {
          if (o.material.map && o.material.map !== tex) o.material.map.dispose();
          o.material.dispose();
        }
        if (o.geometry) o.geometry.dispose();
      });
      tex.dispose();
    },
    cameraHint: { pos: [0, 0.6, 6], look: [0, 0, -2] },
  };
}

/* ═══════════════════════════════════════════════
   Export
   ═══════════════════════════════════════════════ */
window.HertzScenes = {
  HZC,
  logo:     makeLogoFormation,
  stack:    makeStack,
  cymatics: makeCymatics,
  tunnel:   makeTunnel,
  vinyl:    makeVinyl,
  crowd:    makeCrowd,
};
