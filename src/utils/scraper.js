const axios = require("axios");

const scrapeAnimeDetails = async (title) => {
  const allAnime = [];
  let hasNextPage = true;
  let currentPage = 1;

  try {
    while (hasNextPage) {
      const query = `
      query ($search: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            currentPage
            hasNextPage
          }
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
              medium
            }
          }
        }
      }
      `;

      const variables = {
        search: title,
        page: currentPage,
        perPage: 50, // Maximum allowed per page
      };

      const { data } = await axios.post("https://graphql.anilist.co/", {
        query,
        variables,
      });

      const page = data.data.Page;

      if (page.media.length === 0) {
        throw new Error("No data returned for the given title.");
      }

      // Add the current page results to allAnime
      allAnime.push(
        ...page.media.map((anime) => {
          const watchLink = `${anime.siteUrl}/watch`;

          return {
            title: anime.title.romaji || anime.title.english || "No title",
            description: anime.description
              ? anime.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "..."
              : "No description",
            episodes: anime.episodes || "Unknown",
            startDate: anime.startDate || {},
            score: anime.averageScore || "N/A",
            episodes: anime.episodes || "N/A",
            image: anime.coverImage?.large || anime.coverImage?.medium || "/images/default.png",
            watchLink,
          };
        })
      );

      // Update pagination state
      hasNextPage = page.pageInfo.hasNextPage;
      currentPage = page.pageInfo.currentPage + 1;
    }

    console.log("Fetched all anime with images:", allAnime);
    return allAnime;
  } catch (error) {
    console.error("Error in scrapeAnimeDetails:", error.message);
    throw new Error("Failed to fetch anime details.");
  }
};

module.exports = { scrapeAnimeDetails };
