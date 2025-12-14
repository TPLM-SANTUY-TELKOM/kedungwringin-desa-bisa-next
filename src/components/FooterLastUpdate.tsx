"use client";

import { useEffect, useState } from "react";

export function FooterLastUpdate() {
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLastUpdate() {
      try {
        const response = await fetch("/api/git-info");
        const data = await response.json();
        if (data.lastUpdate) {
          setLastUpdate(data.lastUpdate);
        }
      } catch (error) {
        console.error("Error fetching git info:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLastUpdate();
  }, []);

  if (loading || !lastUpdate) {
    return null;
  }

  return (
    <div className="pt-2 mt-2 border-t border-sidebar-border">
      <p className="text-xs text-sidebar-foreground/60 text-center leading-relaxed">
        Aplikasi terakhir diupdate pada
        <br />
        {lastUpdate}
      </p>
    </div>
  );
}

