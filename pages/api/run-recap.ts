// pages/api/run-recap.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { runRecap } from "@/lib/recap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET method allowed" });
  }

  await runRecap();
  res.status(200).json({ message: "Recap complete" });
}
