import React from "react";
import {Button, Form, Input, Modal, Popconfirm, Radio, Table} from "antd";
import ModelList from "./ModelList";
import {ArrayTool, URLTool} from "@crec/lang";
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";
import ModelerUtil from "../utils/ModelerUtil";
import {ProTable} from "@ant-design/pro-components";

export default class {

  static open = (bpmnModeler) => {
    const root = bpmnModeler.getDefinitions().rootElements[0]
    let bo = getBusinessObject(root);

    Modal.info({
      icon: null,
      title: '条件变量',
      width: 800,
      okText: ' ',
      okType:'text',
      style: {
        minHeight: 500
      },
      content: <ConditionForm bo={bo}/>
      ,
      closable: true,
      destroyOnClose: true
    })

  }
}

class ConditionForm extends React.Component {

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

      <Modal title='变量信息' open={this.state.formOpen}
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
