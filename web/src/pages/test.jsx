import ExpressionEditor from "../components/ExpressionEditor";
import {useState} from "react";

export default function () {
  let a = "days>1"
  let b = "days>1 && days<6"
  let c = "(days>1 && days<6) || (days==1 && reason == '临时有事')";
  let e = " reason.contains('临时有事')";

  let d = "(days>1&&days<6)||(days==1&&reason.contains('临时有事'))";
  const [ex, setEx] = useState(a)
  return <div style={{width: 300}}> <ExpressionEditor value={ex} onChange={setEx} variables={[
    {id: 'days', name: '请假天数'},
    {id: 'reason', name: '请假原因'}
  ]}/></div>
}
