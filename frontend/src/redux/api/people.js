import { PEOPLE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const peopleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔥 Get popular people
    getPopularPeople: builder.query({
      query: () => `${PEOPLE_URL}`,
    }),

    // 📄 Get person details
    getPersonDetails: builder.query({
      query: (id) => `${PEOPLE_URL}/${id}`,
    }),

    // 🎬 Get person credits (movies + TV)
    getPersonCredits: builder.query({
      query: (id) => `${PEOPLE_URL}/${id}/credits`,
    }),
  }),
});

export const {
  useGetPopularPeopleQuery,
  useGetPersonDetailsQuery,
  useGetPersonCreditsQuery,
} = peopleApiSlice;
