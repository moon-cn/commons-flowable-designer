package cn.moon.flowable.designer.manager;

import org.flowable.bpmn.converter.BpmnXMLConverter;
import org.flowable.bpmn.model.*;
import org.flowable.bpmn.model.Process;
import org.flowable.common.engine.impl.util.io.BytesStreamSource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.nio.charset.StandardCharsets;
import java.util.List;


@Component
public class ModelManager {

    public BpmnModel createTemplateModel(String key, String name) {
      return   this.createTemplateModel(key,name, null, null);
    }

    /**
     *
     * @param key
     * @param name
     * @param startFormKey
     * @param startFormProperties
     *
     *   text: '文本',
     *   long: '整数',
     *   double: '小数',
     *   date: '日期',
     *   boolean: '是否',
     *   enum: '枚举'
     *
     * @return
     */
    public BpmnModel createTemplateModel(String key, String name, String startFormKey, List<FormProperty> startFormProperties) {
        Assert.notNull(key, "key不能为空");
        Assert.notNull(name, "name不能为空");

        Assert.state(Character.isLetter(key.charAt(0)), "key以字母开头");


        BpmnModel model = new BpmnModel();

        Process mainProcess = new Process();
        mainProcess.setExecutable(true);
        mainProcess.setId(key);
        mainProcess.setName(name);

        model.addProcess(mainProcess);

        StartEvent startEvent = new StartEvent();
        startEvent.setId("StartEvent_1");
        mainProcess.addFlowElement(startEvent);

        model.addGraphicInfo(startEvent.getId(), new GraphicInfo(200, 200, 30, 30));

        startEvent.setFormKey(startFormKey);
        startEvent.setFormProperties(startFormProperties);
        return model;
    }

    public  BpmnModel xmlToModel(String xml) {
        BpmnXMLConverter converter = new BpmnXMLConverter();
        byte[] xmlBytes = xml.getBytes(StandardCharsets.UTF_8);
        BytesStreamSource streamSource = new BytesStreamSource(xmlBytes);

        return converter.convertToBpmnModel(streamSource, true, true);
    }

    public  String modelToXml(BpmnModel model) {
        BpmnXMLConverter converter = new BpmnXMLConverter();
        byte[] bytes = converter.convertToXML(model, StandardCharsets.UTF_8.name());
        return new String(bytes, StandardCharsets.UTF_8);
    }
}
