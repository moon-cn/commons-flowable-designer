
package cn.moon.flowable.designer.controller;

import cn.moon.flowable.designer.manager.ModelManager;
import cn.moon.lang.web.Option;
import cn.moon.lang.web.Result;
import org.apache.commons.lang3.StringUtils;
import org.flowable.bpmn.model.Process;
import org.flowable.bpmn.model.*;
import org.flowable.engine.IdentityService;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.flowable.engine.repository.Model;
import org.flowable.engine.repository.ModelQuery;
import org.flowable.idm.api.Group;
import org.flowable.idm.api.User;
import org.flowable.validation.ProcessValidator;
import org.flowable.validation.ProcessValidatorFactory;
import org.flowable.validation.ValidationError;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 流程模型控制器
 */
@RestController
@RequestMapping("flowable/model")
public class ModelController {

    @Resource
    private IdentityService identityService;

    @Resource
    private RepositoryService repositoryService;


    @Resource
    protected ProcessEngineConfigurationImpl processEngineConfiguration;

    @Resource
    private ModelManager modelManager;

    @GetMapping("list")
    public Result list(String keyword) {
        ModelQuery query = repositoryService.createModelQuery();

        if (keyword != null) {
            query.modelNameLike("%" + keyword + "%");
        }

        List<Model> list = query.orderByLastUpdateTime().desc().list();

        return Result.ok().data(list);
    }

    @PostMapping("save")
    public Result save(String id, String key, String name, String category, String tenantId) {

        modelManager.saveOrUpdate(id, key, name, category, tenantId);

        return Result.ok();
    }


    @GetMapping("detail")
    public Result detail(@RequestParam String id) {
        Model model = repositoryService.getModel(id);

        Map<String, Object> detail = new HashMap<>();
        detail.put("id", model.getId());
        detail.put("name", model.getName());
        detail.put("key", model.getKey());


        byte[] source = repositoryService.getModelEditorSource(id);

        if (source == null) {
            BpmnModel defaultModel = modelManager.createTemplateModel(model.getKey(), model.getName());
            detail.put("xml", modelManager.modelToXml(defaultModel));
        } else {
            detail.put("xml", new String(source, StandardCharsets.UTF_8));
        }

        return Result.ok().data(detail);
    }

    @GetMapping("delete")
    public Result delete(@RequestParam String id) {
        repositoryService.deleteModel(id);
        return Result.ok();
    }


    @PostMapping("saveContent")
    public Result saveContent(@RequestParam String id, @RequestParam String xml) {
        repositoryService.addModelEditorSource(id, xml.getBytes(StandardCharsets.UTF_8));
        BpmnModel bpmnModel = modelManager.xmlToModel(xml);
        validateModel(bpmnModel);
        return Result.ok();
    }


    @PostMapping("deploy")
    public Result deploy(@RequestParam String id, @RequestParam String xml) {
        Model model = repositoryService.createModelQuery().modelId(id).singleResult();
        Assert.notNull(model, "模型不存在");


        repositoryService.addModelEditorSource(id, xml.getBytes(StandardCharsets.UTF_8));

        BpmnModel bpmnModel = modelManager.xmlToModel(xml);
        validateModel(bpmnModel);

        Process mainProcess = bpmnModel.getMainProcess();

        // 修改和检验模型
        for (FlowElement flowElement : mainProcess.getFlowElements()) {
            // 校验是否都分配对象
            if (flowElement instanceof UserTask) {
                UserTask task = (UserTask) flowElement;

                if (task.getAssignee() == null &&
                    CollectionUtils.isEmpty(task.getCandidateUsers()) &&
                    CollectionUtils.isEmpty(task.getCandidateGroups())) {
                    //  throw new IllegalArgumentException("请指定分配对象");
                }

            }

            // 设置发起人变量标识
            if (flowElement instanceof StartEvent) {
                StartEvent startEvent = (StartEvent) flowElement;
                startEvent.setInitiator("INITIATOR");
            }

            // 条件表达式测试
            if (flowElement instanceof SequenceFlow) {
                SequenceFlow sequenceFlow = (SequenceFlow) flowElement;
                String conditionExpression = sequenceFlow.getConditionExpression();

                if (StringUtils.isEmpty(conditionExpression)) {
                    continue;
                }

                try {
                    processEngineConfiguration.getExpressionManager().createExpression(conditionExpression);
                } catch (Exception e) {
                    throw new IllegalArgumentException("条件表达式异常:" + e.getMessage());
                }

            }
        }


        String resourceName = model.getName() + ".bpmn20.xml";
        repositoryService.createDeployment()
                .addBpmnModel(resourceName, bpmnModel)
                .name(model.getName())
                .key(model.getKey())
                .deploy();

        return Result.ok().msg("部署成功");
    }


    @GetMapping("userOptions")
    public Result userOptions() {
        List<User> list = identityService.createUserQuery().list();
        List<Option> options = Option.convertList(list, User::getId, User::getDisplayName);
        return Result.ok().data(options);
    }

    @GetMapping("groupOptions")
    public Result groupOptions() {
        List<Group> list = identityService.createGroupQuery().list();
        List<Option> options = Option.convertList(list, Group::getId, Group::getName);
        return Result.ok().data(options);
    }


    private void validateModel(BpmnModel model) {
        ProcessValidator validator = new ProcessValidatorFactory().createDefaultProcessValidator();

        // 默认校验
        List<ValidationError> errors = validator.validate(model);
        if (!errors.isEmpty()) {
            ValidationError error = errors.get(0);
            String problem = error.getProblem();

            Map<String, String> translates = new HashMap<>();
            translates.put("flowable-exclusive-gateway-seq-flow-without-conditions", "请设置分支条件");
            String msg = translates.get(problem);

            Assert.state(false, StringUtils.defaultString(msg, error.getDefaultDescription()));
        }
    }


    @ExceptionHandler(Exception.class)
    public Result exception(Exception e) {
        return Result.err().msg(e.getMessage());
    }

}
