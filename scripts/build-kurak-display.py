#!/usr/bin/env python3
"""
Сборка шрифта «Kurak Display»: Dela Gothic One (SIL OFL 1.1) + кыргызские Ң ң Ү ү Ө ө.

Исходник — подмножество Dela Gothic One (латиница + кириллица) в src/fonts/DelaGothicOne-kurak.woff2.
В нём нет шести кыргызских букв; скрипт строит их из родных глифов того же шрифта:

  Ү U+04AE  компонент латинской Y (форма та же).
  ү U+04AF  контур «v» высотой строчных; нижние концы диагоналей сведены в прямую ножку
            по центру до линии нижних выносных (глубина и расширение книзу — как у ножки р/p).
  Ң U+04A2  контур Н; справа внизу хвостик, размеры и отступы которого сняты с Ц.
  ң U+04A3  контур н; хвостик снят с ц.
  Ө U+04E8  контур О; просвет разделён перекладиной толщиной как средний штрих Э.
  ө U+04E9  контур о; перекладина занимает ту же долю просвета, что у Ө (просвет «о» ниже, чем у «э»).

Контуры строятся через TTGlyphPen без перекрытий (внешний контур по часовой, просветы против),
bbox пересчитывается, hmtx/vmtx/GDEF/cmap дополняются, кернинг Ү и ү копируется с Y и у.
Таблица name переименовывается в «Kurak Display», копирайт Dela сохраняется.

Запуск (из корня репозитория):  python scripts/build-kurak-display.py
Опции:  --src, --out — пути к исходному и итоговому woff2.
Зависимости: fontTools (4.x) и brotli.
"""
from __future__ import annotations

import argparse
import copy
import math
import sys
from pathlib import Path

from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SRC = ROOT / "src" / "fonts" / "DelaGothicOne-kurak.woff2"
DEFAULT_OUT = ROOT / "src" / "fonts" / "KurakDisplay.woff2"

FAMILY = "Kurak Display"
PS_NAME = "KurakDisplay-Regular"
MOD_NOTE = (
    "Kurak Display is a modified version of Dela Gothic One: "
    "added Kyrgyz letters Ң ң Ү ү Ө ө (2026)."
)
OFL_DESC = (
    "This Font Software is licensed under the SIL Open Font License, Version 1.1. "
    "This license is available with a FAQ at: https://openfontlicense.org"
)
OFL_URL = "https://openfontlicense.org"

EPS = 1e-6

# --------------------------------------------------------------------------------------------
# Геометрия: контуры как списки сегментов ('L', p0, p1) и ('Q', p0, c, p1)
# --------------------------------------------------------------------------------------------


def glyph_contours(font: TTFont, name: str) -> list[list[tuple]]:
    """Контуры глифа (составные раскрываются) как списки сегментов с явными on-curve точками."""
    glyf = font["glyf"]
    coords, ends, flags = glyf[name].getCoordinates(glyf)
    out, start = [], 0
    for end in ends:
        pts = [(float(coords[i][0]), float(coords[i][1]), bool(flags[i] & 1)) for i in range(start, end + 1)]
        start = end + 1
        out.append(tt_points_to_segments(pts))
    return out


