import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import DialogActions from '@mui/material/DialogActions';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { SectionContent } from '@shared/ui';
import {
  buildStatusPillStyles,
  buildSuccessDotStyles,
} from '@shared/ui/styles/style.helpers';

export const ProfileHeaderWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
  width: '100%',
  [theme.breakpoints.up('md')]: {
    alignItems: 'center',
  },
}));

export const ProfileHeaderLeft = styled(Stack)(() => ({
  minWidth: 0,
}));

export const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 38,
  height: 38,
  borderRadius: 10,
  fontSize: theme.typography.pxToRem(13),
  fontWeight: 850,
  border: `1px solid ${theme.palette.divider}`,
  background: 'linear-gradient(180deg, rgba(15,23,42,0.04) 0%, rgba(15,23,42,0.015) 100%)',
  boxShadow: '0px 8px 20px rgba(15, 23, 42, 0.05)',
  color: theme.palette.text.primary,
}));

export const ProfileHeaderText = styled(Box)(() => ({
  minWidth: 0,
}));

export const ProfileHeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(17),
  fontWeight: 850,
  lineHeight: 1.2,
  [theme.breakpoints.up('md')]: {
    fontSize: theme.typography.pxToRem(18),
  },
}));

export const ProfileHeaderSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(12.5),
}));

export const ProfileHeaderRight = styled(Stack)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: 'auto',
  },
}));

export const ProfileUpdatedPill = styled(Box)(({ theme }) => ({
  ...buildStatusPillStyles(theme),
  width: '100%',
  paddingLeft: theme.spacing(1.4),
  paddingRight: theme.spacing(1.4),
  paddingTop: theme.spacing(0.65),
  paddingBottom: theme.spacing(0.65),
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

export const ProfileUpdatedDot = styled('span')(({ theme }) => ({
  ...buildSuccessDotStyles(theme),
}));

export const ProfileUpdatedText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(12.5),
  fontWeight: 800,
  color: theme.palette.text.secondary,
}));

export const ProfileRefreshButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 800,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(0.8),
  paddingBottom: theme.spacing(0.8),
  minHeight: 34,
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'inline-flex',
  },
}));

export const ProfileContent = styled(SectionContent)(({ theme }) => ({
  paddingTop: theme.spacing(1.25),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(1.5),
  },
}));

export const ProfileCard = styled(Paper)(() => ({
  borderRadius: 14,
  overflow: 'hidden',
  boxShadow: 'none',
}));

export const ProfileIdentityCard = styled(ProfileCard)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  background: 'linear-gradient(180deg, rgba(15,23,42,0.025) 0%, rgba(15,23,42,0.01) 100%)',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(1.75),
  },
}));

export const ProfileTwoColGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(1.5),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1fr 1fr',
  },
}));

export const ProfileSectionCard = styled(ProfileCard)(({ theme }) => ({
  padding: theme.spacing(1.5),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(1.75),
  },
}));

export const ProfileIconBox = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: 10,
  display: 'grid',
  placeItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const ProfileIdentityIconBox = styled(ProfileIconBox)(() => ({
  width: 36,
  height: 36,
  flex: '0 0 auto',
}));

export const ProfileStatusChip = styled(Chip)(({ theme }) => ({
  height: 24,
  borderRadius: 999,
  fontWeight: 800,
  fontSize: theme.typography.pxToRem(11.5),
}));

export const ProfileMemberSinceChip = styled(Chip)(({ theme }) => ({
  height: 28,
  borderRadius: 999,
  fontWeight: 800,
  justifyContent: 'center',
  fontSize: theme.typography.pxToRem(11.5),
}));

export const ProfilePrimaryActionButton = styled(Button)(() => ({
  borderRadius: 16,
  fontWeight: 800,
  minHeight: 36,
}));

export const ProfileDangerCard = styled(ProfileCard)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderColor: theme.palette.error.light,
  background: 'linear-gradient(180deg, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0.02) 100%)',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(1.75),
  },
}));

export const ProfileDangerButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 800,
  width: '100%',
  minHeight: 36,
  [theme.breakpoints.up('md')]: {
    width: 'auto',
  },
}));

export const ProfileDialogActions = styled(DialogActions)(({ theme }) => ({
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  paddingBottom: theme.spacing(1.75),
}));

export const ProfileDialogButton = styled(Button)(() => ({
  borderRadius: 16,
  fontWeight: 800,
}));