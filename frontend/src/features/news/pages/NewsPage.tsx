import React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { Link as RouterLink } from 'react-router-dom';

import { CenteredBox, PageCard, SectionContent, SectionHeader, StyledContainer } from '@shared/ui';
import { NewsContent } from '../styles/news.styles';

import { useNewsPage } from '../hooks/useNewsPage';
import NewsLoading from '../components/states/NewsLoading';
import NewsHeader from '../components/feed/NewsHeader';
import NewsArticles from '../components/feed/NewsArticles';
import NewsEmptyState from '../components/states/NewsEmptyState';
import NewsErrorState from '../components/states/NewsErrorState';
import NewsMobileStickyRefresh from '../components/feed/NewsMobileStickyRefresh';

const NewsPage: React.FC = () => {
  const {
    user,
    positionsQuery,
    newsQuery,
    positions,
    tickers,
    symbols,
    articles,
    updatedLabel,
    isRefreshing,
    handleRefresh,
  } = useNewsPage();

  if (!user) {
    return (
      <StyledContainer>
        <Alert severity="info">Please log in to view your portfolio news.</Alert>
      </StyledContainer>
    );
  }

  if (positionsQuery.isLoading) {
    return (
      <StyledContainer>
        <CenteredBox>
          <CircularProgress />
        </CenteredBox>
      </StyledContainer>
    );
  }

  if (positionsQuery.error) {
    return (
      <StyledContainer>
        <Alert severity="error">{positionsQuery.error.message}</Alert>
      </StyledContainer>
    );
  }

  if (positions.length === 0) {
    return (
      <StyledContainer>
        <PageCard>
          <SectionHeader title="News" subheader="Headlines are tailored to your open positions." />
          <SectionContent>
            <NewsEmptyState
              title="No open positions"
              description="Add positions to your portfolio to see curated headlines for the tickers you hold."
              action={
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/app/positions"
                  sx={{ borderRadius: 2.5, fontWeight: 800 }}
                >
                  Add Position
                </Button>
              }
            />
          </SectionContent>
        </PageCard>
      </StyledContainer>
    );
  }

  if (newsQuery.isLoading) {
    return <NewsLoading />;
  }

  if (newsQuery.error) {
    return (
      <NewsErrorState
        message={newsQuery.error.message || 'Failed to load news'}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
    );
  }

  return (
    <StyledContainer>
      <PageCard>
        <SectionHeader
          title={
            <NewsHeader
              tickers={tickers}
              symbols={symbols}
              updatedLabel={updatedLabel}
              isRefreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
          subheader={null}
        />

        <NewsContent>
          {articles.length === 0 ? (
            <NewsEmptyState
              title="No headlines available"
              description="We couldn’t find recent articles for your holdings right now. Try again later."
              actionLabel={isRefreshing ? 'Refreshing…' : 'Refresh'}
              onAction={handleRefresh}
              disabled={isRefreshing}
              startIcon={isRefreshing ? <CircularProgress size={18} /> : <RefreshRoundedIcon />}
            />
          ) : (
            <NewsArticles articles={articles} dimmed={isRefreshing} />
          )}
        </NewsContent>
      </PageCard>

      <NewsMobileStickyRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing} />
    </StyledContainer>
  );
};

export default NewsPage;
