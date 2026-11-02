import os
import pymupdf
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"C:\Users\msi\.gemini\antigravity\scratch\stump-grinding-playbook"
PUBLIC_IMAGES = os.path.join(BASE_DIR, "public", "images")
os.makedirs(PUBLIC_IMAGES, exist_ok=True)

# 1. GENERATE PLAYBOOK PREVIEW (From real 34-page PDF)
pdf_path = os.path.join(BASE_DIR, "private-files", "The-Stump-Grinding-Playbook.pdf")
doc = pymupdf.open(pdf_path)

# Render Page 7 (Chapter 2 Equipment / Buying Guide) or Page 3 (Business Setup)
page = doc[6] # Page 7
zoom = pymupdf.Matrix(2.2, 2.2) # High DPI
pix = page.get_pixmap(matrix=zoom)
img_playbook = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

# Save preview-playbook.png
playbook_out = os.path.join(PUBLIC_IMAGES, "preview-playbook.png")
img_playbook.save(playbook_out, "PNG", quality=95)
print(f"Saved: {playbook_out} ({img_playbook.size})")

# 2. GENERATE PRICING CALCULATOR PREVIEW (Realistic Excel sheet mockup)
calc_w, calc_h = 1200, 1500
img_calc = Image.new("RGB", (calc_w, calc_h), color="#FFFFFF")
draw = ImageDraw.Draw(img_calc)

# Load fonts
try:
    font_bold_lg = ImageFont.truetype("arialbd.ttf", 26)
    font_bold_md = ImageFont.truetype("arialbd.ttf", 20)
    font_bold_sm = ImageFont.truetype("arialbd.ttf", 16)
    font_reg_md = ImageFont.truetype("arial.ttf", 18)
    font_reg_sm = ImageFont.truetype("arial.ttf", 15)
    font_mono_md = ImageFont.truetype("consola.ttf", 18)
except:
    font_bold_lg = ImageFont.load_default()
    font_bold_md = ImageFont.load_default()
    font_bold_sm = ImageFont.load_default()
    font_reg_md = ImageFont.load_default()
    font_reg_sm = ImageFont.load_default()
    font_mono_md = ImageFont.load_default()

# Excel Green Header
draw.rectangle([(0, 0), (calc_w, 64)], fill="#107C41")
draw.text((24, 18), "AutoSave [ON]   Stump_Grinding_Pricing_Calculator.xlsx - Excel", fill="#FFFFFF", font=font_bold_md)

# Excel Ribbon bar
draw.rectangle([(0, 64), (calc_w, 104)], fill="#F3F2F1")
tabs = ["File", "Home", "Insert", "Page Layout", "Formulas", "Data", "Review", "View", "Operator Tools"]
tx = 24
for t in tabs:
    color = "#107C41" if t == "Formulas" else "#323130"
    draw.text((tx, 74), t, fill=color, font=font_bold_sm)
    if t == "Formulas":
        draw.line([(tx, 102), (tx + 70, 102)], fill="#107C41", width=3)
    tx += 105

# Formula bar
draw.rectangle([(0, 104), (calc_w, 144)], fill="#FFFFFF", outline="#E1DFDD", width=1)
draw.rectangle([(16, 112), (70, 136)], fill="#F3F2F1", outline="#8A8886", width=1)
draw.text((28, 116), "H6", fill="#323130", font=font_bold_sm)
draw.text((84, 116), "fx", fill="#605E5C", font=font_mono_md)
draw.text((114, 116), "=ROUND((D6*E6)+F6+G6, 2)  [Total Customer Bid Formula]", fill="#201F1E", font=font_mono_md)

# Sheet Title Area
draw.rectangle([(0, 144), (calc_w, 240)], fill="#FBF6EC")
draw.text((32, 160), "STUMP GRINDING MULTI-JOB ESTIMATOR & PROFIT CALCULATOR", fill="#33241B", font=font_bold_lg)
draw.text((32, 198), "Active Rate Profile: Eastern Hardwood & Rocky Loam ($3.50/in base | $8/ft roots | $56 tooth reserve)", fill="#684128", font=font_reg_sm)

# Table Header
cols = [
    ("Job #", 70),
    ("Tree Species", 190),
    ("Diameter", 100),
    ("Base Rate", 100),
    ("Root Flare", 130),
    ("Rock Buffer", 130),
    ("Gate / Access", 130),
    ("Total Bid", 140),
    ("Margin %", 110),
]

