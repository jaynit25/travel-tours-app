import { Box, Typography, Button } from "@mui/material";

export default function Maintenance() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#111",
        color: "white",
        textAlign: "center",
        px: 3
      }}
    >
      <Typography variant="h2" fontWeight="bold" gutterBottom>
        🚧 Site Under Maintenance
      </Typography>

      <Typography variant="h6" sx={{ opacity: 0.8, mb: 4 }}>
        We are currently upgrading our system.  
        Please check back shortly.
      </Typography>

      <Button
        variant="contained"
        color="warning"
        onClick={() => window.location.reload()}
      >
        Retry
      </Button>
    </Box>
  );
}