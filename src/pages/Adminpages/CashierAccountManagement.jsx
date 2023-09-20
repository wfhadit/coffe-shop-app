import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { Header } from '../../components/Header';
import './style.css';
import { api } from '../../API/api';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import {
  SVGAccountActive,
  SVGAccountBlocked,
} from '../../components/SVG/SVGperson';
import { ModalCreateNewCashierAccount } from './ModalCreateNewCashierAccount';
import { ModalConfirmation } from '../../components/ModalConfirmation';
import Sidebar from '../../components/Sidebar';
import { SVGtrash } from '../../components/SVG/SVGtrash';

export const CashierAccountManagement = () => {
  const [cashier_account, setCashier_account] = useState([]);
  const toast = useToast();
  const [showModal, setShowModal] = useState('');
  const userSelector = useSelector((state) => state.auth);
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
      duration: 3500,
      isClosable: true,
      status: 'error',
      description: description,
    });
  const fetchCashierAccount = async () => {
    try {
      const { data } = await api.get(`/users/cashier_account?role=2`, {
        headers: {
          'api-key': userSelector.username,
          Authorization: `Bearer ${localStorage.getItem('cs-token')}`,
        },
      });
      setCashier_account(data);
    } catch (err) {
      console.log(err);
    }
  };
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      fullname: '',
      phone: null,
      email: null,
      gender: 'male',
      isActive: true,
      role: 2,
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().min(5).required(),
      password: Yup.string().min(8).required(),
      fullname: Yup.string().min(3).required(),
      email: Yup.string().email().nullable(),
      phone: Yup.number().nullable(),
      gender: Yup.string().oneOf(['male', 'female']),
    }),
    onSubmit: async (values) => {
      try {
        const user = await api.post('/users/new_cashier_account', values, {
          headers: { 'api-key': userSelector?.username },
        });
        toastSuccess(`Account ${user.username} has been created successfully`);
        fetchCashierAccount();
        setShowModal('');
      } catch (err) {
        console.log(err);
        toastError(
          'Failed to create account',
          JSON.stringify(err?.response.data)
        );
      }
    },
  });

  useEffect(() => {
    fetchCashierAccount();
  }, [userSelector]);
  return (
    <div>
      <Header />
      <ModalCreateNewCashierAccount
        show={showModal}
        setShowModal={setShowModal}
        formik={formik}
      />
      <Row style={{ margin: '0' }}>
        <Col xl={2} lg={2} className='bg-[#D3A774] position-sticky h-screen'>
          <Sidebar />
        </Col>
        <Col>
          <Container>
            <div className='d-flex flex-column w-100 justify-content-center py-3'>
              <span className='d-flex justify-content-between'>
                <h4 className='d-flex align-items-center'>
                  All Cashier Account
                </h4>
                <span>
                  <Button
                    className='font-semibold bg-[#D3A774] text-black'
                    onClick={() => setShowModal('ModalCreateNewCashierAccount')}
                  >
                    Add New Account
                  </Button>
                </span>
              </span>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className='d-xxs-none'>#</th>
                    <th className='d-xxs-none'>Username</th>
                    <th>Full Name</th>
                    <th className='d-none d-sm-table-cell'>Gender</th>
                    <th>Account Status</th>
                    <th className='d-none d-sm-table-cell'>Account Creation</th>
                  </tr>
                </thead>
                <tbody>
                  {cashier_account.length &&
                    cashier_account.map((account, index) => (
                      <TableDataCashierAccount
                        account={account}
                        index={index}
                        fetchCashierAccount={fetchCashierAccount}
                        toastError={toastError}
                        toastSuccess={toastSuccess}
                      />
                    ))}
                </tbody>
              </Table>
            </div>
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export const TableDataCashierAccount = ({
  account,
  index,
  fetchCashierAccount,
  toastError,
  toastSuccess,
}) => {
  const [show, setShow] = useState('');
  const userSelector = useSelector((state) => state.auth);
  const setActive = async () => {
    const data = { isActive: !account.isActive };
    await api
      .post('/users/update_isactive/' + account.id, data, {
        headers: {
          'api-key': userSelector?.username,
          Authorization: `Bearer ${localStorage.getItem('cs-token')}`,
        },
      })
      .then(async (result) => {
        await fetchCashierAccount();
        toastSuccess(
          'succes',
          `Success updating ${account.username} account status`
        );
      })
      .catch((err) => toastError('failed', err?.response?.data));
  };
  const deleteAcc = async (password) => {
    await api
      .delete('/users/' + account.id, {
        headers: {
          'api-key': userSelector.username,
          'delete-password': password,
        },
      })
      .then(async () => {
        await fetchCashierAccount();
        toastSuccess('Success', `Success deleting ${account.username} account`);
      })
      .catch((err) => {
        return toastError('failed', err?.response?.data);
      });
  };
  return (
    <tr key={`tableRowAccount-${index}`}>
      <ModalConfirmation
        show={show}
        setShow={setShow}
        action={
          show === 'SETACTIVE'
            ? setActive
            : show === 'DELETE'
            ? deleteAcc
            : null
        }
        username={account.username}
      />
      <td className='d-xxs-none'>{index + 1}</td>
      <td className='d-xxs-none'>{account.username}</td>
      <td>{account.fullname}</td>
      <td className='d-none d-sm-table-cell'>{account.gender}</td>
      <td className={account.isActive ? 'bg-info-subtle' : 'bg-danger-subtle'}>
        {account.isActive ? 'Active' : 'Disabled'}
        <Button
          className={
            account.isActive
              ? 'bg-danger-subtle text-dark border-danger-subtle'
              : 'bg-info-subtle text-dark border-info-subtle'
          }
          style={{ float: 'right' }}
          onClick={() => setShow('SETACTIVE')}
        >
          {account.isActive ? <SVGAccountBlocked /> : <SVGAccountActive />}
        </Button>
      </td>
      <td className='d-none d-sm-table-cell'>
        <span>{account?.createdAt?.split('T')[0]}</span>
        <span className='d-sm-none d-md-inline' style={{ marginLeft: '20px' }}>
          {account?.createdAt?.split('T')[1].slice(0, 8)}
        </span>
        <Button
          className='bg-danger-subtle text-dark border-danger-subtle'
          style={{ float: 'right' }}
          onClick={() => setShow('DELETE')}
        >
          <SVGtrash />
        </Button>
      </td>
    </tr>
  );
};
