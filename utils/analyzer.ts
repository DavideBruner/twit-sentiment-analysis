import twit from "twit";
import Sentiment from "sentiment";
import ObjectsToCsv from "objects-to-csv";
import path from "path";

const client = new twit({});

export function getListSentiments(list: any[]) {
  const sentiment = new Sentiment();
  const results = [];

  for (const item of list) {
    console.log(`Analyzing sentiment for: ${item}`);
    const { tokens, words, positive, negative, calculation, ...result } =
      sentiment.analyze(item);
    results.push({
      ...result,
      tokens: tokens.join(","),
      words: words.join(","),
      positive: positive.join(","),
      negative: negative.join(","),
      calculation: JSON.stringify(calculation),
    });
  }

  return results;
}

export async function runAnalysis(q: string, count = 100): Promise<any> {
  let params = { q, count };
  return new Promise((resolve, reject) =>
    client.get(
      "search/tweets",
      params,
      (err, data: { statuses?: any[] }, response) => {
        if (!err) {
          const tweets = data?.statuses?.map(({ text }) => text) || [];
          const result = getListSentiments(tweets);
          console.log("Results");
          resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );
}

function exportToCSV(data: any) {
  const csv = new ObjectsToCsv(data); // Save to file:
  const today = new Date().toISOString().slice(0, 10);
  const time = "";

  const fileName = path.join(process.cwd(), `${today}.csv`);
  csv.toDisk(fileName);
}
