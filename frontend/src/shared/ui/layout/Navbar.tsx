import React, { useMemo } from 'react';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@features/auth';
import {
  NavbarAppBar,
  NavbarTitle,
  NavbarTitleRow,
  NavbarTitleWrap,
  NavbarToolbar,
  UserAvatar,
  UserEmailText,
  UserMenuButton,
} from '../styles/navbar.styles';
import { initialsFromEmail, initialsFromName } from './navbar.utils';

type NavbarProps = {
  title?: string;
  onMenuClick?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ title = 'Dashboard', onMenuClick }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const nav = useNavigate();
  const { user } = useAuth();

  const initials = useMemo(() => {
    if (!user) return null;
    return initialsFromName(user.firstName, user.lastName) ?? initialsFromEmail(user.email);
  }, [user]);

  return (
    <NavbarAppBar position="sticky" color="default">
      <NavbarToolbar>
        {!isDesktop ? (
          <IconButton edge="start" color="inherit" aria-label="open sidebar" onClick={onMenuClick}>
            <MenuIcon fontSize="small" />
          </IconButton>
        ) : null}

        <NavbarTitleRow direction="row" spacing={0.75} alignItems="center">
          <AppRegistrationIcon fontSize="small" />

          <NavbarTitleWrap>
            <Typography
              component="h1"
              noWrap
              sx={{ fontSize: { xs: 16, md: 17 }, fontWeight: 800, lineHeight: 1.2 }}
            >
              {title}
            </Typography>
          </NavbarTitleWrap>
        </NavbarTitleRow>

        <NavbarTitle />

        {user ? (
          <Tooltip title="Account" placement="bottom">
            <UserMenuButton
              variant="text"
              onClick={() => nav('/app/profile')}
              aria-label="Open profile"
            >
              <UserAvatar>{initials}</UserAvatar>
              <UserEmailText>{user.email}</UserEmailText>
            </UserMenuButton>
          </Tooltip>
        ) : null}
      </NavbarToolbar>
    </NavbarAppBar>
  );
};

export default Navbar;