const axios = require("axios");

const fetchTrendingAndUpcomingAnime = async () => {
  try {
    const query = `
      query {
        trending: Page(page: 1, perPage: 6) {
          media(sort: TRENDING_DESC, type: ANIME) {
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
              medium
            }
          }
        }
        upcoming: Page(page: 1, perPage: 6) {
          media(status: NOT_YET_RELEASED, type: ANIME, sort: START_DATE) {
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
              medium
            }
          }
        }
      }
    `;

    const { data } = await axios.post("https://graphql.anilist.co/", { query });

    const trendingAnime = data.data.trending.media.map((anime) => ({
      title: anime.title.romaji || anime.title.english || "No title",
      description: anime.description
        ? anime.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "..."
        : "No description",
      episodes: anime.episodes || "Unknown",
      startDate: anime.startDate || {},
      score: anime.averageScore || "N/A",
      episodes: anime.episodes || "N/A",
      image: anime.coverImage?.large || anime.coverImage?.medium || "/images/default.png",
      watchLink: anime.siteUrl,
    }));

    const upcomingAnime = data.data.upcoming.media.map((anime) => ({
      title: anime.title.romaji || anime.title.english || "No title",
      description: anime.description
        ? anime.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "..."
        : "No description",
      episodes: anime.episodes || "Unknown",
      startDate: anime.startDate || {},
      score: anime.averageScore || "N/A",
      episodes: anime.episodes || "N/A",
      image: anime.coverImage?.large || anime.coverImage?.medium || "/images/default.png",
      watchLink: anime.siteUrl,
    }));

    return { trendingAnime, upcomingAnime };
  } catch (error) {
    console.error("Error in trendingAndUpcoming:", error.message);
    throw new Error("Failed to fetch anime details.");
  }
};

module.exports = { fetchTrendingAndUpcomingAnime };
