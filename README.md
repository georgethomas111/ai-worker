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


