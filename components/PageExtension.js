import { Node, mergeAttributes } from '@tiptap/core'

export const PageExtension = Node.create({
  name: 'page',
  group: 'block',
  content: 'block+',
  defining: true,
  selectable: false,
  isolating: true,

  addAttributes() {
    return {
      pageNumber: {
        default: 1,
        renderHTML: attributes => ({
          pagenumber: attributes.pageNumber,
        }),
      },
      isOverflowing: {
        default: false,
        renderHTML: attributes => {
          if (!attributes.isOverflowing) return {};
          return { 'data-overflow': 'true' };
        },
        parseHTML: element => element.getAttribute('data-overflow') === 'true',
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.page-node' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'page-node' }), 0];
  },
});