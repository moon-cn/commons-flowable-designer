import React from 'react';
import {Button, Card, Divider, Form, Input, Modal, Radio, Table} from 'antd';
import ModelerUtil from "../utils/ModelerUtil";
import BaseForm from "./BaseForm";
import StartEventTimer from "./StartEventTimer";
import {ArrayTool} from "@crec/lang";
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";

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
      dataIndex: 'id',
      title: '标识',

    },
    {
      dataIndex: 'name',
      title: '名称',

    },

    {
      dataIndex: 'type',
      title: '类型',

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
        rowKey='id'
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


          <Form.Item name='id' label='标识' rules={[{required: true}]}>
            <Input/>
          </Form.Item>

          <Form.Item name='name' label='名称' rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item name='valueType' label='类型' rules={[{required: true}]} initialValue='text'>
            <Radio.Group>
              <Radio value='text'>文本</Radio>
              <Radio value='long'>整数</Radio>
              <Radio value='double'>小数</Radio>
              <Radio value='date'>日期</Radio>
              <Radio value='boolean'>是否</Radio>
              <Radio value='enum'>枚举</Radio>
            </Radio.Group>
          </Form.Item>


        </Form>
      </Modal>


    </div>
  }


}
