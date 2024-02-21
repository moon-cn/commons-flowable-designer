import React from 'react';
import {Form, Input} from 'antd';
import ModelerUtil from "../utils/ModelerUtil";
import BaseForm from "./BaseForm";

export default class extends BaseForm {

  onValuesChange = (changedValue, values) => {
    ModelerUtil.setData(this.props.bo, values)


    let oldName = ModelerUtil.getName(this.props.bo);
    let genName = oldName == null || oldName.startsWith('@'); // 是否需要生成节点名称
    if (genName) {
      const cls = values.class;
      ModelerUtil.setName(this.props.modeling, this.props.element, this.props.bo, '@' + cls)
    }

  };


  render() {
    return <Form
      ref={this.formRef}
      onValuesChange={this.onValuesChange}
      layout='vertical'
    >
      <Form.Item label="执行类" name="class" extra="需实现JavaDelegate接口, 如com.demo.SomeJavaJob">
        <Input/>
      </Form.Item>
    </Form>
  }
}
