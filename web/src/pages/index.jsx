import React from "react";
import {Button, Card, Col, Collapse, Divider, Empty, Form, message, Modal, Row, Space} from "antd";

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";
import BpmnModeler from 'bpmn-js/lib/Modeler'

import './index.css'
import customTranslate from "../components/design/customTranslate/customTranslate";
import contextPad from "../components/design/contextPad";
import {
  BranchesOutlined,
  CloudUploadOutlined,
  FolderOpenOutlined,
  FormOutlined,
  SaveOutlined
} from "@ant-design/icons";
import {HttpClient, URLTool} from "@crec/lang";
import OpenTool from "../tools/OpenTool";
import XmlTool from "../tools/XmlTool";
import SaveTool from "../tools/SaveTool";
import {PropertyPanelMap} from "../property/registry";
import ModelerUtil from "../utils/ModelerUtil";
import ConditionVariableTool from "../tools/ConditionVariableTool";

const {Panel} = Collapse;


export default class extends React.Component {


  state = {
    model: null,
    conditionVariable: null,

    elementType: null,
    elementName: '',
    elementId: null,
  }

  curBo = null
  element = null

  componentDidMount() {
    let params = URLTool.params();
    const id = params.id


    window._bpmnModeler = this.bpmnModeler = new BpmnModeler({
      additionalModules: [
        // 汉化翻译
        {
          translate: ['value', customTranslate]
        },
        contextPad,
      ]
    });


    window._modeling = this.modeling = this.bpmnModeler.get('modeling'); // 建模， 包含很多方法
    window._moddle = this.moddle = this.bpmnModeler.get('moddle'); // 数据模型， 主要存储元数据

    if (!id) {
      OpenTool.open()
    } else {
      this.initById(id)
    }


  }

  initById = id => {
    if (id) {
      this.setState({id})
      HttpClient.get('flowable/model/detail', {id}).then(rs => {
        this.setState({model: rs.data, conditionVariable: rs.conditionVariable})
        this.initBpmn(rs.data.xml)
      })
    }

  };

  initBpmn = xml => {
    const id = '#flow-canvas-' + this.state.id
    this.bpmnModeler.attachTo(id);
    this.bpmnModeler.importXML(xml)

    this.bpmnModeler.on('element.contextmenu', e => e.preventDefault()) // 关闭右键，影响操作
    this.bpmnModeler.on('selection.changed', this.onSelectionChanged);
  };


  onSelectionChanged = e => {
    const {newSelection} = e;
    const root = this.root = this.bpmnModeler.getDefinitions().rootElements[0]
    const element = this.element = newSelection[0] || root
    const bo = window._bo = this.bo = getBusinessObject(element)


    // 给一个过渡期
    this.setState({
      elementType: bo.$type.replace("bpmn:", ""),
      elementName: bo.get('name'),
      elementId: bo.get('id')
    })
  }

  render() {

    return <div style={{background: '#f5f5f5'}}>
      <section style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <Button icon={<FolderOpenOutlined/>}
                  onClick={() => OpenTool.open()}></Button>

          <Button icon={<SaveOutlined/>} onClick={() => SaveTool.onSaveXml(this.bpmnModeler)}>保存</Button>
          <Button icon={<CloudUploadOutlined/>} onClick={() => SaveTool.onDeploy(this.bpmnModeler)}>部署</Button>
          <Button icon={<BranchesOutlined/>}
                  onClick={() => ConditionVariableTool.open(this.bpmnModeler)}>条件变量</Button>
          <Button icon={<FormOutlined/>}>表单</Button>
          <Button onClick={() => XmlTool.onClick(this.bpmnModeler)}>XML</Button>
        </div>
        <span>
            流程: {this.state.model?.name}
          </span>
      </section>
      <Row gutter={8} wrap={false} style={{height: '90vh', marginTop: 4}}>
        <Col flex='auto'>
          <div id={"flow-canvas-" + this.state.id} style={{width: '100%', height: '100%', background: 'white'}}></div>
        </Col>

        <Col flex='300px'>
          <Card title='基本信息' extra={this.state.elementType}>
            <div>标识：{this.state.elementId}</div>
            <div>名称：{this.state.elementName}</div>
          </Card>
          <Card title='设置' style={{marginTop: 4}}>

            {this.renderForm()}

          </Card>

        </Col>
      </Row>


    </div>
  }


  renderForm() {
    const {elementType} = this.state;

    const panelCLass = PropertyPanelMap[elementType]
    if (panelCLass) {
      return React.createElement(panelCLass, {
        bo: this.bo,
        element: this.element,
        modeling: this.modeling,
        moddle: this.moddle,
        root: this.root
      })
    }
    return <Empty/>


  }
}
