import { Container, Row, Col } from "react-bootstrap";
import { Header } from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { CategoryList } from "../../components/category";
import { Center, Flex } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import { useDisclosure } from "@chakra-ui/react";
import { ModalInputCategory } from "../../components/categorym";
import { api } from "../../API/api";
import "./z.css";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [totalItem, setTotalItem] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [lastOffset, setLastOffset] = useState(0);

  const limit = 3;

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/page", {
        params: {
          page: lastOffset,
          limit,
        },
      });
      setTotalItem(res.data.count);
      setTotalPage(res.data.total_page);
      setCategories([...res.data.rows]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [lastOffset]);

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

            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={(e) => {
                const newOffset = (e.selected * limit) % totalItem;
                setLastOffset(newOffset);
              }}
              pageRangeDisplayed={3}
              pageCount={totalPage}
              previousLabel="<"
              renderOnZeroPageCount={null}
              containerClassName="pagination"
              pageLinkClassName="page-num"
              previousLinkClassName="page-num"
              nextLinkClassName="page-num"
              activeLinkClassName="active"
            />
          </Container>
        </Col>
      </Row>
    </>
  );
};
