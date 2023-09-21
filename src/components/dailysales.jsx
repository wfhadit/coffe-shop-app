import Table from "react-bootstrap/Table";
import { Center } from "@chakra-ui/layout";

export const DailySalesList = ({
  transactions = [],
  handleInputForQueryString,
}) => {
  return (
    <>
      <input type="date" id="datefrom" onChange={handleInputForQueryString} />
      <input type="date" id="dateto" onChange={handleInputForQueryString} />
      <Center>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction</th>
              <th>Order Type</th>
              <th>Staff</th>
              <th>Total</th>
              <th className="d-none d-sm-table-cell">Details</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((transaction) => (
              <tr>
                <td>{transaction.createdAt.slice(0, 10)}</td>
                <td>{transaction.id}</td>
                <td>{transaction.Transaction_order_type.order_type}</td>
                <td>{transaction.User.username}</td>
                <td>{transaction.total}</td>
                <td className="d-none d-sm-table-cell">
                  <Table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction.Transaction_details.map((detail) => (
                        <tr>
                          <td>{detail.Product.productName}</td>
                          <td>{detail.qty}</td>
                          <td>{detail.price}</td>
                          <td>11%</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </td>
                {/* {transaction.Transaction_details.map((detail) => (
                <div>
                  {detail.Product.productName}*{detail.qty}={detail.price}
                  +tax10%
                </div> */}
                {/* ))} */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Center>
    </>
  );
};
