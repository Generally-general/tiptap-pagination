"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import { PageExtension } from "./PageExtension";

const CustomDocument = Document.extend({
  content: "page+",
});

const Tiptap = () => {
  const clearOverflow = () => {
    const dom = editor.view.dom;
    const pages = dom.querySelectorAll(".page-node");
    const SAFE_ZONE = 864;

    pages.forEach((page) => {
      const children = Array.from(page.children);
      if (!children.length) return;

      let overflowDom = null;

      for (let child of children) {
        if (child.offsetTop + child.offsetHeight > SAFE_ZONE) {
          overflowDom = child;
          break;
        }
      }

      if (!overflowDom) return;

      const from = editor.view.posAtDOM(overflowDom, 0);
      const pagePos = editor.view.posAtDOM(page, 0);

      const pageNode = editor.state.doc.nodeAt(pagePos - 1);
      if (!pageNode) return;

      const pageStart = pagePos;
      const pageEnd = pagePos + pageNode.content.size;

      // Take overflow content from this page
      const overflowSlice = editor.state.doc.slice(from, pageEnd);

      editor.chain().focus().deleteRange({ from, to: pageEnd }).run();

      // Find next page position in the document
      const resolved = editor.state.doc.resolve(pagePos);
      const afterPage = resolved.after(); // position after this page

      const nextNode = editor.state.doc.nodeAt(afterPage);

      if (nextNode && nextNode.type.name === "page") {
        // Insert into existing next page
        editor
          .chain()
          .insertContentAt(afterPage + 1, overflowSlice.content.toJSON())
          .run();
      } else {
        // Create new page
        editor
          .chain()
          .insertContentAt(editor.state.doc.content.size, {
            type: "page",
            content: overflowSlice.content.toJSON(),
          })
          .run();
      }
    });
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ document: false }),
      CustomDocument,
      PageExtension,
    ],
    content: `<div class="page-node"><h1>Legal Draft</h1><p>Start typing...</p></div>`,
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    immediatelyRender: false,
    onUpdate({ editor }) {
      const dom = editor.view.dom;
      const pages = dom.querySelectorAll(".page-node");
      const SAFE_ZONE = 890;

      pages.forEach((page, index) => {
        const children = Array.from(page.children);
        if (children.length === 0) return;

        const lastChild = children[children.length - 1];
        const lastChildBottom = lastChild.offsetTop + lastChild.offsetHeight;

        const currentlyOverflowing = lastChildBottom > SAFE_ZONE;

        const pos = editor.view.posAtDOM(page, 0);

        const node = editor.state.doc.nodeAt(pos - 1);
        if (node && node.attrs.isOverflowing !== currentlyOverflowing) {
          editor.commands.command(({ tr }) => {
            tr.setNodeMarkup(pos - 1, undefined, {
              ...node.attrs,
              isOverflowing: currentlyOverflowing,
            });
            return true;
          });
        }
      });
    },
  });

  if (!editor) return null;

  const addPage = () => {
    editor
      .chain()
      .focus()
      .insertContentAt(editor.state.doc.content.size, {
        type: "page",
        content: [{ type: "paragraph" }],
      })
      .run();
  };

  return (
    <div className="editor-viewport">
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2.5 rounded-full shadow-2xl transition-all hover:shadow-blue-500/10">
        <button
          onClick={addPage}
          className="group flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-full transition-all hover:bg-slate-800 active:scale-95 shadow-sm cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="transition-transform group-hover:rotate-90"
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          New Page
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <button
          onClick={clearOverflow}
          className="group flex items-center gap-2 px-4 py-1.5 text-slate-600 text-sm font-medium rounded-full transition-all hover:bg-red-50 hover:text-red-600 active:scale-95 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path
              fillRule="evenodd"
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
            />
          </svg>
          Fix Overflow
        </button>
        <button
          onClick={() => window.print()}
          className="group flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full transition-all hover:bg-blue-700 active:scale-95 shadow-sm cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
          </svg>
          Export PDF
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
