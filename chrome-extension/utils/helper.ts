export function parseMarkdownJSON(markdownText: string) {
  // Extract JSON from markdown code block
  const jsonMatch = markdownText.match(/```json\n([\s\S]*?)\n```/);

  if (!jsonMatch) {
    throw new Error('No JSON code block found in markdown');
  }

  let jsonString = jsonMatch[1];

  // Remove any non-JSON text before and after the JSON block
  const jsonStart = jsonString.indexOf('{');
  const jsonEnd = jsonString.lastIndexOf('}') + 1;

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('Invalid JSON format in markdown');
  }

  jsonString = jsonString.substring(jsonStart, jsonEnd);

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Invalid JSON format in markdown');
  }
}
