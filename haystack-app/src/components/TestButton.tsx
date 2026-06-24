import { getInnertube } from "../lib/innertube";

export function TestButton() {
  async function testInnertube() {
    const innertube = await getInnertube();
  }

  return (
    <button onClick={testInnertube}>
      Test Innertube
    </button>
  );
}
