from __future__ import annotations

import math
import os
from pathlib import Path
from typing import Iterable, Sequence

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
TARGETS = [
    ROOT / "public" / "images",
    ROOT.parent / "AI_Data_House_Positioning_Website" / "public" / "images",
]

NAVY = "#0f172a"
PANEL = "#111c31"
PANEL_2 = "#17233a"
LINE = "#334155"
SLATE = "#94a3b8"
SLATE_2 = "#cbd5e1"
WHITE = "#ffffff"
GREEN = "#1a7a3c"
EMERALD = "#34d399"
RED = "#f87171"
AMBER = "#fbbf24"
BLUE = "#60a5fa"
PURPLE = "#a78bfa"

FONT_DIRS = [
    Path("/System/Library/Fonts"),
    Path("/System/Library/Fonts/Supplemental"),
    Path("/Library/Fonts"),
]


def font_path(name: str) -> str | None:
    for folder in FONT_DIRS:
        match = next(folder.glob(name), None)
        if match:
            return str(match)
    return None


SANS = font_path("Avenir Next.ttc") or font_path("HelveticaNeue.ttc") or font_path("Arial.ttf")
SANS_BOLD = font_path("Avenir Next.ttc") or font_path("Arial Bold.ttf") or SANS


def f(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(SANS_BOLD if bold else SANS, size=size, index=0)


def canvas(w: int, h: int) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (w, h), NAVY)
    d = ImageDraw.Draw(img)
    for y in range(h):
        a = y / h
        r = int(15 + 6 * a)
        g = int(23 + 8 * a)
        b = int(42 + 12 * a)
        d.line([(0, y), (w, y)], fill=(r, g, b))
    return img, d


def rounded(d: ImageDraw.ImageDraw, box, radius=28, fill=PANEL, outline=None, width=2):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def text(d: ImageDraw.ImageDraw, xy, value: str, size: int, fill=WHITE, bold=False, anchor=None):
    d.text(xy, value, font=f(size, bold), fill=fill, anchor=anchor)


def centered(d: ImageDraw.ImageDraw, box, value: str, size: int, fill=WHITE, bold=False):
    x1, y1, x2, y2 = box
    bb = d.textbbox((0, 0), value, font=f(size, bold))
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    d.text((x1 + (x2 - x1 - tw) / 2, y1 + (y2 - y1 - th) / 2 - 2), value, font=f(size, bold), fill=fill)


def wrap(d: ImageDraw.ImageDraw, value: str, max_width: int, size: int, bold=False) -> list[str]:
    words = value.split()
    lines: list[str] = []
    current = ""
    font = f(size, bold)
    for word in words:
        trial = f"{current} {word}".strip()
        if d.textlength(trial, font=font) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def logo(d: ImageDraw.ImageDraw, x: int, y: int, scale: float = 1.0, light: bool = True):
    stroke = WHITE if light else NAVY
    bars = WHITE if light else GREEN
    word = WHITE if light else GREEN
    s = scale
    # Clean code-rendered version of components/Logo.tsx, not generated text/art.
    pts = [
        (42, 22), (30, 22), (21, 31), (21, 60), (30, 69), (43, 69),
        (51, 80), (59, 69), (70, 69), (79, 60), (79, 46),
    ]
    p = [(x + px * s, y + py * s) for px, py in pts]
    d.line(p, fill=stroke, width=max(2, int(6 * s)), joint="curve")
    for cx in [48, 56, 64]:
        d.ellipse((x + (cx - 2.4) * s, y + (22 - 2.4) * s, x + (cx + 2.4) * s, y + (22 + 2.4) * s), fill=stroke)
    for bx, top in [(36, 53), (43, 47), (50, 41), (57, 34)]:
        d.line((x + bx * s, y + 60 * s, x + bx * s, y + top * s), fill=bars, width=max(2, int(5.5 * s)))
    d.line((x + 59 * s, y + 63 * s, x + 84 * s, y + 39 * s), fill=stroke, width=max(2, int(6 * s)))
    d.line((x + 84 * s, y + 39 * s, x + 73.5 * s, y + 39.5 * s), fill=stroke, width=max(2, int(6 * s)))
    d.line((x + 84 * s, y + 39 * s, x + 83.5 * s, y + 49.5 * s), fill=stroke, width=max(2, int(6 * s)))
    text(d, (x + 112 * s, y + 38 * s), "Ai Data House", int(24 * s), word, True)


