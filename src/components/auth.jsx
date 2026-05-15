// Apex Professores — Clerk Authentication Screen (ApexMed Design System)

import React from 'react';
import { SignUpButton, SignInButton } from '@clerk/react';
import { ApexLogo } from './icons.jsx';

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
            <div style={{
              backgroundColor: 'rgba(255,255,255,.02)',
              borderRadius: 12,
              padding: '12px 0',
              border: '1px solid rgba(164,57,57,.1)',
            }}>
              <SignUpButton mode="modal" />
            </div>
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
            <div style={{
              backgroundColor: 'rgba(255,255,255,.02)',
              borderRadius: 12,
              padding: '12px 0',
              border: '1px solid rgba(164,57,57,.1)',
            }}>
              <SignInButton mode="modal" />
            </div>
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

      {/* CSS for Clerk button styling override */}
      <style>{`
        /* Override Clerk SignInButton/SignUpButton appearance */
        [data-testid*="clerk"] button,
        button[type="submit"] {
          background-color: #A43939 !important;
          color: #f8fafc !important;
          border-radius: 50px !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          padding: 12px 28px !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
          transition: all 0.25s !important;
          box-shadow: 0 0 24px rgba(164,57,57,.25) !important;
        }

        button[type="submit"]:hover {
          background-color: #913232 !important;
          box-shadow: 0 0 40px rgba(164,57,57,.4) !important;
          transform: translateY(-2px) !important;
        }

        button[type="submit"]:active {
          transform: scale(0.98) !important;
        }

        /* Ensure Clerk components use correct font */
        [data-testid*="clerk"] * {
          font-family: 'Atkinson Hyperlegible', Arial, system-ui, sans-serif !important;
        }
      `}</style>
    </div>
  );
}
