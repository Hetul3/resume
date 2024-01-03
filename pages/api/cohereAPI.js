import { CohereClient } from "cohere-ai";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} not Allowed`);
    return;
  }

  const { prompt } = body;

  
  if (!prompt || !prompt.trim()) {
    res.status(400).json({ error: "Prompt must be provided and non-empty" });
    return;
  }

  const cohere = new CohereClient({
    token: "RF4XtWf39euBZkjDASGCpCL47HATXboOCOVIsyWj", 
  });

  try {
    const maxTokens = 100;

    const generate = await cohere.generate({
      prompt:`Using this information about a tech project: "${prompt.trim()}" write 30 bullet points with each being no more than 15 words about the project, make the project sound impressive and resemble that of a tech resume. This means that it will highlight the relevant technologies used, use third-person. The generated text must be less than 80 tokens and it is important that the generated bullet points are less than 20 tokens each with an emphasis on conciseness. Before starting the bullet points, start with an & and new line, then write out all three bullet points before ending with a & and new line. Space each bullet point with a new line`,
      maxTokens: maxTokens,
      temperature: 0.9,
    });

    res.status(200).json(generate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
