const data = await response.json();

if (!response.ok) {
  console.error("OpenAI API error:", response.status);
  return res.status(502).json({
    error: "The AI service could not answer right now."
  });
}

const answer =
  data.output_text ||
  "Sorry, I could not prepare an answer. Please try again.";

return res.status(200).json({ reply: answer });
