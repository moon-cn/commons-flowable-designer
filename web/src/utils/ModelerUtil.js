const PREFIX = 'flowable:';

function getPureKey(key) {
  return key.replace(PREFIX, '')
}

function getFullKey(k) {
  return PREFIX + k;
}

export default class {


  // 更新属性，会自动加上前缀
  static updateProperties(modeling, element, properties) {
    const newProps = {};
    for (let key in properties) {
      const fk = getFullKey(key);
      newProps[fk] = properties[key]
    }

    modeling.updateProperties(element, newProps)

  }


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
  static query(root, type) {
    const elements = root.flowElements;
    for (const element of elements) {
      if (element.$type === type) {
        return element;
      }
    }
  }
}
