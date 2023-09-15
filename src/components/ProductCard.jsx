import { Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { SVGminus, SVGplus } from "./SVG/SVGplus";
import { useEffect, useRef, useState } from "react";
import "../pages/Adminpages/style.css";
import { useToast } from "@chakra-ui/react";

export const ProductCardCashier = ({
  item,
  index,
  showTransaction,
  currentTransaction,
  setAnyTransaction,
}) => {
  const [showItemController, setShowItemController] = useState(false);
  const currentItemTransaction =
    currentTransaction?.Transaction_details?.findLast(
      (val) => val.productId == item.id
    );
  const toast = useToast();

  let last_qty = currentItemTransaction?.qty ? currentItemTransaction?.qty : 0;
  const [quantity, setQuantity] = useState(last_qty);
  const ref = useRef(quantity);

  useEffect(() => {
    setQuantity(last_qty); // isi nilai quantity
  }, [last_qty]);

  useEffect(() => {
    ref.current = quantity;
  }, [quantity]);

  useEffect(() => {
    const modifyTransaction = setTimeout(() => {
      if (!last_qty && quantity > 0) {
        currentTransaction?.Transaction_details?.push({
          transactionId: currentTransaction?.id,
          price: item.price,
          productId: item.id,
          qty: quantity,
          discount: 0,
          status: 1,
          Product: { productName: item?.productName },
        });
      } else if (last_qty || currentItemTransaction?.productId) {
        const index = currentTransaction?.Transaction_details.findLastIndex(
          (val) => val.productId === item.id
        );
        currentTransaction?.Transaction_details.splice(index, 1, {
          ...currentItemTransaction,
          ["qty"]: quantity,
        });
      }
      setAnyTransaction(currentTransaction);
    }, 1000);
    return () => {
      clearTimeout(modifyTransaction);
    };
  }, [quantity]);
  return (
    <Col key={`cardProd-${index}`} lg={3}>
      <Card
        className="position-relative"
        type="button"
        onClick={
          showTransaction
            ? () => setShowItemController(true)
            : () =>
                toast({
                  title: "Please Choose A Transaction on the right side",
                  position: "top",
                  duration: 2000,
                  isClosable: true,
                })
        }
        // onTouchStart={() => setShowItemController(false)}
        onMouseEnter={() => setShowItemController(true)}
        onMouseLeave={() => setShowItemController(false)}
      >
        <Card.Img
          variant="top"
          src={`http://localhost:2500/public/product/` + item.imageName}
          style={{
            aspectRatio: "1/1",
            maxHeight: "240px",
            objectFit: "cover",
            ...(showItemController && showTransaction
              ? { opacity: "0.5" }
              : null),
          }}
        />
        {showItemController && showTransaction ? (
          <div
            className="position-absolute d-flex justify-content-center w-100 gap-3"
            style={{ top: "100px", zIndex: "2" }}
          >
            <div
              type="button"
              onClick={() => {
                ref.current -= 1;
                if (ref.current < 0) ref.current = 0;
                setQuantity(ref.current);
              }}
            >
              <SVGminus />
            </div>
            <span
              style={{ width: "calc(20px + 2vw)", height: "calc(20px + 2vw)" }}
              className="d-flex align-items-center justify-content-center border border-dark rounded border-3"
            >
              <input
                type="number"
                min={0}
                value={quantity}
                style={{
                  maxWidth: "calc(15px + 2vw)",
                  fontSize: "calc(10px + 1vw)",
                  textAlign: "center",
                }}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              {/* <b style={{ fontSize: "calc(10px + 1vw)" }}>{quantity}</b> */}
            </span>
            <div
              onClick={() => {
                ref.current += 1;
                setQuantity(ref.current);
              }}
            >
              <SVGplus />
            </div>
          </div>
        ) : null}
        <Card.Body>
          <Card.Title>{item.productName}</Card.Title>
          {/* <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text> */}
        </Card.Body>
      </Card>
    </Col>
  );
};
