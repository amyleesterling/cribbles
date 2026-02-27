import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Play, Dumbbell, Heart, Brain, Moon, Zap, X, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MotionDot from "@/components/ui/motion-dot";

const categories = [
  { id: "all", label: "All", icon: <Heart className="h-4 w-4" /> },
  { id: "mindfulness", label: "Mindfulness", icon: <Brain className="h-4 w-4" /> },
  { id: "movement", label: "Movement", icon: <Dumbbell className="h-4 w-4" /> },
  { id: "sleep", label: "Sleep", icon: <Moon className="h-4 w-4" /> },
  { id: "energy", label: "Energy", icon: <Zap className="h-4 w-4" /> },
  { id: "read", label: "Articles", icon: <BookOpen className="h-4 w-4" /> },
];

const resources = [
  {
    id: 1,
    title: "The 5-Minute Morning Reset",
    description: "Start your day with intention. This short breathwork sequence activates your nervous system gently before you check your phone.",
    type: "exercise",
    category: "mindfulness",
    tags: ["Breathwork", "Morning", "Stress Relief"],
    readTime: "5 min",
    color: "from-skyBlue/20 to-blue-100",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=240&fit=crop&auto=format",
    content: `**Before you open Instagram, try this.**

The first 5 minutes of your morning set the tone for everything that follows. Here's a simple sequence you can do before getting out of bed:

**1. Three conscious breaths (1 minute)**
As soon as you wake up, take three slow, deliberate breaths. Inhale for 4 counts, hold for 2, exhale for 6. This activates your parasympathetic nervous system — the "rest and digest" mode.

**2. Body scan (1 minute)**
Starting at the top of your head, slowly move your awareness down through your body. Notice tension without trying to fix it. Just observe.

**3. Set one intention (1 minute)**
Not a to-do list. One word or phrase for how you want to *feel* today. "Calm." "Focused." "Open." Say it out loud.

**4. Gratitude flash (2 minutes)**
Name three very specific things you're grateful for. Not "my family" — try "the way sunlight hit the kitchen table yesterday morning." Specificity makes it stick.

That's it. Five minutes. Do this consistently for a week and notice how it changes your mornings.`,
  },
  {
    id: 2,
    title: "Why Rest Is Productive",
    description: "Rest is not the absence of work — it's part of the work. The science of restoration and why doing nothing might be the most powerful thing you do.",
    type: "article",
    category: "mindfulness",
    tags: ["Rest", "Productivity", "Science"],
    readTime: "4 min read",
    color: "from-vibrantPink/10 to-pink-50",
    image: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=600&h=240&fit=crop&auto=format",
    content: `**We've been wrong about rest.**

Our culture treats rest as a reward for hard work, something you earn after you've done enough. But neuroscience tells a different story.

**The Default Mode Network**
When your brain appears to be "doing nothing," it's actually running its most important background processes. The default mode network — active during rest — is where you consolidate memories, make creative connections, process emotions, and build your sense of self. Interrupting rest with constant stimulation (scrolling, podcasts, ambient noise) prevents this essential maintenance from happening.

**The Sabbath Principle**
Across cultures and centuries, humans built rest into their week — not as indulgence, but as necessity. The logic wasn't moral. It was practical: fields left fallow become more fertile. Minds that rest become more capable.

**Productive rest vs. passive collapse**
There's a difference between restorative rest and numbing out. True rest involves low stimulation, reduced decision-making, and often some gentle physical presence — a walk, a bath, sitting in the sun. Scrolling social media is not rest. It's low-effort stimulation that keeps your brain's threat-detection systems active.

**The practice**
Schedule one 20-minute window per day with nothing. No podcast, no phone, no plans. Just you and whatever's around you. It will feel uncomfortable at first. That discomfort is data — it tells you how chronically overstimulated you've become.`,
  },
  {
    id: 3,
    title: "10-Minute Body Scan for Deep Sleep",
    description: "A guided body scan practice that signals to your brain it's safe to rest — and measurably improves sleep quality.",
    type: "video",
    category: "sleep",
    tags: ["Sleep", "Body Scan", "Relaxation"],
    readTime: "10 min",
    color: "from-purple-100 to-indigo-50",
    image: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=600&h=240&fit=crop&auto=format",
    content: `**The body scan: a practice, not a trick.**

Lie down comfortably. Close your eyes. This practice takes about 10 minutes and can be done in bed.

**The sequence:**

*Feet and toes (1 min)*
Bring your attention to the soles of your feet. Notice any sensations — warmth, tingling, contact with the sheets. Don't try to relax them. Just notice.

*Calves and shins (1 min)*
Move your awareness slowly up your legs. Notice the weight of your calves against the mattress.

*Knees and thighs (1 min)*
Notice the back of your knees. The heaviness of your thighs. Let them sink.

*Hips and lower back (1 min)*
Many people hold chronic tension here without realizing it. Just acknowledge it.

*Belly and chest (2 min)*
Notice the rise and fall with each breath. Let your belly be soft. You don't need to hold it in.

*Shoulders and arms (2 min)*
Let your shoulders drop away from your ears. Feel the weight of your arms. Release your hands.

*Face and head (2 min)*
Unclench your jaw. Let your tongue drop from the roof of your mouth. Soften the space between your eyebrows.

When you reach the top of your head, take three deep breaths, and allow your body to be completely heavy.

Most people who practice this regularly fall asleep before they finish. That's the goal.`,
  },
  {
    id: 4,
    title: "Movement Snacks: 2-Minute Desk Breaks",
    description: "Micro-movement breaks that reset your posture, boost circulation, and lift your mood — no gym required.",
    type: "exercise",
    category: "movement",
    tags: ["Movement", "Energy", "Desk"],
    readTime: "2 min",
    color: "from-green-100 to-emerald-50",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=240&fit=crop&auto=format",
    content: `**You don't need 30 minutes. You need 2, repeated.**

Research from the University of Colorado found that 5-minute walks every hour were more effective at improving mood and energy than a single 30-minute workout. The key insight: movement *distributed* through the day matters more than movement concentrated in one block.

**5 movement snacks to try:**

**1. The Shoulder Opener (30 sec)**
Interlace your fingers behind your back, straighten your arms, and gently lift them while opening your chest. Breathe. This undoes hours of forward-hunching in seconds.

**2. Hip Flexor Release (1 min)**
Step one foot forward into a lunge, drop your back knee to the ground (or stay standing). Press your hips forward gently. Hold 30 seconds each side. The hip flexors shorten dramatically when seated — this reverses that.

**3. Eye Reset (20 sec)**
Look at something at least 20 feet away for 20 seconds. This relaxes the ciliary muscles in your eyes that work hard to focus on a screen.

**4. Neck Rolls (30 sec)**
Slowly drop your right ear to your right shoulder, hold, then roll your chin to your chest, then left. Never roll your head backward — it compresses the cervical spine.

**5. Shake it out (30 sec)**
Stand up and literally shake your hands, arms, and legs for 30 seconds. This sounds silly. It works. It discharges accumulated physical tension and is one of the fastest ways to shift your state.

Set a timer for every 90 minutes. When it goes off, do one of these. That's it.`,
  },
  {
    id: 5,
    title: "The Science of Awe",
    description: "Awe experiences measurably lower inflammation, increase generosity, and expand your sense of time. Here's how to cultivate more of it.",
    type: "article",
    category: "energy",
    tags: ["Awe", "Nature", "Wellbeing"],
    readTime: "6 min read",
    color: "from-goldenYellow/20 to-yellow-50",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=240&fit=crop&auto=format",
    content: `**Awe is not just a nice feeling. It's a biological reset.**

Dacher Keltner at UC Berkeley has spent two decades studying awe — that feeling of encountering something vast, beyond your current understanding. Mountains. Great music. A truly generous act. The night sky.

What he found surprised everyone.

**What awe does to your body:**
- Reduces pro-inflammatory cytokines (the same molecules linked to depression and chronic disease)
- Activates the vagus nerve, improving heart rate variability
- Shifts attention from self-focused rumination to the broader world
- Measurably expands your subjective sense of time — awe makes you feel like you have more of it

**What triggers awe:**
Keltner identifies two core features: *vastness* (something bigger than your current frame) and *accommodation* (your mind has to stretch to take it in). This doesn't require a trip to the Grand Canyon.

Standing under a very tall tree. Looking at time-lapse videos of galaxies. Reading a poem that says something true you'd never quite put into words. Watching a master craftsperson work.

**The awe walk**
One practice with strong evidence: a 15-minute "awe walk" taken weekly. The rules are simple — walk slowly, look for something you've never noticed before, and let yourself be genuinely curious. Participants in studies report significant increases in wellbeing, decreases in anxiety, and a stronger sense of connection to others — after just one week.

This week, try one awe walk. Leave your headphones at home.`,
  },
  {
    id: 6,
    title: "Emotional Regulation: The RAIN Technique",
    description: "Recognize, Allow, Investigate, Nurture — a four-step approach to move through difficult emotions without getting stuck.",
    type: "article",
    category: "mindfulness",
    tags: ["Emotions", "RAIN", "Self-compassion"],
    readTime: "5 min read",
    color: "from-skyBlue/10 to-teal-50",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=240&fit=crop&auto=format",
    content: `**Emotions aren't problems to fix. They're signals to understand.**

RAIN is a mindfulness-based technique developed by Michelle McDonald and popularized by Tara Brach. It's designed for moments when you're caught in a difficult emotion — anxiety, anger, shame, loneliness — and you can't seem to think your way out.

**R — Recognize**
Pause and name what you're experiencing. "There is fear here." "I notice anger." Not "I am angry" — that fuses your identity with the emotion. "There is anger" creates just enough space to work with it.

**A — Allow**
Let the emotion be there, without trying to fix, suppress, or immediately act on it. This is the hardest step. We're trained to make discomfort go away. Allow means: "I don't have to like this, but I can let it exist for now."

**I — Investigate**
With gentle curiosity, explore the emotion in your body. Where do you feel it? What does it feel like — tight, heavy, hot, hollow? What belief is underneath it? What does this part of you most need? Don't analyze. Just explore.

**N — Nurture**
Offer yourself what you'd offer a friend going through the same thing. A hand on your chest. A gentle inner voice: "This is hard. It makes sense you feel this way." The nurture step isn't about bypassing the emotion — it's about meeting yourself with compassion while it moves through.

RAIN takes about 5 minutes when practiced intentionally. Over time, it becomes instinctive — a way of being with your emotional life rather than being run by it.`,
  },
  {
    id: 7,
    title: "Cold Water Reset",
    description: "30 seconds of cold water on your face activates the mammalian dive reflex — instantly slowing your heart and calming anxiety.",
    type: "exercise",
    category: "energy",
    tags: ["Anxiety", "Quick Fix", "Body"],
    readTime: "1 min",
    color: "from-blue-100 to-cyan-50",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=240&fit=crop&auto=format",
    content: `**When anxiety spikes and you need relief in under a minute.**

This isn't a wellness trend. It's basic physiology.

**The mammalian dive reflex** is an automatic nervous system response present in all mammals. When cold water contacts your face — especially around the eyes, nose, and cheeks — your heart rate drops by 10–25%, blood flow redistributes away from your extremities, and your parasympathetic nervous system activates almost immediately.

It's the same reflex that allows humans to survive brief submersions in cold water. You can trigger it safely at home.

**How to do it:**

Fill a bowl with cold water (add ice if available). Take a breath, hold it, and submerge your face for 15–30 seconds. Or simply splash cold water on your face and forehead repeatedly for 30 seconds.

**When to use it:**
- Before a difficult conversation
- When anxiety is escalating
- Mid-panic attack (the physiological response interrupts the spiral)
- When you feel flooded by emotion and can't think clearly

**Why it works so fast:** Unlike breathing techniques or meditation, which work through the mind to affect the body, cold water works directly on the nervous system. It bypasses your thinking brain entirely. This makes it especially useful when anxiety is so high that you can't focus on a meditation practice.

One caveat: if you have a heart condition, check with your doctor first. The heart rate drop is significant.`,
  },
  {
    id: 8,
    title: "How to Actually Wind Down Before Bed",
    description: "The 90 minutes before sleep matter more than any supplement. A step-by-step protocol backed by sleep research — and actually doable.",
    type: "article",
    category: "sleep",
    tags: ["Sleep Hygiene", "Routine", "Evening"],
    readTime: "7 min read",
    color: "from-indigo-100 to-purple-50",
    image: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=600&h=240&fit=crop&auto=format",
    content: `**The hour before bed is the most important hour of your day.**

According to sleep researcher Matthew Walker, the quality of your sleep is largely determined by what you do in the 90 minutes before you try to sleep. Here's what the science says — and what actually works.

**Lower the lights (90 min before bed)**
Your brain reads light through your retinas to set your circadian clock. Bright overhead lights signal "midday" to your brain and suppress melatonin production. Dim your lights, use warm (orange/red spectrum) lamps, and if you use screens, enable night mode.

**Stop eating 2–3 hours before bed**
Digestion raises your core body temperature. Sleep requires your core temperature to *drop* by 1–2°F. Eating late keeps your body in a metabolic state that's incompatible with deep sleep.

**The phone boundary**
This one is non-negotiable if you want quality sleep. Not just because of blue light, but because email, social media, and news all trigger cortisol — your stress hormone. Cortisol has a half-life of around 90 minutes. Checking your phone at 10pm means you have elevated cortisol at midnight. Charge it in another room.

**The transition ritual**
You can't go from full-speed to sleep. You need a transition. It doesn't have to be elaborate: 10 minutes of light stretching, a warm shower or bath (the subsequent cooling triggers sleep), herbal tea, or reading a physical book (not an e-reader).

**Write tomorrow's list tonight**
The "cognitive shuffle" — brain can't stop planning? Write your to-do list for tomorrow before bed. Studies show this reduces middle-of-the-night problem-solving by giving your brain permission to let go.

**Temperature**
The ideal sleep temperature is 65–68°F (18–20°C). If you can't control your room temperature, a warm bath followed by a cool bedroom works well — the bath causes a post-soak temperature drop that mimics what your body does naturally at sleep onset.

None of this is complicated. The hard part is protecting the habit when everything else feels urgent.`,
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  article: <BookOpen className="h-3.5 w-3.5" />,
  video: <Play className="h-3.5 w-3.5" />,
  exercise: <Dumbbell className="h-3.5 w-3.5" />,
};

type Resource = (typeof resources)[number];

function ArticleModal({ resource, onClose }: { resource: Resource; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <motion.div
          className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero image */}
          <div className="relative h-48 shrink-0 overflow-hidden">
            <img
              src={resource.image}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1">
                {typeIcons[resource.type]}
                <span className="capitalize">{resource.type}</span>
                <span>·</span>
                <Clock className="h-3 w-3" />
                <span>{resource.readTime}</span>
              </div>
              <h2 className="text-white font-bold text-xl leading-snug">{resource.title}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-6">
            <div className="flex flex-wrap gap-1.5 mb-5">
              {resource.tags.map((tag) => (
                <span key={tag} className="text-xs bg-skyBlue/10 text-skyBlue px-2 py-0.5 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              {resource.content.split("\n\n").map((block, i) => {
                // Bold headers with **
                const rendered = block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                // Italic with *
                const renderedItalic = rendered.replace(/\*(.*?)\*/g, "<em>$1</em>");
                return (
                  <p
                    key={i}
                    className="mb-4 last:mb-0"
                    dangerouslySetInnerHTML={{ __html: renderedItalic }}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function WellnessLibrary() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState<Resource | null>(null);

  const filtered = resources.filter((r) => {
    const matchesCategory = activeCategory === "all" || r.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <MotionDot />
          <h1 className="font-bold text-2xl md:text-3xl ml-2 text-darkGray">Wellness Library</h1>
        </div>
        <p className="text-gray-500 ml-6">Short, science-backed reads and practices — built for real life.</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search articles, exercises, topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-skyBlue/20 focus:border-skyBlue"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-skyBlue text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-skyBlue/40 hover:bg-softBlue"
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No results for "{search}"</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((resource, i) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelected(resource)}
            >
              <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 overflow-hidden">
                {/* Cover image */}
                <div className="h-40 overflow-hidden">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className={`p-5 bg-gradient-to-br ${resource.color}`}>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-2">
                    {typeIcons[resource.type]}
                    <span className="capitalize">{resource.type}</span>
                    <span className="mx-1">·</span>
                    <Clock className="h-3 w-3" />
                    <span>{resource.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-darkGray mb-2 leading-snug">{resource.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{resource.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {resource.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-white/60 text-gray-600 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Article modal */}
      {selected && (
        <ArticleModal resource={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
