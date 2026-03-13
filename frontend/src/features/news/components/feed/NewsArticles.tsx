import React from 'react';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';

import {
  NewsAgeChip,
  NewsArticleItem,
  NewsArticleRightMeta,
  NewsArticleTitle,
  NewsArticlesList,
  NewsDotSeparator,
  NewsMetaSpacer,
  NewsOpenIconBoxMobile,
  NewsOpenLinkDesktop,
} from '../../styles/news.styles';

import type { Article } from '../../types/news';
import { ageLabel, formatDate } from '../../types/news';

type Props = {
  articles: Article[];
  dimmed?: boolean;
};

export default function NewsArticles({ articles, dimmed }: Props) {
  return (
    <NewsArticlesList disablePadding>
      {articles.map((a, i) => {
        const age = ageLabel(a.publishedAt);
        return (
          <React.Fragment key={`${a.url}_${i}`}>
            <NewsArticleItem dimmed={Boolean(dimmed)}>
              <Link
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                color="inherit"
                sx={{ width: '100%', display: 'block' }}
              >
                <Stack spacing={0.75} sx={{ width: '100%' }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    justifyContent="space-between"
                    sx={{ width: '100%' }}
                  >
                    <NewsArticleTitle variant="subtitle1">{a.title}</NewsArticleTitle>

                    <NewsArticleRightMeta>
                      {age ? <NewsAgeChip label={age} size="small" variant="outlined" /> : null}

                      <NewsOpenIconBoxMobile aria-hidden="true">
                        <OpenInNewRoundedIcon fontSize="small" />
                      </NewsOpenIconBoxMobile>
                    </NewsArticleRightMeta>
                  </Stack>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 0.25, sm: 1 }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    sx={{ minWidth: 0 }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
                      {a.source}
                    </Typography>

                    <NewsDotSeparator>
                      <Typography variant="body2" color="text.secondary">
                        •
                      </Typography>
                    </NewsDotSeparator>

                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                      {formatDate(a.publishedAt)}
                    </Typography>

                    <NewsMetaSpacer />

                    <NewsOpenLinkDesktop color="text.secondary">
                      Open <OpenInNewRoundedIcon fontSize="small" />
                    </NewsOpenLinkDesktop>
                  </Stack>
                </Stack>
              </Link>
            </NewsArticleItem>

            {i < articles.length - 1 ? <Divider component="li" /> : null}
          </React.Fragment>
        );
      })}
    </NewsArticlesList>
  );
}