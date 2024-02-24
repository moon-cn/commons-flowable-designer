package cn.moon;

import cn.moon.flowable.designer.manager.ModelManager;
import cn.moon.flowable.designer.tool.BpmnModelXmlTool;
import org.flowable.bpmn.model.BpmnModel;
import org.flowable.bpmn.model.Process;
import org.flowable.bpmn.model.SequenceFlow;

public class XmlFactory {

    public static void main(String[] args) {
        ModelManager manager = new ModelManager();

        BpmnModel bpmnModel = manager.createTemplateModel("leave", "请假");

        Process mainProcess = bpmnModel.getMainProcess();
        SequenceFlow sf = new SequenceFlow();
        sf.setConditionExpression("days>1");
        mainProcess.addFlowElement(sf);

        System.out.println(BpmnModelXmlTool.modelToXml(bpmnModel));

    }

}
