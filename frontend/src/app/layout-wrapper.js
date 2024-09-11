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
        if (!isLoginPage) {
          const response = await checkUserAuth();
          console.log('this is responce',response)
          if (response?.isAuthenticated) {
            setUser(response);
          } else {
            router.push('/user-login'); // Redirect to login if not authenticated
          }
        } else if (user && isLoginPage) {
          // If the user is authenticated and they are on the login page, redirect them to home
          router.push('/');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        if (!isLoginPage) {
          router.push('/user-login'); // Redirect to login page in case of error
        }
      } finally {
        setLoading(false); // Set loading to false after checking auth
      }
    };

    if (!user) {
      checkAuth(); // Only check authentication if user is not already set
    } else if (isLoginPage && user) {
      router.push('/'); // Redirect authenticated user away from login page
    } else {
      setLoading(false); // If user is already set, no need to load
    }
  }, [user, setUser, router, pathname, isLoginPage]);

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
