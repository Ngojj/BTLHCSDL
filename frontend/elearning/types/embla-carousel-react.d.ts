declare module "embla-carousel-react" {
  type EmblaApi = {
    canScrollPrev(): boolean;
    canScrollNext(): boolean;
    scrollPrev(): void;
    scrollNext(): void;
    on(event: string, cb: (api: EmblaApi) => void): void;
    off(event: string, cb: (api: EmblaApi) => void): void;
  };

  type EmblaRef = (node: HTMLElement | null) => void;

  export type UseEmblaCarouselType = [
    EmblaRef,
    EmblaApi | undefined
  ];

  export default function useEmblaCarousel(
    options?: Record<string, unknown>,
    plugins?: unknown
  ): UseEmblaCarouselType;
}
