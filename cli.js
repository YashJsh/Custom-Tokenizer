#!/usr/bin/env node

import readline from 'readline';
import Tokenizer from './custom_embedding.js';

class TokenizerCLI {
    constructor() {
        this.tokenizer = new Tokenizer();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    encodeCommand(args) {
        if (args.length === 0) {
            console.error('❌ Error: Please provide text to encode');
            console.log('💡 Usage: encode "Your text here"');
            return;
        }
        
        const text = args.join(' ');
        console.log(`\n🔤 Encoding text: "${text}"`);
        console.log('='.repeat(50));
        
        try {
            const result = this.tokenizer.encode(text);
            console.log('\n✅ ENCODING RESULTS');
            console.log('📝 Original text:', result.originalText);
            console.log('🧹 Cleaned text:', result.cleanedText);
            console.log('📚 Words:', result.words);
            console.log('🔢 Token IDs:', result.tokenIds);
            console.log('📊 Token count:', result.tokenCount);
            console.log('📖 Vocabulary size:', result.vocabularySize);
        } catch (error) {
            console.error('❌ Error during encoding:', error.message);
        }
    }

    decodeCommand(args) {
        if (args.length === 0) {
            console.error('❌ Error: Please provide token IDs to decode');
            console.log('💡 Usage: decode "[0,1,2,3]" or decode 0,1,2,3');
            return;
        }

        let tokenIds;
        try {
            const input = args.join(' ');
            if (input.startsWith('[') && input.endsWith(']')) {
                tokenIds = JSON.parse(input);
            } else {
                tokenIds = input.split(',').map(id => parseInt(id.trim()));
            }
        } catch (error) {
            console.error('❌ Error: Invalid token ID format. Use "[0,1,2,3]" or "0,1,2,3"');
            return;
        }

        console.log(`\n🔓 Decoding token IDs: [${tokenIds.join(', ')}]`);
        console.log('='.repeat(50));

        try {
            const result = this.tokenizer.decode(tokenIds);
            console.log('\n✅ DECODING RESULTS');
            console.log('📝 Decoded text:', result);
        } catch (error) {
            console.error('❌ Error during decoding:', error.message);
        }
    }

    showVocabCommand() {
        this.tokenizer.showVocabulary();
    }

    clearVocabCommand() {
        this.tokenizer.clearVocab();
    }

    helpCommand() {
        console.log(`
╔══════════════════════════════════════════════╗
║            🔤 TOKENIZER CLI TOOL             ║
╚══════════════════════════════════════════════╝

📋 AVAILABLE COMMANDS:
  encode <text>        🔤 Encode text to token IDs
  decode <token_ids>   🔓 Decode token IDs back to text  
  vocab               📖 Show current vocabulary
  clear               🧹 Clear current vocabulary
  help                ❓ Show this help message
  quit                🚪 Exit the program

💡 EXAMPLES:
  > encode "Hello world! How are you?"
  > decode "[0,1,2,3,4]"
  > decode "0,1,2,3,4"  
  > vocab
  > clear
  > quit

📝 NOTES:
  • Text will be cleaned (lowercase, punctuation removed)
  • Vocabulary is built automatically during encoding
  • Use 'clear' to reset and start fresh
  • Token IDs can be provided as JSON array or comma-separated
        `);
    }

    showWelcome() {
        console.log(`
╔══════════════════════════════════════════════╗
║     🚀 Welcome to Tokenizer CLI Tool!       ║
╚══════════════════════════════════════════════╝

Type 'help' to see available commands or 'quit' to exit.
        `);
    }

    processCommand(input) {
        const trimmed = input.trim();
        if (!trimmed) return;

        const parts = trimmed.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (command) {
            case 'encode':
                this.encodeCommand(args);
                break;
            case 'decode':
                this.decodeCommand(args);
                break;
            case 'vocab':
                this.showVocabCommand();
                break;
            case 'clear':
                this.clearVocabCommand();
                break;
            case 'help':
                this.helpCommand();
                break;
            case 'quit':
            case 'exit':
                console.log('\n👋 Thanks for using Tokenizer CLI! Goodbye!');
                this.rl.close();
                return;
            default:
                console.error(`❌ Unknown command: "${command}"`);
                console.log('💡 Type "help" to see available commands');
        }
    }

    start() {
        this.showWelcome();
        
        const prompt = () => {
            this.rl.question('🔤 tokenizer> ', (input) => {
                this.processCommand(input);
                if (!this.rl.closed) {
                    console.log(); // Add spacing
                    prompt();
                }
            });
        };
        
        prompt();
    }
}

const func = ()=>{
    const cli = new TokenizerCLI();
    cli.start();
}

func();