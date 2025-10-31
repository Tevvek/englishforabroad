import { useEffect, useState } from "react";

export default function SPReact() {
  const day = new Date();
  const timezone = "Europe/Madrid";

  const [bookableSlots, setBookableSlots] = useState<any[]>([]);
  useEffect(() => {
    fetchBookableSlots();
  }, []);

  async function fetchBookableSlots() {
    const response = await fetch(
      `/api/bookable-slots?day=${day.toISOString()}&timezone=${timezone}`
    );
    const data = await response.json();
    setBookableSlots(data);
  }

  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        fontFamily: "monospace",
      }}
    >
      {JSON.stringify(bookableSlots, null, 2)}
    </pre>
  );
}
