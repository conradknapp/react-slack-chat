import React from "react";
import firebase from "../index";
import md5 from "md5";
//prettier-ignore
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setUser } from "../actions";

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    usersRef: firebase.database().ref("users"),
    loading: false
  };

  isFormValid = () => {
    let errors = [];

    if (this.isFormEmpty()) {
      // prettier-ignore
      errors = [{ message: "Fill in all fields", type: "formEmpty" }];
      this.setState({ errors });
      return false;
    } else if (!this.isPasswordValid()) {
      // prettier-ignore
      errors = [{ message: "Password is invalid", type: "passwordInvalid" }];
      this.setState({ errors });
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = () => {
    const { username, email, password, passwordConfirmation } = this.state;

    // prettier-ignore
    if (!username.length || !email.length || !password.length || !passwordConfirmation.length) {
      return true;
    } else {
      return false;
    }
  };

  isPasswordValid = () => {
    const { password, passwordConfirmation } = this.state;

    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  registerUser = event => {
    console.log("registering...");

    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log("user registered", createdUser.user.email);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(
              () => {
                this.saveUser(createdUser).then(() => {
                  console.log(createdUser.user);
                  this.props.setUser(createdUser.user);
                  this.props.history.push("/");
                });
              },
              err => {
                console.error(err);
                // prettier-ignore
                this.setState({
                  errors: this.state.errors.concat([{ message: err.message, type: err.name }]),
                  loading: false
                });
              }
            );
        })
        .catch(err => {
          console.error(err);
          // prettier-ignore
          this.setState({
            errors: this.state.errors.concat([{ message: err.message, type: err.name }]),
            loading: false
          });
        });
    }
  };

  saveUser = createdUser => {
    console.log(createdUser.user);
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  handleChange = event => {
    let trimmedValue = event.target.value.trim();
    this.setState({ [event.target.name]: trimmedValue });
  };

  displayErrors = () =>
    this.state.errors.map((error, i) => <p key={i}>{error.message}</p>);

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;

    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="orange" textAlign="center">
              Register
            </Header>
            <Form size="large" onSubmit={this.registerUser} className="error">
              <Segment stacked>
                <Form.Input
                  fluid
                  name="username"
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                  onChange={this.handleChange}
                  value={username}
                  required={true}
                />
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
                    errors.some(el => el.includes("password")) ? "error" : null
                  }
                  autoComplete="password"
                  required={true}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password Confirmation"
                  type="password"
                  name="passwordConfirmation"
                  onChange={this.handleChange}
                  value={passwordConfirmation}
                  className={
                    errors.some(el => el.type === "passwordInvalid")
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
              Already a user? <Link to="/login">Login</Link>
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
)(Register);
