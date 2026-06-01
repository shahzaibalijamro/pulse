import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { SiteModel } from "../models/site.model.js";
import { createSiteSchema, siteIdParamSchema } from "../schemas/site.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createApiKey } from "../utils/crypto.js";
import { normalizeDomain } from "../utils/domain.js";
import { HttpError } from "../utils/httpError.js";

export const sitesRouter = Router();

sitesRouter.use(requireAuth);

sitesRouter.post(
  "/",
  validate(createSiteSchema),
  asyncHandler(async (req, res) => {
    const domain = normalizeDomain(req.body.domain);

    const existingSite = await SiteModel.findOne({
      workspaceId: req.auth!.workspaceId,
      domain
    }).lean();

    if (existingSite) {
      throw new HttpError(409, "This domain already exists in your workspace");
    }

    const site = await SiteModel.create({
      workspaceId: req.auth!.workspaceId,
      name: req.body.name,
      domain,
      apiKey: createApiKey()
    });

    res.status(201).json({ site: toSiteResponse(site) });
  })
);

sitesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const sites = await SiteModel.find({ workspaceId: req.auth!.workspaceId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ sites: sites.map(toSiteResponse) });
  })
);

sitesRouter.delete(
  "/:id",
  validate(siteIdParamSchema),
  asyncHandler(async (req, res) => {
    const site = await SiteModel.findOneAndDelete({
      _id: req.params.id,
      workspaceId: req.auth!.workspaceId
    }).lean();

    if (!site) {
      throw new HttpError(404, "Site not found");
    }

    res.status(204).send();
  })
);

function toSiteResponse(site: {
  _id: unknown;
  workspaceId: unknown;
  name: string;
  domain: string;
  apiKey: string;
  createdAt?: Date;
}) {
  return {
    id: String(site._id),
    workspaceId: String(site.workspaceId),
    name: site.name,
    domain: site.domain,
    apiKey: site.apiKey,
    createdAt: site.createdAt
  };
}
