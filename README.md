# Flashboom AI Prototype

**Flashboom AI** is a lightweight Electron application that uses OpenAI’s GPT-4O model to automatically generate study flashcards from a user-specified topic and optional PDF textbook. It provides a minimal, white-themed UI featuring the Singularity Language branding.

---

## Live Demo

Watch the prototype in action here: [Flashboom AI Demo](https://drive.google.com/file/d/1W_gn_zLkCNZ98aPHgCsPmJxIyRlZdz5j/view?usp=drive_link)

![image](https://github.com/user-attachments/assets/20bfca88-8a5a-4bb2-9e4f-d677c8268e93)



---

## Features

* **Topic-driven flashcards**: Enter any subject and receive 5 AI-generated Q\&A pairs.
* **PDF integration**: Upload your own PDF (e.g., lecture slides, e-textbook) to enhance relevance.
* **LocalStorage persistence**: Generated decks are saved locally for review.
* **Minimal, branded UI**: Clean white theme with Singularity logo.

---

## Dependencies

This project requires the following npm packages:

* `electron` – desktop runtime
* `openai` – to communicate with GPT-4O
* `dotenv` – loads environment variables
* `pdf-parse` – extracts text from user PDFs
* `electron-fetch` – HTTP fetches in the main process

To install them, run:

```bash
npm install electron openai dotenv pdf-parse electron-fetch
```

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/flashboom.git
   cd flashboom/app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure your OpenAI API key**

   * Create a file named `.env` in the **project root** (same folder as `main.js`).
   * Add your key:

     ```ini
     OPENAI_API_KEY=YOUR_API_KEY
     ```

4. **Run the app**

   ```bash
   npm start
   ```

---

## Environment Variables

| Variable         | Description                          |
| ---------------- | ------------------------------------ |
| `OPENAI_API_KEY` | Your OpenAI API key for GPT requests |

> **Note**: Ensure `.env` is listed in `.gitignore` so your key isn’t committed.

---

## Usage

1. Click **Upload Your Textbook** and select a PDF (optional).
2. Enter a topic in the input field.
3. Click **Generate Flashcards**.
4. Review your 5 flashcards in the viewer. Use **Show Answer** and **Next** to navigate.

---



*Built with ❤️ by Singularity Language Team*

