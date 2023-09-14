import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

export const ModalCreateNewCashierAccount = ({
  show,
  setShowModal,
  formik,
}) => {
  const handleClose = () => {
    setShowModal("");
  };
  return (
    <Modal show={show === "ModalCreateNewCashierAccount"} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="usernameNewAccountForm">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              name="username"
              autoFocus
              onChange={formik.handleChange}
            />
            <div className="text-danger">{formik.errors.username}</div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="passwordNewAccountForm">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              autoFocus
              onChange={formik.handleChange}
            />
            <div className="text-danger">{formik.errors.password}</div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="fullnameNewAccountForm">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              autoFocus
              onChange={formik.handleChange}
            />
            <div className="text-danger">{formik.errors.fullname}</div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="phoneNewAccountForm">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              autoFocus
              onChange={formik.handleChange}
            />
            <div className="text-danger">{formik.errors.phone}</div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="emailNewAccountForm">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              autoFocus
              onChange={formik.handleChange}
            />
            <div className="text-danger">{formik.errors.email}</div>
          </Form.Group>
          <Form.Group className="mb-3 " controlId="genderNewAccountForm">
            <Form.Label>Gender</Form.Label>
            <span style={{ marginLeft: "10px" }}>
              <select name="gender" id="gender" onChange={formik.handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </span>
            <div className="text-danger">{formik.errors.gender}</div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={formik.handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
