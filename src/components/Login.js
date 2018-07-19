import React from "react";
import firebase from "../index";
import md5 from "md5";
//prettier-ignore
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { Link } from "react-router-dom";

class Login extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    usersRef: firebase.database().ref("users")
  };

  isFormValid = () => {
    let errors = [];

    if (this.isFormEmpty()) {
      // prettier-ignore
      errors = [...this.state.errors, { message: "Fill in all fields", type: "formEmpty" }];
      this.setState({ errors });
      return false;
    } else if (!this.isPasswordValid()) {
      // prettier-ignore
      errors = [...this.state.errors, { message: "Password is invalid", type: "passwordInvalid" }];
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
      this.setState({ errors: [] });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          console.log("user registered", user.user.email);
          user.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                user.user.email
              )}?d=identicon`
            })
            .then(
              () => {
                this.saveUser(user).then(() => {
                  console.log(user.user);
                  this.props.history.push("/");
                });
              },
              err => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat([
                    { message: err.message, type: err.name }
                  ])
                });
              }
            );
        })
        .catch(err => {
          console.error(err);
          // prettier-ignore
          this.setState({ errors: this.state.errors.concat([{ message: err.message, type: err.name }]) });
        });
    }
  };

  saveUser = user => {
    console.log(user.user);
    return this.state.usersRef.child(user.user.uid).set({
      name: user.user.displayName,
      avatar: user.user.photoURL
    });
  };

  handleChange = event => {
    let trimmedValue = event.target.value.trim();
    this.setState({ [event.target.name]: trimmedValue });
  };

  displayErrors = () =>
    this.state.errors.map((error, i) => (
      <Message key={i} error header="Error" content={error.message} />
    ));

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors
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
              Slack Clone
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
                    errors.some(el => el.type === "passwordInvalid")
                      ? "error"
                      : null
                  }
                  autoComplete="new-password"
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
                  autoComplete="new-password"
                />
                <Button color="orange" fluid size="large">
                  Login
                </Button>
              </Segment>
            </Form>
            {!!errors.length && this.displayErrors()}
            <Message>
              Already a user? <Link to="/register">Register</Link>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Login;
