package cn.moon.flowable.designer.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class FlowModel {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    /**
     * 编码, 流程的key
     */
    private String key;

    /**
     * 名称
     */
    private String name;



    private String formUrl;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String updateTime;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String xml;

}
