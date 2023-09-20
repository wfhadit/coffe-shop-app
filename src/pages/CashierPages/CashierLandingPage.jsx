import {
  Button,
  ButtonGroup,
  Card,
  Col,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import { Header } from "../../components/Header";
import { useEffect, useRef, useState } from "react";
import { API_URL, api } from "../../API/api";
import { SearchboxBootstrap } from "../../components/SearchboxBootstrap";
import { ProductCardCashier } from "../../components/ProductCard";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import "../Adminpages/style.css";
import { SVGtrash } from "../../components/SVG/SVGtrash";
import { SVGup } from "../../components/SVG/SVGup";
import { SVGdown } from "../../components/SVG/SVGdown";
import { SVGx } from "../../components/SVG/SVGx";
import { ModalConfirmationPayResetDeleteTransaction } from "../../components/ModalConfirmationPayResetDeleteTransaction";
import { ModalEditTransaction } from "../../components/ModalEditTransaction";
import { io } from "socket.io-client";

const socketConnection = io(API_URL);

export const CashierLandingPage = () => {
  const toast = useToast();
  const [searchKey, setSearchKey] = useState("");
  const [button, setButton] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState(0);
  const [products, setProducts] = useState([]);
  const [showTransaction, setShowTransaction] = useState(0); // untuk show transaction
  const [showModal, setShowModal] = useState("");
  const [modalEditTransaction, setModalEditTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState(false);
  const [outstandingTransaction, setOutstandingTransaction] = useState([]);
  const [anyTransaction, setAnyTransaction] = useState({});
  const [totalOutstandingTransaction, setTotalOutstandingTransaction] =
    useState(0);
  const userSelector = useSelector((state) => state.auth);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/category");
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOutstandingTransaction = async () => {
    try {
      const { data } = await api.get("/transactions/outstanding", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("cs-token"),
          "api-key": userSelector?.username,
        },
      });
      setOutstandingTransaction(data.rows);
      setTotalOutstandingTransaction(data.count);
      socketConnection.on(`NEW_TRANSACTION`, (newTransaction) => {
        fetchOutstandingTransaction();
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAnyTransaction = async (transactionId) => {
    try {
      if (transactionId) {
        const { data } = await api.get("/transactions/" + transactionId, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("cs-token"),
            "api-key": userSelector?.username,
          },
        });
        setAnyTransaction(data);
      }
    } catch (err) {
      console.log(err);
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
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("cs-token"),
            "api-key": userSelector?.username,
          },
        }
      )
      .then((res) => {
        fetchOutstandingTransaction();
      })
      .catch((err) => console.log(err));

    setNewTransaction(!newTransaction);
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await api.delete("/transactions/" + transactionId, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("cs-token"),
          "api-key": userSelector?.username,
        },
      });
      fetchOutstandingTransaction();
      fetchProducts();
    } catch (err) {
      console.log(err);
      if (typeof err?.response?.data === "string")
        toast({
          title: err?.response?.data,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      if (typeof err?.response?.data === "object") {
        toast({
          title: err?.response?.data[0],
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  const handleReset = async () => {
    const temp = { ...anyTransaction };
    temp?.Transaction_details?.forEach((val) => {
      val.qty = 0;
    });
    setAnyTransaction(temp);
    handleSave();
  };

  const handleSave = async () => {
    try {
      setButton(false);
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
      await fetchAnyTransaction(showTransaction);
      fetchProducts();
      toast({
        title: "Successfully update this transaction",
        position: "top",
        duration: 2500,
        isClosable: true,
        status: "success",
      });
      setButton(true);
    } catch (err) {
      toast({
        title: "Error",
        position: "top",
        description:
          typeof err?.response?.data === "string"
            ? err?.response?.data
            : err?.response?.data.errors[0],
        duration: 2500,
        isClosable: true,
        status: "error",
      });
      setButton(true);
      return 0;
    }
  };

  const handlePay = async () => {
    try {
      await handleSave().then((result) => {
        if (result === 0)
          throw new Error("Error in updating transaction details to database");
      });
      anyTransaction.isPaid = true;
      anyTransaction.total =
        (11 / 100) *
          anyTransaction?.Transaction_details?.reduce(
            (acc, val) => acc + val.price * val.qty,
            0
          ) +
        anyTransaction?.Transaction_details?.reduce(
          (acc, val) => acc + val.price * val.qty,
          0
        );

      await api
        .patch(`/transactions/` + anyTransaction.id, anyTransaction, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("cs-token"),
            "api-key": userSelector?.username,
          },
        })
        .then(
          toast({
            status: "success",
            title: "This transaction is complete",
            position: "top",
            duration: 2500,
            isClosable: true,
          })
        );
      fetchOutstandingTransaction();
      setShowTransaction(0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeTransaction = async (order_type, name) => {
    const data = {
      ...anyTransaction,
      name,
      ...(order_type && { order_type: Number(order_type) }),
    };
    delete data.updatedAt;
    delete data.createdAt;
    await api
      .patch(`/transactions/` + anyTransaction?.id, data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("cs-token"),
          "api-key": userSelector?.username,
        },
      })
      .catch((err) => console.log(err));
    fetchAnyTransaction(anyTransaction?.id);
    fetchOutstandingTransaction();
  };

  useEffect(() => {
    fetchAnyTransaction(showTransaction);
    fetchProducts();
  }, [showTransaction]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchOutstandingTransaction();

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <div>
      <Header />
      <Row className="m-0 mt-2">
        <Col className="xs-no-p-m">
          {/* <Container> */}
          <Row className="mb-2 mx-0">
            <SearchboxBootstrap setSearchKey={setSearchKey} />
          </Row>
          <Row className="m-0">
            <div className="d-flex gap-2 flex-wrap">
              <Button
                className={
                  searchCategory === 0
                    ? "text-dark bg-primary py-0 px-3 card-cashier-page"
                    : "text-dark bg-cyan-300 border-cyan-300 py-0 px-3 card-cashier-page"
                }
                id={`category` + 0}
                onClick={(e) => setSearchCategory(0)}
              >
                All
              </Button>
              {categories.map((category, index) => (
                <Button
                  key={`category-` + index}
                  className={
                    searchCategory === category.id
                      ? "text-dark bg-primary py-0 px-1 card-cashier-page"
                      : "text-dark bg-cyan-300 border-cyan-300 py-0 px-1 card-cashier-page"
                  }
                  id={`category` + category.id}
                  onClick={(e) =>
                    setSearchCategory(Number(e.target.id.slice(8)))
                  }
                >
                  {category.category_name}
                </Button>
              ))}
            </div>
          </Row>
          <Row className="m-0">
            {products.length &&
              products.map((item, index) => {
                return (
                  <ProductCardCashier
                    products={products}
                    setProducts={setProducts}
                    currentTransaction={{ ...anyTransaction }}
                    setAnyTransaction={setAnyTransaction}
                    item={item}
                    index={index}
                    showTransaction={showTransaction}
                    searchKey={searchKey}
                    searchCategory={searchCategory}
                  />
                );
              })}
          </Row>
          {/* </Container> */}
        </Col>
        {showTransaction ? (
          <Col lg={4} xs={6} className="col">
            {/* <Container> */}
            <Button
              className="mb-2 d-xxs-smallfont bg-cyan-300 border-info-subtle text-dark"
              onClick={() => {
                setShowTransaction(0);
                setAnyTransaction({});
              }}
            >
              Back to Transaction List
            </Button>
            <Card>
              <Card.Header
                className={
                  "" + anyTransaction?.Transaction_order_type?.order_type ===
                  "Dine In"
                    ? "d-flex flex-wrap bg-info-subtle justify-content-between"
                    : anyTransaction?.Transaction_order_type?.order_type ===
                      "Take Away"
                    ? "d-flex flex-wrap bg-success-subtle justify-content-between"
                    : anyTransaction?.Transaction_order_type?.order_type ===
                      "Catering"
                    ? "d-flex flex-wrap bg-warning-subtle justify-content-between"
                    : "d-flex flex-wrap justify-content-between"
                }
              >
                <ModalEditTransaction
                  show={modalEditTransaction}
                  setShow={setModalEditTransaction}
                  currentTransaction={{ ...anyTransaction }}
                  setAnyTransaction={setAnyTransaction}
                  handleChangeTransaction={handleChangeTransaction}
                />
                <span className="border border-secondary rounded px-1 td-cashier-page">
                  Order No. {anyTransaction?.id}
                </span>
                <span
                  className="border border-secondary rounded px-1 d-flex align-items-center gap-2 td-cashier-page"
                  onClick={() => setModalEditTransaction(true)}
                  type="button"
                >
                  {anyTransaction?.Transaction_order_type?.order_type}{" "}
                  <SVGdown />
                </span>
                <span
                  className="border border-secondary rounded px-1 d-flex align-items-center gap-2 td-cashier-page"
                  onClick={() => setModalEditTransaction(true)}
                  type="button"
                >
                  {anyTransaction?.name ? anyTransaction?.name : "Table/Name"}{" "}
                  <SVGdown />
                </span>
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <div>Current item(s):</div>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th className="td-cashier-page">Item</th>
                        <th className="td-cashier-page">Qty</th>
                        <th className="td-cashier-page">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anyTransaction?.Transaction_details?.map(
                        (val, index) => (
                          <TableTransaction
                            product={val}
                            setProducts={setProducts}
                            products={products}
                            index={index}
                            currentTransaction={{ ...anyTransaction }}
                            setAnyTransaction={setAnyTransaction}
                            handleSave={handleSave}
                          />
                        )
                      )}
                    </tbody>
                  </Table>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex w-100 justify-content-between">
                    <b className="td-cashier-page">Tax: </b>
                    <span className="td-cashier-page">
                      <b>
                        IDR
                        {(
                          (11 / 100) *
                          anyTransaction?.Transaction_details?.reduce(
                            (acc, val) => acc + val.price * val.qty,
                            0
                          )
                        ).toLocaleString(`id-ID`)}
                      </b>
                    </span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex w-100 justify-content-between">
                    <b className="td-cashier-page">Grand total: </b>
                    <span className="td-cashier-page">
                      <b>
                        IDR
                        {(
                          (11 / 100) *
                            anyTransaction?.Transaction_details?.reduce(
                              (acc, val) => acc + val.price * val.qty,
                              0
                            ) +
                          anyTransaction?.Transaction_details?.reduce(
                            (acc, val) => acc + val.price * val.qty,
                            0
                          )
                        ).toLocaleString(`id-ID`)}
                      </b>
                    </span>
                  </div>
                </ListGroup.Item>
                <ModalConfirmationPayResetDeleteTransaction
                  action={handleReset}
                  setShow={setShowModal}
                  show={showModal}
                  handleDeleteTransaction={handleDeleteTransaction}
                  handlePay={handlePay}
                />
                <ListGroup.Item>
                  <ButtonGroup className="w-100">
                    <Button
                      variant="info"
                      onClick={() => setShowModal("RESET TRANSACTION")}
                      className="d-xxs-smallfont bg-cyan-300 border-info-subtle text-dark"
                    >
                      Reset
                    </Button>
                    <Button
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
                      className="d-xxs-smallfont bg-cyan-300 border-info-subtle text-dark"
                    >
                      Save
                    </Button>
                    <Button
                      className="d-xxs-smallfont bg-cyan-300 border-info-subtle text-dark"
                      onClick={() => setShowModal("PAY")}
                    >
                      Pay
                    </Button>
                  </ButtonGroup>
                </ListGroup.Item>
              </ListGroup>
            </Card>
            {/* </Container> */}
          </Col>
        ) : (
          <Col xl={2} lg={3} xs={4} className="col">
            <Button
              className="position-relative w-100 bg-cyan-300 border-info-subtle text-dark"
              variant="info"
              onClick={() => setNewTransaction(!newTransaction)}
            >
              New Transaction
            </Button>
            {newTransaction ? (
              <div className="d-flex flex-column gap-2 my-2">
                <Button
                  variant="text-dark bg-info-subtle border-info-subtle"
                  onClick={() => createNewTransaction(1)}
                >
                  Dine In
                </Button>
                <Button
                  onClick={() => createNewTransaction(2)}
                  variant="success"
                  className="text-dark bg-success-subtle border-success-subtle"
                >
                  Take Away
                </Button>
                <Button
                  variant="warning"
                  className="bg-warning-subtle border-warning-subtle"
                  onClick={() => createNewTransaction(3)}
                >
                  Cathering
                </Button>
              </div>
            ) : null}
            <ListGroup variant="flush" className="mt-2 text-center">
              <span>
                Outstanding Transaction: <b>{totalOutstandingTransaction}</b>
              </span>
              <ListGroup.Item key={`group-item`}>
                {outstandingTransaction.length &&
                  outstandingTransaction.map((val, index) => (
                    <div key={`transaction-${index}`} className="d-flex mt-2">
                      <span
                        className="d-flex align-items-center justify-content-center"
                        type="button"
                        onClick={() => {
                          setShowModal(val.id);
                        }}
                      >
                        <SVGtrash />
                      </span>
                      <ModalConfirmationPayResetDeleteTransaction
                        setShow={setShowModal}
                        show={showModal}
                        handleDeleteTransaction={handleDeleteTransaction}
                      />
                      <div
                        className={`d-flex py-1 px-2 justify-content-center rounded-pill gap-1 w-100 ${
                          val.order_type === 1
                            ? "bg-info-subtle"
                            : val.order_type === 2
                            ? "bg-success-subtle"
                            : val.order_type === 3
                            ? "bg-warning-subtle"
                            : null
                        }`}
                        type="button"
                        onClick={() => {
                          if (!localStorage.getItem("cs-token"))
                            return toast({
                              status: "warning",
                              title: "Login first",
                              isClosable: true,
                              duration: 2000,
                              position: "top",
                              description: (
                                <a href="/login">Sign in Click Here!</a>
                              ),
                            });
                          setShowTransaction(val.id);
                        }}
                      >
                        <span>Order</span>
                        <span>{val.id}</span>
                        <span>{val.name}</span>
                      </div>
                    </div>
                  ))}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        )}
      </Row>
    </div>
  );
};

const TableTransaction = ({
  product,
  index,
  currentTransaction,
  setAnyTransaction,
  products,
  setProducts,
}) => {
  const toast = useToast();
  const [showModal, setShowModal] = useState("");
  const [quantity, setQuantity] = useState(
    currentTransaction.Transaction_details[index].qty
  );
  const indexProduct = products.findIndex(
    (val) => val.id === product?.Product?.id
  );

  const [stock, setStock] = useState(0);
  useEffect(() => {
    setStock(products[indexProduct]?.stock);
  }, [products[indexProduct]?.stock]);

  const ref = useRef();
  const handleDeleteTransactionDetail = () => {
    currentTransaction.Transaction_details[index].qty = 0;
    setAnyTransaction(currentTransaction);
  };

  const handleAddQuantity = () => {
    if (stock === 0)
      return toast({
        title: "Quantity reachs maximum stock",
        duration: 2000,
        isClosable: true,
        position: "top",
        status: "warning",
      });
    ref.current = quantity;
    ref.current += 1;
    const newStock = stock - 1;
    setStock(newStock);
    const temp = [...products];
    temp[indexProduct].stock = newStock;
    setProducts(temp);
    setQuantity(ref.current);
  };
  const handleSubtractQuantity = () => {
    if (quantity === 0) return;
    ref.current = quantity;
    ref.current -= 1;
    const newStock = stock + 1;
    setStock(newStock);
    const temp = [...products];
    temp[indexProduct].stock = newStock;
    setProducts(temp);
    setQuantity(ref.current);
  };

  useEffect(() => {
    setQuantity(currentTransaction.Transaction_details[index].qty);
  }, [currentTransaction.Transaction_details[index].qty]);

  useEffect(() => {
    currentTransaction.Transaction_details[index].qty = quantity;
    setAnyTransaction(currentTransaction);
  }, [quantity]);
  return product?.qty ? (
    <tr key={`transactionItem-` + product.id}>
      <td className="td-cashier-page max-702 position-relative align-middle w-50">
        <div className="position-relative d-flex align-items-center">
          <span
            type="button"
            className="float-start text-danger"
            style={{ right: "0" }}
            onClick={() => setShowModal("DELETE TRANSACTION")}
          >
            <SVGx />
          </span>
          <span
            className="w-100 d-flex align-items-center"
            style={{
              wordBreak: "break-word",
            }}
          >
            {product?.Product?.productName}
          </span>
        </div>
      </td>
      <td className="td-cashier-page position-relative text-center align-middle">
        <span
          className="d-flex w-100 justify-content-center"
          type="button"
          onClick={handleAddQuantity}
        >
          <SVGup />
        </span>
        <span>{quantity}</span>
        <span
          className="d-flex w-100 justify-content-center"
          type="button"
          onClick={handleSubtractQuantity}
        >
          <SVGdown />
        </span>
      </td>
      <td className="td-cashier-page align-middle text-center">
        <div>{(product?.price).toLocaleString("id-ID")}</div>
      </td>
      <ModalConfirmationPayResetDeleteTransaction
        action={handleDeleteTransactionDetail}
        show={showModal}
        setShow={setShowModal}
      />
    </tr>
  ) : null;
};
