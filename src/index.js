const htmlForm = `
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
      form {
        margin-bottom: 20px;
      }
      input[type="text"] {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      input[type="submit"] {
        padding: 10px 20px;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      input[type="submit"]:hover {
        background-color: #0056b3;
      }
      .error {
        background-color: #ffebee;
        color: #c62828;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>AI Response</h1>

      <div class="section">
        <div class="label">Model:</div>
        <div class="content">@cf/meta/llama-3.1-8b-instruct</div>
      </div>

      <form id="queryForm">
        <input type="text" id="queryInput" placeholder="Enter your question here..." />
        <input type="submit" value="Ask AI" />
      </form>

      <div class="section">
        <div class="label">Prompt:</div>
        <div class="content" id="promptContent">What is the origin of the phrase 'Hello, World'?</div>
      </div>

      <div class="section">
        <div class="label">Answer:</div>
        <div class="content" id="answerContent">Waiting for your question...</div>
      </div>

      <div class="section">
        <div class="label">Token Usage:</div>
        <div class="content" id="tokenUsage">
          <strong>Prompt Tokens:</strong> 0<br>
          <strong>Completion Tokens:</strong> 0<br>
          <strong>Total Tokens:</strong> 0
        </div>
      </div>

      <div class="error" id="errorSection" style="display: none;">
        <div class="label">Error:</div>
        <div class="content" id="errorContent"></div>
      </div>
    </div>

    <script>
      document.getElementById('queryForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent form submission from reloading the page

        const query = document.getElementById('queryInput').value;
        if (!query) return; // Do nothing if the input is empty

        // Clear previous error
        document.getElementById('errorSection').style.display = 'none';
        document.getElementById('errorContent').textContent = '';

        // Update the prompt section
        document.getElementById('promptContent').textContent = query;

        try {
          // Call the AI API
          const response = await fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query }),
          });

          const data = await response.json();
          console.log("AI Response Data:", data); // Log the response data

          // Update the answer and token usage sections
          if (data.response) {
            document.getElementById('answerContent').textContent = data.response;
            document.getElementById('tokenUsage').innerHTML = \`
              <strong>Prompt Tokens:</strong> \${data.usage?.prompt_tokens || 0}<br>
              <strong>Completion Tokens:</strong> \${data.usage?.completion_tokens || 0}<br>
              <strong>Total Tokens:</strong> \${data.usage?.total_tokens || 0}
            \`;
          } else {
            document.getElementById('answerContent').textContent = 'No response from AI';
          }
        } catch (error) {
          console.error("Error fetching AI response:", error);
          document.getElementById('errorContent').textContent = error.message || 'Error fetching AI response';
          document.getElementById('errorSection').style.display = 'block';
        }
      });
    </script>
  </body>
  </html>
`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle the AI request
    if (url.pathname === '/ask' && request.method === 'POST') {
      try {
        const { query } = await request.json();
        const aiPrompt = query || "What is the origin of the phrase 'Hello, World'?";

        const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages: [{ role: "user", content: aiPrompt }],
        });

        console.log("AI Response:", response); // Log the response

        return new Response(JSON.stringify(response), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("AI Error:", error);
        return new Response(JSON.stringify({ error: error.message || "AI request failed" }), {
          headers: { "Content-Type": "application/json" },
          status: 500,
        });
      }
    }

    // Serve the HTML form for all other requests
    return new Response(htmlForm, {
      headers: { "Content-Type": "text/html" },
    });
  }
};
