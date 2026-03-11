import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { styled } from '@mui/material/styles';

export const DialogFieldLabelWrap = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
}));

export const DialogSubmitButton = styled(Button)(() => ({
  minWidth: 140,
}));

export const PositionsTabButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  '& .MuiButton-root': {
    minHeight: 34,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    fontWeight: 800,
    textTransform: 'none',
  },
}));

export const PositionsPrimaryButton = styled(Button)(({ theme }) => ({
  minHeight: 34,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  fontWeight: 800,
  textTransform: 'none',
}));

export const PositionsTableActionButton = styled(Button)(({ theme }) => ({
  minHeight: 30,
  paddingLeft: theme.spacing(1.25),
  paddingRight: theme.spacing(1.25),
  fontWeight: 700,
  textTransform: 'none',
}));

export const PositionsMobileActionButton = styled(Button)(({ theme }) => ({
  minHeight: 32,
  paddingLeft: theme.spacing(1.25),
  paddingRight: theme.spacing(1.25),
  fontWeight: 700,
  textTransform: 'none',
  borderRadius: theme.spacing(1),
}));