def draw_grid(d: ImageDraw.ImageDraw, w: int, h: int):
    for x in range(80, w, 120):
        d.line((x, 0, x, h), fill="#152033", width=1)
    for y in range(80, h, 120):
        d.line((0, y, w, y), fill="#152033", width=1)


def pill(d, xy, label, fill=GREEN, fg=WHITE, size=42, pad=30):
    x, y = xy
    font = f(size, True)
    tw = int(d.textlength(label, font=font))
    rounded(d, (x, y, x + tw + pad * 2, y + size + pad), radius=(size + pad) // 2, fill=fill)
    d.text((x + pad, y + pad / 2 - 2), label, font=font, fill=fg)


def icon_circle(d, cx, cy, label, color=EMERALD, r=62):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill="#102b27", outline=color, width=4)
    centered(d, (cx - r, cy - r, cx + r, cy + r), label, 34, WHITE, True)


def hero_speed() -> Image.Image:
    img, d = canvas(1600, 900)
    draw_grid(d, 1600, 900)
    logo(d, 92, 70, 0.75)
    rounded(d, (180, 240, 690, 650), 34, PANEL, "#2b3a55", 3)
    text(d, (230, 300), "New inbound lead", 54, WHITE, True)
    text(d, (230, 380), "Website form submitted", 34, SLATE_2)
    text(d, (230, 455), "Name, service, budget", 34, SLATE)
    pill(d, (230, 535), "Qualified", GREEN, size=38)
    d.line((720, 445, 870, 445), fill=EMERALD, width=10)
    d.polygon([(870, 445), (830, 420), (830, 470)], fill=EMERALD)
    rounded(d, (900, 255, 1420, 635), 34, "#102821", EMERALD, 4)
    text(d, (955, 322), "CRM created", 64, WHITE, True)
    text(d, (955, 416), "Assigned to sales", 38, SLATE_2)
    text(d, (955, 510), "94 seconds", 82, EMERALD, True)
    return img


def hero_dashboard() -> Image.Image:
    img, d = canvas(1600, 900)
    draw_grid(d, 1600, 900)
    logo(d, 92, 70, 0.75)
    rounded(d, (170, 210, 760, 670), 34, PANEL, "#2b3a55", 3)
    pts = [(240, 560), (360, 520), (480, 455), (610, 390), (700, 305)]
    d.line(pts, fill=EMERALD, width=12)
    for p in pts:
        d.ellipse((p[0]-12, p[1]-12, p[0]+12, p[1]+12), fill=WHITE)
    text(d, (235, 280), "Live revenue", 54, WHITE, True)
    text(d, (235, 355), "Updated from every system", 34, SLATE_2)
    rounded(d, (840, 260, 1400, 600), 34, "#102821", EMERALD, 4)
    centered(d, (840, 290, 1400, 390), "$84,200", 92, WHITE, True)
    centered(d, (840, 405, 1400, 475), "this week", 42, SLATE_2, True)
    pill(d, (990, 510), "Always current", GREEN, size=38)
    return img


def hero_chat() -> Image.Image:
    img, d = canvas(1600, 900)
    draw_grid(d, 1600, 900)
    logo(d, 92, 70, 0.75)
    rounded(d, (270, 205, 1330, 695), 38, PANEL, "#2b3a55", 3)
    rounded(d, (340, 300, 875, 405), 30, "#21304a")
    text(d, (382, 333), "Need pricing for automation.", 42, WHITE, True)
    rounded(d, (725, 455, 1260, 560), 30, "#103326", EMERALD, 3)
    text(d, (770, 488), "Great. What tools do you use?", 42, WHITE, True)
    pill(d, (560, 600), "Lead qualified", GREEN, size=52)
    return img


