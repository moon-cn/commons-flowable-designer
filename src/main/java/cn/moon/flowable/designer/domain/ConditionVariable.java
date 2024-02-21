package cn.moon.flowable.designer.domain;

import lombok.Data;

import java.io.Serializable;

@Data
public class ConditionVariable implements Serializable {

    String name;
    String label;
    Object value;


    // 不设置 valueType 则为仅仅显示
    ValueType valueType;
    String params;

    boolean disabled;
    boolean visible = true;

    public ConditionVariable() {

    }

    public enum ValueType {
        text,  digit
    }


    public static ConditionVariable text(String name, String label){
        ConditionVariable item = new ConditionVariable();
        item.name = name;
        item.label = label;
        item.valueType= ValueType.text;
        return item;
    }


    public static ConditionVariable digit(String name, String label){
        ConditionVariable item = new ConditionVariable();
        item.name = name;
        item.label = label;
        item.valueType = ValueType.digit;
        return item;
    }


    public static ConditionVariable labelValue(String label, String value){
        ConditionVariable item = new ConditionVariable();
        item.value = value;
        item.label = label;
        return item;
    }
}
