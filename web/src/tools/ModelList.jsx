import {AutoComplete, Button, Form, Input, message, Modal, Popconfirm, Select, Space, Switch, Table} from 'antd';
import React from 'react';
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {HttpClient} from "@crec/lang";

const baseTitle = "流程模型";
const baseApi = 'flowable/model/';
const basePerm = 'flowable/model:';

const deleteTitle = '删除' + baseTitle


const delApi = baseApi + 'delete'
const pageApi = baseApi + 'list'

const delPerm = basePerm + 'delete'


export default class extends React.Component {


  state = {
    formValues: {},
    formOpen:false,
    list:[]
  }

  actionRef = React.createRef();
  formRef = React.createRef();


  columns = [
    {
      title: '名称',
      dataIndex: 'name',
      sorter: true
    },
    {
      title: '编码',
      dataIndex: 'key'
    },

    {
      title: '更新时间',
      dataIndex: 'updateTime',
      hideInForm: true,
      hideInSearch: true
    },


    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <a onClick={() => this.props.onChange(record.id)}> 选定 </a>
          <a onClick={() => this.handleEdit(record)}> 修改 </a>
          <Popconfirm perm={delPerm} title={'是否确定' + deleteTitle} onConfirm={() => this.handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>

        </Space>
      ),
    },
  ];

  componentDidMount() {
    this.request()
  }

  request = (keyword)=>{
    HttpClient.get(pageApi,{keyword}).then(rs=>{
      this.setState({list:rs.data})
    })
  }



  handleAdd = () => {
    this.setState({
      formOpen:true,
      formValues:{}
    })
  }

  handleEdit = record=>{
    this.setState({
      formOpen:true,
      formValues:record
    })
  }
  onFinish = values=>{
    HttpClient.post('flowable/model/save',values).then(rs=>{
      message.success(rs.message)
      this.request()
      this.setState({formOpen:false})
    })
  }

  handleDelete = row => {
    HttpClient.get(delApi, {id:row.id}).then(rs => {
      rs.success ? message.success(rs.message) : message.error(rs.message)
      this.request()
    })
  }


  render() {
    return <>
      <div style={{marginBottom: 12, display:'flex', justifyContent:'space-between'}}>
        <Input.Search style={{width: 180, }} onSearch={(e)=>this.request(e)} />
        <Button icon={<PlusOutlined/>} type='primary' onClick={this.handleAdd}>新建</Button>
      </div>
      <Table
        dataSource={this.state.list}
        actionRef={this.actionRef}
        columns={this.columns}
        rowKey="id"
      />

      <Modal title='模型信息'
             open={this.state.formOpen}
             destroyOnClose
             onOk={() => this.formRef.current.submit()}
             onCancel={() => this.setState({formOpen: false})}
             width={700}
      >

        <Form ref={this.formRef} labelCol={{flex: '100px'}}
              initialValues={this.state.formValues}
              onFinish={this.onFinish}>
          <Form.Item name='id' noStyle>
          </Form.Item>
          <Form.Item label='名称' name='name' rules={[{required: true}]}>
            <Input/>
          </Form.Item>
          <Form.Item label='标识Key' name='key' rules={[{required: true}]} help='流程定义的key，全局唯一， 英文'>
            <Input/>
          </Form.Item>
        </Form>

      </Modal>
    </>
  }


}



