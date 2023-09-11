import { Button, Container, Table } from "react-bootstrap";
import { Header } from "../../components/Header";

export const CashierAccountManagement = () => {
  return (
    <div>
      <Header />
      <Container>
        <div className="d-flex flex-column w-100 justify-content-center py-3">
          <h3 className="d-flex align-items-center">
            All Cashier Account
            <span className="mx-2">
              <Button variant="secondary">Add New Account</Button>
            </span>
          </h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Account Creation</th>
              </tr>
            </thead>
            <tbody>
              {}
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>@mdo</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};
