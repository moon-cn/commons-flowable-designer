import React from 'react'
import {Select} from 'antd'

/**
  多选时，值逗号分隔，
 */
export default class extends React.Component {



  render(){
    let {value, onChange, ...rest} = this.props

    if(value){
     if (!Array.isArray(value)){
        value = value.split(',')
     }
    }else {
      value = []
    }


    return <Select {...rest}
     value={value}
     onChange={(v)=>{
        if(Array.isArray(v)){
          v = v.join(',')
        }
        onChange(v)
     }} />

  }

}
