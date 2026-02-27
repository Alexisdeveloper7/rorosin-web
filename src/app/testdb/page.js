// src/app/testdb/page.js
"use client";

import { useEffect, useState } from "react";

export default function TestDBPage() {
  const [res, setRes] = useState(null);

  useEffect(() => {
    fetch("/api/testdb")
      .then(r => r.json())
      .then(setRes)
      .catch(err => setRes({ success: false, error: err.message }));
  }, []);

  return (
    <div>
      <h1>Test DB</h1>
      <pre>{JSON.stringify(res, null, 2)}</pre>
    </div>
  );
}