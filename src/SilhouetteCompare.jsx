import React from "react";

const COLOR_GREEN_MAX = 1.5;
const COLOR_YELLOW_MAX = 2.0;
const OVERLAY_OPACITY = 0.75;

const toFiniteNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const normalizeMeasureCm = (m) => ({
  shoulder: toFiniteNumber(m?.shoulder),
  chest: toFiniteNumber(m?.chest),
  length: toFiniteNumber(m?.length),
  sleeve: toFiniteNumber(m?.sleeve)
});

const hasAllPositiveMeasures = (m) => m.shoulder > 0 && m.chest > 0 && m.length > 0 && m.sleeve > 0;

export const col = (diffCm) => {
  const ad = Math.abs(diffCm);
  if (ad <= COLOR_GREEN_MAX) {
    return "#22c55e";
  }
  if (ad <= COLOR_YELLOW_MAX) {
    return "#f59e0b";
  }
  return "#ef4444";
};

const calculateTopGeometry = (measuresPx, options = {}) => {
  const sh = toFiniteNumber(measuresPx?.sh);
  const ch = toFiniteNumber(measuresPx?.ch);
  const le = toFiniteNumber(measuresPx?.le);
  const sl = toFiniteNumber(measuresPx?.sl);

  const isOuter = !!options?.isOuter;
  const _isHoodie = !!options?.isHoodie;

  const trapTopY = -(le * 0.25 + le * 0.75);
  const bodyTopY = -(le * 0.75);
  const bodyBottomY = 0;

  const trapTopLeftX = -sh / 2;
  const trapTopRightX = sh / 2;
  const trapBottomLeftX = -ch / 2;
  const trapBottomRightX = ch / 2;

  const bodyLeftX = -ch / 2;
  const bodyRightX = ch / 2;

  const sleevePts = (t, b, slLen, signX) => {
    const dx = b[0] - t[0];
    const dy = b[1] - t[1];
    let nx = -dy;
    let ny = dx;
    if (Math.sign(nx) !== signX) {
      nx = dy;
      ny = -dx;
    }
    const ln = Math.hypot(nx, ny) || 1;
    nx = (nx / ln) * slLen;
    ny = (ny / ln) * slLen;
    const t2 = [t[0] + nx, t[1] + ny];
    const b2 = [b[0] + nx, b[1] + ny];
    return [t, b, b2, t2];
  };

  const orderTB = (a, b) => (a[1] <= b[1] ? [a, b] : [b, a]);

  const triOut = (A, B, isLeft) => {
    const dx = B[0] - A[0];
    const dy = B[1] - A[1];
    const L = Math.hypot(dx, dy) || 1;
    const mx = (A[0] + B[0]) / 2;
    const my = (A[1] + B[1]) / 2;
    const px = -dy / L;
    const py = dx / L;
    const h = (Math.sqrt(3) / 2) * L;
    const C1 = [mx + px * h, my + py * h];
    const C2 = [mx - px * h, my - py * h];
    const C = isLeft ? (C1[0] <= C2[0] ? C1 : C2) : (C1[0] >= C2[0] ? C1 : C2);
    return C;
  };

  const tl = [trapTopLeftX, trapTopY];
  const tr = [trapTopRightX, trapTopY];
  const bl = [trapBottomLeftX, bodyTopY];
  const br = [trapBottomRightX, bodyTopY];

  let triLeftPts;
  let triRightPts;
  let sleeveLeftPts;
  let sleeveRightPts;

  if (sh < ch) {
    const cL = triOut(tl, bl, true);
    const cR = triOut(tr, br, false);
    triLeftPts = [tl, bl, cL];
    triRightPts = [tr, br, cR];

    const eL = orderTB(bl, cL);
    const eR = orderTB(br, cR);
    sleeveLeftPts = sleevePts(eL[0], eL[1], sl, -1);
    sleeveRightPts = sleevePts(eR[0], eR[1], sl, 1);
  } else {
    sleeveLeftPts = sleevePts(tl, bl, sl, -1);
    sleeveRightPts = sleevePts(tr, br, sl, 1);
  }

  if (isOuter) {
  }

  return {
    trapTopY,
    trapTopLeftX,
    trapTopRightX,
    trapBottomLeftX,
    trapBottomRightX,
    bodyTopY,
    bodyBottomY,
    bodyLeftX,
    bodyRightX,
    sleeveLeftPts,
    sleeveRightPts,
    triLeftPts,
    triRightPts
  };
};

const calculatePantsGeometry = (measures, options = {}) => {
  const scale = Number.isFinite(options?.scale) ? options.scale : 3;
  const raw = measures || {};

  const waistCm = Math.max(0, toFiniteNumber(raw.waist));
  const thighCm = Math.max(0, toFiniteNumber(raw.thigh));
  const riseCm = Math.max(0, toFiniteNumber(raw.rise));
  const lengthCm = Math.max(0, toFiniteNumber(raw.length));
  const hipInputCm = Math.max(0, toFiniteNumber(raw.hip));
  const hemInputCm = Math.max(0, toFiniteNumber(raw.hem));

  const hemCm = hemInputCm > 0 ? hemInputCm : thighCm * 0.7;

  const hipFrameCm = Math.max(
    hipInputCm > 0 ? hipInputCm : 0,
    waistCm * 1.05,
    thighCm * 2,
    hemCm * 2
  );

  const waistBandH = 4 * scale;

  const topY = 0;
  const waistBotY = topY + waistBandH;
  const riseH = riseCm * scale;
  const crotchY = waistBotY + riseH;

  const bottomY = Math.max(crotchY + 1, topY + lengthCm * scale);

  const waistW = waistCm * scale;
  const hipW = hipFrameCm * scale;
  const thighW = thighCm * scale;
  const minLegPx = 8 * scale;

  const waistVisualWeight = 1.35;
  const waistWVisual = Math.min(hipW, waistW * waistVisualWeight);

  let innerGap = hipW - 2 * thighW;
  const maxInnerGap = Math.max(0, hipW - 2 * minLegPx);
  innerGap = Math.max(0, Math.min(innerGap, maxInnerGap));

  const maxHemW = Math.max(1, hipW / 2 - innerGap / 2);
  const hemW = Math.min(hemCm * scale, maxHemW);

  const yMid = waistBotY + riseH * 0.5;

  const polys = {
    waistRect: [[-waistWVisual / 2, topY], [waistWVisual / 2, topY], [waistWVisual / 2, waistBotY], [-waistWVisual / 2, waistBotY]],
    waistToHip: [[-waistWVisual / 2, waistBotY], [waistWVisual / 2, waistBotY], [hipW / 2, yMid], [-hipW / 2, yMid]],
    hipRect: [[-hipW / 2, yMid], [hipW / 2, yMid], [hipW / 2, crotchY], [-hipW / 2, crotchY]],
    leftLeg: [[-hipW / 2, crotchY], [-innerGap / 2, crotchY], [-hipW / 2 + hemW, bottomY], [-hipW / 2, bottomY]],
    rightLeg: [[innerGap / 2, crotchY], [hipW / 2, crotchY], [hipW / 2, bottomY], [hipW / 2 - hemW, bottomY]]
  };

  const halfW = hipW / 2;
  const waistHalfW = waistWVisual / 2;

  return {
    kind: "pants",
    scale,
    measuresCm: { waist: waistCm, thigh: thighCm, rise: riseCm, length: lengthCm, hem: hemCm, hip: hipInputCm },
    topY,
    waistBotY,
    crotchY,
    bottomY,
    halfW,
    waistHalfW,
    totalW: hipW,
    innerGap,
    waistBandH,
    riseH,
    hipW,
    hemW,
    polys,
    rects: {
      waist: { x: -waistWVisual / 2, y: topY, w: waistWVisual, h: waistBandH },
      rise: { x: -hipW / 2, y: waistBotY, w: hipW, h: crotchY - waistBotY },
      leftLeg: { x: -hipW / 2, y: crotchY, w: hipW / 2 - innerGap / 2, h: bottomY - crotchY },
      rightLeg: { x: innerGap / 2, y: crotchY, w: hipW / 2 - innerGap / 2, h: bottomY - crotchY }
    }
  };
};

const polyPathFromPts = (pts) => `M ${pts.map((p) => `${p[0]} ${p[1]}`).join(" L ")} Z`;

