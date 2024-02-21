import React from "react";
import {Modal} from "antd";
import ModelList from "./ModelList";
import {URLTool} from "@crec/lang";

export default class {

  static open = () => {
    Modal.info({
      icon:null,
      title: '模型列表',
      width:800,
      okText: null,
      style:{
        minHeight: 500
      },
      content:   <ModelList onChange={id => {
        const url = URLTool.replaceParam(window.location.href, 'id', id)
        window.location.href = url;
      }}></ModelList>
      ,
      closable: true,
      destroyOnClose:true
    })

  }
}
