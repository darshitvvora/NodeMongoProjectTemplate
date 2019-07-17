/* eslint no-process-env:0 */

export const env = process.env.NODE_ENV;
export const port = process.env.PORT || 9111;
// List of user roles
export const userRoles = ['guest', 'user', 'admin'];

export default {
  env,
  port,
  userRoles,
};
