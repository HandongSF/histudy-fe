import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

type PropType = {
  children: React.ReactNode;
  options?: EmblaOptionsType;
  className?: string;
};

export const CAROUSEL_SLIDES = [
  {
    imageUrl: "/img/SLE_DESKTOP.png",
    linkUrl: "https://sle-recruitng.vercel.app/",
    alt: "슬기짜기",
  },
  {
    imageUrl: "/img/TEST_DESKTOP.png",
    linkUrl: "https://hisnet.handong.edu/",
    alt: "데모이미지",
  },
];

const CAROUSEL_OPTIONS: EmblaOptionsType = { loop: true };

export default function EmblaCarousel(props: PropType) {
  const { children, className } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(CAROUSEL_OPTIONS, [
    Autoplay({ stopOnInteraction: false }),
  ]);

  return (
    <section className={`embla ${className || ""}`}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {React.Children.map(children, (child, index) => (
            <div className="embla__slide" key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