def hero_integrations() -> Image.Image:
    img, d = canvas(1600, 900)
    draw_grid(d, 1600, 900)
    logo(d, 92, 70, 0.75)
    cx, cy = 800, 455
    icon_circle(d, cx, cy, "ADH", GREEN, 90)
    items = [("CRM", 510, 250), ("Store", 1090, 250), ("Chat", 1210, 545), ("Data", 800, 700), ("Ops", 390, 545)]
    for label, x, y in items:
        d.line((cx, cy, x, y), fill="#2e6f52", width=7)
        icon_circle(d, x, y, label, EMERALD, 72)
    pill(d, (605, 90), "All connected", GREEN, size=56)
    return img


def hero_voice() -> Image.Image:
    img, d = canvas(1600, 900)
    draw_grid(d, 1600, 900)
    logo(d, 92, 70, 0.75)
    rounded(d, (220, 235, 1380, 665), 40, PANEL, "#2b3a55", 3)
    text(d, (305, 315), "Inbound call", 52, SLATE_2, True)
    text(d, (305, 405), "Call answered", 78, WHITE, True)
    for i in range(18):
        x = 790 + i * 28
        amp = 40 + 95 * abs(math.sin(i * 0.65))
        d.line((x, 455 - amp, x, 455 + amp), fill=EMERALD, width=11)
    pill(d, (305, 535), "0 missed calls", GREEN, size=54)
    return img


def simple_dashboard(title: str, stat: str, subtitle: str, kind: str) -> Image.Image:
    img, d = canvas(1600, 900)
    draw_grid(d, 1600, 900)
    logo(d, 86, 66, 0.72)
    text(d, (140, 190), title, 72, WHITE, True)
    text(d, (145, 285), subtitle, 38, SLATE_2)
    rounded(d, (135, 380, 530, 665), 34, "#102821", EMERALD, 4)
    centered(d, (135, 425, 530, 535), stat, 76, WHITE, True)
    centered(d, (135, 545, 530, 610), "live KPI", 36, SLATE_2, True)
    if kind == "chart":
        rounded(d, (610, 350, 1420, 690), 34, PANEL, "#2b3a55", 3)
        bars = [170, 105, 220, 150, 260, 195]
        for i, bh in enumerate(bars):
            x = 700 + i * 105
            d.rounded_rectangle((x, 630 - bh, x + 54, 630), radius=18, fill=EMERALD if i == 4 else "#2f9a63")
    elif kind == "chat":
        rounded(d, (620, 370, 1110, 465), 24, "#21304a")
        text(d, (655, 400), "Can you qualify this lead?", 36, WHITE, True)
        rounded(d, (830, 515, 1390, 615), 24, "#103326", EMERALD, 3)
        text(d, (865, 546), "Qualified and routed.", 36, WHITE, True)
    else:
        rounded(d, (600, 360, 1430, 665), 34, PANEL, "#2b3a55", 3)
        for i, label in enumerate(["Manual", "Automated", "Reported"]):
            y = 420 + i * 75
            d.ellipse((655, y, 690, y + 35), fill=EMERALD)
            text(d, (720, y - 5), label, 42, WHITE, True)
            d.line((1015, y + 17, 1335, y + 17), fill="#2b3a55", width=18)
            d.line((1015, y + 17, 1190 + i * 45, y + 17), fill=EMERALD, width=18)
    return img


def before_after(title: str, left: str, right: str) -> Image.Image:
    img, d = canvas(1600, 900)
    draw_grid(d, 1600, 900)
    logo(d, 86, 66, 0.72)
    text(d, (140, 170), title, 70, WHITE, True)
    rounded(d, (140, 290, 730, 690), 34, "#241b29", "#55415d", 3)
    text(d, (200, 355), "Before", 58, RED, True)
    for i, line in enumerate(wrap(d, left, 440, 42, True)[:3]):
        text(d, (200, 455 + i * 62), line, 42, WHITE, True)
    rounded(d, (870, 290, 1460, 690), 34, "#102821", EMERALD, 4)
    text(d, (930, 355), "After", 58, EMERALD, True)
    for i, line in enumerate(wrap(d, right, 440, 42, True)[:3]):
        text(d, (930, 455 + i * 62), line, 42, WHITE, True)
    d.line((780, 490, 830, 490), fill=EMERALD, width=10)
    d.polygon([(840, 490), (812, 470), (812, 510)], fill=EMERALD)
    return img


