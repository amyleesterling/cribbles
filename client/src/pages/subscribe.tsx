import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, MessageSquare, Mail, Check, Sparkles, Quote, Leaf, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import MotionDot from "@/components/ui/motion-dot";
import { type User } from "@shared/schema";

type ChannelType = "email" | "sms" | "push";

const channels: { id: ChannelType; label: string; description: string; icon: React.ReactNode; placeholder: string }[] = [
  {
    id: "email",
    label: "Email",
    description: "Get a daily wellness check-in delivered to your inbox each morning.",
    icon: <Mail className="h-5 w-5" />,
    placeholder: "you@example.com",
  },
  {
    id: "sms",
    label: "Text message",
    description: "A short daily nudge sent straight to your phone. No apps needed.",
    icon: <MessageSquare className="h-5 w-5" />,
    placeholder: "+1 (555) 000-0000",
  },
  {
    id: "push",
    label: "Push notification",
    description: "Browser notifications — no personal info required.",
    icon: <Bell className="h-5 w-5" />,
    placeholder: "",
  },
];

const times = ["7:00 AM", "8:00 AM", "9:00 AM", "12:00 PM", "5:00 PM", "8:00 PM"];

// Sample preview data rotating by day
const previewSamples = [
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop&auto=format",
    quote: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    author: "Thich Nhat Hanh",
    tip: "Take one mindful breath before you check your phone this morning. That single pause is the foundation of everything.",
  },
  {
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=300&fit=crop&auto=format",
    quote: "Almost everything will work again if you unplug it for a few minutes — including you.",
    author: "Anne Lamott",
    tip: "Schedule one 10-minute block today with no tasks, no screen, no input. Just you and the air around you.",
  },
  {
    image: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=600&h=300&fit=crop&auto=format",
    quote: "You are allowed to be both a masterpiece and a work in progress simultaneously.",
    author: "Sophia Bush",
    tip: "Write down one thing you handled well yesterday. Not perfectly — just well. That counts.",
  },
];

function CheckinPreview() {
  const today = new Date().getDate();
  const sample = previewSamples[today % previewSamples.length];

  return (
    <div className="rounded-2xl overflow-hidden border border-skyBlue/20 bg-white shadow-sm">
      <div className="relative h-40 overflow-hidden">
        <img src={sample.image} alt="Daily inspiration" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute top-3 left-3 text-xs bg-white/20 text-white backdrop-blur-sm px-2.5 py-1 rounded-full font-medium">
          Today's Check-in Preview
        </span>
      </div>
      <div className="p-5 space-y-4">
        {/* Quote */}
        <div className="flex gap-3">
          <Quote className="h-4 w-4 text-vibrantPink shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-700 italic leading-relaxed">"{sample.quote}"</p>
            <p className="text-xs text-gray-400 mt-1">— {sample.author}</p>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-100" />
        {/* Wellness tip */}
        <div className="flex gap-3">
          <Leaf className="h-4 w-4 text-skyBlue shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 leading-relaxed">{sample.tip}</p>
        </div>
      </div>
    </div>
  );
}

