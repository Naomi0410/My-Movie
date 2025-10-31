import { Link, useParams } from "react-router-dom"; // ✅ Corrected import
import {
  useGetPersonDetailsQuery,
  useGetPersonCreditsQuery,
} from "../../redux/api/people";
import Loader from "../../component/Loader";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { motion } from "framer-motion";
import { defaultAvatar } from "../../assets";

const getSlidesToShow = (width) => {
  if (width < 480) return 2;
  if (width < 768) return 2;
  if (width < 1024) return 3;
  if (width < 1280) return 4;
  return 5;
};

const PeopleDetails = () => {
  const { id } = useParams();
  const { data: personDetails } = useGetPersonDetailsQuery(id);
  const { data: personCredits } = useGetPersonCreditsQuery(id);

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

  if (!personDetails || !personCredits) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader />
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: Math.min(slidesToShow, 3),
  };

  return (
    <div
      className="w-full mx-auto 2xl:container"
      role="main"
      aria-label="Person Details Page"
    >
      <motion.div
        className="flex bg-gradient-to-r from-teal-700 via-cyan-900 to-blue-950 justify-center items-center gap-8 py-8 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        aria-label={`Biography of ${personDetails.name}`}
      >
        <div className="w-[80vw] md:w-2/6 lg:w-2/6 xl:w-80">
          <img
            src={
              personDetails.profile_path
                ? `https://image.tmdb.org/t/p/w500${personDetails.profile_path}`
                : defaultAvatar
            }
            loading="lazy"
            alt={personDetails.name}
          />
        </div>
        <div className="w-full p-3 md:p-0 md:w-3/6 lg:w-3/6">
          <h2 className="text-2xl font-bold">{personDetails.name}</h2>
          <p className="mt-2 text-xs xl:text-sm">
            {personDetails.biography || "No biography available."}
          </p>
          <div className="mt-3 flex justify-between">
            <p className="text-sm xl:text-base font-bold">
              Gender:{" "}
              <span className="font-normal text-xs xl:text-sm">
                {personDetails.gender === 1
                  ? "Female"
                  : personDetails.gender === 2
                  ? "Male"
                  : "Unknown"}
              </span>
            </p>
            <p className="text-sm xl:text-base font-bold">
              Born:{" "}
              <span className="font-normal text-xs xl:text-sm">
                {personDetails.birthday || "Unknown"}
              </span>
            </p>
          </div>
          <p className="mt-3 font-bold text-sm xl:text-base">
            Place of Birth:{" "}
            <span className="font-normal text-xs xl:text-sm">
              {personDetails.place_of_birth || "Unknown"}
            </span>
          </p>
          <p className="mt-3 font-bold text-sm xl:text-base">
            Also Known As:{" "}
            <span className="font-normal text-xs xl:text-sm">
              {personDetails.also_known_as?.length
                ? personDetails.also_known_as.join(", ")
                : "Unknown"}
            </span>
          </p>
        </div>
      </motion.div>
      <div className="px-8 lg:px-12 mt-8 pb-20" aria-label="Known For Section">
        <h2 className="text-xl font-bold mb-4 text-white">Known For</h2>
        {personCredits.length > 0 ? (
          <Slider key={width} {...settings}>
            {personCredits.map((items) => (
              <motion.div
                key={items.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.4 }}
              >
                <Link
                  to={
                    items.type === "movie"
                      ? `/movie/${items.tmdbId}`
                      : `/tv/${items.tmdbId}`
                  }
                  className="text-center text-white px-2 block"
                  aria-label={`View ${items.title} as ${items.character}`}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w342/${items.posterPath}`}
                    loading="lazy"
                    className="rounded-lg shadow-sm object-cover w-full max-h-[350px] max-w-xs mx-auto hover:opacity-80 transition-opacity duration-300"
                  />
                  <p className="text-white mt-2 font-bold text-center">
                    {items.title}
                  </p>
                  <p className="text-orange-300 mt-0 font-semibold text-center">
                    As:{" "}
                    <span className="text-orange-400 font-normal italic">
                      {items.character || "N/A"}
                    </span>
                  </p>
                </Link>
              </motion.div>
            ))}
          </Slider>
        ) : (
          <p className="text-white italic">No known credits available.</p>
        )}
      </div>
    </div>
  );
};

export default PeopleDetails;
