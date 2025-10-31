import { useEffect, useState } from "react";
import { useGetPopularPeopleQuery } from "../../redux/api/people";
import { Link } from "react-router-dom";
import Loader from "../../component/Loader";
import { motion } from "framer-motion";
import { defaultAvatar } from "../../assets";

const getProductsPerPage = () => {
  const width = window.innerWidth;
  if (width >= 1280) return 20;
  if (width >= 1024) return 16;
  if (width >= 768) return 12;
  return 8;
};

const People = () => {
  const { data, isLoading } = useGetPopularPeopleQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(getProductsPerPage());

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleResize = () => {
      setProductsPerPage(getProductsPerPage());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Array.isArray(data)
    ? Math.ceil(data.length / productsPerPage)
    : 1;

  const paginatedPeople = Array.isArray(data)
    ? data.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      )
    : [];

  return (
    <div
      className="w-full mx-auto 2xl:container px-3 md:px-8 lg:px-12 pb-20 pt-3"
      role="main"
      aria-label="Popular People Page"
    >
      <h1 className="text-xl font-bold mt-2 md:mt-4">Popular People</h1>

      {isLoading && (
        <div className="flex justify-center items-center h-[200px]">
          <Loader />
        </div>
      )}

      <div
        className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        aria-label="People Grid"
      >
        {paginatedPeople.length > 0 ? (
          paginatedPeople.map((person, index) => (
            <motion.div
              key={`${person.id}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                to={`/people/${person.id}`}
                className="text-center block"
                aria-label={`View details for ${person.name}`}
              >
                <img
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                      : defaultAvatar
                  }
                  alt={person.name}
                  loading="lazy"
                  className="rounded-lg w-full h-[150px] md:h-[200px] object-cover"
                />
                <p className="mt-2 font-medium">{person.name}</p>
              </Link>
            </motion.div>
          ))
        ) : (
          <p>No people found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex justify-center items-center mt-6 gap-5 flex-wrap"
          aria-label="Pagination Controls"
        >
          {currentPage > 1 && (
            <motion.button
              className="pagination-button font-family-2"
              onClick={() => paginate(currentPage - 1)}
              whileTap={{ scale: 0.95 }}
            >
              Prev
            </motion.button>
          )}
          {Array(Math.min(3, totalPages))
            .fill()
            .map((_, index) => {
              const pageNumber = Math.max(1, currentPage - 2) + index;
              return (
                <motion.button
                  key={pageNumber}
                  className={`pagination-button font-family-2 ${
                    currentPage === pageNumber
                      ? "active bg-rose-900 text-white py-2 px-3 rounded-2xl"
                      : ""
                  }`}
                  onClick={() => paginate(pageNumber)}
                  whileTap={{ scale: 0.95 }}
                >
                  {pageNumber}
                </motion.button>
              );
            })}
          {currentPage < totalPages && (
            <motion.button
              className="pagination-button font-family-2"
              onClick={() => paginate(currentPage + 1)}
              whileTap={{ scale: 0.95 }}
            >
              Next
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export default People;
