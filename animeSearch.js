const axios = require("axios");

const animeSearch = async (title) => {
  try {
    const query = `
      query ($search: String) {
        Page(page: 1, perPage: 6) {
          media(search: $search, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            description
            startDate {
              year
              month
              day
            }
            averageScore
            episodes
            siteUrl
            coverImage {
              large
            }
          }
        }
      }
    `;
    const variables = { search: title };
    const { data } = await axios.post("https://graphql.anilist.co/", { query, variables });
    return data.data.Page.media.map((anime) => ({
      id: anime.id,
      title: anime.title.romaji || anime.title.english || "No title",
      description: anime.description?.replace(/<\/?[^>]+(>|$)/g, "") || "No description",
      startDate: anime.startDate || {},
      score: anime.averageScore || "N/A",
      episodes: anime.episodes || "N/A",
      image: anime.coverImage?.large || "/images/default.png",
      watchLink: anime.siteUrl,
    }));
  } catch (error) {
    console.error("Error in animeSearch:", error.message);
    throw new Error("Failed to fetch anime details.");
  }
};

module.exports = animeSearch;
