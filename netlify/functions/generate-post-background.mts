// Netlify *background* function: returns 202 immediately and may run for up to 15 minutes.
// Writing a post can take longer than the 30 s a normal request gets.
import { runGenerationJob } from "../../src/lib/generation-job";

const generatePostBackground = async (req: Request) => {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn("generate-post-background: unauthorized");
    return;
  }
  const { jobId } = (await req.json().catch(() => ({}))) as { jobId?: string };
  if (!jobId) return;
  try {
    const result = await runGenerationJob(jobId);
    console.log("generate-post-background", jobId, JSON.stringify(result));
  } catch (e) {
    console.error("generate-post-background", jobId, e);
  }
};

export default generatePostBackground;
