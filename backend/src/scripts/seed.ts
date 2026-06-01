import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectMongo, disconnectMongo } from "../config/database.js";
import { disconnectRedis } from "../config/redis.js";
import { EventModel } from "../models/event.model.js";
import { SiteModel } from "../models/site.model.js";
import { UserModel } from "../models/user.model.js";
import { WorkspaceModel } from "../models/workspace.model.js";
import { createApiKey, createDailySessionHash } from "../utils/crypto.js";

const demoEmail = "demo@pulse.dev";
const demoPassword = "password123";

async function seed() {
  await connectMongo();

  await Promise.all([
    EventModel.deleteMany({}),
    SiteModel.deleteMany({}),
    UserModel.deleteMany({}),
    WorkspaceModel.deleteMany({})
  ]);

  const userId = new mongoose.Types.ObjectId();
  const workspaceId = new mongoose.Types.ObjectId();
  const siteId = new mongoose.Types.ObjectId();

  await WorkspaceModel.create({
    _id: workspaceId,
    name: "Pulse Demo Workspace",
    ownerId: userId,
    plan: "free"
  });

  await UserModel.create({
    _id: userId,
    email: demoEmail,
    passwordHash: await bcrypt.hash(demoPassword, 12),
    workspaceId
  });

  const site = await SiteModel.create({
    _id: siteId,
    workspaceId,
    name: "Demo Portfolio",
    domain: "example.com",
    apiKey: createApiKey()
  });

  const paths = ["/", "/pricing", "/blog/pulse-build", "/contact", "/projects"];
  const referrers = [null, "https://google.com/search?q=analytics", "https://github.com", "https://linkedin.com"];
  const countries = [
    { country: "Pakistan", countryCode: "PK" },
    { country: "United States", countryCode: "US" },
    { country: "United Kingdom", countryCode: "GB" },
    { country: "Germany", countryCode: "DE" }
  ];
  const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
  const devices = ["desktop", "mobile", "tablet"] as const;

  const events = Array.from({ length: 500 }, (_, index) => {
    const timestamp = randomDateWithinLast30Days();
    const path = paths[index % paths.length];
    const geo = countries[index % countries.length];
    const userAgent = `seed-agent-${index % 80}`;

    return {
      siteId,
      workspaceId,
      type: "pageview",
      url: `https://example.com${path}`,
      path,
      referrer: referrers[index % referrers.length],
      referrerDomain: referrers[index % referrers.length]
        ? new URL(referrers[index % referrers.length]!).hostname
        : null,
      browser: browsers[index % browsers.length],
      os: index % 2 === 0 ? "Windows" : "macOS",
      device: devices[index % devices.length],
      country: geo.country,
      countryCode: geo.countryCode,
      sessionHash: createDailySessionHash(`203.0.113.${index % 100}`, userAgent, timestamp),
      eventName: null,
      properties: {},
      timestamp
    };
  });

  await EventModel.insertMany(events);

  console.log("Pulse demo data created");
  console.log(`Email: ${demoEmail}`);
  console.log(`Password: ${demoPassword}`);
  console.log(`Site ID: ${site._id.toString()}`);
  console.log(`API key: ${site.apiKey}`);

  await disconnectMongo();
  await disconnectRedis().catch(() => undefined);
}

function randomDateWithinLast30Days() {
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return new Date(now - Math.floor(Math.random() * thirtyDays));
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
