"use server";

import { cookies } from "next/headers";

const TOKEN_KEY = "auth_token";

const Cookies = cookies();

export async function logout() {
  (await Cookies).delete(TOKEN_KEY);
}

export async function getAuthToken() {
  return (await Cookies).get(TOKEN_KEY);
}

export async function isAuthenticated() {
  return !!getAuthToken();
}

export async function getAuthHeader() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
