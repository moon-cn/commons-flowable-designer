import React from "react";
import {Button, Card, Input, Space} from "antd";


/**
 * 独立的条件表达式编辑器
 *
 * 1. 解析条件表达式
 * 2. 设置条件表达式
 *
 */

const fns = {
  contains: '包含',
  startsWith: '开头等于',
  endsWith: '结尾等于',
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

function isSimple(type) {
  return type === "Identifier" || type === "Literal";
}

function toStr(block) {
  if (block == null) {
    return block
  }

  let {type, left, operator, right, name, raw} = block

  if (type === 'CallExpression') {
    let {arguments: args, callee} = block
    return toStr(callee.object) + toStr(callee.property) + args.map(arg => toStr(arg)).join(',')
  }

  if (block.type === "Identifier") {
    return name
  }
  if (block.type === "Literal") {
    return raw
  }

  const str = toStr(left) + operator + toStr(right)

  if (operator === '||' || operator === '&&') {
    return '(' + str + ')'
  }
  return str
}

const defaultValueOptions = [
  {label: '空', value: ''},
  {label: '是', value: 'true'},
  {label: '否', value: 'false'},
];


const logicOptions = [
  {label: '并且', value: '&&'},
  {label: '或者', value: '||'},
  {label: '(', value: '('},
  {label: ')', value: ')'},
];
export default class extends React.Component {

  state = {
    options: [],
    defaultOptions: [],


    // 值输入框的值
    valueInputValue: undefined,

    arrValue: [],


  }

  componentDidMount() {
    const {value, onChange, variables = []} = this.props

    const conditionVariableOptions = variables.map(item => ({
      value: item.id,
      label: item.name + " ( " + item.id + " )"
    }))

    const options = [
      {
        label: '变量',
        options: conditionVariableOptions,
      },
      {
        label: '操作',
        options: opsOptions
      },
      {
        label: '值',
        options: defaultValueOptions
      },
      {
        label: '优先级',
        options: logicOptions
      }
    ]

    this.setState({options, defaultOptions: options})
  }
  manualEdit = () => {
    const value = prompt('手动编辑表达式', this.props.value)
    if (value) {
      this.props.onChange(value)
    }
  }
  onInput = (v) => {
    const arrValue = this.state.arrValue
    arrValue.push(v)
    this.setState({arrValue})
  }

  render() {
    const {value, onChange, variables = []} = this.props


    return <Card>
      <fieldset>
        <legend>条件 <a style={{fontSize:'small'}} onClick={this.manualEdit}>手动编辑</a></legend>
        <Input.TextArea disabled={true} value={this.translate(variables)} placeholder='请编辑表达式'/>
        <div>{value}</div>
      </fieldset>


      <fieldset>
        <legend>
          变量
        </legend>
        <Space wrap={true}>
          {variables.map(v => <Button size='small' onClick={() => this.onInput(v.id)}>{v.name}</Button>)}
        </Space>
      </fieldset>
      <fieldset style={{marginTop: 8}}>
        <legend>操作</legend>
        <Space wrap={true}>
          {opsOptions.map(v => <Button size='small' onClick={() => this.onInput(v.value)}>{v.label}</Button>)}
        </Space>
      </fieldset>
      <fieldset style={{marginTop: 8}}>
       <legend> 值</legend>
        <Space>
          {defaultValueOptions.map(v => <Button size='small' onClick={() => this.onInput(v.value)}>{v.label}</Button>)}
          <Input.Group compact>
            <Input size='small' placle='输入值' style={{ width: 'calc(100% - 50px)' }} value={this.state.valueInputValue} onChange={e=>{
              this.setState({valueInputValue: e.target.value})
            }}/>
            <Button size='small' onClick={() => {
              this.onInput(this.state.valueInputValue);
              this.setState({valueInputValue: null})
            }}>确定</Button>
          </Input.Group>

        </Space>
      </fieldset>

      <fieldset style={{marginTop: 8, marginBottom: 8}}>
        <legend>
          逻辑
        </legend>

        <Space>
          {logicOptions.map(v => <Button size='small' onClick={() => this.onInput(v.value)}>{v.label}</Button>)}
        </Space>
      </fieldset>
    </Card>
  }


  translate(variables) {
    return this.state.arrValue.map(a => {
      let rs = variables.find(v => v.id === a)
      if (rs !== undefined) {
        return rs.name
      }
      rs = opsOptions.find(v => v.value === a)
      if (rs !== undefined) {
        return rs.label
      }
      rs = logicOptions.find(v => v.value === a)
      if (rs !== undefined) {
        return rs.label
      }

      rs = defaultValueOptions.find(v => v.value === a)
      if (rs !== undefined) {
        return rs.label
      }

      return a;
    }).join(' ');
  }
}
