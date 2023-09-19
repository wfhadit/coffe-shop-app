import { Container, Row, Col } from "react-bootstrap";
import { Header } from "../../components/Header";
import { Flex, useDisclosure, Center } from "@chakra-ui/react";
import add50 from "../../assets/icons8-plus.svg";

import Sidebar from "../../components/Sidebar";
import { PostList } from "../../components/post/post-list";

export const AdminLandingPage = ({ search }) => {
  const discloosure = useDisclosure();

  return (
    <>
      <Header />
      <Row style={{ margin: "0" }}>
        <Col xl={2} lg={2} className="bg-cyan-300">
          <Sidebar />
        </Col>
        <Col>
          <Container>
            <Center alignItems={"flex-start"} marginTop={"35px"}>
              <PostList {...discloosure} />
              <Flex justifyContent={"right"} bgColor={"blue"}>
                <img
                  src={add50}
                  alt=""
                  style={{
                    position: "fixed",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    objectFit: "cover",
                    cursor: "pointer",
                    marginRight: "20px",
                    marginTop: "20px,",
                  }}
                  onClick={() => discloosure.onOpen()}
                />
              </Flex>
            </Center>
          </Container>
        </Col>
      </Row>
    </>
  );
};