table_top = 250
row_h = 44

# Draw header row
hx = 24
draw.rectangle([(24, table_top), (calc_w - 24, table_top + row_h)], fill="#107C41")
for name, w in cols:
    draw.text((hx + 8, table_top + 12), name, fill="#FFFFFF", font=font_bold_sm)
    draw.line([(hx + w, table_top), (hx + w, table_top + row_h)], fill="#0E6B38", width=1)
    hx += w

# Draw Data Rows
rows = [
    ("Job 1", "24\" White Oak (Dense)", "24 in", "$144.00", "+$65.00 (8ft)", "+$56.00 (Rocks)", "+$35.00 (34\" Gate)", "$345.00", "74% NET"),
    ("Job 2", "18\" Sugar Maple", "18 in", "$108.00", "+$35.00 (4ft)", "+$0.00 (Normal)", "+$0.00 (Driveway)", "$143.00", "71% NET"),
    ("Job 3", "36\" Sweetgum (Spreading)", "36 in", "$216.00", "+$110.00 (14ft)", "+$56.00 (River Rock)", "+$40.00 (Slope)", "$422.00", "76% NET"),
    ("Job 4", "14\" White Pine", "14 in", "$84.00", "+$0.00 (Clean)", "+$0.00 (Sandy)", "+$0.00 (Front Yard)", "$84.00", "68% NET"),
    ("Job 5", "30\" Pin Oak (Lateral)", "30 in", "$180.00", "+$85.00 (10ft)", "+$56.00 (Flint Rock)", "+$35.00 (Tight Gate)", "$356.00", "73% NET"),
    ("Job 6", "22\" Hickory (Tough Core)", "22 in", "$132.00", "+$45.00 (6ft)", "+$25.00 (Cobble)", "+$0.00 (Open)", "$202.00", "70% NET"),
]

cy = table_top + row_h
for i, r in enumerate(rows):
    bg_color = "#F9F8F7" if i % 2 == 1 else "#FFFFFF"
    draw.rectangle([(24, cy), (calc_w - 24, cy + row_h)], fill=bg_color, outline="#E1DFDD", width=1)
    rx = 24
    for j, val in enumerate(r):
        text_color = "#107C41" if j == 8 else ("#D83B01" if j == 7 else "#323130")
        f = font_bold_sm if (j in [0, 7, 8]) else font_reg_sm
        draw.text((rx + 8, cy + 12), val, fill=text_color, font=f)
        rx += cols[j][1]
    cy += row_h

# Summary Card Section at bottom
draw.rectangle([(24, cy + 30), (calc_w - 24, cy + 220)], fill="#F3F9F5", outline="#107C41", width=2)
draw.text((48, cy + 50), "WEEKEND ESTIMATOR RECAP (6 JOBS):", fill="#107C41", font=font_bold_md)
draw.text((48, cy + 86), "Total Quoted Revenue:   $1,552.00", fill="#201F1E", font=font_bold_lg)
draw.text((48, cy + 126), "Est. Cutting Labor Time: 5.2 Hours  |  Average Hourly Machine Gross: $298.46 / hr", fill="#323130", font=font_reg_md)
draw.text((48, cy + 162), "Carbide Tooth Replacement Fund Surcharge Collected: $193.00 (Protects Equipment)", fill="#684128", font=font_bold_sm)

# Save preview-calculator.png
calc_out = os.path.join(PUBLIC_IMAGES, "preview-calculator.png")
img_calc.save(calc_out, "PNG", quality=95)
print(f"Saved: {calc_out} ({img_calc.size})")

# 3. GENERATE TEMPLATES PREVIEW (Realistic Word Document Contract & Waiver)
docx_w, docx_h = 1200, 1500
img_docx = Image.new("RGB", (docx_w, docx_h), color="#FFFFFF")
draw = ImageDraw.Draw(img_docx)

# Word Blue Header
draw.rectangle([(0, 0), (docx_w, 64)], fill="#2B579A")
draw.text((24, 18), "AutoSave [ON]   Document_04_PreJob_Walkthrough_Waiver.docx - Word", fill="#FFFFFF", font=font_bold_md)

