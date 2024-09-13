# CharDetective

CharDetective is an open-source web tool designed to help users identify potentially deceptive or confusing characters in text, particularly in URLs and email addresses. By highlighting visually similar characters and non-standard Unicode characters, CharDetective aims to enhance online security and reduce the risk of falling victim to phishing attacks or visual spoofing.

> Inspired by the need for better visual verification in an age of sophisticated phishing attempts

***

## Live: 

***

## Features

- Detects and highlights non-ASCII characters
- Identifies visually similar character substitutions (e.g., '0' for 'O', 'l' for 'I')
- Highlights zero-width and invisible characters
- Provides detailed information about each detected character
- Offers cautionary advice for users when suspicious characters are found

***

## Example payloads you can try:

URL with Cyrillic characters:
"https://www.аррӏе.com/icloud"

Email address with number substitution:
"j0hn.d0e@gmai1.com"

URL with mixed case and number substitution:
"https://www.PayPa1.com/log1n"

Company name with Greek letter substitution:
"Μicrosoft Support"

URL with homoglyphs:
"https://www.googIe.com/accounts"

Password with visually similar characters:
"P@ssw0rd123!"

Domain name with zero-width space:
"amazon​.com"

URL with multiple substitutions:
"https://secure.bank0famerica.com/l0gin"

Product key with mixed characters:
"XXXXX-XXXXX-XXXXX-XXXXX-ХХХXX"

***

## Contributing
Contributions to CharDetective are welcome! Please feel free to submit pull requests, create issues or spread the word.

***

## Disclaimer
While CharDetective is designed to help identify potentially deceptive text, it should not be considered a foolproof security measure. Always exercise caution when dealing with suspicious links or communications, and use additional verification methods when in doubt.