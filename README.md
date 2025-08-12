![CLI](/./image/Cli_start.png)
![CLI](/./image/Cli_end.png)

# Tokenizer CLI Tool

A simple command-line interface (CLI) tool to **encode** text into token IDs and **decode** token IDs back to text using a custom tokenizer that supports multiple languages.

---

## Features

- Tokenizes input text into words or characters using Unicode-aware segmentation (`Intl.Segmenter`).
- Builds a vocabulary dynamically for each input.
- Supports encoding and decoding commands.
- Works with any language, including English, Japanese, Chinese, Thai, Russian, etc.
- Interactive CLI with helpful commands and prompts.

---

## Prerequisites

- **Node.js v16+** (for native ES Modules and `Intl.Segmenter` support)
- Terminal / Command Prompt


---

## Runinng the CLI Tool

Run the CLI tool using Node.js:

- pnpm install or npm install
- node cli.js
- You will see the command pannel after this.
