import { Box } from "@mui/material";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
