<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1yKy7LUcC77tDkxB4U0wQ21wMb38Qs-UG

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `OPENAI_API_KEY` in [.env.local](.env.local) to your OpenAI API key
3. Set the `VITE_GOOGLE_CLIENT_ID` in [.env.local](.env.local) to the OAuth **Web** Client ID from Google Cloud (authorized origin `http://localhost:3000`)
4. Run the app:
   `npm run dev`
