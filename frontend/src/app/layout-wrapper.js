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
        // Only check auth if not already logged in
        if (!user && !isLoginPage) {
          const response = await checkUserAuth();
          console.log('Auth response:', response);

          // Handle authenticated user
          if (response?.isAuthenticated) {
            setUser(response);
          } else {
            // Redirect to login if not authenticated
            router.push('/user-login');
          }
        } else if (user && isLoginPage) {
          // Redirect authenticated user away from login page
          router.push('/');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Redirect to login on failure
        if (!isLoginPage) {
          router.push('/user-login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth(); // Call checkAuth on mount

  }, [user, setUser, router, pathname, isLoginPage]);

  // Show a loading spinner while checking authentication
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
