/* tslint:disable */
/**
 * This file was automatically generated by Payload CMS.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  email?: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  loginAttempts?: number;
  lockUntil?: string;
  name: string;
  roles?: 'admin';
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "api-users".
 */
export interface APIUser {
  id: string;
  enableAPIKey?: boolean;
  apiKey?: string;
  apiKeyIndex?: string;
  email?: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  loginAttempts?: number;
  lockUntil?: string;
  name: string;
  roles?: 'admin';
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pages".
 */
export interface Page {
  id: string;
  name: string;
  sites: (string | Site)[];
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "sites".
 */
export interface Site {
  id: string;
  name: string;
  domain: string;
  pages?: (string | Page)[];
  createdAt: string;
  updatedAt: string;
}
