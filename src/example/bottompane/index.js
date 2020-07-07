import React, {
  Component
} from 'react';
import styled from "styled-components"

import 'react-github-button/assets/style.css'
import GitHubButton from 'react-github-button'

import "bootstrap/dist/css/bootstrap.min.css"
import InputGroup from "react-bootstrap/InputGroup"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import RowBS from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons"
import { faSync } from "@fortawesome/free-solid-svg-icons"

import {mapPicker} from '../land'

const Bottom = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding-bottom: 0.5em;
`

const Row = styled(RowBS)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const GoLocation = styled(Button)`
  background-color: #5e2750;

  &:hover {
    background-color: #77216F;
  }
`

const TwitterButton = styled.a`
  margin-left: 0.5em;
  display: inline-block;
  height: 20px;
  box-sizing: border-box;
  padding: 0px 8px 1px 6px;
  background-color: #1b95e0;
  color: #fff;
  border-radius: 3px;
  font-weight: 500;
  font-size: 11px;
  cursor: pointer;
  text-decoration: none;
  vertical-align: top;

  & i {
    position: relative;
    top: 3px;
    display: inline-block;
    width: 14px;
    height: 14px;
    background: transparent 0 0 no-repeat;
    background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2072%2072%22%3E%3Cpath%20fill%3D%22none%22%20d%3D%22M0%200h72v72H0z%22%2F%3E%3Cpath%20class%3D%22icon%22%20fill%3D%22%23fff%22%20d%3D%22M68.812%2015.14c-2.348%201.04-4.87%201.744-7.52%202.06%202.704-1.62%204.78-4.186%205.757-7.243-2.53%201.5-5.33%202.592-8.314%203.176C56.35%2010.59%2052.948%209%2049.182%209c-7.23%200-13.092%205.86-13.092%2013.093%200%201.026.118%202.02.338%202.98C25.543%2024.527%2015.9%2019.318%209.44%2011.396c-1.125%201.936-1.77%204.184-1.77%206.58%200%204.543%202.312%208.552%205.824%2010.9-2.146-.07-4.165-.658-5.93-1.64-.002.056-.002.11-.002.163%200%206.345%204.513%2011.638%2010.504%2012.84-1.1.298-2.256.457-3.45.457-.845%200-1.666-.078-2.464-.23%201.667%205.2%206.5%208.985%2012.23%209.09-4.482%203.51-10.13%205.605-16.26%205.605-1.055%200-2.096-.06-3.122-.184%205.794%203.717%2012.676%205.882%2020.067%205.882%2024.083%200%2037.25-19.95%2037.25-37.25%200-.565-.013-1.133-.038-1.693%202.558-1.847%204.778-4.15%206.532-6.774z%22%2F%3E%3C%2Fsvg%3E);
  }

`

export class BottomPane extends Component {
  constructor() {
    super()
    this.state ={
      lat: mapPicker.map.geoLocation[0],
      lon: mapPicker.map.geoLocation[1],
      rotate: true
    }
  }

  handleLat(event) {
    this.setState({lat: event.target.value})
  }

  handleLon(event) {
    this.setState({lon: event.target.value})
  }

  handleRotate(event) {
    mapPicker.map.controls.autoRotate = event.target.checked
    this.setState({rotate: event.target.checked})
  }

  go() {
    mapPicker.go(
      Number(this.state.lat),
      Number(this.state.lon)
    )
  }

  render() {
    return (
      <Bottom>
        <Row>
          <Form.Group as={Col} sm={6} md={5}>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Checkbox
                  label={(
                    <FontAwesomeIcon
                      icon={faSync}
                      size="lg"
                      className="mr-2"
                    />
                  )}
                  aria-label="Camera rotation"
                  checked={this.state.rotate}
                  onChange={this.handleRotate.bind(this)}
                />
              </InputGroup.Prepend>
              <Form.Control
                placeholder="Latitude"
                aria-label="Latitude"
                size="sm"
                type="number" step="any"
                value={this.state.lat}
                onChange={this.handleLat.bind(this)}
                />
              <Form.Control
                placeholder="Latitude"
                aria-label="Latitude"
                size="sm"
                type="number" step="any"
                value={this.state.lon}
                onChange={this.handleLon.bind(this)}
                />
              <InputGroup.Append>
                <GoLocation size="sm" variant="secondary" onClick={this.go.bind(this)}>
                  <FontAwesomeIcon
                    icon={faLocationArrow}
                    size="lg"
                    className="mr-2"
                  />
                </GoLocation>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row>
          <GitHubButton type="stargazers" namespace="blaze33" repo="map33.js" />
          <TwitterButton href="https://twitter.com/intent/follow?region=follow_link&screen_name=maxmre&tw_p=followbutton"
            target="_blank">
            <i></i> Follow @maxmre
          </TwitterButton>
        </Row>
      </Bottom>
    )
  }
}