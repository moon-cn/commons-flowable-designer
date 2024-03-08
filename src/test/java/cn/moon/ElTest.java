package cn.moon;

import org.flowable.common.engine.api.delegate.Expression;
import org.flowable.common.engine.impl.el.ExpressionManager;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.impl.el.ProcessExpressionManager;
import org.flowable.engine.impl.persistence.entity.ExecutionEntityImpl;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

public class ElTest {

    @Test
    public  void test1() {
        ExpressionManager expressionManager = new ProcessExpressionManager(null);
        Expression expression = expressionManager.createExpression("${reason.startsWith(\"生病\")}");

        DelegateExecution delegateExecution = new ExecutionEntityImpl();
        Map<String, Object> data = new HashMap<>();
        data.put("reason", "生病了");
        delegateExecution.setTransientVariables(data);

        Object value = expression.getValue(delegateExecution);

        System.out.println(value);
    }

    @Test
    public  void test2() {
        ExpressionManager expressionManager = new ProcessExpressionManager(null);
        Expression expression = expressionManager.createExpression("${reason.contains(\"生病\")}");

        DelegateExecution delegateExecution = new ExecutionEntityImpl();
        Map<String, Object> data = new HashMap<>();
        data.put("reason", "生病了");
        delegateExecution.setTransientVariables(data);

        Object value = expression.getValue(delegateExecution);

        System.out.println(value);
    }

    @Test
    public  void testEnds() {
        ExpressionManager expressionManager = new ProcessExpressionManager(null);
        Expression expression = expressionManager.createExpression("${reason.endsWith(\"生病\")}");

        DelegateExecution delegateExecution = new ExecutionEntityImpl();
        Map<String, Object> data = new HashMap<>();
        data.put("reason", "生病了");
        delegateExecution.setTransientVariables(data);

        Object value = expression.getValue(delegateExecution);

        System.out.println(value);
    }

    @Test
    public  void testQuite() {
        ExpressionManager expressionManager = new ProcessExpressionManager(null);
        Expression expression = expressionManager.createExpression("${reason.endsWith('生病')}");

        DelegateExecution delegateExecution = new ExecutionEntityImpl();
        Map<String, Object> data = new HashMap<>();
        data.put("reason", "生病");
        delegateExecution.setTransientVariables(data);

        Object value = expression.getValue(delegateExecution);

        System.out.println(value);
    }

    @Test
    public  void testBad() {
        ExpressionManager expressionManager = new ProcessExpressionManager(null);
        Expression expression = expressionManager.createExpression("${reason == 1Y}");

        DelegateExecution delegateExecution = new ExecutionEntityImpl();
        Map<String, Object> data = new HashMap<>();
        data.put("reason", "生病");
        delegateExecution.setTransientVariables(data);

        Object value = expression.getValue(delegateExecution);

        System.out.println(value);
    }
}
