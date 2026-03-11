import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import {
  ContentScrollArea,
  DashboardContainer,
  MainContent,
  RouteLinearProgress,
} from '../styles/app-shell.styles';
import { ROUTE_TRANSITION_MS, dashboardTitleFromPath } from './styled.utils';

const DashboardLayout: React.FC = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    setRouteLoading(true);
    setMobileOpen(false);

    const timeoutId = window.setTimeout(() => setRouteLoading(false), ROUTE_TRANSITION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  const title = useMemo(() => dashboardTitleFromPath(pathname), [pathname]);

  return (
    <DashboardContainer>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <MainContent>
        <Navbar title={title} onMenuClick={() => setMobileOpen(true)} />
        {routeLoading ? <RouteLinearProgress /> : null}

        <ContentScrollArea>
          <Outlet />
        </ContentScrollArea>
      </MainContent>
    </DashboardContainer>
  );
};

export default DashboardLayout;