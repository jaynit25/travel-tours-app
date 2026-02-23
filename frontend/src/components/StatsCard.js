import React from 'react';
import { Paper, Box, Typography, Avatar } from '@mui/material';

const StatsCard = ({ title, value, icon, color, trend }) => {
  return (
    <Paper sx={{ 
      p: 3, 
      borderRadius: 4, 
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0',
      transition: 'transform 0.3s',
      '&:hover': { transform: 'translateY(-5px)' }
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mb: 1 }}>
            {title.toUpperCase()}
          </Typography>
          <Typography variant="h3" fontWeight="900" sx={{ color: '#2d3748' }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ 
          bgcolor: color, 
          width: 56, 
          height: 56,
          boxShadow: `0 8px 15px ${color}44` 
        }}>
          {icon}
        </Avatar>
      </Box>
      
      {trend && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#38a169', fontWeight: 'bold', bgcolor: '#f0fff4', px: 1, borderRadius: 1 }}>
            {trend}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default StatsCard;