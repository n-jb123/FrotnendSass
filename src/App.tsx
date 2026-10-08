/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { I18nProvider } from './lib/i18n/I18nContext';
import { ThemeProvider } from './lib/theme/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
          <ErrorBoundary>
            <AppShell />
          </ErrorBoundary>
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