const getSingleOutlinePath = (g, category) => {
  if (!g) return "";

  const eps = 1e-6;

  const dist2 = (a, b) => {
    const dx = toFiniteNumber(a?.[0]) - toFiniteNumber(b?.[0]);
    const dy = toFiniteNumber(a?.[1]) - toFiniteNumber(b?.[1]);
    return dx * dx + dy * dy;
  };

  const attachIndex = (sleevePts, target) => {
    if (!sleevePts || sleevePts.length < 4) return 0;
    const a = sleevePts[0];
    const b = sleevePts[1];
    return dist2(target, a) <= dist2(target, b) + eps ? 0 : 1;
  };

  const sleeveOuterChain = (sleevePts, fromAttach, toAttach) => {
    const iFrom = attachIndex(sleevePts, fromAttach);
    const iTo = attachIndex(sleevePts, toAttach);

    const fromOut = iFrom === 0 ? sleevePts[3] : sleevePts[2];
    const toOut = iTo === 0 ? sleevePts[3] : sleevePts[2];

    return [fromOut, toOut, toAttach];
  };

  const tl = [toFiniteNumber(g.trapTopLeftX), toFiniteNumber(g.trapTopY)];
  const tr = [toFiniteNumber(g.trapTopRightX), toFiniteNumber(g.trapTopY)];

  const bl = [toFiniteNumber(g.bodyLeftX), toFiniteNumber(g.bodyTopY)];
  const br = [toFiniteNumber(g.bodyRightX), toFiniteNumber(g.bodyTopY)];

  const bbl = [toFiniteNumber(g.bodyLeftX), toFiniteNumber(g.bodyBottomY)];
  const bbr = [toFiniteNumber(g.bodyRightX), toFiniteNumber(g.bodyBottomY)];

  const outlinePts = [bbl, bl];

  if (g.triLeftPts && g.triLeftPts.length >= 3) {
    const cL = g.triLeftPts[2];
    outlinePts.push(...sleeveOuterChain(g.sleeveLeftPts, bl, cL));
    outlinePts.push(tl);
  } else {
    outlinePts.push(...sleeveOuterChain(g.sleeveLeftPts, bl, tl));
  }

  outlinePts.push(tr);

  if (g.triRightPts && g.triRightPts.length >= 3) {
    const cR = g.triRightPts[2];
    outlinePts.push(cR);
    outlinePts.push(...sleeveOuterChain(g.sleeveRightPts, cR, br));
  } else {
    outlinePts.push(...sleeveOuterChain(g.sleeveRightPts, tr, br));
  }

  outlinePts.push(bbr);

  return `M ${outlinePts.map((p) => `${p[0]} ${p[1]}`).join(" L ")} Z`;
};

const cuffPathFromSleeve = (pts, d) => {
  const t2 = pts[3];
  const b2 = pts[2];
  const vx = t2[0] - pts[0][0];
  const vy = t2[1] - pts[0][1];
  const ln = Math.hypot(vx, vy) || 1;
  const ux = vx / ln;
  const uy = vy / ln;
  const t3 = [t2[0] - ux * d, t2[1] - uy * d];
  const b3 = [b2[0] - ux * d, b2[1] - uy * d];
  return polyPathFromPts([t2, b2, b3, t3]);
};

const xAtY = (t, b, y) => {
  const den = b[1] - t[1];
  if (!den) return t[0];
  const k = (y - t[1]) / den;
  return t[0] + (b[0] - t[0]) * k;
};

const createTopPaths = (g, category) => {
  const sh = g.trapTopRightX - g.trapTopLeftX;
  const r = sh * (category === "hoodie" ? 0.12 : 0.15);

  const trap = `M ${g.trapTopLeftX} ${g.trapTopY} L ${g.trapTopRightX} ${g.trapTopY} L ${g.trapBottomRightX} ${g.bodyTopY} L ${g.trapBottomLeftX} ${g.bodyTopY} Z M ${r} ${g.trapTopY} A ${r} ${r} 0 0 1 ${-r} ${g.trapTopY} Z`;
  const triL = g.triLeftPts ? polyPathFromPts(g.triLeftPts) : null;
  const triR = g.triRightPts ? polyPathFromPts(g.triRightPts) : null;
  const slL = polyPathFromPts(g.sleeveLeftPts);
  const slR = polyPathFromPts(g.sleeveRightPts);

  const yC = g.bodyTopY + (g.bodyBottomY - g.bodyTopY) * 0.6;
  const bodyTop = `M ${g.bodyLeftX} ${g.bodyTopY} H ${g.bodyRightX} V ${yC} H ${g.bodyLeftX} Z`;
  const bodyBot = `M ${g.bodyLeftX} ${yC} H ${g.bodyRightX} V ${g.bodyBottomY} H ${g.bodyLeftX} Z`;
  const body = `M ${g.bodyLeftX} ${g.bodyTopY} H ${g.bodyRightX} V ${g.bodyBottomY} H ${g.bodyLeftX} Z`;

  let hood;
  let hoodOuter;
  let hemRib;
  let cuffL;
  let cuffR;
  let hoodMinY;

  if (category === "hoodie") {
    hemRib = { x: g.bodyLeftX, y: g.bodyBottomY - 8, w: g.bodyRightX - g.bodyLeftX, h: 8 };
    cuffL = cuffPathFromSleeve(g.sleeveLeftPts, 8);
    cuffR = cuffPathFromSleeve(g.sleeveRightPts, 8);

    const hoodW = Math.max(46, Math.min(120, sh * 0.62));
    const hoodH = 34;
    const xL = -hoodW / 2;
    const xR = hoodW / 2;
    const y0 = g.trapTopY - 2;
    const yT = y0 - hoodH;
    hood = `M ${xL} ${y0} C ${xL} ${yT} ${xR} ${yT} ${xR} ${y0}`;

    const hoodW2 = hoodW * 1.12;
    const hoodH2 = hoodH * 1.12;
    const xL2 = -hoodW2 / 2;
    const xR2 = hoodW2 / 2;
    const y02 = y0 - 2;
    const yT2 = y02 - hoodH2;
    hoodOuter = `M ${xL2} ${y02} C ${xL2} ${yT2} ${xR2} ${yT2} ${xR2} ${y02}`;

    hoodMinY = Math.min(yT, yT2);
  }

  let centerFront;
  let pocketL;
  let pocketR;

  if (category === "outer") {
    centerFront = `M 0 ${g.bodyTopY} V ${g.bodyBottomY}`;

    const len = 25;
    const dx = Math.cos((30 * Math.PI) / 180) * len;
    const dy = Math.sin((30 * Math.PI) / 180) * len;

    const w = g.bodyRightX - g.bodyLeftX;
    const y0 = g.bodyBottomY - Math.min(22, Math.max(12, (g.bodyBottomY - g.bodyTopY) * 0.18));
    const xBaseL = g.bodyLeftX + w * 0.28;
    const xBaseR = g.bodyRightX - w * 0.28;

    pocketL = `M ${xBaseL} ${y0} L ${xBaseL - dx} ${y0 + dy}`;
    pocketR = `M ${xBaseR} ${y0} L ${xBaseR + dx} ${y0 + dy}`;
  }

  const xs = [g.trapTopLeftX, g.trapTopRightX, g.trapBottomLeftX, g.trapBottomRightX, g.bodyLeftX, g.bodyRightX, ...g.sleeveLeftPts.map((p) => p[0]), ...g.sleeveRightPts.map((p) => p[0]), ...(g.triLeftPts ? g.triLeftPts.map((p) => p[0]) : []), ...(g.triRightPts ? g.triRightPts.map((p) => p[0]) : [])];
  const ys = [g.trapTopY, g.bodyTopY, g.bodyBottomY, ...g.sleeveLeftPts.map((p) => p[1]), ...g.sleeveRightPts.map((p) => p[1]), ...(g.triLeftPts ? g.triLeftPts.map((p) => p[1]) : []), ...(g.triRightPts ? g.triRightPts.map((p) => p[1]) : [])];

  if (hemRib) ys.push(hemRib.y);
  if (Number.isFinite(hoodMinY)) ys.push(hoodMinY);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys, g.trapTopY - r);
  const maxY = Math.max(...ys);

  return {
    trap,
    triL,
    triR,
    slL,
    slR,
    bodyTop,
    bodyBot,
    body,
    hood,
    hoodOuter,
    hemRib,
    cuffL,
    cuffR,
    centerFront,
    pocketL,
    pocketR,
    b: { minX, maxX, minY, maxY }
  };
};

