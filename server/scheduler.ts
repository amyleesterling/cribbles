import cron from "node-cron";
import { storage } from "./storage";
import { sendDailyCheckinEmail } from "./email";
import { log } from "./vite";

// Parse "8:00 AM" / "12:00 PM" → { hour, minute } in 24h
function parseSubscriptionTime(timeStr: string): { hour: number; minute: number } {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return { hour: 8, minute: 0 };

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return { hour, minute };
}

// Track subscription IDs that already got an email today (resets at midnight)
const sentToday = new Set<number>();

export function startScheduler() {
  // Reset at midnight so people get their email each new day
  cron.schedule("0 0 * * *", () => {
    sentToday.clear();
    log("Scheduler: reset daily sent tracker");
  });

  // Check every minute whether any subscription is due
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    let allSubs: Awaited<ReturnType<typeof storage.getAllSubscriptions>>;
    try {
      allSubs = await storage.getAllSubscriptions();
    } catch {
      return;
    }

    for (const sub of allSubs) {
      // Only email channel is live; SMS/push coming soon
      if (sub.channel !== "email") continue;
      if (sentToday.has(sub.id)) continue;

      const { hour, minute } = parseSubscriptionTime(sub.time);
      if (currentHour !== hour || currentMinute !== minute) continue;

      try {
        const user = await storage.getUser(sub.userId);
        if (!user) continue;

        await sendDailyCheckinEmail({ to: sub.contact, name: user.name });
        sentToday.add(sub.id);
        log(`Daily check-in sent → ${sub.contact} (${sub.time})`);
      } catch (err) {
        log(`Failed to send check-in for sub #${sub.id}: ${err}`);
      }
    }
  });

  log("Daily check-in scheduler started ✓");
}
