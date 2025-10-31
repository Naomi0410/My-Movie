import { useParams } from "react-router-dom";
import { useGetTMDbMovieCreditsQuery } from "../redux/api/movies";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { defaultAvatar } from "../assets";

const getSlidesToShow = (width) => {
  if (width < 480) return 3;
  if (width < 768) return 3;
  if (width < 1024) return 4;
  if (width < 1280) return 5;
  return 6;
};

const MovieCast = () => {
  const { id } = useParams();
  const {
    data: credits,
    isLoading: creditsLoading,
    error: creditsError,
  } = useGetTMDbMovieCreditsQuery(id);

  const [width, setWidth] = useState(window.innerWidth);
  const [slidesToShow, setSlidesToShow] = useState(
    getSlidesToShow(window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      setSlidesToShow(getSlidesToShow(newWidth));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (creditsLoading) return <p className="text-white">Loading cast...</p>;
  if (creditsError) return <p className="text-red-500">Failed to load cast.</p>;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: Math.min(slidesToShow, 3),
  };

  return (
    credits?.cast?.length > 0 && (
      <div className="px-8 lg:px-12 mt-8" role="region" aria-label="Movie Cast">
        <h2 className="text-xl font-bold mb-4 text-white">Cast</h2>
        <Slider key={width} {...settings}>
          {credits.cast.slice(0, 12).map((actor) => (
            <div
              key={actor.id}
              className="text-center text-white px-2"
              role="group"
              aria-label={`${actor.name} as ${actor.character}`}
            >
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : defaultAvatar
                }
                alt={`Portrait of ${actor.name}`}
                loading="lazy"
                className="rounded-2xl mx-auto mb-2 w-[200px] h-auto max-h-[150px] object-cover"
              />
              <p className="font-semibold">{actor.name}</p>
              <p className="text-sm text-gray-300">as {actor.character}</p>
            </div>
          ))}
        </Slider>
      </div>
    )
  );
};

export default MovieCast;
