import React from "react";
import {Button, Empty, Form, Input, Modal, Select, Tag} from "antd";
import {CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import jsep from '../libs/jsep.min'
import {render} from "react-dom";


/**
 * 条件表达式编辑器
 */

const fns = {
  contains: '包含',
  startWith: '开头等于',
  endWith: '结尾等于',
}

const ops = {
  '==': '等于',
  '!=': '不等于',

  '>=': '大于等于',
  '<=': '小于等于',
  '>': '大于',
  '<': '小于',
  ...fns
}


const opsOptions = Object.keys(ops).map(k => ({
  label: ops[k],
  value: k
}))

function isSimple(type){
  return type === "Identifier" || type === "Literal";
}
function toStr(block) {
  if (block == null) {
    return block
  }

  let {type, left, operator, right, name, raw} = block

  if (type === 'CallExpression') {
    let {arguments: args, callee} = block
    return toStr(callee.object) + toStr(callee.property) + args.map(arg=>toStr(arg)).join(',')
  }

  if (block.type === "Identifier") {
    return name
  }
  if (block.type === "Literal") {
    return raw
  }

  const str = toStr(left)  + operator + toStr(right)

  if(operator === '||' || operator === '&&' ){
    return  '(' + str + ')'
  }
  return str
}

function simply(expression){
  if(expression == null){
    return expression
  }


  if(expression.startsWith('(')){
    expression = expression.substring(1, expression.length -1)
  }



  return  expression;

}

export default class extends React.Component {

  state = {
    formOpen: false,
  }
  formRef = React.createRef();

  add = () => {
    this.setState({modalForm: {}, formOpen: true});
  };


  manualEdit = () => {
    const value = prompt('手动编辑表达式', this.props.value)
    if (value) {
      this.props.onChange(value)

    }
  }

  onFormFinish = (values) => {

  }


  render() {
    const {value, onChange, variables = []} = this.props


    let parsed = null
    try {
      if (value) {
        parsed = jsep(value)
      }
    } catch (e) {
      console.error(e)
    }

    console.log('解析结果',parsed)

    const conditionVariableOptions = variables.map(item => ({
      value: item.id,
      label: item.name + " ( " + item.id + " )"
    }))
    return <div>


      {parsed && this.renderExpression(parsed)}

      <div> 原始：{value}   </div>
      <div> 解析： {simply(toStr(parsed))}  </div>

      <div style={{margin: 4}}>
        <Button type="dashed" onClick={this.add} icon={<PlusOutlined/>} size="small">
          添加
        </Button>
        <Button type="dashed" onClick={this.manualEdit} icon={<EditOutlined/>} style={{marginLeft: 4}} size="small">
          手动编辑
        </Button>
      </div>

      <Modal open={this.state.formOpen} title="添加条件"
             onOk={() => this.formRef.current.submit()}
             onCancel={() => {
               this.setState({formOpen: false})
             }}
             destroyOnClose
             width={700}
      >
        <Form ref={this.formRef} onFinish={this.onFormFinish} layout="horizontal" labelCol={{flex: '80px'}}>
          <Form.Item name="key" label="变量" rules={[{required: true}]}>
            <Select options={conditionVariableOptions}></Select>
          </Form.Item>

          <Form.Item name="op" label="操作符" rules={[{required: true}]}>
            <Select options={opsOptions}> </Select>
          </Form.Item>

          <Form.Item name="value" label="值" rules={[{required: true}]}>
            <Input/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  }

  renderExpression = (parsed) => {
    const {variables = []} = this.props


    let {type, left, operator, right, name, raw} = parsed

    if (type === 'CallExpression') {
      let {arguments: args, callee} = parsed

      return <div
        style={{
          border: '1px solid lightblue',
          padding: 8,
          marginBottom: 8,
          marginTop: 8,
          display: 'flex',
          gap: 8
        }}>
        <div>{this.renderExpression(callee.object)}</div>
        <div>{this.renderExpression(callee.property)}</div>
        <div>{args.map(this.renderExpression)}</div>
      </div>
    }

    if (parsed.type === "Identifier") { // 可能是变量或者函数
      const v = variables.find(v => v.id === name)
      const fn = fns[name]
      return <Tag color='green'>{v?.name || fn || name}</Tag>
    }
    if (parsed.type === "Literal") {
      return <Tag color='blue'> {raw}</Tag>
    }

    const isLogic = operator === '&&' || operator === '||'

    let operatorLabel = ops[operator]
    if (operatorLabel == null && isLogic) {
      operatorLabel = operator === '&&' ? '并且' : '或者'
    }


    return <div
      style={{
        border: '1px solid lightblue',
        padding: 8,
        marginBottom: 8,
        marginTop: 8,
        display: isLogic ? 'block' : 'flex',
        gap: 8
      }}>
      <div>{this.renderExpression(left)}</div>
      <Tag color='red'>{operatorLabel || operator}</Tag>
      <div>{this.renderExpression(right)}</div>

      <Button size='small' icon={<DeleteOutlined/>} type='text' onClick={() => this.deleteBlock(parsed)}></Button>
    </div>
  };

  deleteBlock = (block) => {


  }

}
