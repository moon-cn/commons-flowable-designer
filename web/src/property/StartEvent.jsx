import React from 'react';
import {Button, Card, Form, Input, Select, Space} from 'antd';
import ModelerUtil from "../utils/ModelerUtil";
import StartEventTimer from "./StartEventTimer";
import {ArrayTool} from "@crec/lang";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const typeMap = {
  text: '文本',
  long: '整数',
  double: '小数',
  date: '日期',
  boolean: '是否',
  enum: '枚举'
}

export default class extends React.Component {


  render() {
    const {bo, element, modeling} = this.props
    const childProps = {bo, element, modeling}

    // 定时启动事件单独处理
    if (ModelerUtil.isTimerStart(bo)) {
      return <StartEventTimer {...childProps}/>
    }


    return <StartForm bo={bo}/>

  }
}


class StartForm extends React.Component {


  state = {
    list: [],

    formOpen: false,
    formValues: false,
  }

  componentDidMount() {
    const bo = this.props.bo;
    const list = bo.extensionElements.values
    console.log(list)

    this.setState({list})
  }

  handleAdd = () => {
    this.setState({formOpen: true})
  }

  handleDelete(record) {
    const {list} = this.state
    ArrayTool.remove(list, record)

    this.setState({list: [...list]})
    ModelerUtil.setForList(this.props.bo, 'conditionVariableList', list)
  }

  onFinish = (values) => {
    values.$type = "flowable:formProperty"
    const {list} = this.state
    let newList = [...list, values];

    this.setState({list: newList, formOpen: false})


    this.props.bo.extensionElements.values = list;

  }

  formRef = React.createRef()

  onValuesChange = (changed, values) => {

  }

  render() {
    return <Card title='表单'>
      <Form onValuesChange={this.onValuesChange}>
        <Form.Item label='表单标识' name='formKey'>
          <Input/>
        </Form.Item>
      </Form>
      <div>

        <div style={{marginBottom: 4}}>表单属性:</div>

        <Form.List name='formProperties' initialValue={this.state.list}>
          {(fields, {add, remove}, {errors}) => <>

            {fields.map(({key, name, ...restField}, index) => <Space
                key={key}
                style={{
                  display: 'flex',
                  marginBottom: 8,
                }}
                align="baseline"
              >
                <Form.Item label='标识' name={[name, 'id']} {...restField} >
                  <Input/>
                </Form.Item>
                <Form.Item label='名称' name={[name, 'name']} {...restField} >
                  <Input/>
                </Form.Item>

                <Form.Item label='类型' name={[name, 'type']} {...restField} >
                  <Select style={{width: 100}}
                          options={[{label: '文本', value: 'text'}, {label: '数字', value: 'digit'}]}/>
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)}/>

              </Space>
            )}

            <Form.Item label=' ' colon={false}>
              <Button
                icon={<PlusOutlined/>}
                type="dashed"
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


      </div>
    </Card>
  }


}
