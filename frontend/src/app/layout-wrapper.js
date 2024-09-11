'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useUserStore from '@/Store/userStore';
import { checkUserAuth } from '@/services/auth.service';
import Header from '@/app/components/Header';
import Loader from '@/lib/Loader';

const LayoutWrapper = ({ children }) => {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/user-login';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          // Check auth only if user is not set
          const response = await checkUserAuth();
          console.log('Auth response:', response);

          if (response?.isAuthenticated) {
            setUser(response);
          } else {
            router.push('/user-login');
          }
        } else if (user && isLoginPage) {
          router.push('/');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        if (!isLoginPage) {
          router.push('/user-login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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
