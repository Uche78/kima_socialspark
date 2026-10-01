import type { Config } from "@netlify/functions";

// Runs every 5 minutes and asks the app to publish any posts that are due.
const publishScheduled = async () => {
  const site = process.env.URL;
  const res = await fetch(`${site}/api/cron/publish-due`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
  });
  console.log("publish-due", res.status, await res.text());
};

export default publishScheduled;

export const config: Config = { schedule: "*/5 * * * *" };
