import { Container, Row, Col } from 'react-bootstrap';
import { Header } from '../../components/Header';
import { Flex, useDisclosure, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ProductList } from '../../components/product';
import add50 from '../../assets/icons8-plus.svg';
import { ModalInputProduct } from '../../components/post/post-modal';
import { api } from '../../API/api';
import Sidebar from '../../components/Sidebar';

export const AdminLandingPage = ({ search }) => {
  const [products, setProducts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products', {
        params: { product_name: search },
      });
      console.log(res.data.data);
      setProducts(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);
  return (
    <>
      <Header />
      <Row style={{ margin: '0' }}>
        <Col xl={2} lg={2}>
          <Sidebar />
        </Col>
        <Col>
          <Container>
            <Center alignItems={'flex-start'} marginTop={'35px'}>
              <ProductList products={products} fetchProducts={fetchProducts} />
              <Flex justifyContent={'right'} bgColor={'blue'}>
                <img
                  src={add50}
                  alt=''
                  style={{
                    position: 'fixed',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    marginRight: '20px',
                    marginTop: '20px,',
                  }}
                  onClick={onOpen}
                />
              </Flex>
              <ModalInputProduct
                isOpen={isOpen}
                onClose={onClose}
                fetchProducts={fetchProducts}
              />
            </Center>
          </Container>
        </Col>
      </Row>
    </>
  );
};
