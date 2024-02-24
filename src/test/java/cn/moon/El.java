package cn.moon;

import org.flowable.common.engine.api.delegate.Expression;
import org.flowable.common.engine.impl.el.DefaultExpressionManager;
import org.flowable.common.engine.impl.el.ExpressionManager;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.impl.el.ProcessExpressionManager;
import org.flowable.engine.impl.persistence.entity.ExecutionEntityImpl;
import org.flowable.engine.impl.util.CommandContextUtil;

import java.util.HashMap;
import java.util.Map;

public class El {
    public static void main(String[] args) {
        ExpressionManager expressionManager = new ProcessExpressionManager(null);
        Expression expression = expressionManager.createExpression("${days>1}");

        DelegateExecution delegateExecution = new ExecutionEntityImpl();
        Map<String, Object> data = new HashMap<>();
        data.put("days", 2);
        delegateExecution.setTransientVariables(data);

        Object value = expression.getValue(delegateExecution);

        System.out.println(value);
    }
}
