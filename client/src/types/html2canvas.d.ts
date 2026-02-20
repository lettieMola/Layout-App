declare module 'html2canvas' {
  interface Options {
    async?: boolean;
    allowTaint?: boolean;
    backgroundColor?: string;
    canvas?: HTMLCanvasElement | null;
    foreignObjectRendering?: boolean;
    ignoreElements?: (element: Element) => boolean;
    imageTimeout?: number;
    ignoreElements?: (element: Element) => boolean;
    logging?: boolean;
    onclone?: (documentClone: Document) => void;
    proxy?: string | null;
    removeContainer?: boolean;
    scale?: number;
    useCORS?: boolean;
    width?: number;
    height?: number;
    windowHeight?: number;
    windowWidth?: number;
    x?: number;
    y?: number;
  }

  export default function html2canvas(
    element: HTMLElement,
    options?: Partial<Options>
  ): Promise<HTMLCanvasElement>;
}
