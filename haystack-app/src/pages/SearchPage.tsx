import { useSearchParams } from "react-router-dom";

export function SearchPage() {

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <div>
        <h1>Searching for "{query}"</h1>
    </div>
  );
}