def integrations_strip() -> Image.Image:
    img, d = canvas(1600, 900)
    draw_grid(d, 1600, 900)
    logo(d, 92, 72, 0.8)
    centered(d, (120, 175, 1480, 270), "Connected To Your Stack", 72, WHITE, True)
    labels = ["n8n", "HubSpot", "Shopify", "OpenAI", "VAPI", "Slack", "Google"]
    colors = [EMERALD, AMBER, "#95bf47", "#10a37f", BLUE, PURPLE, "#ea4335"]
    for i, label in enumerate(labels):
        x = 85 + i * 205
        rounded(d, (x, 360, x + 185, 555), 28, PANEL, "#2b3a55", 3)
        d.ellipse((x + 58, 390, x + 127, 459), fill="#102821", outline=colors[i], width=4)
        centered(d, (x + 58, 390, x + 127, 459), label[0], 36, colors[i], True)
        name_size = 31 if len(label) <= 7 else 27
        centered(d, (x + 12, 478, x + 173, 535), label, name_size, WHITE, True)
    pill(d, (560, 660), "One automated system", GREEN, size=46)
    return img


def process_image() -> Image.Image:
    img, d = canvas(1600, 900)
    draw_grid(d, 1600, 900)
    logo(d, 92, 72, 0.8)
    steps = [("1", "Audit", "Find the highest-value workflow"), ("2", "Build", "Ship in focused phases"), ("3", "Launch", "Support the live system")]
    for i, (num, title, body) in enumerate(steps):
        x = 150 + i * 485
        rounded(d, (x, 300, x + 360, 635), 34, PANEL, "#2b3a55", 3)
        icon_circle(d, x + 80, 385, num, GREEN, 55)
        text(d, (x + 55, 475), title, 58, WHITE, True)
        for j, line in enumerate(wrap(d, body, 260, 32)):
            text(d, (x + 55, 555 + j * 42), line, 32, SLATE_2)
        if i < 2:
            d.line((x + 380, 465, x + 455, 465), fill=EMERALD, width=8)
            d.polygon([(x + 465, 465), (x + 438, 447), (x + 438, 483)], fill=EMERALD)
    centered(d, (100, 145, 1500, 240), "Audit. Build. Launch.", 76, WHITE, True)
    return img


def trust_badges() -> Image.Image:
    img, d = canvas(1600, 900)
    draw_grid(d, 1600, 900)
    logo(d, 92, 72, 0.8)
    centered(d, (100, 155, 1500, 250), "Built For Serious Operations", 72, WHITE, True)
    badges = [("HIPAA-aware", "privacy-minded builds"), ("NDA standard", "confidential by default"), ("You own code", "no platform lock-in"), ("US hours", "overlap for delivery")]
    for i, (title, sub) in enumerate(badges):
        x = 150 + i * 360
        rounded(d, (x, 350, x + 285, 610), 34, "#102821", EMERALD, 4)
        d.ellipse((x + 95, 390, x + 190, 485), outline=EMERALD, width=6)
        d.line((x + 118, 437, x + 143, 462, x + 176, 414), fill=WHITE, width=8)
        centered(d, (x + 20, 505, x + 265, 560), title, 34, WHITE, True)
        centered(d, (x + 20, 562, x + 265, 610), sub, 23, SLATE_2)
    return img


