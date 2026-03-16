/**
 * Standardised API response helpers.
 * Every successful response: { success: true, data: ... }
 * Every error response:      { success: false, error: '...' }
 */

const ok = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, ...data });

const created = (res, data) => ok(res, data, 201);

const noContent = (res) => res.status(204).send();

const badRequest = (res, error) =>
  res.status(400).json({ success: false, error });

const unauthorized = (res, error = 'Authentication required.') =>
  res.status(401).json({ success: false, error });

const forbidden = (res, error = 'Insufficient permissions.') =>
  res.status(403).json({ success: false, error });

const notFound = (res, error = 'Resource not found.') =>
  res.status(404).json({ success: false, error });

const conflict = (res, error) =>
  res.status(409).json({ success: false, error });

const unprocessable = (res, error) =>
  res.status(422).json({ success: false, error });

const serverError = (res, error = 'Internal server error.') =>
  res.status(500).json({ success: false, error });

module.exports = { ok, created, noContent, badRequest, unauthorized, forbidden, notFound, conflict, unprocessable, serverError };