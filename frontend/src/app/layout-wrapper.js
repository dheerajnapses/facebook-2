'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useUserStore from '@/Store/userStore';
import { checkUserAuth } from '@/services/auth.service';
import Header from '@/app/components/Header';
import Loader from '@/lib/Loader';

const LayoutWrapper = ({ children }) => {
  const { user, setUser } = useUserStore();
  const pathname = usePathname();

  const isLoginPage = pathname === '/user-login';

  return (
    <>
      {!isLoginPage && <Header />}
      {children}
    </>
  );
};

export default LayoutWrapper;
