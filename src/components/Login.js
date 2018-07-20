import React from "react";
import firebase from "../index";
//prettier-ignore
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setUser } from "../actions";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false
  };

  loginUser = () => {
    console.log("login");
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          this.props.setUser(signedInUser.user);
          this.props.history.push("/");
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat([
              { message: err.message, type: err.name }
            ]),
            loading: false
          });
        });
    }
  };

  isFormValid = () => {
    if (this.state.email && this.state.password) {
      return true;
    } else {
      return false;
    }
  };

  handleChange = event => {
    let trimmedValue = event.target.value.trim();
    this.setState({ [event.target.name]: trimmedValue });
  };

  displayErrors = () =>
    this.state.errors.map((error, i) => <p key={i}>{error.message}</p>);

  render() {
    const { email, password, errors, loading } = this.state;

    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="orange" textAlign="center">
              Login
            </Header>
            <Form size="large" onSubmit={this.loginUser} className="error">
              <Segment stacked>
                <Form.Input
                  fluid
                  name="email"
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail address"
                  onChange={this.handleChange}
                  value={email}
                  className={
                    errors.some(el => el.message.includes("email"))
                      ? "error"
                      : null
                  }
                  autoComplete="email"
                  required={true}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  name="password"
                  onChange={this.handleChange}
                  value={password}
                  className={
                    errors.some(el => el.message.includes("password"))
                      ? "error"
                      : null
                  }
                  autoComplete="password"
                  required={true}
                />
                <Button
                  color="orange"
                  fluid
                  size="large"
                  className={loading ? "loading" : null}
                >
                  Submit
                </Button>
              </Segment>
            </Form>
            {!!errors.length && (
              <Message error>
                <h3>Error</h3>
                {this.displayErrors()}
              </Message>
            )}
            <Message>
              Don't have an account? <Link to="/register">Register</Link>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default connect(
  null,
  { setUser }
)(Login);
