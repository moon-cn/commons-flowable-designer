import React from 'react';
import {Button, Card, Divider, Form, Input, Modal, Radio, Table} from 'antd';
import ModelerUtil from "../utils/ModelerUtil";
import BaseForm from "./BaseForm";
import StartEventTimer from "./StartEventTimer";
import {ArrayTool} from "@crec/lang";

export default class extends React.Component {


  render() {
    const {bo, element, modeling} = this.props
    const childProps = {bo, element, modeling}

    // 定时启动事件单独处理
    if (ModelerUtil.isTimerStart(bo)) {
      return <StartEventTimer {...childProps}/>
    }


    return <Card title='表单'>
      <Form>
        <Form.Item label='表单标识'>
          <Input/>
        </Form.Item>
      </Form>
      <StartForm bo={bo}/>
    </Card>

  }
}


class StartForm extends React.Component {

  columns = [
    {
      dataIndex: 'name',
      title: '名称',

    },
    {
      dataIndex: 'valueType',
      title: '类型',
      valueEnum: {
        text: '字符串',
        digit: '数值'
      },

    },
    {
      dataIndex: 'label',
      title: '显示文本',

    },
    {
      dataIndex: 'operation',
      hideInForm: true,
      render: (_, record) =>
        <a onClick={() => this.handleDelete(record)}>删除</a>
    },
  ]

  state = {
    list: [],

    formOpen: false,
    formValues: false,
  }

  componentDidMount() {
    const list = ModelerUtil.getForList(this.props.bo, 'conditionVariableList')
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
    const {list} = this.state
    let newList = [...list, values];

    this.setState({list: newList, formOpen: false})

    ModelerUtil.setForList(this.props.bo, 'conditionVariableList', newList)
  }

  formRef = React.createRef()

  render() {
    return <div>

      <Button
        style={{float: 'right'}}
        onClick={this.handleAdd}
        size="small"
        type="primary"
      >
        新增
      </Button>
      <Table
        columns={this.columns}
        dataSource={this.state.list}
        pagination={false}
      >
      </Table>

      <Modal title='表单属性' open={this.state.formOpen}
             destroyOnClose
             onCancel={() => this.setState({formOpen: false})}
             onOk={() => this.formRef.current.submit()}
             okText='确定'
             cancelText='取消'
      >

        <Form ref={this.formRef} layout='horizontal' labelCol={{flex: '100px'}} onFinish={this.onFinish}>
          <Form.Item name='name' label='名称' rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item name='valueType' label='类型' rules={[{required: true}]} initialValue='text'>
            <Radio.Group>
              <Radio value='text'>文本</Radio>
              <Radio value='digit'>数字</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name='label' label='显示文本' rules={[{required: true}]}>
            <Input/>
          </Form.Item>


        </Form>
      </Modal>


    </div>
  }


}
