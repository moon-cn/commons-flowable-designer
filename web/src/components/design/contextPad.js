class CustomContextPad {
  constructor(config, contextPad, create, elementFactory, injector, translate) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    contextPad.registerProvider(this);
  }

  static $inject = ['config', 'contextPad', 'create', 'elementFactory', 'injector'];

  getContextPadEntries(element) {
    const { autoPlace, create, elementFactory } = this;

    function appendServiceTask(event, element) {
      if (autoPlace) {
        const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
        autoPlace.append(element, shape);
      } else {
        appendServiceTaskStart(event, element);
      }
    }

    function appendServiceTaskStart(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
      create.start(event, shape, element);
    }

    return {
      'append.append-task': {
        group: 'model',
        className: 'bpmn-icon-user-task',
        title: '追加用户任务',
        action: {
          click: appendServiceTask,
          dragstart: appendServiceTaskStart,
        },
      },
    };
  }
}

export default {
  __init__: ['customContextPad'],
  customContextPad: ['type', CustomContextPad],
};
