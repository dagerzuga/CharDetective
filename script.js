document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.querySelector('.js-input-text');
    const analyzeBtn = document.querySelector('.js-analyze-btn');
    const resultsDiv = document.querySelector('.js-results');

    analyzeBtn.addEventListener('click', analyzeInput);
    inputText.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            analyzeInput();
        }
    });

    function analyzeInput() {
        const text = inputText.value;
        const suspiciousChars = analyzeText(text);
        const visuallySimilar = checkVisuallySimilarChars(text);
        displayResults(suspiciousChars, visuallySimilar);
    }

    function analyzeText(text) {
        const suspiciousChars = [];

        // Regular expression for various categories of suspicious characters
        const regex = /[^\u0000-\u007F]|\u200B-\u200D|\u2060|\uFEFF|\u202A-\u202E/g;

        // Homoglyphs
        const homoglyphs = {
            'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x',
            'ᴀ': 'a', 'ʙ': 'b', 'ᴄ': 'c', 'ᴅ': 'd', 'ᴇ': 'e', 'ғ': 'f', 'ɢ': 'g',
            'ʜ': 'h', 'ɪ': 'i', 'ᴊ': 'j', 'ᴋ': 'k', 'ʟ': 'l', 'ᴍ': 'm', 'ɴ': 'n',
            'ᴏ': 'o', 'ᴘ': 'p', 'ǫ': 'q', 'ʀ': 'r', 'ѕ': 's', 'ᴛ': 't', 'ᴜ': 'u',
            'ᴠ': 'v', 'ᴡ': 'w', 'х': 'x', 'ʏ': 'y', 'ᴢ': 'z'
        };

        let match;
        while ((match = regex.exec(text)) !== null) {
            let charType = "Non-ASCII";
            if (/[\u200B-\u200D\u2060\uFEFF]/.test(match[0])) {
                charType = "Zero-width";
            } else if (/[\u202A-\u202E]/.test(match[0])) {
                charType = "Directional formatting";
            } else if (Object.keys(homoglyphs).includes(match[0])) {
                charType = `Homoglyph (looks like '${homoglyphs[match[0]]}')`;
            }

            suspiciousChars.push({
                char: match[0],
                index: match.index,
                unicode: match[0].charCodeAt(0).toString(16).padStart(4, '0'),
                type: charType
            });
        }

        return suspiciousChars;
    }

    function checkVisuallySimilarChars(text) {
        const similarities = [
            {
                characterFound: ['I'],
                isIn: "Uppercase",
                alterForm: { "lowercase": "i" },
                confusedWith: 'lowercase "L"'
            },
            {
                characterFound: ['l'],
                isIn: "lowercase",
                alterForm: { "uppercase": "L" },
                confusedWith: 'uppercase "i"'
            },
            {
                characterFound: ['G'],
                isIn: "Uppercase",
                alterForm: { "lowercase": "g" },
                confusedWith: 'the number "6"'
            },
            {
                characterFound: ['g'],
                isIn: "lowercase",
                alterForm: { "uppercase": "G" },
                confusedWith: 'the number "6"'
            },
            {
                characterFound: ['0'],
                isIn: "Number",
                confusedWith: 'the letter "O" (uppercase) or "o" (lowercase)'
            },
            {
                characterFound: ['O'],
                isIn: "Uppercase",
                alterForm: { "lowercase": "o" },
                confusedWith: 'the number zero "0"'
            },
            {
                characterFound: ['o'],
                isIn: "lowercase",
                alterForm: { "uppercase": "O" },
                confusedWith: 'the number zero "0"'
            },
            {
                characterFound: ['S'],
                isIn: "Uppercase",
                alterForm: { "lowercase": "s" },
                confusedWith: 'the number five "5"'
            },
            {
                characterFound: ['s'],
                isIn: "lowercase",
                alterForm: { "uppercase": "S" },
                confusedWith: 'the number five "5"'
            },
            {
                characterFound: ['Z'],
                isIn: "Uppercase",
                alterForm: { "lowercase": "z" },
                confusedWith: 'the number two "2"'
            },
            {
                characterFound: ['z'],
                isIn: "lowercase",
                alterForm: { "uppercase": "Z" },
                confusedWith: 'the number two "2"'
            },
            {
                characterFound: ['B'],
                isIn: "Uppercase",
                alterForm: { "lowercase": "b" },
                confusedWith: 'the number eight "8"'
            },
            {
                characterFound: ['b'],
                isIn: "lowercase",
                alterForm: { "uppercase": "B" },
                confusedWith: 'the number eight "8"'
            }
        ];

        const results = [];

        similarities.forEach(sim => {
            sim.characterFound.forEach(char => {
                const regex = new RegExp(char, 'g');
                let match;
                while ((match = regex.exec(text)) !== null) {
                    results.push({
                        char: match[0],
                        index: match.index,
                        ...sim
                    });
                }
            });
        });

        return results;
    }

    function displayResults(suspiciousChars, visuallySimilar) {
        resultsDiv.innerHTML = '';

        if (suspiciousChars.length === 0 && visuallySimilar.length === 0) {
            resultsDiv.innerHTML = '<p>No suspicious characters or visually similar substitutions found.</p>';
            return;
        }

        // Display results for suspicious characters
        if (suspiciousChars.length > 0) {
            const suspiciousDiv = document.createElement('div');
            suspiciousDiv.className = 'result-section__suspicious';

            // Show warning message
            const warningDiv = document.createElement('div');
            warningDiv.className = 'result-section__warning';
            warningDiv.innerHTML = `
            <strong>Warning:</strong> Suspicious characters detected. 
            This text may be attempting to deceive you. Exercise caution with any links or email addresses containing these characters.
        `;
            suspiciousDiv.appendChild(warningDiv);

            suspiciousDiv.innerHTML += '<h3>Suspicious Characters:</h3>';

            const suspiciousList = document.createElement('ul');
            suspiciousList.className = 'result-section__list';
            suspiciousChars.forEach(result => {
                const listItem = document.createElement('li');
                listItem.className = 'result-section__item';
                listItem.innerHTML = `
                <strong>Character:</strong> ${result.char} <br>
                <strong>Position:</strong> ${result.index} <br>
                <strong>Unicode:</strong> U+${result.unicode} <br>
                <strong>Type:</strong> ${result.type} <br>
                <div class="highlighted-text">${highlightChar(inputText.value, result.index, result.char)}</div>
            `;
                suspiciousList.appendChild(listItem);
            });

            suspiciousDiv.appendChild(suspiciousList);
            resultsDiv.appendChild(suspiciousDiv);
        }

        // Display results for visually similar characters
        if (visuallySimilar.length > 0) {
            const similarDiv = document.createElement('div');
            similarDiv.className = 'result-section__similar';
            similarDiv.innerHTML = `
            <h3>Visually Similar Character Substitutions:</h3>
            <p>The following characters might be confused with others:</p>
        `;

            const similarList = document.createElement('ul');
            similarList.className = 'result-section__list';
            visuallySimilar.forEach(result => {
                const listItem = document.createElement('li');
                listItem.className = 'result-section__item';
                listItem.innerHTML = `
                Character '${result.char}' at position ${result.index}:
                <ul>
                    <li>This character is ${result.isIn === "Number" ? "a number" : `in ${result.isIn}`}</li>
                    ${result.alterForm ? `<li>In ${Object.keys(result.alterForm)[0]} this character looks like this: ${Object.values(result.alterForm)[0]}</li>` : ''}
                    <li>It is possible to confuse this character with ${result.confusedWith}</li>
                </ul>
                <div class="highlighted-text">${highlightChar(inputText.value, result.index, result.char)}</div>
            `;
                similarList.appendChild(listItem);
            });

            similarDiv.appendChild(similarList);

            // Add the cautionary note after the character analysis
            const cautionNote = document.createElement('p');
            cautionNote.className = 'result-section__caution-note';
            cautionNote.innerHTML = `
            <strong>Note:</strong> The presence of these characters doesn't necessarily indicate malicious intent, 
            but caution is advised since it's possible to misread some characters. If this is a URL or email address, 
            type it manually rather than clicking a link.
        `;
            similarDiv.appendChild(cautionNote);

            resultsDiv.appendChild(similarDiv);
        }
    }

    function highlightChar(text, index, char) {
        const before = text.slice(0, index);
        const after = text.slice(index + 1);
        let highlightedChar;

        if (char.trim() === '') {
            // For zero-width characters, insert a visible marker
            highlightedChar = '<span class="zero-width-marker">•</span>';
        } else {
            highlightedChar = `<span class="highlighted-char">${char}</span>`;
        }

        return `${escapeHTML(before)}${highlightedChar}${escapeHTML(after)}`;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
