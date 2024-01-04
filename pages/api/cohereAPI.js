import { CohereClient } from "cohere-ai";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} not Allowed`);
    return;
  }

  const { prompts, jobDescription, experience } = body;

  if (
    !Array.isArray(prompts) ||
    prompts.length === 0 ||
    prompts.some((prompt) => !prompt.trim()) ||
    !Array.isArray(experience) ||
    experience.length === 0 ||
    experience.some((exp) => !exp.trim())
  ) {
    res
      .status(400)
      .json({ error: "Prompts must be provided in a non-empty array" });
    return;
  }
  if (!jobDescription || typeof jobDescription !== "string") {
    res.status(400).json({ erorr: "Job description not provided as string" });
    return;
  }

  const cohere = new CohereClient({
    token: "RF4XtWf39euBZkjDASGCpCL47HATXboOCOVIsyWj",
  });

  let usedTechnologies = "";

  try {
    const maxTokensJob = 50;

    const generateJob = await cohere.generate({
      prompt: `Give me the key technologies and skills highlighted from this job description in only one or two words seperated by a comma: "${jobDescription}"`,
      model: "command-nightly",
      maxTokens: maxTokensJob,
      temperature: 0.9,
    });

    usedTechnologies = generateJob.generations[0].text;
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error when retrieving job description technologies" });
  }

  const result = {
    prompts: [],
    experience: [],
  };

  try {
    const maxTokens = 100;

    const promptsGeneration = prompts.map(async (prompt) => {
      const generate = await cohere.generate({
        prompt: `Use the provided software project description to generate tech resume bullet points for someone showcasing this project on their resume: "${prompt.trim()}". Generate 3 bullet points with a maximum of 15 words each in the style of a tech resume, highlight the key aspects of the project and omit any unnecessary details. Ensure a concise tech resume style, emphasizing the tech stack, user features, and project uniqueness. Highlight with one bullet point what the project is in less than 15 words, with the second bullet point highlight the technologies used in less than 15 words and with the third bullet point highlight something impressive about the project or another technology used in less than 15 words. Make sure to resemble the result to that of a tech resume along with using third person and don't refer to the project. Start with ^ and a new line, then write bullet points with -, seperate the bullet points with a new line, end the generation with ^ at the end. Before starting the bullet points, start with an ^ and a new line, then write all three bullet points before ending with an ^ and new line. Space each bullet point with a new line. Cater bullet points and information to best fit the technologies highlighted for a job description provided here: "${usedTechnologies}", making sure to include the technologies highlighted in the job description if they are in the project. Ensure no speculative data or content that is not explicitly mentioned in the project description is never included. The result must be in bullet point.`,
        model: "command-nightly",
        maxTokens: maxTokens,
        temperature: 0.9,
      });
      return generate;
    });

    const experienceGeneration = experience.map(async (exp) => {
        const generate = await cohere.generate({
            prompt: `Use the provided software experience description to generate tech resume bullet points for someone showcasing this experience on their resume: "${exp.trim()}". Generate 3 bullet points with a maximum of 15 words each in the style of a tech resume, highlight the key aspects of the experience and omit any unnecessary details. Ensure a concise tech resume style, exphasizing the tech stack, user features, and experience uniqueness. Highlight with one bullet point what the experience responsibilities were in less than 15 words, with the second bullet point highlight the technologies used in less than 15 words, and with the third bullet point highlight a softskill showcased in the experience. Make sure to resemble the result to that of a tech resume along with using third person and don't refer to the project. Start with ^ and a new line, then write bullet points with -, seperate the bullet points with a new line, end the generation with ^ at the end. Before starting the bullet points, start with an ^ and a new line, then write all three bullet points before ending with an ^ and new line. Space each bullet point with a new line. Cater bullet points and information to best fit the technologies and skills highlighted for a job description here: "${usedTechnologies}", making sure to include the technologies highlighted in the job description if they are in the experience. Ensure no speculative data or content that is not explicitly mentioned in the experience description is never included. The result must be in bullet point.`,
            model: "command-nightly",
            maxTokens: maxTokens,
            temperature: 0.9,
          });
          return generate;
    });

    const [promptResults, experienceResults] = await Promise.all([
        Promise.all(promptsGeneration),
        Promise.all(experienceGeneration),
    ]);

    result.prompts = promptResults;
    result.experience = experienceResults;

    // for (const prompt of prompts) {
    //   const generate = await cohere.generate({
    //     prompt: `Use the provided software project description to generate tech resume bullet points for someone showcasing this project on their resume: "${prompt.trim()}". Generate 3 bullet points with a maximum of 15 words each in the style of a tech resume, highlight the key aspects of the project and omit any unnecessary details. Ensure a concise tech resume style, emphasizing the tech stack, user features, and project uniqueness. Highlight with one bullet point what the project is in less than 15 words, with the second bullet point highlight the technologies used in less than 15 words and with the third bullet point highlight something impressive about the project or another technology used in less than 15 words. Make sure to resemble the result to that of a tech resume along with using third person and don't refer to the project. Start with ^ and a new line, then write bullet points with -, seperate the bullet points with a new line, end the generation with ^ at the end. Before starting the bullet points, start with an ^ and a new line, then write all three bullet points before ending with an ^ and new line. Space each bullet point with a new line. Cater bullet points and information to best fit the technologies highlighted for a job description provided here: "${usedTechnologies}", making sure to include the technologies highlighted in the job description if they are in the project. Ensure no speculative data or content that is not explicitly mentioned in the project description is never included. The result must be in bullet point.`,
    //     model: "command-nightly",
    //     maxTokens: maxTokens,
    //     temperature: 0.9,
    //   });

    //   responses.push(generate);
    //   console.log(responses);
    // }

    // for (const exp of experience) {
    //   const generate = await cohere.generate({
    //     prompt: `Use the provided software experience description to generate tech resume bullet points for someone showcasing this experience on their resume: "${exp.trim()}". Generate 3 bullet points with a maximum of 15 words each in the style of a tech resume, highlight the key aspects of the experience and omit any unnecessary details. Ensure a concise tech resume style, exphasizing the tech stack, user features, and experience uniqueness. Highlight with one bullet point what the experience responsibilities were in less than 15 words, with the second bullet point highlight the technologies used in less than 15 words, and with the third bullet point highlight a softskill showcased in the experience. Make sure to resemble the result to that of a tech resume along with using third person and don't refer to the project. Start with ^ and a new line, then write bullet points with -, seperate the bullet points with a new line, end the generation with ^ at the end. Before starting the bullet points, start with an ^ and a new line, then write all three bullet points before ending with an ^ and new line. Space each bullet point with a new line. Cater bullet points and information to best fit the technologies and skills highlighted for a job description here: "${usedTechnologies}", making sure to include the technologies highlighted in the job description if they are in the experience. Ensure no speculative data or content that is not explicitly mentioned in the experience description is never included. The result must be in bullet point.`,
    //     model: "command-nightly",
    //     maxTokens: maxTokens,
    //     temperature: 0.9,
    //   });

    //   experienceResponse.push(generate);
    //   console.log(experienceResponse);
    // }

    // const result = {
    //   prompts: responses,
    //   experience: experienceResponse,
    // };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
