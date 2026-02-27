import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Youtube, ExternalLink, Play, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import MotionDot from "@/components/ui/motion-dot";

type YouTubeVideo = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  url: string;
};

function VideoCard({ video, index }: { video: YouTubeVideo; index: number }) {
  return (
    <motion.a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group block"
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
            }}
          />
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              <Play className="h-5 w-5 text-vibrantPink fill-vibrantPink ml-0.5" />
            </div>
          </div>
          {/* YouTube badge */}
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
            <Youtube className="h-3 w-3" />
            <span>YouTube</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-darkGray text-sm line-clamp-2 group-hover:text-skyBlue transition-colors leading-snug">
            {video.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1.5">
            {new Date(video.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {video.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>
      </Card>
    </motion.a>
  );
}

export default function YouTubeFeed() {
  const { data, isLoading, isError, error } = useQuery<{ videos: YouTubeVideo[]; channelUrl: string }>({
    queryKey: ["/api/youtube-feed"],
    queryFn: () => fetch("/api/youtube-feed").then((r) => r.json()),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-softBlue via-white to-pink-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <MotionDot />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">The 650 Method</span>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-darkGray flex items-center gap-3">
                <Youtube className="h-8 w-8 text-red-500" />
                Mira's Videos
              </h1>
              <p className="text-gray-500 mt-1">Latest workouts and wellness content from Mira Solis</p>
            </div>
            {data?.channelUrl && (
              <a
                href={data.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <Youtube className="h-4 w-4" />
                Subscribe on YouTube
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-vibrantPink" />
            <p className="text-gray-400 text-sm">Loading Mira's latest videos…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <AlertCircle className="h-10 w-10 text-gray-300" />
            <p className="text-gray-500 font-medium">Couldn't load videos right now</p>
            <p className="text-gray-400 text-sm max-w-sm">
              {(error as Error)?.message || "Please try again in a moment or visit the channel directly."}
            </p>
            <a
              href="https://www.youtube.com/@MiraSolis-fitness"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors mt-2"
            >
              <Youtube className="h-4 w-4" />
              Visit YouTube Channel
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) : !data?.videos?.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <Youtube className="h-12 w-12 text-gray-200" />
            <p className="text-gray-400 text-lg">No videos found</p>
            <a
              href="https://www.youtube.com/@MiraSolis-fitness"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skyBlue hover:underline text-sm"
            >
              Visit the channel on YouTube →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.videos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
