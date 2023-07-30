import videoData from "../data/videos.json";

const fetchVideos = async ({ url }) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = `youtube.googleapis.com/youtube/v3`;

  const response = await fetch(
    `https://${BASE_URL}/${url}&maxResults=10&key=${YOUTUBE_API_KEY}`
  );

  return await response.json();
};

export const getCommonVideos = async ({ url }) => {
  const isDev = process.env.DEVELOPMENT;

  try {
    const data = isDev ? videoData : await fetchVideos({ url });

    if (data?.error) {
      console.error("Youtube API error", data.error);
      return [];
    }

    return data?.items.map((item) => {
      return {
        title: item?.snippet?.title,
        imageUrl: item?.snippet?.thumbnails?.medium?.url,
        id: item?.id?.videoId || item?.id?.channelId || item?.id,
      };
    });
  } catch (error) {
    console.error("Something went wrong with video library", error);
    return [];
  }
};

export const getVideos = ({ searchQuery }) => {
  const URL = `search?part=snippet&q=${searchQuery}`;

  return getCommonVideos({ url: URL });
};

export const getPopularVideos = () => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=NG`;

  return getCommonVideos({ url: URL });
};

export const getYouTubeVideoById = async ({ videoId }) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    const videoData = await data.items[0];

    const video = {
      title: videoData?.snippet?.title,
      publishTime: videoData?.snippet?.publishedAt,
      description: videoData?.snippet?.description,
      channelTitle: videoData?.snippet?.channelTitle,
      viewCount: videoData?.statistics?.viewCount || 0,
    };

    return video;
  } catch (error) {
    console.error("Something went wrong with video library", error);
  }
};
