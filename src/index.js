const prompt = function(req) {
  if (!req || !req.url) {
    return "What is the origin of the phrase 'Hello, World'?"; // Default prompt
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("q"); // Extract query parameter

    return query ? `Answer the following: ${query}` : "What is the origin of the phrase 'Hello, World'?";
  } catch (error) {
    return "What is the origin of the phrase 'Hello, World'?"; // Fallback prompt
  }
}

const formattedResponse = function (aiPrompt, response) {
  if (!response || !response.response) {
    return `<html><body><h1>Error</h1><p>Invalid response from AI</p></body></html>`;
  }

  return `
  <html>
  <head>
    <title>AI Response</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 40px;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 800px;
        margin: auto;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        text-align: center;
        color: #333;
      }
      .section {
        margin-bottom: 20px;
      }
      .label {
        font-weight: bold;
        color: #555;
      }
      .content {
        padding: 10px;
        background: #f1f1f1;
        border-radius: 5px;
        white-space: pre-wrap;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>AI Response</h1>

      <div class="section">
        <div class="label">Prompt:</div>
        <div class="content">${aiPrompt}</div>
      </div>

      <div class="section">
        <div class="label">Answer:</div>
        <div class="content">${response.response}</div>
      </div>

      <div class="section">
        <div class="label">Token Usage:</div>
        <div class="content">
          <strong>Prompt Tokens:</strong> ${response.usage?.prompt_tokens || 0}<br>
          <strong>Completion Tokens:</strong> ${response.usage?.completion_tokens || 0}<br>
          <strong>Total Tokens:</strong> ${response.usage?.total_tokens || 0}
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};

export default {
  async fetch(request, env, ctx) {
    const aiPrompt = prompt(request);

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [{ role: "user", content: aiPrompt }],
    });

    return new Response(formattedResponse(aiPrompt, response), {
      headers: { "Content-Type": "text/html" },
    });
  },
};

