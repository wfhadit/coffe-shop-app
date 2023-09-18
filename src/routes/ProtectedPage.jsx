import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const ProtectedPage = ({
  children,
  needLogin = false,
  AdminOnly = false,
  CashierOnly = false,
}) => {
  const token = localStorage.getItem('cs-token');
  const userSelector = useSelector((state) => state.auth);
  const toast = useToast();
  const nav = useNavigate();
  useEffect(() => {
    if (needLogin === true && !token) {
      return nav('/login');
    } else if (needLogin === true && AdminOnly && userSelector.role !== 1) {
      toast({
        title: 'Warning',
        status: 'warning',
        description: 'You are not allowed to access this page',
        isClosable: true,
        duration: 2000,
      });
      return nav('/login');
    }
  }, [children]);

  return children;
};