def tt_points_to_segments(pts: list[tuple]) -> list[tuple]:
    """TrueType-точки (с неявными on-curve между двумя off-curve) -> сегменты L/Q."""
    if not any(on for _, _, on in pts):  # контур из одних off-curve: добавим середину
        a, b = pts[-1], pts[0]
        pts = [((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, True)] + pts
    k = next(i for i, p in enumerate(pts) if p[2])
    pts = pts[k:] + pts[:k]
    # явные on-curve точки между соседними off-curve
    full = []
    n = len(pts)
    for i in range(n):
        p, q = pts[i], pts[(i + 1) % n]
        full.append(p)
        if not p[2] and not q[2]:
            full.append(((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, True))
    segs, i, n = [], 0, len(full)
    while i < n:
        p0 = full[i]
        p1 = full[(i + 1) % n]
        if p1[2]:
            segs.append(("L", p0[:2], p1[:2]))
            i += 1
        else:
            p2 = full[(i + 2) % n]
            segs.append(("Q", p0[:2], p1[:2], p2[:2]))
            i += 2
    return segs


def seg_start(s):
    return s[1]


def seg_end(s):
    return s[-1]


def quad_at(p0, c, p1, t):
    mt = 1 - t
    return (
        mt * mt * p0[0] + 2 * mt * t * c[0] + t * t * p1[0],
        mt * mt * p0[1] + 2 * mt * t * c[1] + t * t * p1[1],
    )


def split_seg(s, t):
    """Делит сегмент в параметре t (де Кастельжо)."""
    if s[0] == "L":
        p0, p1 = s[1], s[2]
        m = (p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t)
        return ("L", p0, m), ("L", m, p1)
    p0, c, p1 = s[1], s[2], s[3]
    c0 = (p0[0] + (c[0] - p0[0]) * t, p0[1] + (c[1] - p0[1]) * t)
    c1 = (c[0] + (p1[0] - c[0]) * t, c[1] + (p1[1] - c[1]) * t)
    m = quad_at(p0, c, p1, t)
    return ("Q", p0, c0, m), ("Q", m, c1, p1)


def seg_y_params(s, y):
    """Параметры t в (0, 1), где сегмент пересекает горизонталь y."""
    if s[0] == "L":
        y0, y1 = s[1][1], s[2][1]
        if abs(y1 - y0) < EPS:
            return []
        t = (y - y0) / (y1 - y0)
        return [t] if EPS < t < 1 - EPS else []
    y0, yc, y1 = s[1][1], s[2][1], s[3][1]
    a = y0 - 2 * yc + y1
    b = 2 * (yc - y0)
    c = y0 - y
    if abs(a) < EPS:
        roots = [-c / b] if abs(b) > EPS else []
    else:
        d = b * b - 4 * a * c
        if d < 0:
            return []
        sq = math.sqrt(d)
        roots = [(-b - sq) / (2 * a), (-b + sq) / (2 * a)]
    return sorted(t for t in roots if EPS < t < 1 - EPS)


def split_contour_at_y(segs, y):
    out = []
    for s in segs:
        ts = seg_y_params(s, y)
        rest, consumed = s, 0.0
        for t in ts:
            local = (t - consumed) / (1 - consumed)
            a, rest = split_seg(rest, local)
            out.append(a)
            consumed = t
        out.append(rest)
    return out


def seg_mid(s):
    if s[0] == "L":
        return ((s[1][0] + s[2][0]) / 2, (s[1][1] + s[2][1]) / 2)
    return quad_at(s[1], s[2], s[3], 0.5)


def signed_area(segs):
    """Площадь по формуле шнурков с учётом квадратичных дуг (>0 — против часовой)."""
    a = 0.0
    for s in segs:
        if s[0] == "L":
            (x0, y0), (x1, y1) = s[1], s[2]
            a += x0 * y1 - x1 * y0
        else:
            (x0, y0), (cx, cy), (x1, y1) = s[1], s[2], s[3]
            # точная площадь квадратичной Безье относительно начала координат
            a += (x0 * y1 - x1 * y0) + (2.0 / 3.0) * (
                (x0 * cy - cx * y0) + (cx * y1 - x1 * cy) - (x0 * y1 - x1 * y0)
            )
    return a / 2


def rotate_to(segs, idx):
    return segs[idx:] + segs[:idx]


def close(a, b, tol=0.51):
    return abs(a[0] - b[0]) <= tol and abs(a[1] - b[1]) <= tol


def draw_contours(contours):
    """
    Сегменты -> TrueType-глиф. On-curve точка, лежащая ровно посередине между соседними
    off-curve (неявная в исходнике), снова делается неявной — нетронутые участки контура
    записываются точь-в-точь как в Dela. Координаты округляются до целых.
    """
    pen = TTGlyphPen(None)
    R = lambda p: (int(round(p[0])), int(round(p[1])))  # noqa: E731
    for segs in contours:
        n = len(segs)
        pts = []  # (точка, on-curve?)
        for i, s in enumerate(segs):
            nxt = segs[(i + 1) % n]
            if s[0] == "Q":
                pts.append((R(s[2]), False))
            end = seg_end(s)
            implied = (
                s[0] == "Q" and nxt[0] == "Q"
                and close(end, ((s[2][0] + nxt[2][0]) / 2, (s[2][1] + nxt[2][1]) / 2), 1e-6)
            )
            if not implied:
                pts.append((R(end), True))
        # убрать совпавшие после округления соседние точки
        clean = []
        for p in pts:
            if clean and clean[-1] == p:
                continue
            clean.append(p)
        while len(clean) > 1 and clean[-1] == clean[0]:
            clean.pop()
        k = next((i for i, (_, on) in enumerate(clean) if on), None)
        if k is None:  # одни off-curve: делаем первую точку опорной
            clean[0] = (clean[0][0], True)
            k = 0
        clean = clean[k:] + clean[:k]
        first = clean[0][0]
        pen.moveTo(first)
        offs = []
        for p, on in clean[1:] + [(first, True)]:
            if not on:
                offs.append(p)
            elif offs:
                pen.qCurveTo(*offs, p)
                offs = []
            else:
                pen.lineTo(p)
        pen.closePath()
    return pen.glyph(dropImpliedOnCurves=True)


# --------------------------------------------------------------------------------------------
# Измерения на родных глифах
# --------------------------------------------------------------------------------------------


def on_points(segs):
    return [seg_start(s) for s in segs]


def vertical_lines(segs, min_len=150):
    return [s for s in segs if s[0] == "L" and abs(s[1][0] - s[2][0]) < EPS and abs(s[1][1] - s[2][1]) >= min_len]


def horizontal_lines(segs, min_len=150):
    return [s for s in segs if s[0] == "L" and abs(s[1][1] - s[2][1]) < EPS and abs(s[1][0] - s[2][0]) >= min_len]


def x_on_contour_at_y(segs, y, side="max"):
    xs = []
    for s in split_contour_at_y(segs, y):
        for p in (seg_start(s), seg_end(s)):
            if abs(p[1] - y) < 1e-3:
                xs.append(p[0])
    return max(xs) if side == "max" else min(xs)


def measure_tail(font, ref):
    """Хвостик Ц/ц: дно, левый/правый край, высота ступеньки, отступы от правой ножки."""
    (segs,) = glyph_contours(font, ref)
    pts = on_points(segs)
    y_min = min(p[1] for p in pts)
    bottom = [p for p in pts if abs(p[1] - y_min) < EPS]
    tail_l, tail_r = min(p[0] for p in bottom), max(p[0] for p in bottom)
    step_y = max(p[1] for p in pts if abs(p[0] - tail_r) < EPS)
    outer_at_step = max(p[0] for p in pts if abs(p[1] - step_y) < EPS and p[0] < tail_r - EPS)
    adv = font["hmtx"][ref][0]
    stem_inner = max(
        s[1][0] for s in vertical_lines(segs)
        if adv / 2 < s[1][0] < outer_at_step and min(s[1][1], s[2][1]) > -EPS  # не край самого хвостика
    )
    m = dict(
        y_min=y_min,
        step_y=step_y,
        d_left=tail_l - stem_inner,  # левый край хвостика от внутреннего края правой ножки
        d_right=tail_r - outer_at_step,  # выступ за внешний край ножки на высоте ступеньки
        rsb=adv - tail_r,
    )
    assert y_min < -100 and 100 < step_y < 300 and 0 < m["d_left"] < 120 and 0 < m["d_right"] < 80, (ref, m)
    return m


def bar_from(font, ref):
    """Средняя горизонталь Э/э: нижняя и верхняя y длинных горизонтальных отрезков."""
    (segs,) = glyph_contours(font, ref)
    ys = sorted({round(s[1][1], 3) for s in horizontal_lines(segs, min_len=200)})
    assert len(ys) == 2, (ref, ys)
    return ys[0], ys[1]


# --------------------------------------------------------------------------------------------
# Построение новых букв
# --------------------------------------------------------------------------------------------


def build_tail_letter(font, base, ref):
    """Н/н + хвостик, снятый с Ц/ц. Возвращает (контуры, advance)."""
    m = measure_tail(font, ref)
    (segs,) = glyph_contours(font, base)
    adv = font["hmtx"][base][0]
    stem_inner = max(s[1][0] for s in vertical_lines(segs, 100) if s[1][0] > adv / 2)
    # точка P на внешнем крае правой ножки на высоте ступеньки: делим только этот сегмент
    hits = []
    for i, s in enumerate(segs):
        for t in seg_y_params(s, m["step_y"]):
            hits.append((split_seg(s, t)[0][-1][0], i, t))
    x_p, i_s, t_s = max(hits)
    assert x_p > stem_inner + 100, (base, x_p)
    a, b = split_seg(segs[i_s], t_s)
    segs = segs[:i_s] + [a, b] + segs[i_s + 1:]
    p = seg_start(b)
    segs = rotate_to(segs, i_s + 1)
    # отрезок по базовой линии, приходящий во внутренний край правой ножки
    i_e = next(
        i for i, s in enumerate(segs)
        if s[0] == "L" and abs(s[2][1]) < EPS and abs(s[1][1]) < EPS and abs(s[2][0] - stem_inner) < EPS
    )
    tail_r = round(p[0] + m["d_right"])
    tail_l = round(stem_inner + m["d_left"])
    y0, ys = m["y_min"], m["step_y"]
    pts = [p, (tail_r, ys), (tail_r, y0), (tail_l, y0), (tail_l, 0.0), (stem_inner, 0.0)]
    tail = [("L", a, b) for a, b in zip(pts, pts[1:])]
    new = tail + segs[i_e + 1:]
    return [new], tail_r + m["rsb"]


def build_barred_o(font, base, bar_lo, bar_hi):
    """О/о, просвет которой перекладиной [bar_lo, bar_hi] разделён на два просвета."""
    contours = glyph_contours(font, base)
    assert len(contours) == 2, base
    outer, inner = sorted(contours, key=lambda c: abs(signed_area(c)), reverse=True)
    assert signed_area(outer) < 0 < signed_area(inner), "ожидались внешний по часовой и просвет против"
    iy = [p[1] for p in on_points(inner)]
    assert min(iy) < bar_lo < bar_hi < max(iy), (base, bar_lo, bar_hi)
    segs = split_contour_at_y(split_contour_at_y(inner, bar_lo), bar_hi)

    def chain(pred):
        flags = [pred(seg_mid(s)[1]) for s in segs]
        # начинаем с первого сегмента цепочки, перед которым — чужой сегмент
        k = next(i for i in range(len(segs)) if flags[i] and not flags[i - 1])
        rot = rotate_to(segs, k)
        part = []
        for s in rot:
            if not pred(seg_mid(s)[1]):
                break
            part.append(s)
        part.append(("L", seg_end(part[-1]), seg_start(part[0])))  # край перекладины
        return part

    upper = chain(lambda y: y > bar_hi)
    lower = chain(lambda y: y < bar_lo)
    for c in (upper, lower):
        assert signed_area(c) > 0
    return [outer, upper, lower], font["hmtx"][base][0]


def build_straight_u(font, base="v", stem=226, flare=5, desc_ref="p"):
    """
    ү: «v» + прямая ножка. Внешние края диагоналей продолжены по касательной вниз,
    пока не сойдутся до ширины ножки; дальше ножка вертикальна до глубины выносных (как у p),
    с лёгким расширением книзу, как у ножки p.
    """
    (segs,) = glyph_contours(font, base)
    pts = on_points(segs)
    assert min(p[1] for p in pts) == 0
    # нижние углы «v» на базовой линии
    bl = [p for p in pts if abs(p[1]) < EPS]
    bot_l, bot_r = min(bl), max(bl)
    cx = (bot_l[0] + bot_r[0]) / 2
    # вершина внутреннего угла (самая низкая точка не на базовой линии)
    crotch = min((p for p in pts if p[1] > EPS), key=lambda p: p[1])
    cx = (cx + crotch[0]) / 2
    sl, sr = cx - stem / 2, cx + stem / 2
    y_desc = min(p[1] for p in on_points(glyph_contours(font, desc_ref)[0]))

    def tangent_into(seg_in_at_end, corner, x_target):
        """Продолжение внешнего края от corner по касательной до x_target."""
        c = seg_in_at_end
        dx, dy = corner[0] - c[0], corner[1] - c[1]
        t = (x_target - corner[0]) / dx
        return (x_target, corner[1] + dy * t)

    # сегмент, приходящий в правый нижний угол (правый внешний край), и уходящий из левого
    i_r = next(i for i, s in enumerate(segs) if close(seg_end(s), bot_r, 1e-6))
    i_l = next(i for i, s in enumerate(segs) if close(seg_start(s), bot_l, 1e-6))
    s_r, s_l = segs[i_r], segs[i_l]
    ctrl_r = s_r[2] if s_r[0] == "Q" else s_r[1]  # точка, задающая касательную в углу
    ctrl_l = s_l[2]  # для Q — off-curve, для L — дальний конец отрезка
    jr = tangent_into(ctrl_r, bot_r, sr)
    jl = tangent_into(ctrl_l, bot_l, sl)
    # ножка: вертикаль с плавным расширением книзу, как у p (кривая, расходится в нижней половине)
    def stem_edge(top, x_bottom):
        mid_y = top[1] + (y_desc - top[1]) * 0.55
        return ("Q", top, (top[0], mid_y), (x_bottom, y_desc))

    right_down = stem_edge(jr, sr + flare)
    left_up_q = stem_edge(jl, sl - flare)
    left_up = ("Q", left_up_q[3], left_up_q[2], left_up_q[1])
    new_bottom = [
        ("L", bot_r, jr),
        right_down,
        ("L", (sr + flare, y_desc), (sl - flare, y_desc)),
        left_up,
        ("L", jl, bot_l),
    ]
    # заменяем отрезок дна «v» (bot_r -> bot_l) новым низом
    i_b = next(
        i for i, s in enumerate(segs) if s[0] == "L" and close(s[1], bot_r, 1e-6) and close(s[2], bot_l, 1e-6)
    )
    new = segs[:i_b] + new_bottom + segs[i_b + 1:]
    return [new], font["hmtx"][base][0]


# --------------------------------------------------------------------------------------------
# Таблицы
# --------------------------------------------------------------------------------------------


def add_glyph(font, name, glyph, adv, cp):
    glyf = font["glyf"]
    order = font.getGlyphOrder()
    assert name not in order, name
    order = order + [name]
    font.setGlyphOrder(order)
    glyf.glyphOrder = order
    glyf[name] = glyph
    glyph.recalcBounds(glyf)
    font["hmtx"][name] = (adv, glyph.xMin)
    if "vmtx" in font:
        # вертикальные метрики как у родных глифов: высота = em, начало по typoAscender (O: 880-747=133)
        v_origin = font["OS/2"].sTypoAscender
        font["vmtx"][name] = (font["head"].unitsPerEm, v_origin - glyph.yMax)
    for t in font["cmap"].tables:
        if t.isUnicode():
            t.cmap[cp] = name
    if "GDEF" in font and font["GDEF"].table.GlyphClassDef:
        font["GDEF"].table.GlyphClassDef.classDefs[name] = 1


def clone_kerning(font, new, src):
    """Новый глиф получает кернинг src и как первый, и как второй в паре (GPOS PairPos)."""
    if "GPOS" not in font:
        return
    for lookup in font["GPOS"].table.LookupList.Lookup:
        for st in lookup.SubTable:
            if getattr(st, "LookupType", lookup.LookupType) != 2:
                continue
            cov = st.Coverage.glyphs
            if st.Format == 1:
                if src in cov:
                    ps = copy.deepcopy(st.PairSet[cov.index(src)])
                    cov.append(new)  # новые глифы в конце порядка — сортировка покрытия сохраняется
                    st.PairSet.append(ps)
                    st.PairSetCount = len(st.PairSet)
                for ps in st.PairSet:
                    for r in list(ps.PairValueRecord):
                        if r.SecondGlyph == src:
                            nr = copy.deepcopy(r)
                            nr.SecondGlyph = new
                            ps.PairValueRecord.append(nr)
                    ps.PairValueCount = len(ps.PairValueRecord)
            elif st.Format == 2:
                if src in cov:
                    cov.append(new)
                    c1 = st.ClassDef1.classDefs.get(src)
                    if c1:
                        st.ClassDef1.classDefs[new] = c1
                c2 = st.ClassDef2.classDefs.get(src)
                if c2:
                    st.ClassDef2.classDefs[new] = c2


def rename(font):
    name = font["name"]
    copyright_ = name.getDebugName(0) or ""
    version = name.getDebugName(5) or "Version 1.000"
    rev = version.replace("Version", "").strip()
    for rec in list(name.names):
        if rec.nameID in (1, 3, 4, 6, 10, 13, 14, 16, 17, 21, 22):
            name.removeNames(nameID=rec.nameID)
    plats = sorted({(r.platformID, r.platEncID, r.langID) for r in name.names}) or [(3, 1, 0x409)]
    for pid, eid, lid in plats:
        def put(i, s):
            name.setName(s, i, pid, eid, lid)
        put(0, copyright_)
        put(1, FAMILY)
        put(2, "Regular")
        put(3, f"{rev};KURAK;{PS_NAME}")
        put(4, f"{FAMILY} Regular")
        put(5, f"{version}; {FAMILY}")
        put(6, PS_NAME)
        put(10, MOD_NOTE)
        put(13, OFL_DESC)
        put(14, OFL_URL)


# --------------------------------------------------------------------------------------------


def build(src: Path, out: Path, yu_stem=226, yu_flare=5, ob_cap=None, ob_lc=None):
    font = TTFont(str(src), recalcTimestamp=False)  # воспроизводимая сборка: head.modified как в исходнике
    assert "glyf" in font, "ожидался TrueType-шрифт (glyf)"
    cmap = font.getBestCmap()
    gname = lambda cp: cmap[cp]  # noqa: E731
    H, h = gname(0x041D), gname(0x043D)  # Н н
    TSE, tse = gname(0x0426), gname(0x0446)  # Ц ц
    O, o = gname(0x041E), gname(0x043E)  # О о
    E_rev, e_rev = gname(0x042D), gname(0x044D)  # Э э
    Y, v, u_cyr = gname(0x0059), gname(0x0076), gname(0x0443)
    desc = gname(0x0440)  # р — глубина нижних выносных

    new = {}

    # Ү — компонент Y
    pen = TTGlyphPen(font.getGlyphSet())
    pen.addComponent(Y, (1, 0, 0, 1, 0, 0))
    new["uni04AE"] = (0x04AE, pen.glyph(), font["hmtx"][Y][0], Y)

    # ү
    c, adv = build_straight_u(font, v, stem=yu_stem, flare=yu_flare, desc_ref=desc)
    new["uni04AF"] = (0x04AF, draw_contours(c), adv, u_cyr)

    # Ң ң
    c, adv = build_tail_letter(font, H, TSE)
    new["uni04A2"] = (0x04A2, draw_contours(c), adv, None)
    c, adv = build_tail_letter(font, h, tse)
    new["uni04A3"] = (0x04A3, draw_contours(c), adv, None)

    # Ө ө: перекладина по центру просвета.
    # Ө — толщина средней горизонтали Э (168 ед.). У ө просвет «о» всего 226 ед., и толщина э (126)
    # оставила бы щели по 50 ед.; поэтому ө получает ту же долю перекладины в просвете, что и Ө.
    def counter_span(base):
        (_, inner) = sorted(glyph_contours(font, base), key=lambda c: abs(signed_area(c)), reverse=True)
        ys = [p[1] for p in on_points(inner)]
        return min(ys), max(ys)

    def centered(span, thickness):
        mid = (span[0] + span[1]) / 2
        return mid - thickness / 2, mid + thickness / 2

    lo, hi = bar_from(font, E_rev)
    cap_span, lc_span = counter_span(O), counter_span(o)
    cap_t = ob_cap if ob_cap is not None else hi - lo
    lc_t = ob_lc if ob_lc is not None else round(cap_t * (lc_span[1] - lc_span[0]) / (cap_span[1] - cap_span[0]))
    c, adv = build_barred_o(font, O, *centered(cap_span, cap_t))
    new["uni04E8"] = (0x04E8, draw_contours(c), adv, None)
    c, adv = build_barred_o(font, o, *centered(lc_span, lc_t))
    new["uni04E9"] = (0x04E9, draw_contours(c), adv, None)

    for name in sorted(new, key=lambda n: new[n][0]):
        cp, glyph, adv, _ = new[name]
        add_glyph(font, name, glyph, adv, cp)
    for name in sorted(new, key=lambda n: font.getGlyphID(n)):
        kern_src = new[name][3]
        if kern_src:
            clone_kerning(font, name, kern_src)

    rename(font)
    font.flavor = "woff2"
    out.parent.mkdir(parents=True, exist_ok=True)
    font.save(str(out))
    verify(out)
    return out


def verify(path: Path):
    f = TTFont(str(path))
    cmap = f.getBestCmap()
    glyf = f["glyf"]
    for cp in (0x04A2, 0x04A3, 0x04AE, 0x04AF, 0x04E8, 0x04E9):
        assert cp in cmap, hex(cp)
        g = glyf[cmap[cp]]
        assert g.numberOfContours != 0, hex(cp)
        if not g.isComposite():
            areas = [signed_area(c) for c in glyph_contours(f, cmap[cp])]
            assert areas[0] < 0, (hex(cp), areas)  # внешний контур по часовой
        adv, lsb = f["hmtx"][cmap[cp]]
        assert lsb == g.xMin, (hex(cp), lsb, g.xMin)
    assert f["name"].getDebugName(1) == FAMILY
    f["GPOS"].compile(f)  # таблицы собираются без ошибок
    print(f"ok: {path} ({path.stat().st_size} bytes), {len(f.getGlyphOrder())} glyphs")


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    ap.add_argument("--src", type=Path, default=DEFAULT_SRC)
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT)
    a = ap.parse_args(argv)
    build(a.src, a.out)


if __name__ == "__main__":
    sys.exit(main())
