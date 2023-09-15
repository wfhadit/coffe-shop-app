import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import { Header } from "../../components/Header";
import { useEffect, useState } from "react";
import { api } from "../../API/api";
import { SearchboxBootstrap } from "../../components/SearchboxBootstrap";
import { ProductCardCashier } from "../../components/ProductCard";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";

export const CashierLandingPage = ({ search }) => {
  const toast = useToast();
  const [button, setButton] = useState(true);
  const [products, setProducts] = useState([]);
  const [showTransaction, setShowTransaction] = useState(0); // untuk show transaction
  const [newTransaction, setNewTransaction] = useState(false);
  const [outstandingTransaction, setOutstandingTransaction] = useState([]);
  const [anyTransaction, setAnyTransaction] = useState({});
  const [totalOutstandingTransaction, setTotalOutstandingTransaction] =
    useState(0);
  const userSelector = useSelector((state) => state.auth);
  const fetchOutstandingTransaction = async () => {
    try {
      const { data } = await api.get("/transactions/outstanding", {
        headers: { "api-key": userSelector?.username },
      });
      setOutstandingTransaction(data.rows);
      setTotalOutstandingTransaction(data.count);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchAnyTransaction = async (transactionId) => {
    if (transactionId) {
      const { data } = await api
        .get("/transactions/" + transactionId, {
          headers: { "api-key": userSelector?.username },
        })
        .catch((err) => console.log(err));
      setAnyTransaction(data);
    }
  };
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const createNewTransaction = async (order_type) => {
    await api
      .post(
        "/transactions/",
        {
          order_type,
          staff: userSelector?.id,
        },
        { headers: { "api-key": userSelector?.username } }
      )
      .catch((err) => console.log(err));
    fetchOutstandingTransaction();
  };

  useEffect(() => {
    fetchAnyTransaction(showTransaction);
  }, [showTransaction]);

  useEffect(() => {
    fetchProducts();
    fetchOutstandingTransaction();
  }, []);

  const handleReset = () => {
    const temp = { ...anyTransaction };
    temp?.Transaction_details?.forEach((val) => {
      val.qty = 0;
    });
    setAnyTransaction(temp);
  };
  const handleSave = async () => {
    try {
      setButton(!button);
      const { data } = await api.post(
        `/transaction_details/insert_multi_value`,
        anyTransaction?.Transaction_details,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("cs-token"),
            "api-key": userSelector?.username,
          },
        }
      );
      toast({
        title: "Successfully update this transaction",
        position: "top",
        duration: 2500,
        isClosable: true,
        status: "success",
      });
      setButton(!button);
    } catch (err) {
      toast({
        title: "Error",
        position: "top",
        description: err?.response?.data,
        duration: 2500,
        isClosable: true,
        status: "error",
      });
      setButton(!button);
    }
  };

  // console.log(
  //   anyTransaction?.Transaction_details?.forEach((val) => console.log(val.qty))
  // );
  // console.log(anyTransaction);
  return (
    <div>
      <Header />
      <Row className="m-0">
        <Col>
          <Container>
            <Row>
              <SearchboxBootstrap />
            </Row>
            <Row>
              <div>Category</div>
            </Row>
            <Row>
              {products.length &&
                products.map((item, index) => (
                  <ProductCardCashier
                    currentTransaction={{ ...anyTransaction }}
                    setAnyTransaction={setAnyTransaction}
                    item={item}
                    index={index}
                    showTransaction={showTransaction}
                  />
                ))}
            </Row>
          </Container>
        </Col>
        {showTransaction ? (
          <Col lg={3}>
            <Container>
              <Button
                className="mb-2"
                variant="info"
                onClick={() => {
                  setShowTransaction(0);
                  setAnyTransaction({});
                }}
              >
                Back to Transaction List
              </Button>
              <Card>
                <Card.Header>
                  Order No. {anyTransaction?.id} |{" "}
                  {anyTransaction?.Transaction_order_type?.order_type} |{" "}
                  {anyTransaction?.name}
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <div>Current item(s):</div>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qty</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {anyTransaction?.Transaction_details?.map(
                          (val, index) => (
                            <TableTransaction product={val} index={index} />
                          )
                        )}
                        <tr>
                          <td colSpan={2}>GrandTotal</td>
                          <td>
                            {anyTransaction?.Transaction_details?.reduce(
                              (acc, val) => acc + val.price * val.qty,
                              0
                            ).toLocaleString(`id-ID`)}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </ListGroup.Item>
                  <ListGroup.Item>TotalOrder</ListGroup.Item>
                  <ListGroup.Item>
                    <ButtonGroup className="w-100">
                      <Button variant="info" onClick={handleReset}>
                        Reset
                      </Button>
                      <Button
                        variant="info"
                        onClick={
                          button
                            ? handleSave
                            : () =>
                                toast({
                                  title: "Your request is one process",
                                  position: "top",
                                  status: "warning",
                                  isClosable: true,
                                  duration: 2000,
                                })
                        }
                      >
                        Save
                      </Button>
                      <Button variant="info">Pay</Button>
                    </ButtonGroup>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Container>
          </Col>
        ) : (
          <Col lg={2}>
            <Button
              variant="info"
              className="position-relative w-100"
              onClick={() => setNewTransaction(!newTransaction)}
            >
              New Transaction
            </Button>
            {newTransaction ? (
              <div className="d-flex flex-column gap-2 my-2">
                <Button variant="info" onClick={() => createNewTransaction(1)}>
                  Dine In
                </Button>
                <Button variant="info" onClick={() => createNewTransaction(2)}>
                  Take Away
                </Button>
                <Button variant="info" onClick={() => createNewTransaction(3)}>
                  Cathering
                </Button>
              </div>
            ) : null}
            <ListGroup variant="flush" className="mt-2">
              Outstanding Transaction: {totalOutstandingTransaction}
              <ListGroup.Item>
                {outstandingTransaction.length &&
                  outstandingTransaction.map((val, index) => (
                    <div
                      key={`transaction-${index}`}
                      className="bg-info text-center my-2 rounded-pill"
                      type="button"
                      onClick={() => setShowTransaction(val.id)}
                    >
                      Order {val.id}
                      {val.name ? ` | ` + val.name : null}
                    </div>
                  ))}
              </ListGroup.Item>
              <ListGroup.Item>orderList</ListGroup.Item>
              <ListGroup.Item>TotalOrder</ListGroup.Item>
              <ListGroup.Item>Reset Save Pay</ListGroup.Item>
            </ListGroup>
          </Col>
        )}
      </Row>
    </div>
  );
};

const TableTransaction = ({ product, index }) => {
  return product?.qty ? (
    <tr key={`transactionItem-` + product.id}>
      <td>{product?.Product?.productName}</td>
      <td>{product?.qty}</td>
      <td>{(product?.price).toLocaleString("id-ID")}</td>{" "}
    </tr>
  ) : null;
};
