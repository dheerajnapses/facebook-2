'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useUserStore from '@/Store/userStore';
import { checkUserAuth } from '@/services/auth.service';
import Header from '@/app/components/Header';
import Loader from '@/lib/Loader';

const LayoutWrapper = ({ children }) => {
  const { user, setUser,clearUser } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/user-login';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkUserAuth();
        if (response?.isAuthenticated) {
          setUser(response?.user);
        } else {
          clearUser()
          router.push('/user-login');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        clearUser();
        if (!isLoginPage) {
          router.push('/user-login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user && !isLoginPage) {
      checkAuth();
    } else if (user && isLoginPage) {
      router.push('/');
    } else {
      setLoading(false);
    }
  }, [user, isLoginPage, router, setUser]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {!isLoginPage && <Header />}
      {children}
    </>
  );
};

export default LayoutWrapper;
