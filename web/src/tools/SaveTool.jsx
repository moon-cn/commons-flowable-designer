import {message} from "antd";
import {HttpClient, URLTool} from "@crec/lang";

export default class {

  static onSaveXml = (bpmnModeler) => {
    let params = URLTool.params();
    const id = params.id;

    return new Promise((resolve, reject) => {
      const hide = message.loading('保存中...', 0)
      bpmnModeler.saveXML().then(res => {
        HttpClient.postForm('/flowable/model/saveContent', {id, xml: res.xml}).then(rs => {
          hide()
          message.success('服务端保存成功')
          resolve()
        }).catch(e => {
          hide()
          reject()
        })
      })
    })

  }

 static onDeploy = (bpmnModeler) => {
   let params = URLTool.params();
   const id = params.id;
   bpmnModeler.saveXML().then(res => {
      HttpClient.postForm('/flowable/model/deploy', {id, xml: res.xml}).then(rs => {
        if (rs.success) {
          message.success(rs.message)
        } else {
          message.error(rs.message)
        }

      })
    })
  }

}
