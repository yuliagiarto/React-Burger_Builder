import React, { Component } from "react";
import { connect } from "react-redux";
import classes from "./ContactData.css";
import Button from "../../../components/UI/Button/Button";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name",
        },
        value: "",
        validation: {
          required: {
            value: true,
            message: "This field can't be empty!",
          },
        },
        valid: false,
        touched: false,
        errMsg: "",
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Street",
        },
        value: "",
        validation: {
          required: {
            value: true,
            message: "This field can't be empty!",
          },
        },
        valid: false,
        touched: false,
        errMsg: "",
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Zip Code",
        },
        value: "",
        validation: {
          required: {
            value: true,
            message: "This field can't be empty!",
          },
          minLength: {
            value: 5,
            message: "Please enter min 5 chars!",
          },
          maxLength: {
            value: 5,
            message: "Please enter max 5 chars!",
          },
        },
        valid: false,
        touched: false,
        errMsg: "",
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Country",
        },
        value: "",
        validation: {
          required: {
            value: true,
            message: "This field can't be empty!",
          },
        },
        valid: false,
        touched: false,
        errMsg: "",
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your Email",
        },
        value: "",
        validation: {
          required: {
            value: true,
            message: "This field can't be empty!",
          },
          format: {
            value: /\S+@\S+\.\S+/,
            message: "Email format is invalid!",
          },
        },
        valid: false,
        touched: false,
        errMsg: "",
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" },
          ],
        },
        value: "fastest",
        valid: true,
      },
    },
    formIsValid: false,
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const formData = {};
    for (let formElemIdenfier in this.state.orderForm) {
      formData[formElemIdenfier] = this.state.orderForm[formElemIdenfier].value;
    }
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
    };

    axios
      .post("/orders.json", order)
      .then((response) => {
        this.setState({ loading: false });
        this.props.history.push("/");
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
    console.log(this.props.ings);
  };

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
    return [isValid, errMsg];
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = { ...this.state.orderForm };
    const updatedFormElem = { ...updatedOrderForm[inputIdentifier] };
    updatedFormElem.value = event.target.value;
    console.log(updatedFormElem.validation);
    [updatedFormElem.valid, updatedFormElem.errMsg] = this.checkValidity(
      updatedFormElem.value,
      updatedFormElem.validation
    );
    updatedFormElem.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElem;

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({
      orderForm: updatedOrderForm,
      formIsValid,
    });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map((formElem) => (
          <Input
            key={formElem.id}
            elementType={formElem.config.elementType}
            elementConfig={formElem.config.elementConfig}
            value={formElem.config.value}
            errorMessage={formElem.config.errMsg}
            invalid={!formElem.config.valid}
            touched={formElem.config.touched}
            shouldValidate={formElem.config.validation}
            changed={(event) => this.inputChangedHandler(event, formElem.id)}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Entry your contact data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
    price: state.totalPrice,
  };
};

export default connect(mapStateToProps)(ContactData);
