import { headacheNode } from '../headacheNodeBuilder';

export const accountsHeadacheNode = headacheNode('q-headache-accounts', 'accounts/finance', [
  {
    label: 'Match bank / bKash / Nagad SMS to Excel',
    example: '40 SMS lines vs one sheet—find what does not match before month-end.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'bank-sms-reconcile',
  },
  {
    label: 'Pull amounts from challan or receipt photos into a sheet',
    example: 'Dealer challan photos → correct amount column for outstanding report.',
    modality: 'image',
    nextId: 'q-finished',
    contextValue: 'challan-extract',
  },
  {
    label: 'Summarize a long audit or policy PDF',
    example: '30-page PDF → bullet summary with page references for your manager.',
    modality: 'text',
    nextId: 'q-needs-files',
    contextValue: 'audit-summary',
  },
  {
    label: 'Check payroll or incentive sheet before send',
    example: 'Compare two versions; flag wrong totals or missing names.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'payroll-check',
  },
  {
    label: 'Monthly financial report narrative from the numbers',
    example: 'P&L + cashflow tabs → plain-language summary for CFO with 3 risks called out.',
    modality: 'text',
    nextId: 'q-needs-files',
    contextValue: 'finance-report',
  },
  {
    label: 'Analyze expense or revenue trends in Excel',
    example: '12 months of GL export → top cost drivers and one chart-ready table.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'finance-analysis',
  },
  {
    label: 'Clean transaction export before reconciliation',
    example: 'Raw bank/ERP dump → standard columns, no duplicates, ready for VLOOKUP.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'finance-data-clean',
  },
]);
