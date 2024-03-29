import React, { useEffect, useRef } from "react";
import Slider from "react-slick";

import PictureCard from "../../components/pictureCard/PictureCard";
import { settings } from "../../constants/sliderSettings";
import { categories } from "../../constants/categories";
import { picturesType } from "../../types/picturesType";

// CSS
import "./PictureDictionary.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PictureDictionarySlider.css";
import { useAppSelector } from "../../hooks/selector";

function PictureDictionary() {
  const sliderRef = useRef<Slider | null>(null);
  const scrollRef = useRef<null | HTMLDivElement>(null);

  const { label } = useAppSelector((state) => state.selector);

  const handleScroll = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (label) {
      handleScroll();
    }
  }, [label]);

  useEffect(() => {
    const sliderElement = sliderRef.current;
    sliderElement?.innerSlider?.list?.setAttribute("tabindex", "0");
    sliderElement?.innerSlider?.list?.focus();
  }, []);

  return (
    // <div className="picture-dictionary-wrapper">

    <div className="picture-dictionary">
      {/* <button onClick={handleScroll}>scroll</button> */}
      {/* {label === slider.name ? handleScroll : null} */}
      {categories.map((slider, index) => (
        <div
          className="slider"
          key={slider.name}
          ref={slider.name === label ? scrollRef : null}
        >
          <h3 className="category-title">{slider.name}</h3>
          <Slider ref={!index ? sliderRef : null} {...settings}>
            {slider.category.map(
              (picture: picturesType) => (
                <PictureCard
                  key={picture.hy}
                  hy={picture.hy}
                  transliteration={picture.transliteration}
                  ru={picture.ru}
                  en={picture.en}
                  url={picture.url}
                  category={picture.category}
                />
              ),
              console.log(scrollRef)
              // slider.name.includes(label)
              //   ? handleScroll
              //   : console.log(label, "THIS IS LABEL")
            )}
          </Slider>
        </div>
      ))}
    </div>
    // </div>
  );
}

export default PictureDictionary;
