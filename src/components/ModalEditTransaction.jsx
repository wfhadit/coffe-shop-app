import { async } from "q";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { api } from "../API/api";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export const ModalEditTransaction = ({
  show,
  setShow,
  currentTransaction,
  handleChangeTransaction,
}) => {
  const userSelector = useSelector((state) => state.auth);
  const handleClose = () => setShow(false);
  const [orderTypes, setOrderTypes] = useState([]);
  const fetchOrderType = async () => {
    try {
      const { data } = await api.get("/transactions/order_type", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("cs-token"),
          "api-key": userSelector?.username,
        },
      });
      setOrderTypes(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrderType();
  }, []);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>ORDER ID {currentTransaction?.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="nameOrTableNumber">
            <Form.Label>Name / Table Number:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name or table number"
              autoFocus
              defaultValue={currentTransaction?.name}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Order type:</Form.Label>
            <select
              name="order_type"
              id="ordertype_selectoption"
              defaultValue={currentTransaction?.order_type}
            >
              {orderTypes.length &&
                orderTypes.map((orderType, index) => (
                  <option value={orderType.id} index={`ordertype-` + index}>
                    {orderType.order_type}
                  </option>
                ))}
            </select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="bg-secondary border-secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          className="bg-cyan-300 border-cyan-300 text-dark"
          onClick={async () => {
            handleChangeTransaction(
              document.getElementById("ordertype_selectoption").value,
              document.getElementById("nameOrTableNumber").value
            );
            handleClose();
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
