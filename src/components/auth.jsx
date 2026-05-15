// Apex Professores — Clerk Authentication Screen

import React from 'react';
import { SignUpButton, SignInButton } from '@clerk/react';
import { ApexLogo } from './icons.jsx';

export default function AuthScreen() {
  return (
    <div className="apex-grad" style={{ minHeight: '100vh' }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '80px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <ApexLogo size={48} />
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 38,
          fontWeight: 900,
          color: '#0f172a',
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
          color: '#475569',
          margin: 0,
          textAlign: 'center',
          lineHeight: 1.55,
          fontWeight: 500,
          marginBottom: 48,
          maxWidth: 500,
        }}>
          Crie e valide questões médicas com interface intuitiva. Seu trabalho fica salvo automaticamente.
        </p>

        {/* Auth Container */}
        <div style={{
          width: '100%',
          padding: '32px 24px',
          background: 'white',
          border: '1px solid #ececea',
          borderRadius: 16,
          boxShadow: '0 1px 2px rgba(15,23,42,.03)',
        }}>
          {/* Sign Up Section */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#0f172a',
              textTransform: 'uppercase',
              letterSpacing: '.12em',
              margin: '0 0 16px 0',
            }}>
              Nova Conta
            </h2>
            <SignUpButton mode="modal" />
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: '#ececea',
            margin: '28px 0',
          }} />

          {/* Sign In Section */}
          <div>
            <h2 style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#0f172a',
              textTransform: 'uppercase',
              letterSpacing: '.12em',
              margin: '0 0 16px 0',
            }}>
              Já Tem Conta?
            </h2>
            <SignInButton mode="modal" />
          </div>
        </div>

        {/* Footer text */}
        <p style={{
          fontSize: 12,
          color: '#64748b',
          marginTop: 32,
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          Suas questões são salvas localmente no navegador. Faça login para sincronizar com sua conta.
        </p>
      </div>
    </div>
  );
}
