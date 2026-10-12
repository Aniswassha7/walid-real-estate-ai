const SYSTEM_PROMPT = `
You are Walid, a bilingual Arabic-English real estate assistant
specialized in Dubai and the UAE.

Reply in the same language as the user’s message.
Help users compare properties, understand rental and purchase options,
estimate investment returns when enough information is provided,
and ask concise questions when key details are missing.

Never invent live listings, current prices, availability, or guaranteed
investment returns. Clearly label estimates and explain when live property
data is unavailable. Do not provide legal or financial guarantees.
Be professional, friendly, and concise.
`;

module.exports = async function handler(req, res) {
if (req.method !== “POST”) {
return res.status(405).json({
error: “Method not allowed”
});
}

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
return res.status(500).json({
error: “The AI service is not configured yet.”
});
}

const message =
typeof req.body?.message === “string”
? req.body.message.trim()
: “”;

if (!message || message.length > 2000) {
return res.status(400).json({
error: “Please send a message of up to 2000 characters.”
});
}

try {
const response = await fetch(
“https://api.openai.com/v1/responses”,
{
method: “POST”,
headers: {
“Content-Type”: “application/json”,
“Authorization”: Bearer ${apiKey}
},
body: JSON.stringify({
model: process.env.OPENAI_MODEL || “gpt-4.1-mini”,
instructions: SYSTEM_PROMPT,
input: message,
max_output_tokens: 600
})
}
);

const data = await response.json();
if (!response.ok) {
  console.error("OpenAI API error:", data);
  return res.status(502).json({
    error: "The AI service could not answer. Please try again."
  });
}
const answer = data.output_text;
if (!answer) {
  return res.status(502).json({
    error: "No answer was returned. Please try again."
  });
}
return res.status(200).json({
  reply: answer
});

} catch (error) {
console.error(“Chat error:”, error);
return res.status(500).json({
error: “A server error occurred. Please try again.”
});
}
};
const data = await response.json();

if (!response.ok) {
  console.error("OpenAI API error:", data);
  return res.status(502).json({
    error: "The AI service could not answer. Please try again."
  });
}

const answer = data.output_text;

if (!answer) {
  return res.status(502).json({
    error: "No answer was returned. Please try again."
  });
}

return res.status(200).json({
  reply: answer
});
