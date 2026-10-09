import sys

def main():
    pdf_path = "varun_chauhan_resume (4).pdf"
    
    # Try pypdf
    try:
        import pypdf
        reader = pypdf.PdfReader(pdf_path)
        text = "\n".join([page.extract_text() for page in reader.pages])
        print("=== PYPDF OUTPUT ===")
        print(text)
        return
    except Exception as e:
        print("pypdf error:", e)

    # Try PyMuPDF (fitz)
    try:
        import fitz
        doc = fitz.open(pdf_path)
        text = "\n".join([page.get_text() for page in doc])
        print("=== FITZ OUTPUT ===")
        print(text)
        return
    except Exception as e:
        print("fitz error:", e)

    # Fallback to pdfplumber
    try:
        import pdfplumber
        with pdfplumber.open(pdf_path) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages])
            print("=== PDFPLUMBER OUTPUT ===")
            print(text)
            return
    except Exception as e:
        print("pdfplumber error:", e)

    # Fallback raw string extraction
    try:
        with open(pdf_path, 'rb') as f:
            content = f.read().decode('latin1', errors='ignore')
            import re
            strings = re.findall(r'[A-Za-z0-9\s@\.\:\-\_\/\(\)]{4,}', content)
            print("=== RAW STRINGS OUTPUT ===")
            print("\n".join(strings[:100]))
    except Exception as e:
        print("raw string error:", e)

if __name__ == "__main__":
    main()
