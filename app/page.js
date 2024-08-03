'use client';
import React from 'react';
import LandingPage from './Landing/page';
import SignIn from './sign-in/page';
import PantryPage from './Pantry/page';
import SignUp from './sign-up/page';
import { usePathname } from 'next/navigation';

const Page = () => {
  const pathname = usePathname();

  if (pathname === '/sign-in') {
    return <SignIn />;
  }

  if (pathname === '/sign-up') {
    return <SignUp />;
  }

  if (pathname === '/Pantry') {
    return <PantryPage />;
  }

  return <LandingPage />;
};

export default Page;