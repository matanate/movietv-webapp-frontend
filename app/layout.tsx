import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { Box, Container, GlobalStyles } from '@mui/system';
import { GoogleOAuthProvider } from '@react-oauth/google';

import AlertProviderWrapper from '@/contexts/alert-context';
import { AuthProvider } from '@/contexts/auth-context';
import { RecordProvider } from '@/contexts/record-context';
import { RecordsProvider } from '@/contexts/records-context';
import AddTitleForm from '@/components/add-title-form';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { MainNav } from '@/components/layout/main-nav';
import { SideNav } from '@/components/layout/side-nav';
import ProgressBar from '@/components/progress-bar';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <LocalizationProvider>
          <AlertProviderWrapper>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
              <AuthProvider>
                <RecordsProvider>
                  <RecordProvider>
                    <ThemeProvider>
                      <GlobalStyles
                        styles={{
                          body: {
                            '--MainNav-height': '56px',
                            '--MainNav-zIndex': 1000,
                            '--SideNav-width': '280px',
                            '--SideNav-zIndex': 1100,
                            '--MobileNav-width': '320px',
                            '--MobileNav-zIndex': 1100,
                          },
                        }}
                      />
                      <Box
                        sx={{
                          bgcolor: 'background.default',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          minHeight: '100%',
                        }}
                      >
                        <SideNav />
                        <Box
                          sx={{
                            display: 'flex',
                            flex: '1 1 auto',
                            flexDirection: 'column',
                            pl: { lg: 'var(--SideNav-width)' },
                          }}
                        >
                          <MainNav />
                          <main>
                            <ProgressBar />
                            <Container maxWidth="xl" sx={{ padding: '20px' }}>
                              <AddTitleForm />
                              {children}
                            </Container>
                          </main>
                        </Box>
                      </Box>
                    </ThemeProvider>
                  </RecordProvider>
                </RecordsProvider>
              </AuthProvider>
            </GoogleOAuthProvider>
          </AlertProviderWrapper>
        </LocalizationProvider>
        <script src="https://website-widgets.pages.dev/dist/sienna.min.js" defer></script>
      </body>
    </html>
  );
}
