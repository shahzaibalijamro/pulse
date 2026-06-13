import mongoose from "mongoose";
import { EventModel } from "../models/event.model.js";

function toObjectId(id: string) {
  return new mongoose.Types.ObjectId(id);
}

function baseMatch(siteId: string, workspaceId: string, startDate: Date, endDate: Date) {
  return {
    siteId: toObjectId(siteId),
    workspaceId: toObjectId(workspaceId),
    type: "pageview",
    timestamp: { $gte: startDate, $lte: endDate }
  };
}

export async function getPageviewsOverTime(
  siteId: string,
  workspaceId: string,
  startDate: Date,
  endDate: Date
) {
  return EventModel.aggregate([
    { $match: baseMatch(siteId, workspaceId, startDate, endDate) },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
        },
        pageviews: { $sum: 1 },
        sessions: { $addToSet: "$sessionHash" }
      }
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        pageviews: 1,
        visitors: { $size: "$sessions" }
      }
    },
    { $sort: { date: 1 } }
  ]);
}

export async function getTopPages(
  siteId: string,
  workspaceId: string,
  startDate: Date,
  endDate: Date,
  limit = 10
) {
  return EventModel.aggregate([
    { $match: baseMatch(siteId, workspaceId, startDate, endDate) },
    { $group: { _id: "$path", pageviews: { $sum: 1 } } },
    { $sort: { pageviews: -1 } },
    { $limit: limit },
    { $project: { _id: 0, path: "$_id", pageviews: 1 } }
  ]);
}

export async function getReferrers(
  siteId: string,
  workspaceId: string,
  startDate: Date,
  endDate: Date,
  limit = 10
) {
  return EventModel.aggregate([
    {
      $match: {
        ...baseMatch(siteId, workspaceId, startDate, endDate),
        referrerDomain: { $ne: null }
      }
    },
    { $group: { _id: "$referrerDomain", visits: { $sum: 1 } } },
    { $sort: { visits: -1 } },
    { $limit: limit },
    { $project: { _id: 0, referrer: "$_id", visits: 1 } }
  ]);
}

export async function getDeviceBreakdown(
  siteId: string,
  workspaceId: string,
  startDate: Date,
  endDate: Date
) {
  return EventModel.aggregate([
    { $match: baseMatch(siteId, workspaceId, startDate, endDate) },
    { $group: { _id: "$device", count: { $sum: 1 } } },
    { $project: { _id: 0, device: "$_id", count: 1 } },
    { $sort: { count: -1 } }
  ]);
}

export async function getCountryBreakdown(
  siteId: string,
  workspaceId: string,
  startDate: Date,
  endDate: Date,
  limit = 10
) {
  return EventModel.aggregate([
    { $match: baseMatch(siteId, workspaceId, startDate, endDate) },
    { $group: { _id: { country: "$country", code: "$countryCode" }, visits: { $sum: 1 } } },
    { $sort: { visits: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        country: "$_id.country",
        code: "$_id.code",
        visits: 1
      }
    }
  ]);
}

export async function getSummaryStats(
  siteId: string,
  workspaceId: string,
  startDate: Date,
  endDate: Date
) {
  const result = await EventModel.aggregate([
    { $match: baseMatch(siteId, workspaceId, startDate, endDate) },
    {
      $group: {
        _id: null,
        totalPageviews: { $sum: 1 },
        uniqueSessions: { $addToSet: "$sessionHash" },
        topCountries: { $push: "$country" },
        topBrowsers: { $push: "$browser" }
      }
    },
    {
      $project: {
        _id: 0,
        totalPageviews: 1,
        uniqueVisitors: { $size: "$uniqueSessions" }
      }
    }
  ]);

  return result[0] ?? { totalPageviews: 0, uniqueVisitors: 0 };
}

export async function getCampaigns(
  siteId: string,
  workspaceId: string,
  startDate: Date,
  endDate: Date,
  limit = 10
) {
  return EventModel.aggregate([
    {
      $match: {
        siteId: toObjectId(siteId),
        workspaceId: toObjectId(workspaceId),
        type: "pageview",
        timestamp: { $gte: startDate, $lte: endDate },
        "utm.source": { $ne: null }
      }
    },
    {
      $group: {
        _id: {
          source: "$utm.source",
          medium: "$utm.medium",
          campaign: "$utm.campaign"
        },
        visits: { $sum: 1 }
      }
    },
    { $sort: { visits: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        source: "$_id.source",
        medium: "$_id.medium",
        campaign: "$_id.campaign",
        visits: 1
      }
    }
  ]);
}

export async function getEngagement(
  siteId: string,
  workspaceId: string,
  startDate: Date,
  endDate: Date
) {
  const sessions = await EventModel.aggregate([
    {
      $match: {
        siteId: toObjectId(siteId),
        workspaceId: toObjectId(workspaceId),
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: "$sessionHash",
        eventCount: { $sum: 1 },
        sessionDuration: {
          $max: {
            $cond: [
              { $eq: ["$type", "session_end"] },
              "$properties.durationSeconds",
              0
            ]
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        bouncedSessions: {
          $sum: { $cond: [{ $eq: ["$eventCount", 1] }, 1, 0] }
        },
        avgSessionDuration: { $avg: "$sessionDuration" }
      }
    }
  ]);

  const res = sessions[0] || { totalSessions: 0, bouncedSessions: 0, avgSessionDuration: 0 };
  const bounceRate = res.totalSessions > 0 ? (res.bouncedSessions / res.totalSessions) * 100 : 0;
  
  return {
    bounceRate: Number(bounceRate.toFixed(2)),
    avgSessionDurationSeconds: Number((res.avgSessionDuration || 0).toFixed(1))
  };
}

export async function getBehavior(
  siteId: string,
  workspaceId: string,
  startDate: Date,
  endDate: Date
) {
  const scrolls = await EventModel.aggregate([
    {
      $match: {
        siteId: toObjectId(siteId),
        workspaceId: toObjectId(workspaceId),
        type: "scroll",
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: "$properties.depth",
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const outboundClicks = await EventModel.aggregate([
    {
      $match: {
        siteId: toObjectId(siteId),
        workspaceId: toObjectId(workspaceId),
        type: "click_outbound",
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: "$properties.linkUrl",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  return {
    scrolls: scrolls.map(s => ({ percentage: s._id, count: s.count })),
    outboundClicks: outboundClicks.map(c => ({ url: c._id, count: c.count }))
  };
}
