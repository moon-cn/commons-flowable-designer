/**
 * 系统初始化会调用这里
 */

import {HttpClient} from "@crec/lang";
import {message} from "antd";



HttpClient.setShowError(msg => {
  message.error(msg)
})




