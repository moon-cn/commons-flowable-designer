import React from 'react';
import {Divider, Form, Input} from 'antd';
import ModelerUtil from "../utils/ModelerUtil";
import BaseForm from "./BaseForm";
import StartEventTimer from "./StartEventTimer";

export default class extends React.Component {


  render() {
    const {bo, element, modeling} = this.props
    const childProps = {bo, element,modeling}
    if (ModelerUtil.isTimerStart(bo)) {
      return <StartEventTimer {...childProps}/>
    }
  }
}
