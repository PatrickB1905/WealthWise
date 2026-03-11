import React from 'react';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

import { SectionHeader } from '@shared/ui';
import {
  ProfileAvatar,
  ProfileHeaderLeft,
  ProfileHeaderRight,
  ProfileHeaderSubtitle,
  ProfileHeaderText,
  ProfileHeaderTitle,
  ProfileHeaderWrap,
  ProfileRefreshButton,
  ProfileUpdatedDot,
  ProfileUpdatedPill,
  ProfileUpdatedText,
} from '../../styles/profile.styles';

type Props = {
  initials: string;
  updatedLabel: string;
  onRefresh: () => void;
};

export const ProfileHeader: React.FC<Props> = ({ initials, updatedLabel, onRefresh }) => {
  return (
    <SectionHeader
      title={
        <ProfileHeaderWrap>
          <ProfileHeaderLeft direction="row" spacing={1.5} alignItems="center">
            <ProfileAvatar>{initials}</ProfileAvatar>

            <ProfileHeaderText>
              <ProfileHeaderTitle noWrap>My Profile</ProfileHeaderTitle>
              <ProfileHeaderSubtitle color="text.secondary" noWrap>
                Account details and security settings
              </ProfileHeaderSubtitle>
            </ProfileHeaderText>
          </ProfileHeaderLeft>

          <ProfileHeaderRight
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.25}
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <ProfileUpdatedPill>
              <ProfileUpdatedDot />
              <ProfileUpdatedText>Updated {updatedLabel}</ProfileUpdatedText>
            </ProfileUpdatedPill>

            <ProfileRefreshButton
              variant="outlined"
              onClick={onRefresh}
              startIcon={<RefreshRoundedIcon />}
            >
              Refresh
            </ProfileRefreshButton>
          </ProfileHeaderRight>
        </ProfileHeaderWrap>
      }
      subheader={null}
    />
  );
};