import { useState, useEffect } from "react";

export default function MagicOrb() {
  const [state, setState] = useState<{ status: string; data: any; error: string | null }>({ status: "loading", data: null, error: null });

  async function fetchOrb(retry = 3) {
    try {
      const res = await fetch("/api/magic/orb");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setState({ status: "connected", data, error: null });
    } catch (err: unknown) {
      if (retry > 0) {
        setTimeout(() => fetchOrb(retry - 1), 2000);
      } else {
        setState({ status: "offline", data: null, error: err instanceof Error ? err.message : 'Unknown error' });
      }
    }
  }

  useEffect(() => { fetchOrb(); }, []);

  if (state.status === "loading") return <p>🔄 Loading Orb...</p>;
  if (state.status === "offline") return <p>🔴 Offline — {state.error}</p>;
  return <p>🟢 Connected — {JSON.stringify(state.data)}</p>;
}