// Netlify *background* function (name ends in "-background"): returns 202 immediately and may
// run for up to 15 minutes, so large albums and Instagram processing aren't cut off.
import { publishPostById } from "../../src/lib/publish/run";

const publishPostBackground = async (req: Request) => {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn("publish-post-background: unauthorized");
    return;
  }
  const { postIds } = (await req.json().catch(() => ({}))) as { postIds?: string[] };
  for (const id of postIds ?? []) {
    try {
      const result = await publishPostById(id);
      console.log("publish-post-background", id, JSON.stringify(result));
    } catch (e) {
      console.error("publish-post-background", id, e);
    }
  }
};

export default publishPostBackground;
