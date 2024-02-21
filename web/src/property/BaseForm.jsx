import React from "react";
import ModelerUtil from "../utils/ModelerUtil";

export default class extends React.Component {

  componentDidMount() {
    this.refresh()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.bo != prevProps.bo) {
      this.refresh()
    }
  }

  formRef = React.createRef()


  refresh() {
    console.log('刷新节点表单', this.props.bo)
    let data = ModelerUtil.getData(this.props.bo);
    this.formRef.current.resetFields();
    this.formRef.current.setFieldsValue(data)
  }

}
