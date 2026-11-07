function stripNoise(code: string) {
  return code
    .replace(/\{-[\s\S]*?-\}/g, " ")
    .replace(/--.*$/gm, " ")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""');
}

export function bannedUsed(code: string, banned: string[]) {
  const clean = stripNoise(code);
  return banned.filter((b) =>
    /^[\w']+$/.test(b) ? new RegExp(`(?<![\\w'.])${b}(?![\\w'])`).test(clean) : clean.includes(b),
  );
}
