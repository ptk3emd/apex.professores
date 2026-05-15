import React from 'react';
import { SignUpButton, SignInButton } from '@clerk/react';

export default function AuthScreen() {
  return (
    <>
      <SignUpButton mode="modal" />
      <SignInButton mode="modal" />
    </>
  );
}
