package cn.moon.flowable.designer.manager;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.flowable.bpmn.converter.BpmnXMLConverter;
import org.flowable.bpmn.model.Process;
import org.flowable.bpmn.model.*;
import org.flowable.common.engine.impl.util.io.BytesStreamSource;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.repository.Model;
import org.flowable.engine.repository.ModelQuery;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import javax.annotation.Resource;
import java.nio.charset.StandardCharsets;
import java.util.List;


@Slf4j
@Component
public class ModelManager {

    @Resource
    RepositoryService repositoryService;

    public BpmnModel createTemplateModel(String key, String name) {
        return this.createTemplateModel(key, name, null, null);
    }

    /**
     * @param key
     * @param name
     * @param startFormKey
     * @param startFormProperties text: '文本',
     *                            long: '整数',
     *                            double: '小数',
     *                            date: '日期',
     *                            boolean: '是否',
     *                            enum: '枚举'
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

    public BpmnModel xmlToModel(String xml) {
        BpmnXMLConverter converter = new BpmnXMLConverter();
        byte[] xmlBytes = xml.getBytes(StandardCharsets.UTF_8);
        BytesStreamSource streamSource = new BytesStreamSource(xmlBytes);

        return converter.convertToBpmnModel(streamSource, true, true);
    }

    public String modelToXml(BpmnModel model) {
        BpmnXMLConverter converter = new BpmnXMLConverter();
        byte[] bytes = converter.convertToXML(model, StandardCharsets.UTF_8.name());
        return new String(bytes, StandardCharsets.UTF_8);
    }


    /**
     *
     * @param id
     * @param key
     * @param name
     * @param category
     * @param tenantId
     * @return 模型ID
     */
    public String saveOrUpdate(String id, String key, String name, String category, String tenantId) {
        Assert.notNull(key, "编码不能为空");
        Assert.state(Character.isLetter(key.charAt(0)), "编码以字母开头");
        Assert.notNull(name, "名称不能为空");

        category = StringUtils.trimToNull(category);
        tenantId = StringUtils.trimToNull(tenantId);

        boolean isNew = id == null;
        Model model = isNew ? repositoryService.newModel() : repositoryService.getModel(id);

        if (isNew) {
            // 校验key是否重复
            ModelQuery query = repositoryService.createModelQuery();
            if(tenantId != null){
                query.modelTenantId(tenantId);
            }
            long count = query.modelKey(key).count();
            Assert.state(count == 0, "key重复，同一个租户下的编码只能有一个");
        }


        model.setKey(key);
        model.setName(name);
        model.setCategory(category);
        model.setTenantId(tenantId);

        log.info("保存前ID {}", model.getId());
        repositoryService.saveModel(model);

        log.info("保存后ID {}", model.getId());

        return model.getId();
    }
}
