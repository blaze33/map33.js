import React, {
  Component
} from 'react';
import styled from "styled-components"

import "bootstrap/dist/css/bootstrap.min.css"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"


const BottomRight = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  padding-bottom: 0.5em;
  color: #fff;
`
const popover = (
  <Popover id="popover-attributions">
    <Popover.Title as="h3">Attributions</Popover.Title>
    <Popover.Content>
      <ul>
        <li>
          Elevation data: <a href="https://registry.opendata.aws/terrain-tiles/">
            Terrain Tiles - Registry of Open Data on AWS</a>
        </li>
        <li>
          Satellite imagery: ® Maptiler
        </li>
        <li>
          <a href="https://github.com/Fyrestar/THREE.InfiniteGridHelper">InfiniteGridHelper</a>:
          <a href="https://mevedia.com">Fyrestar</a>
        </li>
      </ul>
    </Popover.Content>
  </Popover>
);

export class Attributions extends Component {
  constructor() {
    super()
    this.state ={
    }
  }

  render() {
    return (
      <BottomRight>
        <OverlayTrigger trigger="click" placement="top" overlay={popover}>
          <FontAwesomeIcon icon={faInfoCircle} size="lg" className="mr-3" />
        </OverlayTrigger>
      </BottomRight>
    )
  }
}