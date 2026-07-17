import { getInnertube } from "../../services/innertube";

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
