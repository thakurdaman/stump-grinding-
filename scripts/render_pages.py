import sys
import fitz  # PyMuPDF
import os

pdf_path = sys.argv[1]
output_dir = sys.argv[2]
os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Opened PDF with {len(doc)} pages.")

# Render Page 1 (Cover, 0-indexed: 0)
# Render Page 2 (Table of contents, 0-indexed: 1)
# Render Page 7 (Chapter 2 / Pricing Table, 0-indexed: 6)
pages_to_render = [0, 1, 6]

# 2x zoom for crisp visual inspection (144 dpi)
zoom_matrix = fitz.Matrix(2.0, 2.0)

for pno in pages_to_render:
    if pno < len(doc):
        page = doc[pno]
        pix = page.get_pixmap(matrix=zoom_matrix)
        out_name = f"stamped_page_{pno + 1}.png"
        out_path = os.path.join(output_dir, out_name)
        pix.save(out_path)
        print(f"Rendered Page {pno + 1} to {out_path} ({pix.width}x{pix.height})")

print("Rendering complete.")
