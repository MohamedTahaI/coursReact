// Windows doesn't render flag emoji as pictures (only shows the two letters),
// so we convert the emoji back to a country code and load a real flag image instead.
export function emojiToCountryCode(emoji) {
  return Array.from(emoji)
    .map((char) => String.fromCharCode(char.codePointAt(0) - 127397))
    .join("")
    .toLowerCase();
}

export function getFlagUrl(emoji, size = 40) {
  return `https://flagcdn.com/w${size}/${emojiToCountryCode(emoji)}.png`;
}
