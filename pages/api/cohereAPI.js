import { CohereClient } from "cohere-ai";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} not Allowed`);
    return;
  }

  const { prompts, jobDescription } = body;

  if (
    !Array.isArray(prompts) ||
    prompts.length === 0 ||
    prompts.some((prompt) => !prompt.trim())
  ) {
    res
      .status(400)
      .json({ error: "Prompts must be provided in a non-empty array" });
    return;
  }
  if(!jobDescription || typeof jobDescription !== "string") {
    res.status(400).json({erorr: "Job description not provided as string"});
    return;
  }

  const cohere = new CohereClient({
    token: "RF4XtWf39euBZkjDASGCpCL47HATXboOCOVIsyWj",
  });

  const usedTechnologies = "";

  try {
    const maxTokensJob = 50;
    
    const generateJob = await cohere.generate({
        prompt: `Give me the key technologies and skills highlighted from this job description in only one or two words seperated by a comma: "${jobDescription}"`,
        model: "command-nightly",
        maxTokens: maxTokensJob,
        temperature: 0.9,
    });

    usedTechnologies = generateJob.generations[0].text;
  } catch(error) {
    console.log(error);
    res.status(500).json({error: "Error when retrieving job description technologies"});
  }

  try {
    const maxTokens = 100;
    const responses = [];

    for (const prompt of prompts) {
      const generate = await cohere.generate({
        prompt: `Use the provided software project description to generate tech resume bullet points for someone showcasing this project: "${prompt.trim()}" with 3 bullet points with a maximum of 15 words each in the style of a tech resume, highlight the key aspects of the project and omit any unnecessary details. Ensure a concise tech resume style, emphasizing the tech stack, user features, and project uniqueness. Highlight with one bullet point what the project is in less than 15 words, with the second bullet point highlight the technologies used in less than 15 words and with the third bullet point highlight something impressive about the project or another technology used in less than 15 words. Make sure to resemble that of a tech resume along with using third person and don't refer to the project. Start with & and a new line, then write bullet points with -, seperate the bullet points with a new line, end the generation with & at the end. Before starting the bullet points, start with an & and a new line, then write all three bullet points before ending with an & and new line. Space each bullet point with a new line. Cater bullet points and information to best fit the technologies highlighted for a job description provided here "${usedTechnologies}", making sure to include the technologies highlighted in the job description if they are in the project. Ensure no speculative data or content that is not explicitly mentioned in the project description is included.`,
        model: "command-nightly",
        maxTokens: maxTokens,
        temperature: 0.9,
      });

      responses.push(generate);
    }

    res.status(200).json(responses);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
