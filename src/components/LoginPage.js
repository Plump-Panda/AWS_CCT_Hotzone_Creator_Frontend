import {Form, Button, Modal} from 'react-bootstrap';

function LoginPage(props) {

  function handleLogin(){
    props.setIsLoggedIn(true);
  }

  return (
    <div className="App">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Contact Tracing Login</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={() => {handleLogin()}}>
            <Form.Group style={{textAlign: 'left'}} className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group style={{textAlign: 'left'}} className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
}

export default LoginPage;