const createPantsPaths = (userG, productG) => {
  const rectToPath = (r) => {
    if (!r || r.w <= 0 || r.h <= 0) return "";
    return `M ${r.x} ${r.y} h ${r.w} v ${r.h} h ${-r.w} Z`;
  };

  const mkShape = (g) => {
    if (!g) return "";

    if (g.polys) {
      const upperBlock = g.polys.waistToHip && g.polys.hipRect
        ? [
          g.polys.waistToHip[0],
          g.polys.waistToHip[1],
          g.polys.waistToHip[2],
          g.polys.hipRect[2],
          g.polys.hipRect[3],
          g.polys.waistToHip[3]
        ]
        : null;

      return [
        g.polys.waistRect,
        upperBlock,
        g.polys.leftLeg,
        g.polys.rightLeg
      ].filter(Boolean).map(polyPathFromPts).join(" ");
    }

    if (g.rects) {
      return [
        rectToPath(g.rects.waist),
        rectToPath(g.rects.rise),
        rectToPath(g.rects.leftLeg),
        rectToPath(g.rects.rightLeg)
      ].filter(Boolean).join(" ");
    }

    return "";
  };

  const userShape = mkShape(userG);
  const productShape = mkShape(productG);

  let beltLine = "";
  let flyLine = "";
  let flyFlapPath = "";

  if (productG) {
    const waistHalfW = toFiniteNumber(productG.waistHalfW || productG.halfW);
    const waistBotY = toFiniteNumber(productG.waistBotY);
    const crotchY = toFiniteNumber(productG.crotchY);
    const totalW = toFiniteNumber(productG.totalW) || toFiniteNumber(productG.rects?.rise?.w) || Math.abs(toFiniteNumber(productG.halfW)) * 2;

    beltLine = `M ${-waistHalfW} ${waistBotY} H ${waistHalfW}`;
    flyLine = `M 0 ${waistBotY} V ${crotchY}`;

    const flyLen = crotchY - waistBotY;
    const flapW = totalW * 0.05;
    const flapH = flyLen * 0.5;
    flyFlapPath = `M 0 ${waistBotY} h ${-flapW} v ${flapH} h ${flapW} Z`;
  }

  const maxG = productG || userG;
  const b = {
    minX: maxG ? -maxG.halfW - 20 : -80,
    maxX: maxG ? maxG.halfW + 20 : 80,
    minY: 0,
    maxY: maxG ? maxG.bottomY : 300
  };

  return { userShape, productShape, beltLine, flyLine, flyFlapPath, bounds: b, b };
};

const createPantsOverlayPaths = (baseG, prodG, diff) => {
  const out = { waist: [], rise: [], thigh: [], length: [] };
  const eps = 1e-3;
  const scale = Number.isFinite(baseG?.scale) ? baseG.scale : 3;

  const dWaistPx = Math.abs(toFiniteNumber(diff?.waist) * scale);
  const dRisePx = Math.abs(toFiniteNumber(diff?.rise) * scale);
  const dThighPx = Math.abs(toFiniteNumber(diff?.thigh) * scale);
  const dLenPx = Math.abs(toFiniteNumber(diff?.length) * scale);

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const xAtYSeg = (a, b, y) => {
    const y1 = toFiniteNumber(a?.[1]);
    const y2 = toFiniteNumber(b?.[1]);
    const x1 = toFiniteNumber(a?.[0]);
    const x2 = toFiniteNumber(b?.[0]);
    const den = y2 - y1;
    if (Math.abs(den) <= eps) return x1;
    const t = (toFiniteNumber(y) - y1) / den;
    return x1 + (x2 - x1) * t;
  };

  const quad = (a, b, c, d) => polyPathFromPts([a, b, c, d]);

  if (baseG?.polys && prodG?.polys) {
    const yWaistBot = Math.min(toFiniteNumber(baseG.waistBotY), toFiniteNumber(prodG.waistBotY));

    if (dWaistPx > eps && yWaistBot > eps) {
      const bw = toFiniteNumber(baseG.waistHalfW);
      const pw = toFiniteNumber(prodG.waistHalfW);

      const lx1 = Math.min(-bw, -pw);
      const lx2 = Math.max(-bw, -pw);
      if (lx2 - lx1 > eps) out.waist.push(quad([lx1, 0], [lx2, 0], [lx2, yWaistBot], [lx1, yWaistBot]));

      const rx1 = Math.min(bw, pw);
      const rx2 = Math.max(bw, pw);
      if (rx2 - rx1 > eps) out.waist.push(quad([rx1, 0], [rx2, 0], [rx2, yWaistBot], [rx1, yWaistBot]));
    }

    if (dRisePx > eps) {
      const by = toFiniteNumber(baseG.crotchY);
      const py = toFiniteNumber(prodG.crotchY);
      const y1 = Math.min(by, py);
      const y2 = Math.max(by, py);

      const hipW = toFiniteNumber(baseG.hipW);
      const innerGap = toFiniteNumber(baseG.innerGap);
      const xL0 = -hipW / 2;
      const xL1 = -innerGap / 2;
      const xR0 = innerGap / 2;
      const xR1 = hipW / 2;

      if (y2 - y1 > eps && xL1 - xL0 > eps) out.rise.push(quad([xL0, y1], [xL1, y1], [xL1, y2], [xL0, y2]));
      if (y2 - y1 > eps && xR1 - xR0 > eps) out.rise.push(quad([xR0, y1], [xR1, y1], [xR1, y2], [xR0, y2]));
    }

    if (dThighPx > eps) {
      const y0 = Math.max(toFiniteNumber(baseG.crotchY), toFiniteNumber(prodG.crotchY));
      const yBottom = Math.min(toFiniteNumber(baseG.bottomY), toFiniteNumber(prodG.bottomY));
      const hAvail = yBottom - y0;
      if (hAvail > eps) {
        const h = clamp(hAvail * 0.35, 1 * scale, 24 * scale);
        const y1 = y0 + h;

        const bLt = [-toFiniteNumber(baseG.innerGap) / 2, toFiniteNumber(baseG.crotchY)];
        const bLb = [-toFiniteNumber(baseG.hipW) / 2 + toFiniteNumber(baseG.hemW), toFiniteNumber(baseG.bottomY)];
        const pLt = [-toFiniteNumber(prodG.innerGap) / 2, toFiniteNumber(prodG.crotchY)];
        const pLb = [-toFiniteNumber(prodG.hipW) / 2 + toFiniteNumber(prodG.hemW), toFiniteNumber(prodG.bottomY)];

        const bRt = [toFiniteNumber(baseG.innerGap) / 2, toFiniteNumber(baseG.crotchY)];
        const bRb = [toFiniteNumber(baseG.hipW) / 2 - toFiniteNumber(baseG.hemW), toFiniteNumber(baseG.bottomY)];
        const pRt = [toFiniteNumber(prodG.innerGap) / 2, toFiniteNumber(prodG.crotchY)];
        const pRb = [toFiniteNumber(prodG.hipW) / 2 - toFiniteNumber(prodG.hemW), toFiniteNumber(prodG.bottomY)];

        const bLx0 = xAtYSeg(bLt, bLb, y0);
        const pLx0 = xAtYSeg(pLt, pLb, y0);
        const bLx1 = xAtYSeg(bLt, bLb, y1);
        const pLx1 = xAtYSeg(pLt, pLb, y1);

        const bRx0 = xAtYSeg(bRt, bRb, y0);
        const pRx0 = xAtYSeg(pRt, pRb, y0);
        const bRx1 = xAtYSeg(bRt, bRb, y1);
        const pRx1 = xAtYSeg(pRt, pRb, y1);

        const l0a = Math.min(bLx0, pLx0);
        const l0b = Math.max(bLx0, pLx0);
        const l1a = Math.min(bLx1, pLx1);
        const l1b = Math.max(bLx1, pLx1);
        if (l0b - l0a > eps || l1b - l1a > eps) out.thigh.push(quad([l0a, y0], [l0b, y0], [l1b, y1], [l1a, y1]));

        const r0a = Math.min(bRx0, pRx0);
        const r0b = Math.max(bRx0, pRx0);
        const r1a = Math.min(bRx1, pRx1);
        const r1b = Math.max(bRx1, pRx1);
        if (r0b - r0a > eps || r1b - r1a > eps) out.thigh.push(quad([r0a, y0], [r0b, y0], [r1b, y1], [r1a, y1]));
      }
    }

    if (dLenPx > eps) {
      const by = toFiniteNumber(baseG.bottomY);
      const py = toFiniteNumber(prodG.bottomY);
      const y1 = Math.min(by, py);
      const y2 = Math.max(by, py);
      if (y2 - y1 > eps) {
        const g = by >= py ? baseG : prodG;
        const hipW = toFiniteNumber(g.hipW);
        const innerGap = toFiniteNumber(g.innerGap);
        const hemW = toFiniteNumber(g.hemW);
        const crotchY = toFiniteNumber(g.crotchY);
        const bottomY = toFiniteNumber(g.bottomY);

        const lt = [-innerGap / 2, crotchY];
        const lb = [-hipW / 2 + hemW, bottomY];
        const rt = [innerGap / 2, crotchY];
        const rb = [hipW / 2 - hemW, bottomY];

        const yTop = y1;
        const yBot = y2;

        const lInnerTopX = xAtYSeg(lt, lb, yTop);
        const rInnerTopX = xAtYSeg(rt, rb, yTop);

        out.length.push(quad([-hipW / 2, yTop], [lInnerTopX, yTop], [lb[0], yBot], [-hipW / 2, yBot]));
        out.length.push(quad([rInnerTopX, yTop], [hipW / 2, yTop], [hipW / 2, yBot], [rb[0], yBot]));
      }
    }

    return out;
  }

  const rect = (x, y, w, h) => {
    const ww = Math.max(0, toFiniteNumber(w));
    const hh = Math.max(0, toFiniteNumber(h));
    if (ww <= eps || hh <= eps) return null;
    return `M ${toFiniteNumber(x)} ${toFiniteNumber(y)} h ${ww} v ${hh} h ${-ww} Z`;
  };

  if (dWaistPx > eps && baseG?.rects?.waist) {
    const r = baseG.rects.waist;
    const h = Math.min(dWaistPx, r.h);
    const p = rect(r.x, r.y, r.w, h);
    if (p) out.waist.push(p);
  }

  if (dRisePx > eps && baseG?.rects?.rise) {
    const r = baseG.rects.rise;
    const w = Math.min(dRisePx, r.w * 0.3);
    const p = rect(-w / 2, r.y, w, r.h);
    if (p) out.rise.push(p);
  }

  if (dThighPx > eps && baseG?.rects?.leftLeg && baseG?.rects?.rightLeg) {
    const l = baseG.rects.leftLeg;
    const r = baseG.rects.rightLeg;
    const wL = Math.min(dThighPx, l.w * 0.4);
    const wR = Math.min(dThighPx, r.w * 0.4);

    const pL = rect(l.x, l.y, wL, l.h);
    if (pL) out.thigh.push(pL);

    const pR = rect(r.x + r.w - wR, r.y, wR, r.h);
    if (pR) out.thigh.push(pR);
  }

  if (dLenPx > eps && baseG?.rects?.leftLeg && baseG?.rects?.rightLeg) {
    const l = baseG.rects.leftLeg;
    const r = baseG.rects.rightLeg;
    const h = Math.min(dLenPx, Math.max(3, scale * 3));

    const pL = rect(l.x, l.y + l.h - h, l.w, h);
    if (pL) out.length.push(pL);

    const pR = rect(r.x, r.y + r.h - h, r.w, h);
    if (pR) out.length.push(pR);
  }

  return out;
};

