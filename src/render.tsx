import React from "react";
import { createRoot } from "react-dom/client";

import { AuthHandler } from "./types";
import { initApp } from "./app";
import { onAuthChange } from "./auth";

/**
 * render
 */
export function render(app: React.ReactNode, elementId = "root") {
  const container = document.getElementById(elementId)!;
  const root = createRoot(container);
  root.render(app);
}

/**
 * renderApp
 * @returns
 */
export function renderApp(...args: Parameters<typeof initApp>) {
  initApp(...args);
  return render;
}

/**
 * renderWithAuth
 * @description mounts a React app after `onAuthChange` has resolved auth state
 */
export function renderWithAuth(
  app: React.ReactNode,
  authHandler: AuthHandler,
  elementId = "root"
) {
  const container = document.getElementById(elementId)!;
  const root = createRoot(container);
  let mounted = false;

  onAuthChange((user) => {
    authHandler(user);
    if (!mounted) {
      root.render(app);
      mounted = true;
    }
  });
}

/**
 * renderAppWithAuth
 * @returns
 */
export function renderAppWithAuth(...args: Parameters<typeof initApp>) {
  initApp(...args);
  return renderWithAuth;
}
