// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { runAnalysis } from "../../utils/analyzer";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const search = (req.query.search as string) || "";
  const results = await runAnalysis(search);
  res.status(200).json(results);
}