const createTopOverlayPaths = (baseG, prodG, diffCm = null) => {
  const out = { shoulder: [], chest: [], sleeve: [], length: [] };

  const eps = 1e-3;
  const quad = (a, b, c, d) => polyPathFromPts([a, b, c, d]);

  {
    const diffShoulderCm = diffCm && Number.isFinite(diffCm.shoulder) ? diffCm.shoulder : 0;

    if (Math.abs(diffShoulderCm) > COLOR_GREEN_MAX) {
      const baseTL = [baseG.trapTopLeftX, baseG.trapTopY];
      const baseTR = [baseG.trapTopRightX, baseG.trapTopY];
      const baseBL = [baseG.trapBottomLeftX, baseG.bodyTopY];
      const baseBR = [baseG.trapBottomRightX, baseG.bodyTopY];

      const prodTL = [prodG.trapTopLeftX, prodG.trapTopY];
      const prodTR = [prodG.trapTopRightX, prodG.trapTopY];
      const prodBL = [prodG.trapBottomLeftX, prodG.bodyTopY];
      const prodBR = [prodG.trapBottomRightX, prodG.bodyTopY];

      const y = Math.min(baseG.trapTopY, prodG.trapTopY);
      const yMax = Math.min(baseG.bodyTopY, prodG.bodyTopY);

      const hAvail = yMax - y;
      const h = hAvail > eps ? Math.min(16, hAvail) : 16;
      const y2 = y + h;

      const bLT = xAtY(baseTL, baseBL, y);
      const bRT = xAtY(baseTR, baseBR, y);
      const bLB = xAtY(baseTL, baseBL, y2);
      const bRB = xAtY(baseTR, baseBR, y2);

      const pLT = xAtY(prodTL, prodBL, y);
      const pRT = xAtY(prodTR, prodBR, y);
      const pLB = xAtY(prodTL, prodBL, y2);
      const pRB = xAtY(prodTR, prodBR, y2);

      const widthDiff = Math.max(
        Math.abs(bLT - pLT),
        Math.abs(bRT - pRT),
        Math.abs(bLB - pLB),
        Math.abs(bRB - pRB)
      );

      if (widthDiff > eps) {
        const xT1 = Math.min(bLT, pLT);
        const xT2 = Math.max(bRT, pRT);
        const xB1 = Math.min(bLB, pLB);
        const xB2 = Math.max(bRB, pRB);
        out.shoulder.push(quad([xT1, y], [xT2, y], [xB2, y2], [xB1, y2]));
      }
    }
  }

  {
    const y1 = Math.max(baseG.bodyTopY, prodG.bodyTopY);
    const y2 = Math.min(baseG.bodyBottomY, prodG.bodyBottomY);
    const h = y2 - y1;

    if (h > eps) {
      const bL = baseG.bodyLeftX;
      const bR = baseG.bodyRightX;
      const pL = prodG.bodyLeftX;
      const pR = prodG.bodyRightX;

      if (Math.abs(bL - pL) > eps) {
        const x1 = Math.min(bL, pL);
        const x2 = Math.max(bL, pL);
        out.chest.push(quad([x1, y1], [x2, y1], [x2, y2], [x1, y2]));
      }

      if (Math.abs(bR - pR) > eps) {
        const x1 = Math.min(bR, pR);
        const x2 = Math.max(bR, pR);
        out.chest.push(quad([x1, y1], [x2, y1], [x2, y2], [x1, y2]));
      }
    }
  }

  {
    const mkBand = (baseC1, baseC2, prodC1, prodC2, dir) => {
      const dx = toFiniteNumber(dir?.[0]);
      const dy = toFiniteNumber(dir?.[1]);
      const ln = Math.hypot(dx, dy) || 1;
      const ux = dx / ln;
      const uy = dy / ln;

      const proj = (p, q) => {
        const vx = toFiniteNumber(p?.[0]) - toFiniteNumber(q?.[0]);
        const vy = toFiniteNumber(p?.[1]) - toFiniteNumber(q?.[1]);
        return vx * ux + vy * uy;
      };

      const s1 = proj(prodC1, baseC1);
      const s2 = proj(prodC2, baseC2);
      const s = (s1 + s2) / 2;

      if (Math.abs(s) <= eps) return null;

      const t0 = Math.min(0, s);
      const t1 = Math.max(0, s);

      const shift = (p, t) => [toFiniteNumber(p?.[0]) + ux * t, toFiniteNumber(p?.[1]) + uy * t];

      const a0 = shift(baseC1, t0);
      const a1 = shift(baseC1, t1);
      const b1 = shift(baseC2, t1);
      const b0 = shift(baseC2, t0);

      return quad(a0, a1, b1, b0);
    };

    const baseDirL = [
      toFiniteNumber(baseG.sleeveLeftPts?.[3]?.[0]) - toFiniteNumber(baseG.sleeveLeftPts?.[0]?.[0]),
      toFiniteNumber(baseG.sleeveLeftPts?.[3]?.[1]) - toFiniteNumber(baseG.sleeveLeftPts?.[0]?.[1])
    ];

    const baseEndL1 = baseG.sleeveLeftPts[3];
    const baseEndL2 = baseG.sleeveLeftPts[2];
    const prodEndL1 = prodG.sleeveLeftPts[3];
    const prodEndL2 = prodG.sleeveLeftPts[2];

    const bandL = mkBand(baseEndL1, baseEndL2, prodEndL1, prodEndL2, baseDirL);
    if (bandL) out.sleeve.push(bandL);

    const baseDirR = [
      toFiniteNumber(baseG.sleeveRightPts?.[3]?.[0]) - toFiniteNumber(baseG.sleeveRightPts?.[0]?.[0]),
      toFiniteNumber(baseG.sleeveRightPts?.[3]?.[1]) - toFiniteNumber(baseG.sleeveRightPts?.[0]?.[1])
    ];

    const baseEndR1 = baseG.sleeveRightPts[3];
    const baseEndR2 = baseG.sleeveRightPts[2];
    const prodEndR1 = prodG.sleeveRightPts[3];
    const prodEndR2 = prodG.sleeveRightPts[2];

    const bandR = mkBand(baseEndR1, baseEndR2, prodEndR1, prodEndR2, baseDirR);
    if (bandR) out.sleeve.push(bandR);
  }

  {
    const y1 = Math.min(baseG.bodyBottomY, prodG.bodyBottomY);
    const y2 = Math.max(baseG.bodyBottomY, prodG.bodyBottomY);

    const x1 = baseG.bodyLeftX;
    const x2 = baseG.bodyRightX;

    const topY = Math.min(y1, y2);
    const botY = Math.max(y1, y2);

    if (x2 - x1 > eps && botY > topY) {
      out.length.push(quad([x1, topY], [x2, topY], [x2, botY], [x1, botY]));
    }
  }

  return out;
};

