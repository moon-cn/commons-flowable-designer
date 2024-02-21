package cn.moon.flowable.designer.tool;

import org.flowable.bpmn.converter.BpmnXMLConverter;
import org.flowable.bpmn.model.BpmnModel;
import org.flowable.common.engine.impl.util.io.BytesStreamSource;

import java.nio.charset.StandardCharsets;

public class BpmnModelXmlTool {

    public static BpmnModel xmlToModel(String xml) {
        BpmnXMLConverter converter = new BpmnXMLConverter();
        byte[] xmlBytes = xml.getBytes(StandardCharsets.UTF_8);
        BytesStreamSource streamSource = new BytesStreamSource(xmlBytes);

        return converter.convertToBpmnModel(streamSource, true, true);
    }

    public static String modelToXml(BpmnModel model) {
        BpmnXMLConverter converter = new BpmnXMLConverter();
        byte[] bytes = converter.convertToXML(model, StandardCharsets.UTF_8.name());
        return new String(bytes, StandardCharsets.UTF_8);
    }
}
