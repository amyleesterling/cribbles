import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, X, Wand2, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import MotionDot from "@/components/ui/motion-dot";

const VIBE_PROMPTS = [
  "A misty mountain lake at sunrise with soft pink clouds",
  "Cherry blossoms drifting in a peaceful Japanese garden",
  "Golden hour light filtering through an ancient forest",
  "A calm ocean cove with turquoise water and smooth stones",
  "A cozy reading nook bathed in warm afternoon light",
  "Lavender fields stretching to the horizon at dusk",
  "A single candle flame reflected in still water",
  "Gentle snow falling on a pine forest at night",
];

type InspirationImage = {
  id: number;
  userId: number;
  prompt: string;
  imageUrl: string;
  vibe: string;
  createdAt: string;
};

function ImageModal({ image, onClose }: { image: InspirationImage; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
          <img
            src={image.imageUrl}
            alt={image.prompt}
            className="w-full aspect-square object-cover"
          />
          <div className="p-4">
            <p className="text-sm text-gray-500 italic">"{image.prompt}"</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(image.createdAt).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric"
              })}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function WellnessLibrary() {
  const [prompt, setPrompt] = useState("");
  const [selectedImage, setSelectedImage] = useState<InspirationImage | null>(null);
  const [activeTab, setActiveTab] = useState<"community" | "mine">("community");
  const queryClient = useQueryClient();

  const { data: communityImages = [], isLoading: communityLoading } = useQuery<InspirationImage[]>({
    queryKey: ["/api/inspiration/all"],
    queryFn: () => fetch("/api/inspiration/all").then(r => r.json()),
  });

  const { data: myImages = [], isLoading: myLoading } = useQuery<InspirationImage[]>({
    queryKey: ["/api/inspiration"],
    queryFn: () => fetch("/api/inspiration").then(r => r.json()),
  });

  const generateMutation = useMutation({
    mutationFn: async (userPrompt: string) => {
      const res = await fetch("/api/inspiration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt, vibe: "zen" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to generate image");
      }
      return res.json() as Promise<InspirationImage>;
    },
    onSuccess: (newImage) => {
      queryClient.invalidateQueries({ queryKey: ["/api/inspiration/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inspiration"] });
      setSelectedImage(newImage);
      setPrompt("");
    },
  });

  const handleGenerate = () => {
    const finalPrompt = prompt.trim() || VIBE_PROMPTS[Math.floor(Math.random() * VIBE_PROMPTS.length)];
    generateMutation.mutate(finalPrompt);
  };

  const displayImages = activeTab === "community" ? communityImages : myImages;
  const isLoading = activeTab === "community" ? communityLoading : myLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-softBlue via-white to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <MotionDot />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Zen Gallery</span>
          </div>
          <h1 className="text-3xl font-bold text-darkGray">Wellness Library</h1>
          <p className="text-gray-500 mt-1">Generate and share zen images with the community</p>
        </div>

        {/* Generate Card */}
        <Card className="p-5 mb-8 border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="h-5 w-5 text-vibrantPink" />
            <span className="font-semibold text-darkGray">Create a Zen Image</span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Describe your vision… or leave blank for a surprise ✨"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !generateMutation.isPending && handleGenerate()}
              className="flex-1 border-gray-200 focus:border-vibrantPink"
              disabled={generateMutation.isPending}
            />
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="cribbles-gradient text-white border-0 px-5"
            >
              {generateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>
          {generateMutation.isPending && (
            <motion.p
              className="text-sm text-gray-400 mt-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Creating your zen image… this takes about 10 seconds ✨
            </motion.p>
          )}
          {generateMutation.isError && (
            <p className="text-sm text-red-400 mt-2">{(generateMutation.error as Error).message}</p>
          )}
          {/* Prompt suggestions */}
          <div className="flex flex-wrap gap-2 mt-3">
            {VIBE_PROMPTS.slice(0, 4).map(p => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="text-xs px-2.5 py-1 rounded-full bg-softBlue text-skyBlue hover:bg-skyBlue/20 transition-colors"
              >
                {p.split(" ").slice(0, 4).join(" ")}…
              </button>
            ))}
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/60 rounded-xl p-1 w-fit">
          {(["community", "mine"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-white shadow text-darkGray"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === "community" ? "Community Gallery" : "My Images"}
              {tab === "community" && communityImages.length > 0 && (
                <span className="ml-1.5 text-xs bg-vibrantPink/20 text-vibrantPink px-1.5 py-0.5 rounded-full">
                  {communityImages.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-vibrantPink" />
          </div>
        ) : displayImages.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ImageIcon className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-lg">No images yet</p>
            <p className="text-gray-300 text-sm mt-1">
              {activeTab === "mine"
                ? "Generate your first zen image above!"
                : "Be the first to create something beautiful ✨"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
            layout
          >
            <AnimatePresence>
              {displayImages.map((image, i) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.prompt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-xs line-clamp-2">{image.prompt}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}
