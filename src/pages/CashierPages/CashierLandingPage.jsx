import { Col, Container, Row } from "react-bootstrap";
import { Header } from "../../components/Header";
import { useDisclosure, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ProductList } from "../../components/product";

import { api } from "../../API/api";

export const CashierLandingPage = ({ search }) => {
  const [products, setProducts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products", {
        params: { product_name: search },
      });
      setProducts([...res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);
  return (
    <div>
      <Header />
      <Row>
        <Col>
          <Row></Row>
          <Row></Row>
          <Row></Row>
        </Col>
        <Col></Col>
      </Row>
    </div>
  );
};
