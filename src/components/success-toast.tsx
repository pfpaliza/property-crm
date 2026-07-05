"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// Reads the `toast` query param left by a server action's redirect(), shows
// it as a banner, then strips the param from the URL so refresh/back nav
// doesn't replay it.
export function SuccessToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toastParam = searchParams.get("toast");

  // Derived-state-from-props pattern: sync `message` to `toastParam` during
  // render instead of in an effect (https://react.dev/learn/you-might-not-need-an-effect).
  // Only sync on a new non-null value — once shown, we strip the `toast`
  // param from the URL ourselves, and that null shouldn't hide the message
  // before its auto-hide timer runs.
  const [prevToastParam, setPrevToastParam] = useState(toastParam);
  const [message, setMessage] = useState(toastParam);
  if (toastParam && toastParam !== prevToastParam) {
    setPrevToastParam(toastParam);
    setMessage(toastParam);
  }

  useEffect(() => {
    if (!toastParam) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastParam]);

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={4000}
      onClose={() => setMessage(null)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => setMessage(null)}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
