import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

export const DashboardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

export const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  borderLeft: `1px solid ${theme.palette.divider}`,
}));

export const ContentScrollArea = styled('div')(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.25),
  },
}));

export const RouteLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 2,
  borderRadius: 999,
  marginBottom: theme.spacing(0.5),
  '& .MuiLinearProgress-bar': {
    borderRadius: 999,
  },
}));