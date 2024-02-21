import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";

const PREFIX = 'flowable:';

function getPureKey(key) {
  return key.replace(PREFIX, '')
}

function getFullKey(k) {
  return PREFIX + k;
}

export default class {


  static getData(bo) {

    let attrs = bo.$attrs;

    const data = {};
    for (let k in attrs) {
      let pureKey = getPureKey(k);
      data[pureKey] = attrs[k];
    }

    return data;
  }

  static setData(bo, values) {
    for (let key in values) {
      let fullKey = getFullKey(key);
      const oldValue = bo.get(fullKey)
      let newValue = values[key]

      if (newValue === undefined || newValue === '') {
        newValue = undefined;
      }
      if (newValue !== oldValue) {
        bo.set(fullKey, newValue)
      }
    }
  }

  static setName(modeling, element, bo, name) {
    bo.set('name', name);
    modeling.updateLabel(element, name);
  }

  static getName(bo) {
    return bo.get('name')
  }

  static isTimerStart(bo) {
    let definitions = bo.eventDefinitions;
    return (definitions != null &&
      definitions.length &&
      definitions[0].$type === "bpmn:TimerEventDefinition"
    )
  }

  static getForList(bo, key) {
    const v = bo.get(getFullKey(key))
    if (v) {
      return JSON.parse(v)
    }
    return []
  }

  static setForList(bo, key, list) {
    if(list && list.length){
      const v = JSON.stringify(list)
      bo.set(getFullKey(key), v)
    }else {
      bo.set(getFullKey(key), undefined)
    }

  }
}