def og(title: str, subtitle: str = "AI Data House") -> Image.Image:
    img, d = canvas(1200, 630)
    for x in range(70, 1200, 110):
        d.line((x, 0, x, 630), fill="#152033")
    for y in range(70, 630, 110):
        d.line((0, y, 1200, y), fill="#152033")
    logo(d, 60, 50, 0.62)
    rounded(d, (720, 150, 1070, 470), 34, "#102821", EMERALD, 4)
    for i, label in enumerate(["AI", "Data", "Ops", "CRM"]):
        icon_circle(d, 790 + (i % 2) * 200, 230 + (i // 2) * 155, label, EMERALD, 48)
    lines = wrap(d, title, 560, 64, True)[:3]
    y = 205 - (len(lines) - 1) * 38
    for line in lines:
        text(d, (70, y), line, 64, WHITE, True)
        y += 76
    text(d, (72, y + 18), subtitle, 34, SLATE_2, True)
    pill(d, (70, 500), "Automation that ships", GREEN, size=28)
    return img


def save_all(rel_webp: str, img: Image.Image):
    rel = Path(rel_webp)
    png_rel = rel.with_suffix(".png")
    for target in TARGETS:
        if not target.exists():
            continue
        out_webp = target / rel
        out_png = target / png_rel
        out_webp.parent.mkdir(parents=True, exist_ok=True)
        img.save(out_png, optimize=True)
        quality = 82
        while quality >= 48:
            img.save(out_webp, "WEBP", quality=quality, method=6)
            if out_webp.stat().st_size <= 150_000:
                break
            quality -= 6


def main():
    assets: Sequence[tuple[str, Image.Image]] = [
        ("hero/hero-speed-to-lead.webp", hero_speed()),
        ("hero/hero-live-dashboard.webp", hero_dashboard()),
        ("hero/hero-ai-chat-agent.webp", hero_chat()),
        ("hero/hero-integrations.webp", hero_integrations()),
        ("hero/hero-voice-agent.webp", hero_voice()),
        ("og/og-homepage.webp", og("AI Automation For Growing Businesses", "Custom dashboards, agents, and workflows")),
        ("solutions/solution-dashboards.webp", simple_dashboard("Executive Dashboard", "$84.2K", "Three numbers. One source of truth.", "chart")),
        ("solutions/solution-ai-chatbots.webp", simple_dashboard("AI Chatbot System", "41%", "Qualify leads before sales replies.", "chat")),
        ("solutions/solution-voice-agents.webp", simple_dashboard("Voice Agent Console", "0 missed", "Answer, qualify, and book every call.", "flow")),
        ("industries/industry-real-estate.webp", before_after("Real Estate Automation", "Missed inquiries scattered across inboxes", "New leads routed and followed up instantly")),
        ("industries/industry-restaurants.webp", before_after("Restaurant Automation", "Manual bookings and slow guest replies", "Reservations and reminders handled automatically")),
        ("industries/industry-agencies.webp", before_after("Agency Automation", "Client reporting rebuilt every week", "Live reports sent from clean data")),
        ("home/integrations-strip.webp", integrations_strip()),
        ("home/before-after-operations.webp", before_after("Operations Transformation", "Manual handoffs create delays and duplicate work", "Automated flow keeps every team updated")),
        ("home/process-audit-build-launch.webp", process_image()),
        ("home/trust-badges.webp", trust_badges()),
        ("og/og-industry-real-estate.webp", og("Real Estate AI Automation")),
        ("og/og-industry-ecommerce.webp", og("Ecommerce AI Automation")),
        ("og/og-industry-agencies.webp", og("Agency AI Automation")),
        ("og/og-industry-restaurants.webp", og("Restaurant AI Automation")),
        ("og/og-industry-professional-services.webp", og("Professional Services AI Automation")),
        ("og/og-industry-healthcare.webp", og("Healthcare AI Automation")),
        ("og/og-ai-automation-agency.webp", og("AI Automation Agency")),
        ("og/og-hire-n8n-developer.webp", og("Hire n8n Developer")),
        ("og/og-ai-chatbot-development-company.webp", og("AI Chatbot Development Company")),
    ]
    for rel, img in assets:
        save_all(rel, img)
        print(rel)


if __name__ == "__main__":
    main()
