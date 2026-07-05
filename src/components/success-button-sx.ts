// Shared "success" look for buttons that just completed a create/update/delete
// action — lime green with black text/spinner, distinct from the default
// primary/error button colors.
// The button is disabled while showing this state (to block resubmission),
// so the lime colors must also win against MUI's `.Mui-disabled` styling.
export const successButtonSx = {
  backgroundColor: "#a3e635",
  color: "#000",
  "&:hover": { backgroundColor: "#a3e635" },
  "&.Mui-disabled": {
    backgroundColor: "#a3e635",
    color: "#000",
  },
} as const;
