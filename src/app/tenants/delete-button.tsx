"use client";

import { useState, useTransition } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { deleteTenant } from "./actions";

export function DeleteTenantButton({
  id,
  name,
  blocked,
}: {
  id: string;
  name: string;
  blocked?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (blocked) {
    return (
      <Tooltip title="End the active lease before deleting this tenant.">
        <span>
          <Button variant="outlined" color="error" disabled>
            Delete
          </Button>
        </span>
      </Tooltip>
    );
  }

  return (
    <>
      <ConfirmDialog
        title="Delete tenant"
        description={`Delete "${name}"? This cannot be undone.`}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
        pending={pending}
        danger
        onConfirm={() =>
          startTransition(async () => {
            const result = await deleteTenant(id);
            if (result?.error) setError(result.error);
          })
        }
        trigger={(open) => (
          <Button
            variant="outlined"
            color="error"
            onClick={open}
            loading={pending}
          >
            {pending ? "Deleting…" : "Delete"}
          </Button>
        )}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
