import { useEffect, useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import loginBackgroundImage from '../assets/bgggg.png';
import { SVGeye, SVGslashedEye } from '../components/SVG/SVGeye';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../redux/middlewares/auth-middleware';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import './Adminpages/Login.css';

export const Login = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const [seePassword, setSeePassword] = useState(false);

  const toastProcessing = () =>
    toast({
      title: 'Processing',
      position: 'top',
      duration: 1000,
      isClosable: true,
      status: 'loading',
    });
  const toastSuccess = (title = 'success', description = '') =>
    toast({
      title: title,
      position: 'top',
      duration: 1500,
      isClosable: true,
      status: 'success',
      description: description,
    });
  const toastError = (title = 'Error', description = '') =>
    toast({
      title: title,
      position: 'top',
      duration: 1500,
      isClosable: true,
      status: 'error',
      description: description,
    });

  const formik = useFormik({
    initialValues: {
      username: null,
      password: null,
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required(),
      password: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      if (!values.username || !values.password) {
        return toastError('Error Login', 'please fill the form');
      }
      toastProcessing();
      await dispatch(userLogin(values))
        .then((result) => {
          console.log(result);
          if (result === 1) {
            toastSuccess('Login success');
            nav(`/account_management`);
          } else if (result === 2) {
            toastSuccess('Login success');
            nav(`/TheCoffeeSpace`);
          } else {
            toastError('Login failed', result.response?.data);
          }
        })
        .catch((err) => {
          console.log(err);
          toastError('Login failed', err?.response?.data);
        });
    },
  });

  useEffect(() => {
    if (localStorage.getItem('cs-token') && userSelector.role === 1) {
      nav(`/account_management`);
    } else if (localStorage.getItem('cs-token') && userSelector.role === 2) {
      nav(`/TheCoffeeSpace`);
    }
  }, [userSelector.role]);

  return (
    <div>
      <div class='bg-gray-800 text-white py-2 overflow-hidden'>
        <div class='marquee text-lg font-mono'>MINI PROJECT 3 | POS</div>
      </div>

      <div className='flex'>
        <div
          className='hidden md:block w-1/2 bg-cover bg-center'
          style={{
            backgroundImage: `url(${loginBackgroundImage})`,
            height: '100vh',
            opacity: '0.8',
          }}
        ></div>

        <div className='w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-sky-300 to-[#D3A774]'>
          <Container>
            <Card className='rounded-lg p-4 items-center shadow-2xl'>
              <h1 className='text-2xl text-center font-sans font-bold mb-4'>
                Login
              </h1>
              <Form className='w-80'>
                <Form.Group className='' controlId='UsernameLoginForm'>
                  <Form.Label className='font-mono'>Username</Form.Label>
                  <Form.Control
                    type='text'
                    name='username'
                    placeholder='Username'
                    onChange={formik.handleChange}
                    autoFocus
                  />
                  <div className='text-red-500'>{formik.errors.username}</div>
                </Form.Group>
                <Form.Group controlId='PasswordLoginForm'>
                  <Form.Label className='font-mono'>Password</Form.Label>
                  <div className='relative'>
                    <Form.Control
                      type={seePassword ? 'text' : 'password'}
                      placeholder='Password'
                      name='password'
                      onChange={formik.handleChange}
                    />
                    <span
                      className='absolute right-2 top-2 cursor-pointer'
                      onClick={() => setSeePassword(!seePassword)}
                    >
                      {seePassword ? 'Hide' : 'Show'}
                    </span>
                  </div>
                  <div className='text-red-500'>{formik.errors.password}</div>
                  <div className='text-center mt-4 w-80'>
                    <Button
                      className='bg-sky-300 text-black font-serif w-full'
                      variant='light'
                      onClick={formik.handleSubmit}
                    >
                      Login
                    </Button>
                  </div>
                </Form.Group>
              </Form>
            </Card>
          </Container>
        </div>
      </div>
    </div>
  );
};
