import axios from 'axios';

export const REPORT_CONTENT_MAX_LENGTH = 1000;
export const REPORT_IMAGE_UPLOAD_MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const REPORT_IMAGE_UPLOAD_MAX_SIZE_MESSAGE = '이미지는 파일당 5MB 이하만 업로드할 수 있습니다.';
export const REPORT_IMAGE_UPLOAD_FAILURE_MESSAGE = '이미지 업로드에 실패했습니다. 다시 시도해주세요.';

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

let htmlTemplateElement: HTMLTemplateElement | null = null;

function getHtmlTemplateElement() {
   if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
      return null;
   }

   if (!htmlTemplateElement) {
      htmlTemplateElement = document.createElement('template');
   }

   return htmlTemplateElement;
}

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

   const template = getHtmlTemplateElement();
   if (!template) {
      return html.replace(/<[^>]*>/g, '').length;
   }

   template.innerHTML = html;

   const text = Array.from(template.content.childNodes).map(getNodeText).join('');

   return text.endsWith('\n') ? text.slice(0, -1).length : text.length;
}

export function isReportImageFileSizeExceeded(file: Blob): boolean {
   return file.size > REPORT_IMAGE_UPLOAD_MAX_SIZE_BYTES;
}

export function isReportImageUploadTooLargeError(error: unknown): boolean {
   return axios.isAxiosError(error) && error.response?.status === 413;
}
