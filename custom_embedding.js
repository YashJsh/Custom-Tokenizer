class Tokenizer {
    constructor() {
        this.vocabulary = new Map();
        this.reverseVocab = new Map();
        this.nextTokenId = 0;
        this.isVocabularyBuilt = false;
    }

    cleanText(text) {
        if (typeof text !== 'string') throw new Error('Input must be a string');

        // Normalize and collapse whitespace, but keep punctuation and casing
        return text
            .normalize('NFKC')
            .replace(/\s+/g, ' ')
            .trim();
    }

    tokenize(text) {
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
            // Use Intl.Segmenter with granularity 'word' for universal tokenization
            const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
            const segments = Array.from(segmenter.segment(text), s => s.segment);
            // Filter out empty strings and whitespace tokens
            return segments.filter(token => token.trim().length > 0);
        } else {
            // Fallback: split on spaces (not perfect for all languages)
            return text.split(/\s+/).filter(token => token.length > 0);
        }
    }

    buildVocabulary(words) {
        this.vocabulary.clear();
        this.reverseVocab.clear();
        this.nextTokenId = 0;

        const uniqueWords = [...new Set(words)];
        console.log(`Building vocabulary from ${uniqueWords.length} unique words...`);

        uniqueWords.forEach((word) => {
            if (word && word.length > 0) {
                this.vocabulary.set(word, this.nextTokenId);
                this.reverseVocab.set(this.nextTokenId, word);
                this.nextTokenId++;
            }
        });

        this.isVocabularyBuilt = true;
        console.log(`Vocabulary built with ${this.vocabulary.size} tokens`);
    }

    encode(text) {
        const cleanedText = this.cleanText(text);
        const words = this.tokenize(cleanedText);
        this.buildVocabulary(words);
        const tokenIds = words.map(word => {
            const tokenId = this.vocabulary.get(word);
            if (tokenId === undefined) {
                console.warn(`Warning: Word "${word}" not found in vocabulary`);
                return -1; // Use -1 for unknown tokens
            }
            return tokenId;
        });
        return {
            tokenIds: tokenIds,
            words: words,
            originalText: text,
            cleanedText: cleanedText,
            vocabularySize: this.vocabulary.size,
            tokenCount: tokenIds.length
        };
    }

    decode(tokenIds) {
        console.log('Input token IDs:', tokenIds);

        if (!this.isVocabularyBuilt) {
            throw new Error('Vocabulary not built yet. Please encode some text first.');
        }
        if (!Array.isArray(tokenIds)) {
            throw new Error('Token IDs must be an array');
        }
        const words = tokenIds.map(tokenId => {
            const word = this.reverseVocab.get(tokenId);
            if (word === undefined) {
                console.warn(`Warning: Token ID ${tokenId} not found in vocabulary`);
                return '<UNK>'; // Unknown token placeholder
            }
            return word;
        });
        const reconstructedText = words.join(' ');
        console.log('Reconstructed text:', reconstructedText);

        return reconstructedText;
    }

    showVocabulary() {
        if (!this.isVocabularyBuilt) {
            console.log('No vocabulary built yet. Please encode some text first.');
            return;
        }
        console.log('\n=== CURRENT VOCABULARY ===');
        const vocab = Array.from(this.vocabulary.entries()).sort((a, b) => a[1] - b[1]);
        vocab.forEach(([word, tokenId]) => {
            console.log(`${tokenId}: "${word}"`);
        });
        console.log(`\nTotal vocabulary size: ${this.vocabulary.size}\n`);
    }

    clearVocab() {
        this.vocabulary.clear();
        this.reverseVocab.clear();
        this.nextTokenId = 0;
        this.isVocabularyBuilt = false;
        console.log('Vocabulary cleared successfully!');
    }
}

export default Tokenizer;
