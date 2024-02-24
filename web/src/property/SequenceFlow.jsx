import React from 'react';
import {
  Button, Card,
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
import ExpressionEditor from "../components/ExpressionEditor";

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

function getPureExpression(expression) {
  if (expression != null) {
    return expression.substring(2, expression.length - 1)
  }
}

function getFullExpression(expression) {
  if (expression != null) {
    return "${" + expression + "}"
  }
}


export default class extends React.Component {


  state = {
    conditionVariableList: [],
    expression: null,
    formOpen: false,
    customEdit: false,
  };

  componentDidMount() {
    const rootBo = getBusinessObject(this.props.root)
    const startBo = ModelerUtil.query(rootBo, 'bpmn:StartEvent');


    const conditionVariableList = startBo.extensionElements.get('values').map(v => {
      return {
        id: v.id, name: v.name
      }
    })
    this.setState({conditionVariableList})
    const expression = this.props.bo.conditionExpression?.body
    this.setState({expression})
  }



  setNodeLabel = () => {
    const {expression: label, genNodeLabel} = this.state;
    if (genNodeLabel) {
      this.props.bo.set('name', label);
      this.props.modeling.updateLabel(this.props.element, label);
    }
  };

  onExpressionChange = v=>{
    let expression = getFullExpression(v);
    this.setState({expression: expression});
    this.props.bo.conditionExpression?.body

    const {modeling,element,moddle} = this.props

    const conditionExpression = moddle.create('bpmn:FormalExpression', {body: expression});
    modeling.updateProperties(element, {conditionExpression: conditionExpression});
  }

  render() {
    const expression =  this.props.bo.conditionExpression?.body
    return (
      <>
        <Card title='条件'>
          <ExpressionEditor value={getPureExpression(expression)}
                            onChange={this.onExpressionChange}
                            variables={this.state.conditionVariableList}
          />
        </Card>


      </>
    );
  }


}