# Word Ribbon
draw.rectangle([(0, 64), (docx_w, 104)], fill="#F3F2F1")
tabs_w = ["File", "Home", "Insert", "Design", "Layout", "References", "Mailings", "Review", "View"]
tx = 24
for t in tabs_w:
    color = "#2B579A" if t == "Home" else "#323130"
    draw.text((tx, 74), t, fill=color, font=font_bold_sm)
    if t == "Home":
        draw.line([(tx, 102), (tx + 55, 102)], fill="#2B579A", width=3)
    tx += 95

# Document Canvas Margins
draw.rectangle([(80, 140), (docx_w - 80, docx_h - 40)], fill="#FFFFFF", outline="#D2D0CE", width=1)

# Company Header
draw.text((120, 180), "PRE-JOB PROPERTY WALKTHROUGH & DAMAGE WAIVER", fill="#33241B", font=font_bold_lg)
draw.text((120, 220), "FORM 04-A: RESIDENTIAL ARBORIST & STUMP CUTTING AGREEMENT", fill="#E8731A", font=font_bold_sm)
draw.line([(120, 250), (docx_w - 120, 250)], fill="#8A5A3B", width=2)

# Client Details Box
draw.rectangle([(120, 270), (docx_w - 120, 370)], fill="#FBF6EC", outline="#D9C2B0", width=1)
draw.text((140, 285), "Customer Name:  Robert & Susan Jenkins", fill="#33241B", font=font_reg_md)
draw.text((140, 315), "Property Address: 742 Evergreen Terrace, Springfield", fill="#33241B", font=font_reg_md)
draw.text((140, 345), "Job Date: October 28, 2026   |   Grinder Model: Bandit SG-40 Tracked", fill="#33241B", font=font_reg_md)

# Checklist Header
draw.text((120, 400), "SECTION 1: PRE-GRIND HAZARD & UTILITY VERIFICATION", fill="#2E5E3E", font=font_bold_md)

check_items = [
    ("[X] 811 Dig Safe / Call Before You Dig ticket confirmed clear (Ticket #4092-28)", True),
    ("[X] Private irrigation, drip lines & sprinkler heads identified and flagged with wire stakes", True),
    ("[X] Invisible pet containment fence lines de-energized and marked with paint", True),
    ("[X] Window, siding & parked vehicle ballistic rock deflection shields positioned", True),
    ("[X] Surface rocks, landscape edging bricks & steel rebar cleared 24\" around root perimeter", True),
    ("[X] Agreed cutting depth: 10–12 inches below existing lawn grade (lawn reseed depth)", True),
]

cy = 440
for item, checked in check_items:
    draw.rectangle([(120, cy), (144, cy + 24)], fill="#EAF2EC", outline="#2E5E3E", width=2)
    draw.text((125, cy + 2), "✓", fill="#2E5E3E", font=font_bold_sm)
    draw.text((160, cy + 2), item[4:], fill="#33241B", font=font_reg_md)
    cy += 48

# Section 2: Legal Liability Waiver Clause
draw.text((120, cy + 20), "SECTION 2: PROPERTY DAMAGE LIMITATION OF LIABILITY", fill="#2E5E3E", font=font_bold_md)
legal_text = (
    "Customer acknowledges that stump cutting machines operate up to 12 inches below ground level\n"
    "using carbide teeth revolving at high RPM. Operator is not liable for damage to unmarked or\n"
    "privately installed underground lines, including but not limited to: irrigation lines, landscape\n"
    "lighting low-voltage wire, invisible pet fences, or private septic drain fields that were not clearly\n"
    "marked in writing prior to machine mobilization."
)
draw.text((120, cy + 60), legal_text, fill="#523422", font=font_reg_sm)

# Signature Box
sig_y = cy + 220
draw.rectangle([(120, sig_y), (docx_w - 120, sig_y + 140)], fill="#F9F5EE", outline="#EADCCF", width=1)
draw.line([(150, sig_y + 90), (520, sig_y + 90)], fill="#33241B", width=1)
draw.text((150, sig_y + 100), "Homeowner Signature (Robert Jenkins)", fill="#33241B", font=font_bold_sm)

draw.line([(580, sig_y + 90), (950, sig_y + 90)], fill="#33241B", width=1)
draw.text((580, sig_y + 100), "Certified Equipment Operator Signature", fill="#33241B", font=font_bold_sm)

# Save preview-templates.png
templates_out = os.path.join(PUBLIC_IMAGES, "preview-templates.png")
img_docx.save(templates_out, "PNG", quality=95)
print(f"Saved: {templates_out} ({img_docx.size})")

print("All 3 preview images generated successfully!")
