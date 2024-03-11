const OPS_FLAGS = ["==", "!=", ">=", "<=", ">", "<"]; // 按长短排序
const LOGIC_FLAGS = ["&&", "||"];
const STR_FLAGS = ['"', '\''];


export function parseToArr(str){
  const arr = [];
  splitWords(str, arr)
  return arr;
}

function splitWords(text, result) {
  if (text === null || text === "") {
    return;
  }

  const chars = text.split("");
  const temp = [];

  let i = 0;

  while (i < chars.length) {
    const c = chars[i];

    const str = isStr(chars, i);
    const fn = isFn(chars, i);
    const op = isOp(chars, i);
    const logic = isLogic(chars, i);

    const block = str !== null ? str : fn !== null ? fn : op !== null ? op : logic;

    if (block !== null) {
      flushTemp(temp, result);
      result.push(block);
      i = i + block.length;
      continue;
    }

    if (c === "(") {
      result.push(String(c));
      i++;
      continue;
    }

    if (c === ")") {
      flushTemp(temp, result);
      result.push(String(c));
      i++;
      continue;
    }

    temp.push(c);
    i++;
  }

  const lastStr = temp.join("").trim();
  if (lastStr.length > 0) {
    result.push(lastStr);
  }
}

function flushTemp(temp, result) {
  const str = temp.join("").trim();
  if (str !== "") {
    result.push(str);
  }
  temp.length = 0;
}

function isOp(chars, index) {
  for (const str of OPS_FLAGS) {
    const len = str.length;
    if (index + len > chars.length) {
      return null;
    }

    if (str === chars.slice(index, index + len).join("")) {
      return str;
    }
  }
  return null;
}

function isLogic(chars, index) {
  for (const str of LOGIC_FLAGS) {
    const len = str.length;
    if (index + len > chars.length) {
      return null;
    }

    if (str === chars.slice(index, index + len).join("")) {
      return str;
    }
  }
  return null;
}

function isStr(chars, index) {
  const c = chars[index];

  for (const flag of STR_FLAGS) {
    if (c === flag) {
      for (let i = index + 1; i < chars.length; i++) {
        const cur = chars[i];
        if (cur === flag) {
          const s = chars.slice(index, i + 1).join("");
          return s;
        }
      }
    }
  }

  return null;
}

function isFn(chars, index) {
  const c = chars[index];
  if (c === ".") {
    for (let i = index + 1; i < chars.length; i++) {
      const cur = chars[i];
      if (cur === "(") {
        const s = chars.slice(index + 1, i).join("");
        return s;
      }
    }
  }

  return null;
}

function test(args) {
  const testArr = [
    "days > 123",
    "days > 123 && days < 456",
    "days > 1 || days < 6",
    "days > 1 && days <= 6 || ( days == 1 && reason == '临时有事' )",
    "days > 1 && days < 6 || ( days == 1 && reason == '临时有事' ) && days > 5",
    "( days > 1 && days < 6 ) || ( days == 1 && reason == '临时有事' )",
    "reason .contains( '临时有事' )",
    "( days > 1 && days < 6 ) || ( days == 1 && reason.contains( '临时有事' ) )"
  ];

  for (let i = 0; i < testArr.length; i++) {
    const str = testArr[i];
    if (i === 3) {
      console.log(i);
    }
    console.log(`\n输入：[${str}]`);

    const arr = [];
    splitWords(str, arr);

    const resultStr = arr.join(" ");
    console.log(`结果：[${resultStr}]\t\t解析数组：${arr}`);
    console.log(str === resultStr);
  }
}
