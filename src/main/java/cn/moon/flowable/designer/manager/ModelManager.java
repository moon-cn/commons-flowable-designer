package cn.moon.flowable.designer.manager;

import cn.moon.flowable.designer.tool.BpmnModelXmlTool;
import org.flowable.bpmn.model.*;
import org.flowable.bpmn.model.Process;
import org.springframework.stereotype.Component;

import java.util.ArrayList;


@Component
public class ModelManager {

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


        return BpmnModelXmlTool.modelToXml(model);
    }

    public static void main(String[] args) {
        ModelManager manager = new ModelManager();
        String template = manager.createTemplate("leave", "请假申请");

        System.out.printf(template);
    }


}
