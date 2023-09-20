import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import '../pages/Adminpages/style.css';
import { background } from '@chakra-ui/styled-system';

function Sidebar() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant='secondary' className='d-lg-none' onClick={handleShow}>
        Menu
      </Button>

      <Offcanvas show={show} onHide={handleClose} responsive='lg'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='d-xxs-smallfont'>
            Administrator Menu
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='d-flex flex-column gap-3'>
          <Offcanvas.Title className='d-xxs-smallfont mt-3'>
            Administrator Menu
          </Offcanvas.Title>
          <a
            href='/account_management'
            className={
              window.location.pathname === '/account_management'
                ? 'bg-success-subtle '
                : null
            }
          >
            Cashier Account Management
          </a>
          <a
            href='/dashboard'
            className={
              window.location.pathname === '/dashboard'
                ? 'bg-success-subtle '
                : null
            }
          >
            Products
          </a>
          <a
            href='/categories'
            className={
              window.location.pathname === '/categories'
                ? 'bg-success-subtle '
                : null
            }
          >
            Categories
          </a>
          <a
            href='/report'
            className={
              window.location.pathname === '/report'
                ? 'bg-success-subtle '
                : null
            }
          >
            Report
          </a>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
