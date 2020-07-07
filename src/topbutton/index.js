import React, {
  Component
} from 'react';
import {
  PopupboxManager,
  PopupboxContainer
} from 'react-popupbox';
import "react-popupbox/dist/react-popupbox.css"
import styled from 'styled-components'

import ButtonLeftImg from './button-left.png'
import ButtonRightImg from './button-right.png'
import OpenblocLogo from './openbloc-logo.png'

import {TopButtonContent} from './content'

const Wrapper = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  line-height: ${(props) => props.height}px;
  text-align: center;
  white-space: nowrap;
`

const BaseButton = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => (props.height * 3) / 2}px;
  display: inline-block;
  background-size: ${(props) => (props.height * 3) / 2}px ${(props) => props.height}px;
`

const ButtonLeft = styled(BaseButton)`
  background-image: url(${ButtonLeftImg});
`

const ButtonRight = styled(BaseButton)`
  background-image: url(${ButtonRightImg});
`

const ButtonCenter = styled.div`
  display: inline-block;
  height: ${(props) => props.height}px;
  background: #5e2750;
  color: #fff;
  vertical-align: top;
`
const ButtonLogo = styled.img`
  height: 30px;
  padding: 5px;
  margin-right: .7em;
`

export class TopButton extends Component {
  submitForm(event) {

  }
  openPopupbox() {
    const content = (<TopButtonContent />)
    PopupboxManager.open({
      content,
      config: {
        style: {
          backgroundColor: "#5e2750"
        },
        content: {
          style: {
            backgroundColor: "#5e2750",
            color: "#fff"
          }
        }
      }
    })
  }

  render() {
    return (
      <>
      <Wrapper height={30} onClick={this.openPopupbox} style={{cursor: 'pointer'}}>
        <ButtonLeft height={30} />
        <ButtonCenter height={30}>
          <ButtonLogo src={OpenblocLogo} alt="Openbloc Logo"></ButtonLogo>
          <span style={{verticalAlign: 'inherit'}}>Openbloc</span>
        </ButtonCenter>
        <ButtonRight height={30} />
      </Wrapper>
      <PopupboxContainer />
      </>
    )
  }
}
