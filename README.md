# Paginated Legal Document Editor

Live Demo: https://tiptap-pagination-nine.vercel.app/  
GitHub Repository: https://github.com/Generally-general/tiptap-pagination

---

## Overview

This project implements a **high-fidelity, paginated rich-text editor** built with **Tiptap** (ProseMirror) and **Next.js**, designed to satisfy strict formatting requirements for legal documents (specifically US Letter size with 1-inch margins). The main goal was to allow users to:

- Visualize page breaks dynamically while drafting,
- Ensure what they see on screen matches printed output,
- Draft structured legal content with predictable pagination behavior.

This prototype demonstrates a practical solution to a real problem legal professionals face when preparing documents for submission, such as preparing petitions or support letters for immigration agencies like USCIS.

---

## 🛠 Tech Stack

**Frontend**
- Next.js (React)
- Tiptap (ProseMirror)
- Tailwind CSS

**Editor & Document Model**
- Tiptap Custom Node Extensions
- ProseMirror Schema & Transactions

**Styling & Layout**
- CSS paged-media concepts
- Fixed-dimension print-accurate layout
- Tailwind utility classes

**Deployment**
- Vercel

**Version Control**
- Git & GitHub


---

## Key Features

- **Paginated editor UI** with fixed-size page nodes,
- Real-time overflow detection and visual indicators,
- Manual overflow handling via “Fix Overflow” button,
- Print-ready output where on-screen pages correspond exactly to printed pages,
- Support for headings, paragraphs, and multi-page documents,
- Built with production-aligned technologies: Next.js, Tailwind CSS, and Tiptap.

---

## How Pagination Works

The editor is built around a custom `page` node in the Tiptap schema


### Pagination Strategy

1. **Fixed Page Dimensions:**  
   Each `.page-node` is sized to match US Letter format at 96 DPI —  
   **816px × 1056px** with 1-inch margins, yielding a safe content height of **864px**.

2. **DOM-Measured Overflow:**  
   On each editor update (`onUpdate`), the editor:
   - Queries all page DOM nodes,
   - Measures the last child’s rendered bottom position,
   - Marks the `page` node as overflowing if beyond the safe zone.

3. **Overflow Handling:**  
   - Overflowed content is not automatically split (to preserve text integrity),
   - Users can click **Fix Overflow**, which:
     - Slices the document starting at the overflow position,
     - Moves overflowing blocks into the next page node,
     - Guards against data loss and avoids corrupting document structure.

4. **Print Output:**  
   Print CSS ensures:
   - Pages break correctly,
   - Editor containers do not clip content,
   - Print preview matches actual document pagination.

This approach prioritizes **document stability and predictability**, crucial for legal drafting where formatting errors can have real consequences.

---

## Design Trade-offs

| Design Choice | Trade-off | Reason |
| ------------- | --------- | ------ |
| Manual overflow resolution | Requires user action to fix overflows | Prevents automatic reflow that could misplace text |
| Block-level pagination | Does not split inside paragraphs | Legal documents prefer splitting at logical boundaries |
| Fixed layout pages | Restricts dynamic flows | Ensures what users see is exactly what prints |
| DOM measurement | Slight performance cost on large docs | Required for accurate height and overflow detection |

---

## Limitations

- Paragraphs are moved only as whole blocks — very long paragraphs may still cross page boundaries.
- Tables, headers/footers, and advanced layouts are not yet supported.
- Import/export (PDF with metadata, DOCX, etc.) is not implemented.
- Real-time collaboration (CRDT/OT) is not included.

These are deliberate scope limitations for the prototype.

---

## Setup Instructions

### Local Development

```bash
git clone https://github.com/Generally-general/tiptap-pagination
cd tiptap-pagination
npm install
npm run dev
```

### Deployment

This project is deployed on **Vercel** — see the **Live Demo** link at the top of this README.

---


## What can be expected

- Typing across page boundaries updates overflow status in real time.
- Overflowing pages are highlighted visually with a red border.
- Manual overflow fixes keep document control in the user’s hands.
- Print preview renders each `.page-node` as a printable physical page.

---



## What I Would Improve with More Time

- **Smart paragraph splitting**  
  Use fine-grained DOM range measurement to split paragraphs when a single paragraph exceeds page height.

- **Header & Footer**  
  Add customizable headers & footers.

- **Backend PDF Export**  
  Generate consistent cross-platform PDFs using server-side rendering.

- **Performance Optimizations**  
  Add debouncing and virtualization for very large documents.

These improvements would make the editor suitable for full production use in enterprise legal workflows.

---

## Developer Notes

- The editor enforces **US Letter (8.5 × 11 inch)** formatting with **1-inch margins**.

## Use of AI Tools

AI tools were used during the development of this project to accelerate research, debugging, and implementation of complex editor and pagination logic.

All generated code and architectural suggestions were reviewed, understood, and adapted manually. The final implementation reflects my own design decisions, debugging, and integration work — particularly around pagination strategy, DOM measurement, overflow handling, and print fidelity.

AI was used as a productivity tool, not as a replacement for engineering judgment.