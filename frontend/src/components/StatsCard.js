import { Paper, Typography } from "@mui/material";

export default function StatsCard({ title, value }) {
  return (
    <Paper
  sx={{
    p: 2,
    textAlign: "center",
    minWidth: 120,
    flex: 1,
    borderRadius: 2,
    boxShadow: 3
  }}
>
  <Typography variant="subtitle1">{title}</Typography>
  <Typography variant="h4" sx={{ mt: 1 }}>
    {value}
  </Typography>
</Paper>

  );
}
