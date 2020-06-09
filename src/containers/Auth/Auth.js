import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Input from "../../components/UI/Input/Input";
import Spinner from "../../components/UI/Spinner/Spinner";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.css";
import * as actions from "../../store/actions/index";

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Mail Address",
        },
        value: "",
        validation: {
          required: {
            value: true,
            message: "This field can't be empty!",
          },
          isEmail: {
            value: true,
            message: "Email format is invalid!",
          },
        },
        valid: false,
        touched: false,
        errMsg: "",
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password",
        },
        value: "",
        validation: {
          required: {
            value: true,
            message: "This field can't be empty!",
          },
          minLength: {
            value: 7,
            message: "Minimum 7 chars",
          },
        },
        valid: false,
        touched: false,
        errMsg: "",
      },
    },
    isSignup: true,
  };

  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== "/") {
      this.props.onSetAuthRedirectPath();
    }
    console.log(this.props.authRedirectPath);
  }

  checkValidity(value, rules) {
    let isValid = true;
    let errMsg = "";
    if (!rules) {
      return [true, ""];
    }
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
      errMsg = rules.required.message;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength.value && isValid;
      errMsg = rules.minLength.message;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength.value && isValid;
      errMsg = rules.maxLength.message;
    }
    if (rules.format) {
      isValid = value.match(rules.format.value) && isValid;
      errMsg = rules.format.message;
    }
    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
      errMsg = rules.isEmail.message;
    }
    return [isValid, errMsg];
  }
  inputChangedHandler = (event, controlName) => {
    const [valid, errMsg] = this.checkValidity(
      event.target.value,
      this.state.controls[controlName].validation
    );
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: valid,
        errMsg: errMsg,
        touched: true,
      },
    };
    this.setState({ controls: updatedControls });
  };

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignup
    );
  };

  switchAuthModeHandler = () => {
    this.setState((prevState) => {
      return { isSignup: !prevState.isSignup };
    });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }
    let form = formElementsArray.map((formElement) => {
      return (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          errorMessage={formElement.config.errMsg}
          invalid={!formElement.config.valid}
          touched={formElement.config.touched}
          shouldValidate={formElement.config.validation}
          changed={(event) => this.inputChangedHandler(event, formElement.id)}
        />
      );
    });
    if (this.props.loading) {
      form = <Spinner />;
    }
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }
    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />;
    }
    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button btnType="Danger" clicked={this.switchAuthModeHandler}>
          SWITCH TO {this.state.isSignup ? "SIGNIN" : "SIGNUP"}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/")),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
