// Apex Professores — Clerk Authentication Screen (ApexMed Design System)

import React from 'react';
import { SignUpButton, SignInButton } from '@clerk/react';
import { ApexLogo } from './icons.jsx';

// Clerk appearance theme for ApexMed design system
const clerkAppearance = {
  baseTheme: undefined,
  variables: {
    colorBackground: 'rgba(255,255,255,0.02)',
    colorInputBackground: 'transparent',
    colorInputText: '#f8fafc',
    colorText: '#f8fafc',
    colorTextSecondary: '#7a7468',
    colorPrimary: '#A43939',
    colorDanger: '#dc2626',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: "'Atkinson Hyperlegible', Arial, system-ui, sans-serif",
  },
};

export default function AuthScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse 55% 65% at 72% 50%, rgba(164,57,57,.13) 0%, transparent 65%), #31302e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px',
      fontFamily: "'Atkinson Hyperlegible', Arial, system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow elements (subtle) */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(164,57,57,.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Main card container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: 600,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <ApexLogo size={48} />
        </div>

        {/* Hero Heading */}
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 38px)',
          fontWeight: 900,
          color: '#f8fafc',
          margin: 0,
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
          textAlign: 'center',
          marginBottom: 10,
        }}>
          Apex Professores
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: 16,
          color: '#7a7468',
          margin: 0,
          textAlign: 'center',
          lineHeight: 1.6,
          fontWeight: 400,
          marginBottom: 48,
          maxWidth: 500,
        }}>
          Crie e valide questões médicas com dados e precisão. Seu trabalho fica salvo automaticamente.
        </p>

        {/* Auth Card */}
        <div style={{
          width: '100%',
          padding: '32px 24px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          backdropFilter: 'blur(4px)',
          transition: 'all 0.25s',
        }}>
          {/* Sign Up Section */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#DF9696',
              textTransform: 'uppercase',
              letterSpacing: '.14em',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{
                width: 4,
                height: 10,
                background: '#DF9696',
                borderRadius: 1,
              }} />
              Criar Conta
            </h2>
            <SignUpButton
              mode="modal"
              appearance={clerkAppearance}
            />
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: 'rgba(255,255,255,0.07)',
            margin: '28px 0',
          }} />

          {/* Sign In Section */}
          <div>
            <h2 style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#DF9696',
              textTransform: 'uppercase',
              letterSpacing: '.14em',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{
                width: 4,
                height: 10,
                background: '#DF9696',
                borderRadius: 1,
              }} />
              Entrar
            </h2>
            <SignInButton
              mode="modal"
              appearance={clerkAppearance}
            />
          </div>
        </div>

        {/* Footer Text */}
        <p style={{
          fontSize: 12,
          color: '#7a7468',
          marginTop: 32,
          textAlign: 'center',
          lineHeight: 1.6,
          margin: '32px 0 0 0',
          maxWidth: 480,
        }}>
          Suas questões são salvas localmente. Faça login para sincronizar sua conta e acessar em qualquer dispositivo.
        </p>
      </div>

      {/* Global Clerk button styling overrides */}
      <style>{`
        /* Clerk button base styles - comprehensive targeting */
        [class*="cl-button"],
        [class*="cl-authLayoutCard"] button,
        [class*="cl-signUp"] button,
        [class*="cl-signIn"] button,
        [class*="cl-internal"] button,
        button[type="submit"],
        .cl-formButtonPrimary,
        [class*="cl-"] button[type="button"] {
          background-color: #A43939 !important;
          color: #f8fafc !important;
          border-radius: 50px !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          padding: 12px 28px !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
          transition: all 0.25s ease !important;
          box-shadow: 0 0 24px rgba(164,57,57,0.25) !important;
          border: none !important;
          width: 100% !important;
          font-family: 'Atkinson Hyperlegible', Arial, system-ui, sans-serif !important;
          cursor: pointer !important;
          display: inline-block !important;
          text-align: center !important;
        }

        /* Hover state */
        [class*="cl-button"]:hover,
        [class*="cl-authLayoutCard"] button:hover,
        [class*="cl-signUp"] button:hover,
        [class*="cl-signIn"] button:hover,
        [class*="cl-internal"] button:hover,
        button[type="submit"]:hover,
        .cl-formButtonPrimary:hover,
        [class*="cl-"] button[type="button"]:hover {
          background-color: #913232 !important;
          box-shadow: 0 0 40px rgba(164,57,57,0.4) !important;
          transform: translateY(-2px) !important;
        }

        /* Active/pressed state */
        [class*="cl-button"]:active,
        [class*="cl-authLayoutCard"] button:active,
        [class*="cl-signUp"] button:active,
        [class*="cl-signIn"] button:active,
        [class*="cl-internal"] button:active,
        button[type="submit"]:active,
        .cl-formButtonPrimary:active,
        [class*="cl-"] button[type="button"]:active {
          transform: scale(0.98) !important;
        }

        /* Focus state for accessibility */
        [class*="cl-button"]:focus-visible,
        button[type="submit"]:focus-visible {
          outline: 2px solid rgba(164,57,57,0.5) !important;
          outline-offset: 2px !important;
        }

        /* Clerk component typography */
        [class*="cl-"] {
          font-family: 'Atkinson Hyperlegible', Arial, system-ui, sans-serif !important;
        }

        /* Clerk form inputs */
        [class*="cl-input"],
        [class*="cl-input"] input,
        input[type="email"],
        input[type="password"] {
          background-color: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(255,255,255,0.07) !important;
          color: #f8fafc !important;
          border-radius: 12px !important;
          font-family: 'Atkinson Hyperlegible', Arial, system-ui, sans-serif !important;
        }

        /* Input focus state */
        [class*="cl-input"]:focus,
        [class*="cl-input"] input:focus,
        input[type="email"]:focus,
        input[type="password"]:focus {
          border-color: #A43939 !important;
          box-shadow: 0 0 0 3px rgba(164,57,57,0.25) !important;
        }

        /* Clerk label and text styling */
        [class*="cl-label"],
        [class*="cl-signUp"] label,
        [class*="cl-signIn"] label {
          color: #f8fafc !important;
          font-family: 'Atkinson Hyperlegible', Arial, system-ui, sans-serif !important;
        }

        /* Clerk card and modal overrides */
        [class*="cl-card"],
        [class*="cl-modalContent"],
        [class*="cl-authLayoutCard"] {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.07) !important;
        }
      `}</style>
    </div>
  );
}