export default function SilhouetteCompare({ userMeasure, productMeasure, category, isMini = false }) {

  const u = normalizeMeasureCm(userMeasure);
  const p = normalizeMeasureCm(productMeasure);

  const okU = hasAllPositiveMeasures(u);
  const okP = hasAllPositiveMeasures(p);

  const isCategoryMismatch = userMeasure && userMeasure.category && userMeasure.category !== "none" && userMeasure.category !== category;
  const categoryName = category === "tshirt" ? "티셔츠" : category === "hoodie" ? "후드·맨투맨" : category === "outer" ? "아우터" : "팬츠";

  if (!okU || isCategoryMismatch) {
    if (isMini) {
      return (
        <div style={{ fontSize: "8.5px", color: "#a1a1aa", textAlign: "center", padding: "16px 8px" }}>
          {isCategoryMismatch ? "동일 카테고리 설정 시 대조 가능" : "기준 의류 설정 시 대조 가능"}
        </div>
      );
    }
    return (
      <div style={{
        width: "100%",
        height: "280px",
        backgroundImage: "linear-gradient(rgba(229, 231, 235, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(229, 231, 235, 0.4) 1px, transparent 1px)",
        backgroundSize: "14px 14px",
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: "12px",
        border: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
        textAlign: "center",
        marginBottom: "16px"
      }}>
        <div style={{ fontSize: "16px", marginBottom: "8px", fontWeight: "bold", color: "#ffffff" }}>📐 핏 대조 비활성화</div>
        <p style={{ fontSize: "11px", color: "#a1a1aa", lineHeight: "1.5", margin: 0, maxWidth: "240px" }}>
          {isCategoryMismatch
            ? `현재 조회 중인 상품은 [${categoryName}] 카테고리입니다. 상단의 설정에서 동일한 카테고리의 기준 의류를 선택해 주세요.`
            : `상단의 설정 메뉴에서 [${categoryName}] 기준 의류를 설정하시면 정밀 실루엣 대조판이 활성화됩니다.`
          }
        </p>
      </div>
    );
  }

  if (!okP) return null;

  const BASE_SCALE = 3;
  const EX = 1.5;
  const toPx = (m) => ({ sh: m.shoulder * BASE_SCALE, ch: m.chest * BASE_SCALE, le: m.length * BASE_SCALE, sl: m.sleeve * BASE_SCALE });
  const pEx = {
    shoulder: u.shoulder + (p.shoulder - u.shoulder) * EX,
    chest: u.chest + (p.chest - u.chest) * EX,
    length: u.length + (p.length - u.length) * EX,
    sleeve: u.sleeve + (p.sleeve - u.sleeve) * EX
  };
  const U = toPx(u);
  const P = toPx(pEx);

  // 💡 [피드백 완벽 반영] 소매 형태 비주얼 정규화 (Sleeve Geometry Visual Normalization)
  // 반팔(35cm 미만)과 긴팔(35cm 이상)이 서로 비교될 때 실루엣이 찢어지거나 끊어지지 않도록 스케일링 보정
  const isShortSleeveU = u.sleeve > 0 && u.sleeve < 35;
  const isShortSleeveP = p.sleeve > 0 && p.sleeve < 35;

  if (isShortSleeveU && !isShortSleeveP) {
    // 기준 옷(반팔)을 구매 상품(긴팔) 형태에 맞추어 비주얼 소매 길이 확장
    U.sl = U.le * 0.82;
  } else if (!isShortSleeveU && isShortSleeveP) {
    // 기준 옷(긴팔)을 구매 상품(반팔) 형태에 맞추어 비주얼 소매 길이 축소
    U.sl = U.le * 0.28;
  }


  let computedSleeveDiff = p.sleeve - u.sleeve;
  if (isShortSleeveU && !isShortSleeveP) {
    // 기준 옷(반팔) ↔ 상품(긴팔): 긴팔 표준 오프셋(39.5cm)을 가산하여 현실적인 긴팔 비교 갭으로 보정
    computedSleeveDiff = p.sleeve - (u.sleeve + 39.5);
  } else if (!isShortSleeveU && isShortSleeveP) {
    // 기준 옷(긴팔) ↔ 상품(반팔): 반팔 표준 오프셋을 환산하여 현실적인 비교 갭으로 보정
    computedSleeveDiff = (p.sleeve + 39.5) - u.sleeve;
  }

  const diff = {
    shoulder: p.shoulder - u.shoulder,
    sleeve: computedSleeveDiff,
    chest: p.chest - u.chest,
    length: p.length - u.length
  };

  if (category === "pants") {
    const normPants = (m) => {
      if (!m) return { waist: 0, thigh: 0, rise: 0, hem: 0, length: 0 };

      const waist = toFiniteNumber(m.waist ?? m.waistSection ?? m.shoulder ?? 0);
      const thigh = toFiniteNumber(m.thigh ?? m.thighSection ?? m.chest ?? 0);
      const rise = toFiniteNumber(m.rise ?? m.riseLength ?? m.sleeve ?? 0);
      const length = toFiniteNumber(m.length ?? m.totalLength ?? m.pantsLength ?? 0);
      const hem = toFiniteNumber(m.hem ?? m.hemWidth ?? 0) || thigh * 0.7;

      return { waist, thigh, rise, hem, length };
    };

    const uPants = normPants(userMeasure);
    const pPants = normPants(productMeasure);

    const okPants = (m) => m.waist > 0 && m.thigh > 0 && m.rise > 0 && m.length > 0;

    const isPantsCategoryMismatch = userMeasure && userMeasure.category && userMeasure.category !== "none" && userMeasure.category !== "pants";

    if (!okPants(uPants) || !okPants(pPants) || isPantsCategoryMismatch) {
      if (isMini) {
        return (
          <div style={{ fontSize: "8.5px", color: "#a1a1aa", textAlign: "center", padding: "16px 8px" }}>
            {isPantsCategoryMismatch ? "동일 카테고리 설정 시 대조 가능" : "기준 의류 설정 시 대조 가능"}
          </div>
        );
      }
      return (
        <div style={{
          width: "100%",
          height: "280px",
          backgroundImage: "linear-gradient(rgba(229, 231, 235, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(229, 231, 235, 0.4) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          backgroundColor: "rgba(0,0,0,0.3)",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
          textAlign: "center",
          marginBottom: "16px"
        }}>
          <div style={{ fontSize: "16px", marginBottom: "8px", fontWeight: "bold", color: "#ffffff" }}>📐 핏 대조 비활성화</div>
          <p style={{ fontSize: "11px", color: "#a1a1aa", lineHeight: "1.5", margin: 0, maxWidth: "240px" }}>
            {isPantsCategoryMismatch
              ? `현재 조회 중인 상품은 [팬츠] 카테고리입니다. 상단의 설정에서 동일한 카테고리의 기준 의류를 선택해 주세요.`
              : `상단의 설정 메뉴에서 [팬츠] 기준 의류를 설정하시면 정밀 실루엣 대조판이 활성화됩니다.`
            }
          </p>
        </div>
      );
    }

    const userG = calculatePantsGeometry(uPants, { scale: BASE_SCALE });
    const productG = calculatePantsGeometry(pPants, { scale: BASE_SCALE });

    const PP = createPantsPaths(userG, productG);

    const diffPants = {
      waist: pPants.waist - uPants.waist,
      rise: pPants.rise - uPants.rise,
      thigh: pPants.thigh - uPants.thigh,
      length: pPants.length - uPants.length
    };

    const isTopLayerPants = (d) => {
      const v = toFiniteNumber(d);
      return (v >= 0 && v <= COLOR_GREEN_MAX) || (v > -2 && v < 0);
    };

    const isGreenFitPants = (d) => {
      const v = toFiniteNumber(d);
      return v >= 0 && v <= COLOR_GREEN_MAX;
    };

    const riseFitBandPath = (() => {
      const y0 = toFiniteNumber(productG?.waistBotY);
      const y1 = toFiniteNumber(productG?.crotchY);
      const h = y1 - y0;
      const w = 4;
      if (!(h > 0)) return "";
      return `M ${-w / 2} ${y0} h ${w} v ${h} h ${-w} Z`;
    })();

    const overlayPaths = createPantsOverlayPaths(userG, productG, diffPants);

    const padX = 130;
    const padY = 30;
    const minX = PP.b.minX - padX;
    const maxX = PP.b.maxX + padX;
    const minY = PP.b.minY - padY;
    const maxY = PP.b.maxY + padY;
    const vb = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

    return (
      <div style={isMini ? { background: "transparent", padding: 0 } : { position: "relative", background: "#000000", borderRadius: "16px", padding: "16px", border: "1.5px solid #1e1e21", marginBottom: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)" }}>

        {/* 💡 [피드백 완벽 반영] 좌측 상단 심플 범례 배치 */}
        {!isMini && (
          <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "10px", alignItems: "center", fontSize: "10px", color: "rgba(255,255,255,0.9)", fontWeight: "bold", zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "rgba(140,140,140,0.95)", display: "inline-block" }} />
              <span>기준 옷</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "rgba(255,255,255,1)", display: "inline-block" }} />
              <span>구매 상품</span>
            </div>
          </div>
        )}

        <svg viewBox={vb} width="100%" height={isMini ? "80" : "240"} preserveAspectRatio="xMidYMax meet" style={{ display: "block" }}>
          <g fill="rgba(140,140,140,0.5)" stroke="rgba(160,160,160,0.7)" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="3,3">
            <path d={PP.userShape} fillRule="evenodd" />
          </g>

          <g fillOpacity={OVERLAY_OPACITY}>
            {!isTopLayerPants(diffPants.waist) && overlayPaths.waist.map((d, i) => <path key={`pw-bot-${i}`} d={d} fill={col(diffPants.waist)} />)}
            {!isTopLayerPants(diffPants.rise) && overlayPaths.rise.map((d, i) => <path key={`pr-bot-${i}`} d={d} fill={col(diffPants.rise)} />)}
            {!isTopLayerPants(diffPants.thigh) && overlayPaths.thigh.map((d, i) => <path key={`pt-bot-${i}`} d={d} fill={col(diffPants.thigh)} />)}
            {!isTopLayerPants(diffPants.length) && overlayPaths.length.map((d, i) => <path key={`pl-bot-${i}`} d={d} fill={col(diffPants.length)} />)}
          </g>

          <g fill="none" stroke="rgba(255,255,255,1)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
            <path d={PP.productShape} fillRule="evenodd" />
          </g>

          <g fill="none" stroke="rgba(255,255,255,1)" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round">
            {PP.beltLine ? <path d={PP.beltLine} strokeWidth="4" /> : null}
            {PP.flyLine ? <path d={PP.flyLine} strokeWidth="4" /> : null}
            {PP.flyFlapPath ? <path d={PP.flyFlapPath} fill="none" strokeWidth="4" /> : null}
          </g>

          <g fillOpacity={OVERLAY_OPACITY}>
            {isTopLayerPants(diffPants.waist) && overlayPaths.waist.map((d, i) => <path key={`pw-top-${i}`} d={d} fill={col(diffPants.waist)} />)}
            {isGreenFitPants(diffPants.rise)
              ? (riseFitBandPath ? <path d={riseFitBandPath} fill={col(diffPants.rise)} /> : null)
              : (isTopLayerPants(diffPants.rise) && overlayPaths.rise.map((d, i) => <path key={`pr-top-${i}`} d={d} fill={col(diffPants.rise)} />))}
            {isTopLayerPants(diffPants.thigh) && overlayPaths.thigh.map((d, i) => <path key={`pt-top-${i}`} d={d} fill={col(diffPants.thigh)} />)}
            {isTopLayerPants(diffPants.length) && overlayPaths.length.map((d, i) => <path key={`pl-top-${i}`} d={d} fill={col(diffPants.length)} />)}
          </g>

          {/* 💡 [피드백 완벽 반영] isMini가 아닐 때만 상세 말풍선 표시 */}
          {!isMini && (() => {
            const hipW = toFiniteNumber(productG?.hipW);

            const outerX = hipW / 2 + 24;

            const waistBotY = toFiniteNumber(productG?.waistBotY);
            const crotchY = toFiniteNumber(productG?.crotchY);
            const bottomY = toFiniteNumber(productG?.bottomY);

            const formatCm = (v) => {
              const rounded = Math.round(v * 10) / 10;
              return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
            };

            return [
              { label: "허리", diff: diffPants.waist },
              { label: "밑위", diff: diffPants.rise },
              { label: "허벅지", diff: diffPants.thigh },
              { label: "총장", diff: diffPants.length }
            ].map((item, idx) => {
              const v = toFiniteNumber(item.diff);
              const ad = Math.abs(v);
              const formatted = formatCm(v);

              let fontColor = "#ef4444";
              let textContent = `${item.label} ${v > 0 ? `+${formatted}` : formatted}cm`;

              if (ad <= COLOR_GREEN_MAX) {
                fontColor = "#22c55e";
                textContent = `${item.label} 딱 맞음`;
              } else if (ad <= COLOR_YELLOW_MAX) {
                fontColor = "#f59e0b";
                textContent = `${item.label} ${v > 0 ? `+${formatted}` : formatted}cm`;
              }

              const isShort = textContent.length <= 5;
              const boxW = isShort ? 65 : 85;
              const boxH = 18;

              let x = 0;
              let y = 0;

              if (item.label === "허리") {
                x = -outerX - 35;
                y = 15;
              } else if (item.label === "밑위") {
                x = -boxW - 10;
                y = waistBotY + (crotchY - waistBotY) * 0.35 - boxH / 2;
              } else if (item.label === "허벅지") {
                x = outerX;
                y = crotchY + 6;
              } else {
                x = -boxW - 10;
                y = bottomY + 8;
              }

              return (
                <g key={`pants-margin-capsule-${idx}`} transform={`translate(${x}, ${y})`}>
                  <rect x={0} y={0} width={boxW} height={boxH} rx={boxH / 2} ry={boxH / 2} fill="#ffffff" stroke="#000000" strokeWidth="1" />
                  <text x={boxW / 2} y={boxH / 2 + 3.5} fill={fontColor} fontSize="9px" fontWeight="900" textAnchor="middle">
                    {textContent}
                  </text>
                </g>
              );
            });
          })()}
        </svg>

        {/* 💡 [피드백 완벽 반영] 3색 신호등 가로 한 줄 정렬 */}
        {!isMini && (
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", alignItems: "center", marginTop: "12px", fontSize: "10px", color: "rgba(255,255,255,0.9)", fontWeight: "bold", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "#22c55e", display: "inline-block" }} />
              <span>잘 맞음</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "#f59e0b", display: "inline-block" }} />
              <span>약간 차이</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "#ef4444", display: "inline-block" }} />
              <span>주의</span>
            </div>
          </div>
        )}

      </div>
    );
  }

  const shiftGeomY = (g, dy) => ({
    ...g,
    trapTopY: g.trapTopY + dy,
    bodyTopY: g.bodyTopY + dy,
    bodyBottomY: g.bodyBottomY + dy,
    sleeveLeftPts: g.sleeveLeftPts.map((p) => [p[0], p[1] + dy]),
    sleeveRightPts: g.sleeveRightPts.map((p) => [p[0], p[1] + dy]),
    triLeftPts: g.triLeftPts ? g.triLeftPts.map((p) => [p[0], p[1] + dy]) : g.triLeftPts,
    triRightPts: g.triRightPts ? g.triRightPts.map((p) => [p[0], p[1] + dy]) : g.triRightPts
  });

  const topOptions = {
    isHoodie: category === "hoodie",
    isOuter: category === "outer",
    isTshirt: category === "tshirt"
  };

  const baseGeom = calculateTopGeometry(U, topOptions);
  const prodGeomRaw = calculateTopGeometry(P, topOptions);

  const sleeveDirFrom = (g, side) => {
    const pts = side === "L" ? g.sleeveLeftPts : g.sleeveRightPts;
    const dx = toFiniteNumber(pts?.[3]?.[0]) - toFiniteNumber(pts?.[0]?.[0]);
    const dy = toFiniteNumber(pts?.[3]?.[1]) - toFiniteNumber(pts?.[0]?.[1]);
    const ln = Math.hypot(dx, dy) || 1;
    return [dx / ln, dy / ln];
  };

  const rebuildSleeveWithDir = (pts, dir) => {
    const a = pts[0];
    const b = pts[1];
    const dx = toFiniteNumber(pts?.[3]?.[0]) - toFiniteNumber(a?.[0]);
    const dy = toFiniteNumber(pts?.[3]?.[1]) - toFiniteNumber(a?.[1]);
    const len = Math.hypot(dx, dy) || 0;
    const ox = toFiniteNumber(dir?.[0]) * len;
    const oy = toFiniteNumber(dir?.[1]) * len;
    const a2 = [toFiniteNumber(a?.[0]) + ox, toFiniteNumber(a?.[1]) + oy];
    const b2 = [toFiniteNumber(b?.[0]) + ox, toFiniteNumber(b?.[1]) + oy];
    return [a, b, b2, a2];
  };

  const alignProdY = (topOptions.isHoodie || topOptions.isOuter || topOptions.isTshirt);
  const prodGeomAligned = alignProdY
    ? shiftGeomY(prodGeomRaw, baseGeom.trapTopY - prodGeomRaw.trapTopY)
    : prodGeomRaw;

  const baseDirL = sleeveDirFrom(baseGeom, "L");
  const baseDirR = sleeveDirFrom(baseGeom, "R");

  const prodGeom = {
    ...prodGeomAligned,
    sleeveLeftPts: rebuildSleeveWithDir(prodGeomAligned.sleeveLeftPts, baseDirL),
    sleeveRightPts: rebuildSleeveWithDir(prodGeomAligned.sleeveRightPts, baseDirR)
  };

  const GU = createTopPaths(baseGeom, category);
  const GP = createTopPaths(prodGeom, category);
  const productOutline = getSingleOutlinePath(prodGeom, category);

  const pad = 24;
  const bottomPad = 40;
  const minX = Math.min(GU.b.minX, GP.b.minX) - pad;
  const maxX = Math.max(GU.b.maxX, GP.b.maxX) + pad;
  const minY = Math.min(GU.b.minY, GP.b.minY) - pad;
  const maxY = Math.max(GU.b.maxY, GP.b.maxY) + pad + bottomPad;
  const vb = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

  const uid = (React.useId ? React.useId() : "sc").replace(/[:]/g, "");
  const mkMask = (id, w, b, evenOdd) => (
    <mask id={id} maskUnits="userSpaceOnUse">
      <rect x={minX} y={minY} width={maxX - minX} height={maxY - minY} fill="#000" />
      <g fill="#fff" fillRule={evenOdd ? "evenodd" : "nonzero"}>{w}</g>
      <g fill="#000" fillRule={evenOdd ? "evenodd" : "nonzero"}>{b}</g>
    </mask>
  );

  const Z = {
    shoulder: { u: [<path key="u" d={GU.trap} fillRule="evenodd" />], p: [<path key="p" d={GP.trap} fillRule="evenodd" />], evenOdd: true },
    sleeve: { u: [<path key="ul" d={GU.slL} />, <path key="ur" d={GU.slR} />], p: [<path key="pl" d={GP.slL} />, <path key="pr" d={GP.slR} />], evenOdd: false },
    chest: { u: [<path key="u" d={GU.bodyTop} />], p: [<path key="p" d={GP.bodyTop} />], evenOdd: false },
    length: { u: [<path key="u" d={GU.bodyBot} />], p: [<path key="p" d={GP.bodyBot} />], evenOdd: false }
  };

  const overlayOpacity = OVERLAY_OPACITY;

  const overlayPaths = createTopOverlayPaths(baseGeom, prodGeom, diff);

  const isTopLayerTop = (d) => {
    const v = toFiniteNumber(d);
    return (v >= 0 && v <= COLOR_GREEN_MAX) || (v > -2 && v < 0);
  };

  const overlayLayerBelowProduct = (
    <g fillOpacity={overlayOpacity}>
      {!isTopLayerTop(diff.shoulder) && overlayPaths.shoulder.map((d, i) => <path key={`sh-bot-${i}`} d={d} fill={col(diff.shoulder)} />)}
      {!isTopLayerTop(diff.sleeve) && overlayPaths.sleeve.map((d, i) => <path key={`sl-bot-${i}`} d={d} fill={col(diff.sleeve)} />)}
      {!isTopLayerTop(diff.chest) && overlayPaths.chest.map((d, i) => <path key={`ch-bot-${i}`} d={d} fill={col(diff.chest)} />)}
      {!isTopLayerTop(diff.length) && overlayPaths.length.map((d, i) => <path key={`le-bot-${i}`} d={d} fill={col(diff.length)} />)}
    </g>
  );

  const overlayLayerTop = (
    <g fillOpacity={overlayOpacity}>
      {isTopLayerTop(diff.shoulder) && overlayPaths.shoulder.map((d, i) => <path key={`sh-top-${i}`} d={d} fill={col(diff.shoulder)} />)}
      {isTopLayerTop(diff.sleeve) && overlayPaths.sleeve.map((d, i) => <path key={`sl-top-${i}`} d={d} fill={col(diff.sleeve)} />)}
      {isTopLayerTop(diff.chest) && overlayPaths.chest.map((d, i) => <path key={`ch-top-${i}`} d={d} fill={col(diff.chest)} />)}
      {isTopLayerTop(diff.length) && overlayPaths.length.map((d, i) => <path key={`le-top-${i}`} d={d} fill={col(diff.length)} />)}
    </g>
  );

  const zoneStroke = (d) => {
    const solid = d < 0 || Math.abs(d) > 1.5;
    if (!solid) {
      return {
        stroke: "rgba(255,255,255,0.6)",
        strokeWidth: 1.5,
        strokeDasharray: "6,4"
      };
    }

    return {
      stroke: "rgba(255,255,255,0.95)",
      strokeWidth: 5
    };
  };

  const stShoulder = zoneStroke(diff.shoulder);
  const stSleeve = zoneStroke(diff.sleeve);
  const stChest = zoneStroke(diff.chest);
  const stLength = zoneStroke(diff.length);

  const baseOnlyMaskId = `${uid}-baseOnly`;
  const baseOnlyMask = mkMask(
    baseOnlyMaskId,
    [
      <path key="u-trap" d={GU.trap} fillRule="evenodd" />,
      GU.triL ? <path key="u-triL" d={GU.triL} /> : null,
      GU.triR ? <path key="u-triR" d={GU.triR} /> : null,
      <path key="u-slL" d={GU.slL} />,
      <path key="u-slR" d={GU.slR} />,
      <path key="u-body" d={GU.body} />
    ],
    [
      <path key="p-trap" d={GP.trap} fillRule="evenodd" />,
      GP.triL ? <path key="p-triL" d={GP.triL} /> : null,
      GP.triR ? <path key="p-triR" d={GP.triR} /> : null,
      <path key="p-slL" d={GP.slL} />,
      <path key="p-slR" d={GP.slR} />,
      <path key="p-body" d={GP.body} />
    ],
    false
  );

  return (
    <div style={isMini ? { background: "transparent", padding: 0 } : { position: "relative", background: "#000000", borderRadius: "16px", padding: "16px", border: "1.5px solid #1e1e21", marginBottom: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)" }}>

      {/* 💡 [피드백 완벽 반영] 좌측 상단 심플 범례 배치 */}
      {!isMini && (
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "10px", alignItems: "center", fontSize: "10px", color: "rgba(255,255,255,0.9)", fontWeight: "bold", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "rgba(140,140,140,0.95)", display: "inline-block" }} />
            <span>기준 옷</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "rgba(255,255,255,1)", display: "inline-block" }} />
            <span>구매 상품</span>
          </div>
        </div>
      )}

      <svg viewBox={vb} width="100%" height={isMini ? "80" : "220"} preserveAspectRatio="xMidYMax meet" style={{ display: "block" }}>
        <defs>{baseOnlyMask}</defs>

        <g fill="rgba(130,130,130,0.95)" stroke="rgba(95,95,95,0.95)" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="3,3">
          <path d={GU.trap} fillRule="evenodd" />
          {GU.triL && <path d={GU.triL} />}
          {GU.triR && <path d={GU.triR} />}
          <path d={GU.slL} />
          <path d={GU.slR} />
          <path d={GU.body} />
        </g>

        {category === "hoodie" && (GU.hoodOuter || GU.hood || GU.hemRib || GU.cuffL || GU.cuffR) && (
          <g fill="none" stroke="rgba(120,120,120,0.89)" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="3,3">
            {GU.hoodOuter && <path d={GU.hoodOuter} />}
            {GU.hood && <path d={GU.hood} />}
            {GU.hemRib && <rect x={GU.hemRib.x} y={GU.hemRib.y} width={GU.hemRib.w} height={GU.hemRib.h} />}
            {GU.cuffL && <path d={GU.cuffL} />}
            {GU.cuffR && <path d={GU.cuffR} />}
          </g>
        )}

        {overlayLayerBelowProduct}

        {category === "tshirt" ? (
          <g fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
            <path d={productOutline} />
          </g>
        ) : (
          <g fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
            <path d={productOutline} />

            {category === "hoodie" && (GP.hoodOuter || GP.hood || GP.hemRib || GP.cuffL || GP.cuffR) && (
              <g>
                {GP.hoodOuter && <path d={GP.hoodOuter} />}
                {GP.hood && <path d={GP.hood} />}
                {GP.hemRib && <rect x={GP.hemRib.x} y={GP.hemRib.y} width={GP.hemRib.w} height={GP.hemRib.h} />}
                {GP.cuffL && <path d={GP.cuffL} />}
                {GP.cuffR && <path d={GP.cuffR} />}
              </g>
            )}

            {category === "outer" && GP.centerFront && (
              <g stroke="rgba(255,255,255,0.95)" strokeWidth="5">
                <path d={GP.centerFront} />
                {GP.pocketL && <path d={GP.pocketL} />}
                {GP.pocketR && <path d={GP.pocketR} />}
              </g>
            )}
          </g>
        )}

        {overlayLayerTop}

        {/* 💡 [피드백 완벽 반영] isMini가 아닐 때만 상세 말풍선 표시 */}
        {!isMini && (() => {
          const formatCm = (v) => {
            const rounded = Math.round(v * 10) / 10;
            return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
          };

          const mk = (label, v) => {
            const vv = toFiniteNumber(v);
            const ad = Math.abs(vv);
            const formatted = formatCm(vv);

            let fontColor = "#ef4444";
            let textContent = `${label} ${vv > 0 ? `+${formatted}` : formatted}cm`;

            if (ad <= COLOR_GREEN_MAX) {
              fontColor = "#22c55e";
              textContent = `${label} 딱 맞음`;
            } else if (ad <= COLOR_YELLOW_MAX) {
              fontColor = "#f59e0b";
              textContent = `${label} ${vv > 0 ? `+${formatted}` : formatted}cm`;
            }

            const isShort = textContent.length <= 5;
            const boxW = isShort ? 65 : 85;
            const boxH = 18;

            return { fontColor, textContent, boxW, boxH };
          };

          const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

          const items = [
            { label: "어깨", diff: diff.shoulder },
            { label: "가슴", diff: diff.chest },
            { label: "총장", diff: diff.length },
            { label: "소매", diff: diff.sleeve }
          ];

          const bx = toFiniteNumber(prodGeom.trapTopLeftX);
          const tx = toFiniteNumber(prodGeom.trapTopRightX);
          const trapTopY = toFiniteNumber(prodGeom.trapTopY);
          const by = toFiniteNumber(prodGeom.bodyTopY);
          const bb = toFiniteNumber(prodGeom.bodyBottomY);
          const yC = by + (bb - by) * 0.6;

          const trapMidX = (bx + tx) / 2;

          const cuffA = prodGeom?.sleeveRightPts?.[2];
          const cuffB = prodGeom?.sleeveRightPts?.[3];
          const cuffX = Math.max(toFiniteNumber(cuffA?.[0]), toFiniteNumber(cuffB?.[0]));
          const cuffY = Math.max(toFiniteNumber(cuffA?.[1]), toFiniteNumber(cuffB?.[1]));

          const bodyRightX = toFiniteNumber(prodGeom.bodyRightX);

          return items.map((it, idx) => {
            const { fontColor, textContent, boxW, boxH } = mk(it.label, it.diff);

            let posX = bx - 92;
            let posY = by + (bb - by) * 0.25;

            if (it.label === "어깨") {
              posX = trapMidX - boxW / 2;
              posY = category === "hoodie" ? toFiniteNumber(minY) + 4 : trapTopY - boxH - 2;
            } else if (it.label === "소매") {
              posX = cuffX - boxW / 2;
              posY = cuffY + 2;
            } else if (it.label === "총장") {
              posX = trapMidX - boxW / 2;
              posY = bb + 10;
            } else if (it.label === "가슴") {
              posX = trapMidX - boxW / 2;

              const isChestTopAnchored = category === "tshirt" || category === "hoodie" || category === "outer" || category === "mtm" || category === "sweatshirt";
              posY = isChestTopAnchored ? (by + 2) : (by + (yC - by) * 0.5 - boxH / 2);
            }

            const x = clamp(toFiniteNumber(posX), toFiniteNumber(minX) + 4, toFiniteNumber(maxX) - boxW - 4);
            const y = clamp(toFiniteNumber(posY), toFiniteNumber(minY) + 4, toFiniteNumber(maxY) - boxH - 4);

            return (
              <g key={`top-margin-capsule-${idx}`} transform={`translate(${x}, ${y})`}>
                <rect x={0} y={0} width={boxW} height={boxH} rx={boxH / 2} ry={boxH / 2} fill="#ffffff" stroke="#000000" strokeWidth="1" />
                <text x={boxW / 2} y={boxH / 2 + 3.5} fill={fontColor} fontSize="9px" fontWeight="900" textAnchor="middle">
                  {textContent}
                </text>
              </g>
            );
          });
        })()}
      </svg>

      {/* 💡 [피드백 완벽 반영] 3색 신호등 가로 한 줄 정렬 */}
      {!isMini && (
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", alignItems: "center", marginTop: "12px", fontSize: "10px", color: "rgba(255,255,255,0.9)", fontWeight: "bold", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "#22c55e", display: "inline-block" }} />
            <span>잘 맞음</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "#f59e0b", display: "inline-block" }} />
            <span>약간 차이</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "#ef4444", display: "inline-block" }} />
            <span>주의</span>
          </div>
        </div>
      )}

    </div>
  );
}