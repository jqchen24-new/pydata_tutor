import { GoogleGenAI, Type } from "@google/genai";
import { Problem, EvaluationResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateProblem = async (topicName: string, difficulty: string): Promise<Problem> => {
  const modelId = "gemini-2.5-flash"; 

  const response = await ai.models.generateContent({
    model: modelId,
    contents: `Create a unique, practical ${difficulty} level data science coding problem focused on: ${topicName}. 
    The problem should test understanding of Python libraries like Pandas, NumPy, or Scikit-Learn.
    Provide a realistic scenario (e.g., cleaning messy data, calculating metrics, simple feature engineering).`,
    config: {
      systemInstruction: "You are a Senior Data Science Interviewer. Create clear, challenging but solvable problems. IMPORTANT: The startingCode must ONLY contain imports and empty function definitions or data setup. DO NOT provide the implementation or solution logic in the startingCode.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING, description: "Markdown supported description of the problem, including sample input data description. Use markdown code blocks for data examples." },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          startingCode: { type: Type.STRING, description: "Initial python code boilerplate only. Import necessary libraries and define variables or empty functions. DO NOT IMPLEMENT THE SOLUTION." },
          hints: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["id", "title", "description", "difficulty", "startingCode", "hints"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as Problem;
};

export const evaluateSubmission = async (problem: Problem, userCode: string): Promise<EvaluationResult> => {
  const modelId = "gemini-2.5-flash";

  const prompt = `
    Problem Title: ${problem.title}
    Problem Description: ${problem.description}
    
    User's Code Solution:
    \`\`\`python
    ${userCode}
    \`\`\`
    
    Evaluate the user's code. 
    1. Check for logical correctness (does it solve the problem described?).
    2. Check for best practices (e.g., using vectorization in Pandas/NumPy instead of loops).
    3. Check for syntax errors.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      systemInstruction: "You are a strict but helpful Python Data Science Tutor. Judge the code execution mentally.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCorrect: { type: Type.BOOLEAN },
          score: { type: Type.INTEGER, description: "Score from 0 to 100" },
          feedback: { type: Type.STRING, description: "Constructive feedback on what is right/wrong." },
          optimizedCode: { type: Type.STRING, description: "A better or more pythonic version of the solution." },
          reasoning: { type: Type.STRING, description: "Brief explanation of the score." }
        },
        required: ["isCorrect", "score", "feedback", "optimizedCode", "reasoning"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as EvaluationResult;
};