import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import "./embla.css";

type PropType = {
  children: React.ReactNode;
  options?: EmblaOptionsType;
  className?: string;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { children, options, className } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
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
};

export default EmblaCarousel;
