import { MediaItem } from '../Gallery/types';

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

interface FeaturedYouTubeVideoProps {
  video: MediaItem;
  channelName?: string;
  height?: string; // CSS height value
}

export function FeaturedYouTubeVideo({ 
  video, 
  channelName = '@bunmiAkinyosolaministries',
  height = '40%' 
}: FeaturedYouTubeVideoProps) {
  return (
    <div className="mb-12 bg-white rounded-lg overflow-hidden shadow-lg">
      <h3 className="text-2xl font-bold text-[#006297] p-6 border-b">
        Featured Video 
        {channelName && (
          <span className="text-sm text-gray-500 font-normal ml-2">{channelName}</span>
        )}
      </h3>
      <div className="relative" style={{ paddingTop: height }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.url)}?autoplay=0`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="p-6">
        <h4 className="text-xl font-semibold">{video.title}</h4>
        <p className="text-gray-600 mt-2">{video.description}</p>
        <div className="mt-4 flex items-center flex-wrap gap-2">
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">YouTube</span>
          {video.tags?.map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
