import React from 'react';
import {Button, Card, Form, Input, Select, Space} from 'antd';
import ModelerUtil from "../utils/ModelerUtil";
import StartEventTimer from "./StartEventTimer";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";


/**
 * // 支持的格式参考
 *  org.flowable.engine.impl.form
 * "enum"
 * "date" -> {org.flowable.engine.impl.form.DateFormType}
 * "boolean" -> {org.flowable.engine.impl.form.BooleanFormType}
 * "string" -> {org.flowable.engine.impl.form.StringFormType}
 * "double" -> {org.flowable.engine.impl.form.DoubleFormType}
 * "long" -> {org.flowable.engine.impl.form.LongFormType}
 */
const typeMap = {
  string: '文本',
  long: '整数',
  double: '小数',
  date: '日期',
  boolean: '是否',
  enum: '枚举'
}
const typeOptions = []
for (let k in typeMap) {
  typeOptions.push({
    value: k,
    label: typeMap[k]
  })
}

export default class extends React.Component {


  render() {
    const {bo, element, modeling, moddle} = this.props
    const childProps = {bo, element, modeling, moddle}

    // 定时启动事件单独处理
    if (ModelerUtil.isTimerStart(bo)) {
      return <StartEventTimer {...childProps}/>
    }

    return <NodeForm {...childProps}/>
  }
}


class NodeForm extends React.Component {

  onValuesChange = (changed, values) => {
    const {element, bo, modeling, moddle} = this.props

    const {formProperties, formKey} = values;

    if (changed.formKey) {
      ModelerUtil.updateProperties(modeling, element, {
        formKey
      })
      return
    }

    if (changed.formProperties) {
      // 忽略新增
      for(let item of formProperties){
        if(item === undefined){
          console.log('忽略新增空行')
          return;
        }
      }

      const props = formProperties.map(prop => {
        const {id,name, type} = prop;
        return moddle.create('flowable:FormProperty', {id,name, type});
      })
      if(bo.extensionElements){
        bo.extensionElements.set('values',props)
      }else {
        const extensionElements =  moddle.create('bpmn:ExtensionElements',{values: props})
        modeling.updateProperties(element, {extensionElements})
      }
    }
  }


  render() {
    const bo = this.props.bo;
    const list = bo.extensionElements?.values
    const data = ModelerUtil.getData(bo)
    data.formKey = bo.formKey

    return <Card title='表单'>
      <Form onValuesChange={this.onValuesChange} size="small">
        <Form.Item label='表单标识' name='formKey' initialValue={data.formKey}>
          <Input/>
        </Form.Item>


        <div style={{marginBottom: 4}}>表单属性:</div>

        <Form.List name='formProperties' initialValue={list}>
          {(fields, {add, remove}, {errors}) => <>

            {fields.map(({key, name, ...restField}, index) => <Space
                key={key}
                style={{
                  display: 'flex',
                }}
                align="baseline"
              >
                <Form.Item name={[name, 'id']} {...restField} >
                  <Input placeholder='标识'/>
                </Form.Item>
                <Form.Item name={[name, 'name']} {...restField} >
                  <Input placeholder='名称'/>
                </Form.Item>

                <Form.Item name={[name, 'type']} {...restField} >
                  <Select placeholder='类型' style={{width: 60}}
                          options={typeOptions}/>
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)}/>

              </Space>
            )}

            <Form.Item label=' ' colon={false}>
              <Button
                icon={<PlusOutlined/>}
                type="dashed"
                size="small"
                onClick={() => add()}
                style={{
                  width: '60%',
                }}
              >
                添加参数
              </Button>
            </Form.Item>
          </>
          }
        </Form.List>


      </Form>
    </Card>
  }


}
