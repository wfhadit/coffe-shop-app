import { Container, Row, Col } from "react-bootstrap";
import { Header } from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { CategoryList } from "../../components/category";
import { Center, Flex } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";
import { ModalInputCategory } from "../../components/categorym";
import { api } from "../../API/api";
export const CategoriesPage = ({ search }) => {
  const [categories, setCategories] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category", {
        params: { category_name: search },
      });

      setCategories([...res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search]);

  return (
    <>
      <Header />
      <Row style={{ margin: "0" }}>
        <Col xl={2} lg={2} className="bg-cyan-300 vh-100">
          <Sidebar />
        </Col>
        <Col>
          <Container alignItems={"flex-start"} marginTop={"35px"}>
            <Flex justifyContent={"right"}>
              <Button colorScheme="blue" onClick={onOpen}>
                Add Category
              </Button>
            </Flex>
            <CategoryList
              categories={[...categories]}
              fetchCategories={fetchCategories}
            />
            <ModalInputCategory
              isOpen={isOpen}
              onClose={onClose}
              fetchCategories={fetchCategories}
            />
          </Container>
        </Col>
      </Row>
    </>
  );
};
