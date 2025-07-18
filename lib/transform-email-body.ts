export function transformEmailBody(body: string): string {
  // Split by double newlines for paragraphs, single newline for line breaks
  return body
    .split(/\n\n+/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
}
