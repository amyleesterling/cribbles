import { Resend } from "resend";
import { generateDailyBoost } from "./openai";

// Lazy-init: don't crash at startup if key isn't set yet
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set in your .env file. Get a free key at https://resend.com");
  return new Resend(key);
}

const zenQuotes = [
  { quote: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
  { quote: "Almost everything will work again if you unplug it for a few minutes — including you.", author: "Anne Lamott" },
  { quote: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush" },
  { quote: "Within you there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse" },
  { quote: "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.", author: "Wayne Dyer" },
  { quote: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", author: "Oprah Winfrey" },
  { quote: "Your calm mind is the ultimate weapon against your challenges. So relax.", author: "Bryant McGill" },
  { quote: "Rest and be thankful.", author: "William Wordsworth" },
  { quote: "Almost everything will work again if you unplug it for a few minutes.", author: "Anne Lamott" },
  { quote: "Smile, breathe, and go slowly.", author: "Thich Nhat Hanh" },
];

const calmingImages = [
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=280&fit=crop&auto=format", alt: "Mountain sunrise" },
  { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=280&fit=crop&auto=format", alt: "Starry night sky" },
  { url: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=600&h=280&fit=crop&auto=format", alt: "Peaceful moon" },
  { url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=280&fit=crop&auto=format", alt: "Ocean waves" },
  { url: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=600&h=280&fit=crop&auto=format", alt: "Cozy evening" },
  { url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=280&fit=crop&auto=format", alt: "Gentle rain" },
  { url: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=600&h=280&fit=crop&auto=format", alt: "Peaceful rest" },
  { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=280&fit=crop&auto=format", alt: "Nature path" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function sendDailyCheckinEmail(params: {
  to: string;
  name: string;
}) {
  const quote = pickRandom(zenQuotes);
  const image = pickRandom(calmingImages);
  const greeting = getGreeting();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Get AI-generated wellness tip (fall back gracefully if OpenAI is unavailable)
  let tip = "Take one slow breath right now. In for 4 counts, out for 6. That's your whole practice for this moment.";
  try {
    const boost = await generateDailyBoost({
      name: params.name,
      recentMoods: [],
      preferences: undefined,
    });
    tip = boost.content;
  } catch {
    // Use fallback tip
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Daily Cribbles Check-in</title>
</head>
<body style="margin:0;padding:0;background-color:#FFF9F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF9F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo + date header -->
          <tr>
            <td style="padding-bottom:28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display:inline-block;width:28px;height:28px;background:linear-gradient(135deg,#7BDFFF 0%,#F593D2 100%);border-radius:7px;vertical-align:middle;margin-right:8px;"></span>
                    <span style="font-size:18px;font-weight:700;color:#2F2D30;vertical-align:middle;">Cribbles</span>
                  </td>
                  <td align="right">
                    <span style="font-size:12px;color:#9CA3AF;">${today}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#2F2D30;line-height:1.2;">${greeting}, ${params.name} ✨</h1>
              <p style="margin:8px 0 0;font-size:15px;color:#6B7280;">Here's your daily moment of calm.</p>
            </td>
          </tr>

          <!-- Hero image -->
          <tr>
            <td style="padding-bottom:24px;">
              <img
                src="${image.url}"
                alt="${image.alt}"
                width="560"
                style="width:100%;max-width:560px;height:auto;border-radius:16px;display:block;"
              />
            </td>
          </tr>

          <!-- Quote card -->
          <tr>
            <td style="padding-bottom:16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                style="background:#FFFFFF;border-radius:16px;border-left:4px solid #F593D2;padding:0;">
                <tr>
                  <td style="padding:22px 24px;">
                    <p style="margin:0 0 10px;font-size:16px;color:#374151;font-style:italic;line-height:1.65;">&ldquo;${quote.quote}&rdquo;</p>
                    <p style="margin:0;font-size:13px;color:#9CA3AF;">&mdash; ${quote.author}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Wellness tip card -->
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                style="background:#FFFFFF;border-radius:16px;border-left:4px solid #7BDFFF;padding:0;">
                <tr>
                  <td style="padding:22px 24px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:#7BDFFF;">Today's Wellness Tip</p>
                    <p style="margin:0;font-size:15px;color:#374151;line-height:1.65;">${tip}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA button -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${process.env.APP_URL || 'https://cribbles.ai'}"
                style="display:inline-block;background:linear-gradient(135deg,#7BDFFF 0%,#F593D2 100%);color:#FFFFFF;text-decoration:none;padding:13px 36px;border-radius:50px;font-size:15px;font-weight:600;">
                Open Cribbles &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="border-top:1px solid #E5E7EB;padding-top:20px;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
                You're receiving this because you subscribed to daily check-ins on Cribbles.<br/>
                One email per day. Unsubscribe anytime from the app.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return getResend().emails.send({
    from: "Cribbles <onboarding@resend.dev>", // update to noreply@cribbles.ai once domain is verified in Resend
    to: params.to,
    subject: `${greeting}, ${params.name} ✨ — your daily check-in`,
    html,
  });
}
