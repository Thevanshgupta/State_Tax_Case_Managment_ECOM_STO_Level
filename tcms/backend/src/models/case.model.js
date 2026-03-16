const STATUSES = ['Pending', 'In Process', 'Completed', 'Closed'];
const FLAG_REASONS = [
  'Non-Compliance',
  'High Value',
  'Documents Missing',
  'Legal Issue',
  'Urgent Action Needed',
  'Other',
];
const FINANCIAL_YEARS = ['2024-25', '2023-24', '2022-23', '2021-22', '2020-21'];

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

module.exports = { STATUSES, FLAG_REASONS, FINANCIAL_YEARS, GSTIN_REGEX };