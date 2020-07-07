import React, { Component } from "react"
import styled from "styled-components"

import "bootstrap/dist/css/bootstrap.min.css"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import AlertBS from "react-bootstrap/Alert"
import InputGroup from "react-bootstrap/InputGroup"
import FormControl from "react-bootstrap/FormControl"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

import OpenblocLogo from "./openbloc-logo.png"

const EmailInput = styled(FormControl)`
  border-radius: 22px;
  font-weight: 700;
  transition: 0.3s ease-in-out !important;
`

const SubmitButton = styled(Button)`
  color: #ffffff;
  background: #df4c16;
  border-color: #df4c16;
  border-radius: 22px;
  font-weight: 700;
  transition: 0.3s ease-in-out !important;

  &:hover {
    background: #e95620;
    border-color: #df4c16;
  }
`

const Form = styled.form`
  margin-bottom: 2em;
`

const CenteredCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const A = styled.a`
  color: #fff;
`

const Alert = styled(AlertBS)`
  border-radius: 22px;
`


export class TopButtonContent extends Component {
  constructor() {
    super()
    this.state = {email: '', waiting:false, status: null}
  }
  submitForm(event) {
    event.preventDefault()
    alert(JSON.stringify(this.state))
    this.setState({waiting: true})
    const data = {
      email: this.state.email,
      emailType: "subscribe",
      labels: [],
    }
    const url = "https://blog.openbloc.com/members/api/send-magic-link/"
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(response => {
      this.setState({waiting: false, status: response.status})
    })

  }
  emailChanged(event) {
    this.setState({ email: event.target.value })
  }
  render() {
    return (
      <div style={{ padding: "18px", maxWidth: "500px" }}>
        <h2 class="font-weight-bold">Get the latest news from Openbloc</h2>
        <p class="my-4">
          Web, entrepreneurship, tech and open source topics straight to your
          Inbox.
        </p>
        <Form
          id="subscribe-form"
          class="mailing-list my-4"
          onSubmit={this.submitForm.bind(this)}
        >
          <InputGroup className="mb-3">
            <EmailInput
              type="email"
              name="email"
              required="required"
              placeholder="Email"
              value={this.state.email}
              onChange={this.emailChanged.bind(this)}
            />
            <InputGroup.Append>
              <SubmitButton id="subscribe-button" type="submit">
                <FontAwesomeIcon
                  icon={this.state.waiting ? faSpinner : faPaperPlane}
                  size="lg"
                  className="mr-2"
                  spin={this.state.waiting}
                />
              </SubmitButton>
            </InputGroup.Append>
          </InputGroup>
          <Alert
            id="subscribe-success"
            variant={"success"}
            className={this.state.result < 300 ? "" : "d-none"}
          >
            <strong>Great!</strong> Check your inbox and click the link to
            confirm your subscription.
          </Alert>
          <Alert
            id="subscribe-error"
            variant={"danger"}
            className={this.state.result >= 500 ? "" : "d-none"}
          >
            <strong>Oops...</strong> An error occurred.
          </Alert>
        </Form>
        <Row>
          <CenteredCol>
            <A href="https://www.openbloc.com" target="_blank">
              Homepage
            </A>
          </CenteredCol>
          <CenteredCol>
            <img src={OpenblocLogo} alt="Openbloc logo"></img>
          </CenteredCol>
          <CenteredCol>
            <A href="https://blog.openbloc.com" target="_blank">
              Blog
            </A>
          </CenteredCol>
        </Row>
      </div>
    )
  }
}