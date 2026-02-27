import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles, ImageIcon, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import MotionDot from "@/components/ui/motion-dot";
import type { InspirationImage } from "@shared/schema";

export default function WonderLibrary() {
  const { data: images, isLoading } = useQuery<InspirationImage[]>({
    queryKey: ["/api/inspiration/gallery"],
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <MotionDot />
          <h1 className="font-bold text-2xl md:text-3xl ml-2 text-darkGray">Wonder Library</h1>
        </div>
        <p className="text-gray-500 ml-6">Your collection of AI-generated images. Each one made by you.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      ) : !images || images.length === 0 ? (
        <Card className="border-dashed border-2 border-skyBlue/30 bg-softBlue/30">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full cribbles-gradient flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-semibold text-lg text-darkGray mb-2">Nothing here yet!</h2>
            <p className="text-gray-500 mb-6 max-w-sm">
              Head over to Visual Inspiration to generate your first AI image. It'll show up here once you create one.
            </p>
            <Link href="/visual-inspiration">
              <Button className="bg-skyBlue hover:bg-skyBlue/90 text-white">
                <Sparkles className="mr-2 h-4 w-4" /> Generate an Image
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">{images.length} image{images.length !== 1 ? "s" : ""} created</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100 shadow-sm"
              >
                <img
                  src={img.imageUrl}
                  alt={img.prompt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                  <p className="text-white text-xs line-clamp-2 mb-2">{img.prompt}</p>
                  <a
                    href={img.imageUrl}
                    download
                    className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download className="h-3 w-3" /> Save
                  </a>
                </div>
                {img.vibe && (
                  <span className="absolute top-2 right-2 bg-black/30 text-white text-xs px-2 py-0.5 rounded-full">
                    {img.vibe}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
