import { Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { SVGminus, SVGplus } from "./SVG/SVGplus";
import { useEffect, useRef, useState } from "react";
import "../pages/Adminpages/style.css";
import { useToast } from "@chakra-ui/react";
import { API_URL } from "../API/api";

export const ProductCardCashier = ({
  products,
  setProducts,
  item,
  index,
  showTransaction,
  currentTransaction,
  setAnyTransaction,
  searchKey,
  searchCategory,
}) => {
  const [showItemController, setShowItemController] = useState(false);
  const currentItemTransaction =
    currentTransaction?.Transaction_details?.findLast(
      (val) => val.productId === item.id
    );
  const toast = useToast();
  let last_qty = currentItemTransaction?.qty ? currentItemTransaction?.qty : 0;
  const [quantity, setQuantity] = useState(last_qty);
  const ref = useRef();

  useEffect(() => {
    setQuantity(last_qty); // isi nilai quantity
  }, [last_qty]);

  useEffect(() => {
    ref.current = quantity;
  }, [quantity]);

  useEffect(() => {
    if (!last_qty && quantity > 0) {
      currentTransaction?.Transaction_details?.push({
        transactionId: currentTransaction?.id,
        price: item.price,
        productId: item.id,
        qty: quantity,
        discount: 0,
        status: 1,
        Product: { productName: item?.productName, id: item?.id },
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
    const temp = [...products];
    temp[index].stock += last_qty - quantity;
    setProducts(temp);
  }, [quantity]);

  return (
    <Col
      key={`cardProd-${index}`}
      xl={3}
      lg={4}
      md={6}
      xs={6}
      className="mt-3"
      hidden={
        searchCategory === 0
          ? item?.productName.toLowerCase().match(searchKey)
            ? false
            : true
          : searchCategory === item?.categoryId &&
            item?.productName.toLowerCase().match(searchKey)
          ? false
          : true
      }
    >
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
          src={API_URL + `/public/product/` + item.imageName}
          style={{
            aspectRatio: "1/1",
            width: "100%",
            objectFit: "cover",
            ...(showItemController && showTransaction
              ? { opacity: "0.5" }
              : null),
          }}
        />
        {showItemController && showTransaction ? (
          <div
            className="position-absolute d-flex justify-content-center w-100"
            style={{
              top: "5vw",
              zIndex: "2",
              gap: "calc(1vw)",
            }}
          >
            <div
              type="button"
              onClick={() => {
                if (ref.current < 0) return (ref.current = 0);
                if (ref.current === 0) return;
                ref.current -= 1;
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
                onChange={(e) => {
                  if (e.target.value > item.stock + last_qty) {
                    e.target.value = item.stock + last_qty;
                  }
                  setQuantity(Number(e.target.value));
                }}
              />
              {/* <b style={{ fontSize: "calc(10px + 1vw)" }}>{quantity}</b> */}
            </span>
            <div
              onClick={() => {
                if (item.stock === 0)
                  return toast({
                    status: "warning",
                    title: "Quantity reachs maximum stock",
                    isClosable: true,
                    duration: 2000,
                  });
                ref.current += 1;
                setQuantity(ref.current);
              }}
            >
              <SVGplus />
            </div>
          </div>
        ) : null}
        <Card.Title
          className="card-cashier-page text-center position-absolute bottom-0 w-100 mb-0 bg-cyan-300"
          style={{
            textTransform: "capitalize",
            maxHeight: "48px",
          }}
        >
          {item.productName.toLowerCase()}
        </Card.Title>
      </Card>
      <Card.Body>
        <Card.Text className="td-cashier-page text-center">
          Price: IDR{item?.price.toLocaleString(`id-ID`)}
        </Card.Text>
        <Card.Text className="td-cashier-page text-center">
          Stock: {item?.stock.toLocaleString(`id-ID`)}
        </Card.Text>
      </Card.Body>
    </Col>
  );
};
