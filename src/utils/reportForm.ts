export const REPORT_CONTENT_MAX_LENGTH = 1000;
export const REPORT_IMAGE_UPLOAD_MAX_SIZE_BYTES = 5 * 1024 * 1024;

const BLOCK_TAG_NAMES = new Set([
   'ADDRESS',
   'ARTICLE',
   'ASIDE',
   'BLOCKQUOTE',
   'DIV',
   'FIGCAPTION',
   'FIGURE',
   'FOOTER',
   'H1',
   'H2',
   'H3',
   'H4',
   'H5',
   'H6',
   'HEADER',
   'HR',
   'LI',
   'MAIN',
   'NAV',
   'OL',
   'P',
   'PRE',
   'SECTION',
   'TABLE',
   'TBODY',
   'TD',
   'TFOOT',
   'TH',
   'THEAD',
   'TR',
   'UL',
]);

function getNodeText(node: ChildNode): string {
   if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent ?? '';
   }

   if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
   }

   const element = node as HTMLElement;

   if (element.tagName === 'BR') {
      return '\n';
   }

   const childText = Array.from(element.childNodes).map(getNodeText).join('');

   if (BLOCK_TAG_NAMES.has(element.tagName)) {
      if (childText.length === 0) {
         return '';
      }

      return `${childText}\n`;
   }

   return childText;
}

export function getReportContentCharacterCount(html: string): number {
   if (!html) {
      return 0;
   }

   const template = document.createElement('template');
   template.innerHTML = html;

   const text = Array.from(template.content.childNodes).map(getNodeText).join('');

   return text.endsWith('\n') ? text.slice(0, -1).length : text.length;
}
