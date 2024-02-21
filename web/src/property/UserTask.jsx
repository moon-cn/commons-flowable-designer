import React from 'react';
import {Card, Form, Select, Switch} from 'antd';
import {HttpClient} from "@crec/lang";
import StringSelect from '../components/StringSelect';
import ModelerUtil from "../utils/ModelerUtil";
import BaseForm from "./BaseForm";
export default class extends BaseForm {
  state = {
    userOptions: [],
    groupOptions: [],
    userMap: {},
    groupMap: {}
  };


  componentDidMount() {
    super.componentDidMount()
    HttpClient.get('/flowable/model/userOptions').then((rs) => {
      this.setState({userOptions: rs.data})
      this.setState({userMap: this.convertOptions(rs.data)})
    })
    HttpClient.get('/flowable/model/groupOptions').then((rs) => {
      this.setState({groupOptions: rs.data})
      this.setState({groupMap: this.convertOptions(rs.data)})
    })
  }
  convertOptions = (options) => {
    const map = {};
    for (let u of options) {
      map[u.value] = u.label
    }
    return map;
  }

  onValuesChange = (changed, values) => {
    ModelerUtil.setData(this.props.bo,values);
    this.genName(changed,values)
  };

  genName = (changed, values) => {
    const {bo, element, modeling} = this.props
    const oldName = ModelerUtil.getName(bo)
    let genName = oldName == null || oldName.startsWith('@'); // 是否需要生成节点名称
    if (!genName) {
      return
    }

    const {assignee, candidateUsers, candidateGroups} = values;

    let label = null;

    if (assignee) {
      label = this.state.userMap[assignee]
    } else if (candidateUsers && candidateUsers.length) {
      label = candidateUsers.split(',').map(u => this.state.userMap[u]).join(',')
    } else if (candidateGroups && candidateGroups.length) {
      label = candidateGroups.split(',').map(u => this.state.groupMap[u]).join(',')
    }

    ModelerUtil.setName(modeling,element, bo, '@' + label)
  }


  render() {
    const {groupOptions, userOptions} = this.state;
    return (
      <Form
        ref={this.formRef}
        onValuesChange={this.onValuesChange}
        layout='vertical'
      >
        <Form.Item label="指定人" name="assignee">
          <StringSelect
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) => option.label.includes(input)}
            options={userOptions}
          >
          </StringSelect>
        </Form.Item>

        <Form.Item label="候选人"
                   name="candidateUsers">
          <StringSelect
            mode='multiple'
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) => option.label.includes(input)}
            options={userOptions}
          >
          </StringSelect>
        </Form.Item>

        <Form.Item
          label="候选组"
          name="candidateGroups">
          <StringSelect
            mode='multiple'
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) => option.label.includes(input)}
            options={groupOptions}
          >
          </StringSelect>
        </Form.Item>
      </Form>
    );
  }


}
