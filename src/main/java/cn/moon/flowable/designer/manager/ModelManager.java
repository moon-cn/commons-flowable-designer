package cn.moon.flowable.designer.manager;

import cn.moon.flowable.designer.tool.BpmnModelXmlTool;
import org.flowable.bpmn.model.*;
import org.flowable.bpmn.model.Process;
import org.springframework.stereotype.Component;


@Component
public class ModelManager {

    public String createTemplate(String key, String name) {
        BpmnModel model = createTemplateModel(key, name);


        return BpmnModelXmlTool.modelToXml(model);
    }

    public  BpmnModel createTemplateModel(String key, String name) {
        BpmnModel model = new BpmnModel();

        Process proc = new Process();
        proc.setExecutable(true);
        proc.setId(key);
        proc.setName(name);

        model.addProcess(proc);

        StartEvent startEvent = new StartEvent();
        startEvent.setId("StartEvent_1");
        proc.addFlowElement(startEvent);

        model.addGraphicInfo(startEvent.getId(), new GraphicInfo(200, 200, 30, 30));
        return model;
    }


}
