# 📄 OpenSphere – Paginated Legal Document Editor

A high-fidelity, paginated rich-text editor built with **Tiptap** and **Next.js**, designed to match **US Letter print layout** for legal document drafting.

This project allows users to visually see where their content will break across pages while writing—similar to Google Docs or Microsoft Word—ensuring formatting accuracy for USCIS-style legal submissions.

---

## 🚀 Live Demo  
**[Your Live Link Here]**

---

## 🧰 Tech Stack

- Next.js  
- Tiptap (ProseMirror)  
- Tailwind CSS  
- Custom Tiptap Page Extension  
- DOM-based layout measurement  

---

## 🧠 How Pagination Works

This editor uses a **visual pagination model** rather than splitting the document into multiple documents.

Each page is represented as a **`page` node** in the ProseMirror schema and rendered as a fixed-size “paper” surface that matches **US Letter (8.5″ × 11″) with 1″ margins**.

### Page dimensions

- Page height: **1056px**  
- Vertical margins: **96px × 2**  
- Safe text area: **864px**

### Pagination Logic

1. Tiptap renders content normally.  
2. On every edit (`onUpdate`), the editor measures the rendered height of content inside each page using the DOM.  
3. When content crosses the **864px safe zone**, the page is marked as **overflowing** via a ProseMirror attribute (`isOverflowing`).  
4. A visual warning (red border + caret) is shown.  
5. When the user clicks **Fix Overflow**, only the overflowing blocks are moved into the next page using **ProseMirror position-based slicing** (not DOM manipulation).

This ensures:
- No data loss  
- No ProseMirror `RangeError`s  
- Predictable and safe behavior for legal documents  

---

## ⚖️ Design Trade-offs

| Decision | Trade-off | Why |
|--------|----------|-----|
Manual overflow resolution | Users must click “Fix Overflow” | Prevents silent content movement, which is dangerous in legal drafting |
Block-level pagination | Long paragraphs move as a unit | Avoids splitting sentences mid-way, which is risky and error-prone |
Fixed page height | No infinite scrolling | Ensures screen matches printed output |
DOM-based measurement | Slight performance cost | Required for accurate mixed-format height calculation |

---

## 🧩 Known Limitations

- Paragraphs are moved as whole blocks. Very long paragraphs are not split mid-sentence unless they exceed a full page.  
- Extremely large documents may require throttling or optimization for layout recalculation.  
- Current implementation supports common blocks (headings, paragraphs, lists); tables and footers are not yet implemented.  

---

## 🔮 What I Would Improve With More Time

- Smart paragraph splitting using DOM Range geometry  
- Native header/footer support  
- PDF export using server-side print engines  
- Visual page ruler and margin guides  
- Collaboration support using Tiptap’s CRDT extensions  

---

## 🛠 Setup Instructions

```bash
git clone https://github.com/Generally-general/tiptap-pagination.git
cd opensphere-pagination
npm install
npm run dev
