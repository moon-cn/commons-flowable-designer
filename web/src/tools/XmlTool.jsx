import React from "react";
import {message, Modal} from "antd";
import ModelList from "./ModelList";
import {URLTool} from "@crec/lang";

const DOM_ID = "flowable-xml-container";
export default class {

  static onClick = (bpmnModeler) => {
    bpmnModeler.saveXML({format: true}).then(res => {
      const xml = res.xml;
      Modal.info({
        icon: null,
        title: 'XML （可直接编辑）',
        width: 800,
        okText: '确认修改',
        style: {
          minHeight: 500
        },
        closable: true,
        destroyOnClose: true,
        content: <div style={{maxHeight: '70vh', overflow: 'auto'}}>
          {xml && <pre id={DOM_ID} contentEditable>
          {xml}
        </pre>}
        </div>,
        onOk:()=>{
          this.handleChangeXml(bpmnModeler)
        }
      })
    })


  }

  static handleChangeXml = (bpmnModeler) => {
    const xml = document.getElementById(DOM_ID).innerText
    let definitions = bpmnModeler.getDefinitions();
    const root = definitions.rootElements[0]
    const {id, name} = root;


    bpmnModeler.importXML(xml)
    root.set('id', id)
    root.set('name', name)
    message.success('修改完成');
  }
}
