import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "./MovieCard";
import TVCard from "./TVCard";
import ModalView from "./ModalView";
import { Link } from "react-router-dom";
import {
  useGetFavoritesQuery,
  useGetWatchlistQuery,
} from "../redux/api/account";
import { motion } from "framer-motion";

const Arrow = ({ className, style, onClick }) => (
  <div
    className={`${className} !text-white !bg-black/70 p-2 rounded-full`}
    style={{ ...style, display: "block", zIndex: 10 }}
    onClick={onClick}
    role="button"
    aria-label="Navigate slider"
  />
);

const getSlidesToShow = (width) => {
  if (width < 480) return 2;
  if (width < 768) return 2;
  if (width < 1024) return 3;
  if (width < 1280) return 4;
  return 5;
};

const SliderUtil = ({ data }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [slidesToShow, setSlidesToShow] = useState(
    getSlidesToShow(window.innerWidth)
  );
  const [showModal, setShowModal] = useState(false);

  const { data: favorites = [] } = useGetFavoritesQuery();
  const { data: watchlist = [] } = useGetWatchlistQuery();

  const handleRequireLogin = () => setShowModal(true);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      setSlidesToShow(getSlidesToShow(newWidth));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: Math.min(slidesToShow, 3),
    arrows: true,
    nextArrow: <Arrow />,
    prevArrow: <Arrow />,
  };

  return (
    <div className="w-full" role="region" aria-label="Media Slider">
      <Slider key={width} {...settings}>
        {data?.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            role="group"
            aria-label={
              item.title ? `Movie: ${item.title}` : `TV Show: ${item.name}`
            }
          >
            {item.title ? (
              <MovieCard
                movie={item}
                favorites={favorites}
                watchlist={watchlist}
                onRequireLogin={handleRequireLogin}
              />
            ) : (
              <TVCard
                tv={item}
                favorites={favorites}
                watchlist={watchlist}
                onRequireLogin={handleRequireLogin}
              />
            )}
          </motion.div>
        ))}
      </Slider>

      <ModalView
        show={showModal}
        handleClose={() => setShowModal(false)}
        title="Login Required"
      >
        <p className="text-gray-400">
          You need to be logged in to add movies to your favorites or watchlist.
        </p>
        <Link
          to="/login"
          className="btn btn-primary w-full"
          onClick={() => setShowModal(false)}
        >
          Go to Login
        </Link>
      </ModalView>
    </div>
  );
};

export default SliderUtil;
