export function ToolGuide({
  steps,
  example,
  assumptions,
}: {
  steps: readonly string[];
  example: string;
  assumptions: readonly string[];
}) {
  return (
    <section className="tool-guide" aria-labelledby="how-to-use">
      <h2 id="how-to-use">How to use this</h2>
      <ol>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <h2>Worked example</h2>
      <p>{example}</p>
      <h2>Assumptions</h2>
      <ul>
        {assumptions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
