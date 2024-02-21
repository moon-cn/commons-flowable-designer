import React from 'react';
import {Divider, Form, Input} from 'antd';
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
    return <Form ref={this.formRef} onValuesChange={this.onValuesChange}>
      <Form.Item
        label="触发时间"
        name="timeDate"
        extra="如2019-10-01T12:00:00Z"
      >
        <Input/>
      </Form.Item>

      <Form.Item label="持续时间" name="timeDuration" extra="PnYnMnDTnHnMnS 如P10D代表10天">
        <Input/>
      </Form.Item>

      <Form.Item label="循环时间" name="timeCycle"
                 extra="持续时间和次数 如R3/PT10H代表每个10小时执行，共3次,也可以是cron">
        <Input/>
      </Form.Item>


      <Divider></Divider>
      <a
        href="https://docs.camunda.org/manual/7.16/reference/bpmn20/events/timer-events/"
        target="_blank"
      >
        参考文档1
      </a>
      &nbsp; &nbsp;
      <a
        href="https://docs.camunda.io/docs/components/modeler/bpmn/timer-events/"
        target="_blank"
      >
        参考文档2
      </a>
    </Form>
  }
}
