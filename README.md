# AI-Powered Cloudflare Worker

This project is a Cloudflare Worker that integrates with **Cloudflare Workers AI** to process user queries and return AI-generated responses in a well-formatted HTML page.

## 🚀 Features
- Uses **Cloudflare Workers AI** (`@cf/meta/llama-3.1-8b-instruct`) to generate responses.
- Parses the request URL to extract the query parameter `q`.
- Returns a structured HTML page displaying:
  - The user’s query (prompt).
  - The AI-generated response.
  - Token usage statistics (prompt tokens, completion tokens, total tokens).
- Clean and modern UI with responsive styling.

## 🛠 Installation & Deployment
### Prerequisites
- A Cloudflare account.
- Workers AI enabled in your Cloudflare environment.
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed.

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. Authenticate with Cloudflare:
   ```sh
   wrangler login
   ```
3. Publish the Worker:
   ```sh
   wrangler publish
   ```

## 📌 Usage
### Querying the AI Model
You can send a query to the Worker via a URL parameter:
```sh
https://your-worker-url/?q=What%20is%20the%20Turing%20Test
```
The AI will process the query and return a formatted HTML response.

### Example Response
When querying:
```
?q=Who invented the internet?
```
The Worker will return an HTML page displaying:
- **Prompt:** "Who invented the internet?"
- **AI Response:** "The internet was developed through the collaboration of researchers, including Vinton Cerf and Robert Kahn..."
- **Token Usage:**
  - Prompt Tokens: `57`
  - Completion Tokens: `256`
  - Total Tokens: `313`

## 📜 Code Overview
### `fetch` Function
Handles incoming requests, extracts the query, and calls `env.AI.run` to generate an AI response.

### `prompt` Function
Parses the request URL to retrieve the query parameter `q`. Defaults to "What is the origin of the phrase 'Hello, World'?" if no query is provided.

### `formattedResponse` Function
Generates a structured HTML page displaying the AI response and token usage details.

## 🔧 Configuration
### Modify the AI Model
To use a different AI model, update:
```javascript
const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { messages: [{ role: "user", content: aiPrompt }] });
```
Replace `@cf/meta/llama-3.1-8b-instruct` with your desired model.

## 🤖 Future Enhancements
- Add caching for frequent queries.
- Allow more advanced prompt customization.
- Implement a frontend UI for direct user interaction.

## 📜 License
This project is licensed under the [MIT License](LICENSE).


