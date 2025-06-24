import { MediaItem } from '../components/Gallery/types';

// Function to fetch actual YouTube videos from Bunmi Akinyosola Ministries channel
export async function fetchYouTubeVideos(): Promise<MediaItem[]> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const channelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;
  const apiEndpoint = import.meta.env.VITE_YOUTUBE_API_ENDPOINT;
  const maxResults = import.meta.env.VITE_YOUTUBE_API_MAX_RESULTS || 10;

  const url = `${apiEndpoint}?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error('YouTube API Error:', data.error);
      return getFallbackVideos();
    }

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      type: 'video',
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.high?.url || `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`,
      title: item.snippet.title,
      description: item.snippet.description,
      tags: [], // YouTube API doesn't return tags in search results
      uploadedAt: new Date(item.snippet.publishedAt)
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return getFallbackVideos();
  }
}

// Fallback function that returns sample data when the API fails
export function getFallbackVideos(): MediaItem[] {
  return [
    {
      id: 'c1xKFnLmKFw',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=c1xKFnLmKFw',
      thumbnail: 'https://img.youtube.com/vi/c1xKFnLmKFw/maxresdefault.jpg',
      title: 'Breaking Soul Ties and Finding Freedom',
      description: 'Powerful teaching on breaking harmful spiritual connections',
      tags: ['sermon', 'ministry', 'deliverance'],
      uploadedAt: new Date('2024-05-15T10:30:00Z')
    },
    // Keep existing fallback videos as backup
    {
      id: 'UZ5YYMTULSY',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=UZ5YYMTULSY',
      thumbnail: 'https://img.youtube.com/vi/UZ5YYMTULSY/maxresdefault.jpg',
      title: 'The Power of Faith-Filled Prayer',
      description: 'Understanding the principles of effective prayer',
      tags: ['sermon', 'prayer', 'faith'],
      uploadedAt: new Date('2024-04-22T14:30:00Z')
    },
    {
      id: 'PC2MkE7Hv2o',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=PC2MkE7Hv2o',
      thumbnail: 'https://img.youtube.com/vi/PC2MkE7Hv2o/maxresdefault.jpg',
      title: 'Overcoming Spiritual Strongholds',
      description: 'Keys to walking in victory over spiritual battles',
      tags: ['teaching', 'spiritual warfare', 'victory'],
      uploadedAt: new Date('2024-03-18T09:45:00Z')
    },
    {
      id: '2WElAGXNUY0',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=2WElAGXNUY0',
      thumbnail: 'https://img.youtube.com/vi/2WElAGXNUY0/maxresdefault.jpg',
      title: 'Walking in Divine Purpose',
      description: 'Discovering and fulfilling God\'s plan for your life',
      tags: ['purpose', 'destiny', 'ministry'],
      uploadedAt: new Date('2024-02-25T11:30:00Z')
    }
  ];
}

// For backward compatibility - returns either real API data or fallbacks
export function getBunmiAkinyosolaVideos(): Promise<MediaItem[]> {
  return fetchYouTubeVideos();
}
