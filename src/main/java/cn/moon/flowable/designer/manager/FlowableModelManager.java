package cn.moon.flowable.designer.manager;

import cn.moon.flowable.designer.tool.BpmnModelXmlTool;
import org.flowable.bpmn.model.*;
import org.flowable.bpmn.model.Process;
import org.flowable.engine.impl.form.LongFormType;
import org.springframework.stereotype.Component;

import java.util.ArrayList;


@Component
public class FlowableModelManager {

    public String createTemplate(String key, String name) {
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

        startEvent.setFormKey("1");
        ArrayList<FormProperty> formProperties = new ArrayList<>();
        FormProperty formProperty = new FormProperty();
        formProperty.setName("请假天数");
        formProperty.setRequired(true);
        formProperty.setId("days");
        formProperties.add(formProperty);
        startEvent.setFormProperties(formProperties);

        return BpmnModelXmlTool.modelToXml(model);
    }

    public static void main(String[] args) {
        FlowableModelManager manager = new FlowableModelManager();
        String template = manager.createTemplate("leave", "请假申请");

        System.out.printf(template);
    }





}