export default function Subscribe() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>("email");
  const [contact, setContact] = useState("");
  const [selectedTime, setSelectedTime] = useState("8:00 AM");
  const [success, setSuccess] = useState(false);

  const { data: user } = useQuery<Omit<User, "password">>({
    queryKey: ["/api/users/me"],
  });

  const { data: existing } = useQuery<{ channel: string; contact: string; time: string } | null>({
    queryKey: ["/api/subscriptions/me"],
  });

  // Pre-fill phone when user switches to SMS and has a saved number
  useEffect(() => {
    if (selectedChannel === "sms" && !contact && (user as any)?.phone) {
      setContact((user as any).phone);
    }
  }, [selectedChannel, user]);

  const subscribe = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/subscriptions", {
        channel: selectedChannel,
        contact: selectedChannel === "push" ? "browser" : contact,
        time: selectedTime,
      });
    },
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/me"] });
    },
  });

  const unsubscribe = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/subscriptions/me", {});
    },
    onSuccess: () => {
      setSuccess(false);
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/me"] });
    },
  });

  const testSend = useMutation({
    mutationFn: async () => apiRequest("POST", "/api/subscriptions/test-send", {}),
    onSuccess: () => alert("✅ Test email sent! Check your inbox."),
    onError: (e: any) => alert(`❌ ${e?.message || "Failed to send. Check your RESEND_API_KEY."}`),
  });

  const channel = channels.find((c) => c.id === selectedChannel)!;
  const isSubscribed = !!existing;
  const activeChannel = existing?.channel ?? selectedChannel;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-xl">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <MotionDot />
          <h1 className="font-bold text-2xl md:text-3xl ml-2 text-darkGray">Daily Check-in</h1>
        </div>
        <p className="text-gray-500 ml-6">A zen quote, a beautiful image, and a wellness tip — delivered to you every day.</p>
      </div>

      {/* Preview — always visible */}
      <div className="mb-6">
        <CheckinPreview />
      </div>

      {(isSubscribed || success) ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="bg-gradient-to-br from-skyBlue/10 to-vibrantPink/10 border-skyBlue/20">
            <CardContent className="p-8 text-center">
              <div className="w-14 h-14 rounded-full cribbles-gradient flex items-center justify-center mx-auto mb-4">
                <Check className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-bold text-xl text-darkGray mb-2">You're subscribed!</h2>
              <p className="text-gray-500 mb-1">
                {existing
                  ? `Daily check-in via ${existing.channel} at ${existing.time}`
                  : `Daily check-in via ${selectedChannel} at ${selectedTime}`}
              </p>
              <p className="text-sm text-gray-500 mb-1">Each day you'll get:</p>
              <ul className="text-sm text-gray-500 mb-4 space-y-1">
                <li>✦ A beautiful, calming image</li>
                <li>✦ A zen quote to carry with you</li>
                <li>✦ One personalized wellness tip</li>
              </ul>
              <p className="text-xs text-gray-400 mb-6">
                {activeChannel === "sms"
                  ? "SMS delivery coming soon — we'll notify you when it's live."
                  : activeChannel === "push"
                  ? "Push notifications coming soon — we'll enable them in your next update."
                  : "We'll send your first email tomorrow morning."}
              </p>
              <div className="flex flex-col gap-2 items-center">
                <Button
                  onClick={() => testSend.mutate()}
                  disabled={testSend.isPending || activeChannel !== "email"}
                  className="bg-skyBlue hover:bg-skyBlue/90 text-white"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {testSend.isPending ? "Sending..." : "Send me a test email now"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => unsubscribe.mutate()}
                  disabled={unsubscribe.isPending}
                  className="border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-300 text-sm"
                >
                  Unsubscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-5">
          {/* Channel picker */}
          <div>
            <p className="text-sm font-medium text-darkGray mb-3">How do you want to receive it?</p>
            <div className="space-y-3">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                    selectedChannel === ch.id
                      ? "border-skyBlue bg-skyBlue/5"
                      : "border-gray-200 bg-white hover:border-skyBlue/30"
                  }`}
                >
                  <div className={`mt-0.5 ${selectedChannel === ch.id ? "text-skyBlue" : "text-gray-400"}`}>
                    {ch.icon}
                  </div>
                  <div>
                    <p className="font-medium text-darkGray">{ch.label}</p>
                    <p className="text-sm text-gray-500">{ch.description}</p>
                  </div>
                  {selectedChannel === ch.id && (
                    <Check className="ml-auto mt-0.5 h-4 w-4 text-skyBlue shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Contact input */}
          {selectedChannel !== "push" && (
            <div>
              <p className="text-sm font-medium text-darkGray mb-2">
                {selectedChannel === "email" ? "Your email address" : "Your phone number"}
              </p>
              <Input
                type={selectedChannel === "email" ? "email" : "tel"}
                placeholder={channel.placeholder}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="bg-white border-skyBlue/20 focus:border-skyBlue"
              />
            </div>
          )}

          {/* Time picker */}
          <div>
            <p className="text-sm font-medium text-darkGray mb-3">What time each day?</p>
            <div className="flex flex-wrap gap-2">
              {times.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selectedTime === t
                      ? "bg-skyBlue text-white border-skyBlue"
                      : "bg-white text-gray-600 border-gray-200 hover:border-skyBlue/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={() => subscribe.mutate()}
            disabled={
              subscribe.isPending ||
              (selectedChannel !== "push" && !contact.trim())
            }
            className="w-full bg-skyBlue hover:bg-skyBlue/90 text-white h-11"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {subscribe.isPending ? "Subscribing..." : "Subscribe to daily check-in"}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            No spam. One short message per day. Unsubscribe anytime.
          </p>
        </div>
      )}
    </div>
  );
}
