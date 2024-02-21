import React from 'react';
import {
  Alert,
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popover,
  Radio,
  Select,
  Switch,
  Table
} from 'antd';
import {DeleteOutlined, PlusOutlined, QuestionCircleFilled, QuestionOutlined} from '@ant-design/icons';
import {ArrayTool} from "@crec/lang";
import ModelerUtil from "../utils/ModelerUtil";
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";

const ops = {
  '==': '等于',
  '!=': '不等于',
  contains: '包含',
  '!contains': '不包含',
  startWith: '开头等于',
  endWith: '结尾等于',
  '>=': '大于等于',
  '<=': '小于等于',
  '>': '大于',
  '<': '小于',

}

const opsOptions = Object.keys(ops).map(k => ({
  label: ops[k],
  value: k
}))

export default class extends React.Component {


  state = {
    conditionVariableList: [],
    expression: null,
    formOpen: false,
    customEdit: false,
  };

  componentDidMount() {
    const rootBo = getBusinessObject(this.props.root)
    const conditionVariableList = ModelerUtil.getForList(rootBo, 'conditionVariableList');
    this.setState({conditionVariableList})
    this.refresh()
  }

  refresh = () => {
    const expression = this.props.bo.conditionExpression?.body
    this.setState({expression})
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.bo != this.props.bo) {
      this.refresh()
    }
  }

  add = () => {
    this.setState({modalForm: {}, formOpen: true});
  };

  handleAdd = (values) => {
    let {conditionVariableList} = this.state;
    const valueType = conditionVariableList.find(item => item.name === values.key).valueType;
    let expression = this.createExpression(values, valueType);
    if (!expression) {
      return
    }

    let oldExpression = this.state.expression

    if (oldExpression) {
      oldExpression = oldExpression.substring(2, oldExpression.length - 2)
      expression = oldExpression + " && " + expression;
    }


    expression = '${' + expression + '}'
    // 设置标准条件表达式
    const conditionExpression = this.props.moddle.create('bpmn:FormalExpression', {body: expression});
    this.props.modeling.updateProperties(this.props.element, {conditionExpression: conditionExpression});
    this.setState({formOpen: false, expression})

    const {modeling, element, bo} = this.props

    const oldName = ModelerUtil.getName(bo);
    if(oldName== null || oldName.startsWith('@')){
     const name = '@' + this.translate(expression)
      ModelerUtil.setName(modeling, element, bo,name)
    }

  };


  createExpression(values, valueType) {
    const {key, op, value} = values;
    switch (valueType) {
      case 'digit':
        return key + op + value;
      case 'text':
        if (op == 'contains') {
          return key + ".contains('" + value + "')";
        }
        if (op === '!contains') {
          return '!' + key + ".contains('" + value + "')";
        }
        return key + op + "'" + value + "'";
      default:
        throw new Error('未知类型' + valueType);
    }
  }

  translate = expression => {
    const translation = {
      '&&': '且',
      '||': '或者',
      ...ops,
      '+': '加',
      '-': '减',
      '*': '乘',
      '/': '除',
      '%': '取模',
      'contains': '包含',
      'startsWith': '以...开头',
      'endsWith': '以...结尾',
      'length': '长度',
      'toUpperCase': '转为大写',
      'toLowerCase': '转为小写',
      '${': '',
      '}': '',
      '.':'',
      '\'':''
    };

    this.state.conditionVariableList.forEach(item => {
      translation[item.name] = item.label
    })


    for (let k in translation) {
      let v = translation[k]
      expression = expression.replaceAll(k, v)
    }

    return expression;

  }


  setNodeLabel = () => {
    const {expression: label, genNodeLabel} = this.state;
    if (genNodeLabel) {
      this.props.bo.set('name', label);
      this.props.modeling.updateLabel(this.props.element, label);
    }
  };
  formRef = React.createRef();

  render() {
    const {conditionVariableList} = this.state;

    if (conditionVariableList == null || conditionVariableList.length == 0) {
      return '未设置条件变量';
    }

    const conditionVariableOptions = conditionVariableList.map(item => ({
      value: item.name,
      label: item.label
    }))
    return (
      <>
        <Button type="primary" onClick={this.add} icon={<PlusOutlined/>} style={{marginBottom: 4}} size="small">
          添加
        </Button>
        <Collapse defaultActiveKey='1'>
          <Collapse.Panel key='1' header='条件'>
            {this.translate(this.state.expression)}
          </Collapse.Panel>
          <Collapse.Panel key='2' header='高级编辑'
                          extra={<Popover
                            content="EL表达式，如 ${age > 10 && name.contains('张三')}">
                            <QuestionCircleFilled/></Popover>}>


            <Input.TextArea value={this.state.expression} spellcheck="false"
                            onInput={e => this.setState({expression: e.target.value})}></Input.TextArea>

          </Collapse.Panel>
        </Collapse>

        <Modal open={this.state.formOpen} title="添加条件"
               onOk={() => this.formRef.current.submit()}
               onCancel={() => {
                 this.setState({formOpen: false})
               }}
               destroyOnClose
               width={700}
        >
          <Form ref={this.formRef} onFinish={this.handleAdd} layout="horizontal" labelCol={{flex: '80px'}}>
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
      </>
    );
  }
}
