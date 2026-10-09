import zlib
import re

def decompress_pdf(filename):
    with open(filename, 'rb') as f:
        data = f.read()

    # Find stream ... endstream blocks
    streams = re.findall(rb'stream\r?\n(.*?)\r?\nendstream', data, re.DOTALL)
    print(f"Found {len(streams)} streams")

    extracted_text = []

    for i, stream in enumerate(streams):
        # Decode ASCII85 if present
        # In reportlab, ASCII85 ends with '~>'
        # Try raw zlib decompress
        decompressed = None
        
        # Strip ASCII85 wrapper if present
        clean_stream = stream
        if b'~>' in clean_stream:
            try:
                import base64
                clean_stream = base64.a85decode(clean_stream.split(b'~>')[0] + b'~>')
            except Exception as e:
                print(f"a85decode error on stream {i}:", e)

        try:
            decompressed = zlib.decompress(clean_stream)
        except Exception as e:
            try:
                decompressed = zlib.decompress(stream)
            except Exception as e2:
                # try wbits
                try:
                    decompressed = zlib.decompress(clean_stream, -15)
                except Exception as e3:
                    pass

        if decompressed:
            print(f"--- Decompressed Stream {i} ---")
            # Look for text inside PDF Tj or TJ operations or plain text
            text_matches = re.findall(rb'\((.*?)\)\s*Tj', decompressed)
            text_matches_tj = re.findall(rb'\[(.*?)\]\s*TJ', decompressed)
            
            for m in text_matches:
                extracted_text.append(m.decode('latin1', errors='ignore'))
            for m in text_matches_tj:
                # Extract substrings inside parens
                sub_strings = re.findall(rb'\((.*?)\)', m)
                line = "".join([s.decode('latin1', errors='ignore') for s in sub_strings])
                extracted_text.append(line)
            
            # Print raw decompressed text snippet
            plain = re.findall(r'[A-Za-z0-9\s@\.\:\-\_\/\(\)\,\+\#\$\%\&\*]{3,}', decompressed.decode('latin1', errors='ignore'))
            extracted_text.extend(plain)

    print("\n".join(extracted_text))

if __name__ == "__main__":
    decompress_pdf("varun_chauhan_resume (4).pdf")
