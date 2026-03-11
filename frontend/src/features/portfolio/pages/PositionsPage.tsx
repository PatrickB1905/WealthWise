import React from 'react';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import {
  InlineInfoAlert,
  MutedHelperText,
  PageCard,
  PositionsTabGroupWrap,
  SectionContent,
  SectionHeader,
  SpacedSection,
  StyledContainer,
} from '@shared/ui';

import { usePositionsPage } from '../hooks/usePositionsPage';
import { PositionsKpis } from '../components/summary/PositionsKpis';
import { PositionsEmptyState } from '../components/lists/PositionsEmptyState';
import { PositionsSkeletonTable } from '../components/lists/PositionsSkeletonTable';
import { PositionsMobileList } from '../components/lists/PositionsMobileList';
import { PositionsDesktopTable } from '../components/lists/PositionsDesktopTable';
import { PositionsTotalsCard } from '../components/lists/PositionsTotalsCard';
import { PositionDialogs } from '../components/dialogs/PositionDialogs';
import { PositionsToast } from '../components/summary/PositionsToast';
import { PositionsPrimaryButton, PositionsTabButtonGroup } from '../components/dialogs/PositionDialogs.styles';

const PositionsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const vm = usePositionsPage(isMobile);

  return (
    <StyledContainer>
      <PageCard>
        <SectionHeader title="Positions" subheader={vm.headerSubtitle} />

        <SectionContent>
          <PositionsTabGroupWrap>
            <PositionsTabButtonGroup size="small">
              <Button
                variant={vm.tab === 'open' ? 'contained' : 'outlined'}
                onClick={() => vm.setTab('open')}
              >
                Open
              </Button>
              <Button
                variant={vm.tab === 'closed' ? 'contained' : 'outlined'}
                onClick={() => vm.setTab('closed')}
              >
                Closed
              </Button>
            </PositionsTabButtonGroup>
          </PositionsTabGroupWrap>

          <PositionsKpis
            loading={vm.loading}
            tab={vm.tab}
            pricing={vm.pricing}
            totalsProfitTone={vm.totalsProfitTone}
            totalsPctTone={vm.totalsPctTone}
          />
        </SectionContent>
      </PageCard>

      <SpacedSection>
        <PageCard>
          <SectionHeader
            title={vm.tab === 'open' ? 'Open Positions' : 'Closed Positions'}
            subheader={vm.listSubtitle}
            action={
              vm.tab === 'open' ? (
                <PositionsPrimaryButton variant="contained" size="small" onClick={vm.openAddDialog}>
                  Add Position
                </PositionsPrimaryButton>
              ) : null
            }
          />

          <SectionContent>
            {vm.tab === 'open' && vm.showQuoteAlert && vm.pricing.missingQuotes > 0 ? (
              <InlineInfoAlert severity="info">
                We’re still fetching live quotes for {vm.pricing.missingQuotes} position(s). Those
                rows will show “—” until pricing is available.
              </InlineInfoAlert>
            ) : null}

            {vm.errorText ? (
              <InlineInfoAlert severity="error">{vm.errorText}</InlineInfoAlert>
            ) : vm.loading ? (
              <PositionsSkeletonTable />
            ) : vm.positions.length === 0 ? (
              <PositionsEmptyState tab={vm.tab} onAdd={vm.openAddDialog} />
            ) : vm.isMobile ? (
              <>
                <PositionsMobileList
                  tab={vm.tab}
                  positions={vm.positions}
                  quotesMap={vm.quotesMap}
                  onClose={vm.openCloseDialog}
                  onEdit={vm.openEditDialog}
                  onDelete={vm.openDeleteDialog}
                />
                <PositionsTotalsCard pricing={vm.pricing} />
              </>
            ) : (
              <PositionsDesktopTable
                tab={vm.tab}
                positions={vm.positions}
                quotesMap={vm.quotesMap}
                pricing={vm.pricing}
                onClose={vm.openCloseDialog}
                onEdit={vm.openEditDialog}
                onDelete={vm.openDeleteDialog}
              />
            )}

            {vm.positions.length > 0 && vm.tab === 'closed' && vm.isMobile ? (
              <MutedHelperText variant="body2">
                Totals are shown above for quick reference.
              </MutedHelperText>
            ) : null}
          </SectionContent>
        </PageCard>
      </SpacedSection>

      <PositionDialogs
        tab={vm.tab}
        selected={vm.selected}
        addOpen={vm.addOpen}
        closeOpen={vm.closeOpen}
        editOpen={vm.editOpen}
        deleteOpen={vm.deleteOpen}
        onCloseAdd={vm.closeAddDialog}
        onCloseClose={vm.closeCloseDialog}
        onCloseEdit={vm.closeEditDialog}
        onCloseDelete={vm.closeDeleteDialog}
        newTicker={vm.newTicker}
        selectedInstrument={vm.selectedInstrument}
        newQuantity={vm.newQuantity}
        newBuyPrice={vm.newBuyPrice}
        newBuyDate={vm.newBuyDate}
        newSellPrice={vm.newSellPrice}
        newSellDate={vm.newSellDate}
        tickerError={vm.tickerError}
        quantityError={vm.quantityError}
        buyPriceError={vm.buyPriceError}
        buyDateError={vm.buyDateError}
        sellPriceError={vm.sellPriceError}
        sellDateError={vm.sellDateError}
        setNewTicker={vm.setNewTicker}
        setSelectedInstrument={vm.setSelectedInstrument}
        setNewQuantity={vm.setNewQuantity}
        setNewBuyPrice={vm.setNewBuyPrice}
        setNewBuyDate={vm.setNewBuyDate}
        setNewSellPrice={vm.setNewSellPrice}
        setNewSellDate={vm.setNewSellDate}
        onAddSubmit={vm.onAddSubmit}
        onCloseSubmit={vm.onCloseSubmit}
        onEditSubmit={vm.onEditSubmit}
        onDeleteConfirm={vm.onDeleteConfirm}
        isAdding={vm.isAdding}
        isClosing={vm.isClosing}
        isEditing={vm.isEditing}
        isDeleting={vm.isDeleting}
      />

      <PositionsToast toast={vm.toast} onClose={vm.closeToast} />
    </StyledContainer>
  );
};

export default PositionsPage;