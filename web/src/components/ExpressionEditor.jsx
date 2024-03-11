import React from "react";
import {Button, Col, Empty, Input, Row, Tabs, Tag} from "antd";
import {parseToArr} from "../tools/ExpressionTokenParser";
import {Divider} from "antd/es";


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
    const {variables = []} = this.props

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
    const arr = parseToArr(this.props.value)
    arr.push(v)
    this.props.onChange(arr.join(''))
  }

  render() {
    const {value, variables = []} = this.props

    return <>
      {this.translate(value, variables)}

      <Divider/>

      <Tabs destroyInactiveTabPane
            items={[
              {
                label: '默认编辑器', key: 'default', children: <Row wrap={false} gutter={8}>
                  <Col span={8}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                      {variables.map(v => <Button size='small' onClick={() => this.onInput(v.id)}>{v.name}</Button>)}


                      {logicOptions.map(v => <Button size='small'
                                                     onClick={() => this.onInput(v.value)}>{v.label}</Button>)}
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                      {opsOptions.map(v => <Button size='small'
                                                   onClick={() => this.onInput(v.value)}>{v.label}</Button>)}
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                      <Input.Group compact>
                        <Input size='small' placeholder='输入值'
                               value={this.state.valueInputValue}
                               onChange={e => {
                                 this.setState({valueInputValue: e.target.value})
                               }}/>
                        <Button size='small' onClick={() => {
                          this.onInput(this.state.valueInputValue);
                          this.setState({valueInputValue: null})
                        }}>确定</Button>
                      </Input.Group>

                      {defaultValueOptions.map(v => <Button
                        size='small'
                        onClick={() => this.onInput(v.value)}>{v.label}</Button>)}
                    </div>
                  </Col>


                </Row>
              },
              {
                label: '手动编辑',
                key: 'manual',
                children: <a style={{fontSize: 'small'}} onClick={this.manualEdit}>手动编辑</a>
              }
            ]}>

      </Tabs>


    </>
  }


  translate(value, variables) {
    const arr = parseToArr(value)

    if (arr.length === 0) {
      return <Empty description='未设置条件'></Empty>
    }

    return arr.map(item => {
      let rs = variables.find(v => v.id === item)
      if (rs !== undefined) {
        return <Tag color='blue' closable={true}> {rs.name}</Tag>
      }
      rs = opsOptions.find(v => v.value === item)
      if (rs !== undefined) {
        return <Tag color='warning'> {rs.label}</Tag>
      }
      rs = logicOptions.find(v => v.value === item)
      if (rs !== undefined) {
        return <Tag color='warning'> {rs.label}</Tag>
      }

      rs = defaultValueOptions.find(v => v.value === item)
      if (rs !== undefined) {
        return <Tag color='green'> {rs.label}</Tag>
      }

      return <Tag color='green'>{item}</Tag>;
    });
  }
}
