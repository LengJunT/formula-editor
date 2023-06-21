import { QuickMatchMap } from './editor/interface'

export function fieldAddTemplate (tree: any) {
  for (let node of tree) {
    if (!node.template && node.value) {
      node.template = `$\{${node.value}}`
    }
    if (node.children?.length) {
      fieldAddTemplate(node.children)
    }
  }
}

export function findNodeAndParents (tree: any, value: any) {
  for (let node of tree) {
    if (node.value === value) {
      return [node];
    }
    if (node.children) {
      const result: any = findNodeAndParents(node.children, value);
      if (result) {
        return [node, ...result];
      }
    }
  }
  return null;
}
export function flattenTree(tree: any) {
  let flattened: any[] = [];

  function flatten(node: any) {
    flattened.push(node);
    if (node.children && node.children.length > 0) {
      for (let child of node.children) {
        flatten(child);
      }
    }
  }

  for (let node of tree) {
    flatten(node);
  }

  return flattened;
}

/**
 * 取出最后一个${}内的内容
 * @param str
 * @returns {any}
 */
export function extractLastPlaceholder(str: string): string | null {
  const regex = /\${([^}]*)}[^}]*$/;
  const matches = str.match(regex);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return null;
}

/**
 * 提取自动提示标签类型的label值
 * @param str
 * @returns {any}
 */
export function extractLabelNestedValues(str: string) {
  const regex = /\${([^}]*)}/;
  const matches = str.match(regex);
  if (matches && matches.length > 1) {
    const nestedValue = matches[1];
    return nestedValue.split('.').filter(value => value.trim() !== '');
  }
  return [];
}


/**
 * 取出字符串数组中指定正则标记的内容
 * @param {string[]} strings
 * @param {RegExp} pattern
 * @returns {string[][]}
 */
export function extractStringArrayPlaceholders(strings: string[], pattern = /\${([^}]*)}/g) {
  const placeholders: string[][] = [];

  for (let i = 0; i < strings.length; i++) {
    const string = strings[i];
    const matches = string.match(pattern);
    const matchesWithoutBraces = matches?.map(function(match) {
      return match.slice(2, -1);
    });
    if (matchesWithoutBraces) {
      placeholders.push(matchesWithoutBraces);
    }
  }
  return placeholders;
}

/**
 * 数组去重并打平
 * @param {string[][]} arr
 * @returns {string[]}
 */
export function deduplicateAndFlatten(arr: string[][]) {
  // 使用 Set 对数组进行去重
  var flattenedSet = new Set(arr.flat());

  // 将 Set 转换为数组并返回
  return Array.from(flattenedSet);
}



/**
 * 合并去重复
 * @param {T extends Record<any, any>[]} arr1
 * @param {T extends Record<any, any>[]} arr2
 * @param { string } indexKey 去重的索引
 * @returns { T extends Record<any, any>[]}
 */
export function mergeAndDeduplicate<T extends Record<any, any>>(arr1: T[], arr2: T[], indexKey = 'value'): T[] {
  // 创建一个对象字典用于记录已经存在的 value
  const valueDict: Record<string, boolean> = {};

  // 合并并去重
  return arr1.concat(arr2).reduce(function(result: any, obj) {
    // 如果当前 value 不存在于字典中，则将该对象添加到结果数组中，并在字典中标记该 value 为存在
    if (!valueDict[obj[indexKey]]) {
      valueDict[obj[indexKey]] = true;
      result.push(obj);
    }
    return result;
  }, []);
}

/**
 * 提取最后一个未完成的函数名称
 * @param {string} input
 * @returns {string}
 */
export const extractLastIncompleteFunction = (input: string): string => {
  const stack: number[] = [];
  let lastFunction = '';

  for (let i = 0; i < input.length; i++) {
    if (input[i] === '(') {
      stack.push(i);
    } else if (input[i] === ')') {
      stack.pop();
    }
  }

  if (stack.length > 0) {
    const lastLeftParenthesisIndex = stack.pop()!;
    lastFunction = input.substring(0, lastLeftParenthesisIndex).trim();

    if (lastFunction.includes(' ')) {
      const lastSpaceIndex = lastFunction.lastIndexOf(' ');
      lastFunction = lastFunction.substring(lastSpaceIndex + 1);
    }
    if (lastFunction.includes('(')) {
      const lastSpaceIndex = lastFunction.lastIndexOf('(');
      lastFunction = lastFunction.substring(lastSpaceIndex + 1);
    }
    if (lastFunction.includes(')')) {
      const lastSpaceIndex = lastFunction.lastIndexOf(')');
      lastFunction = lastFunction.substring(lastSpaceIndex + 1);
    }
  }
  return lastFunction;
};

/**
 * 获取最后一个未完成函数的第一个参数
 */
export const extractLastIncompleteFunctionFirstParam = (text: string): string => {
  const lastFunctionName = extractLastIncompleteFunction(text)
  const param = text.split(lastFunctionName + '(').reverse()?.[0].split(',')?.[0]?.trim()
  return param
}

/**
 * 获取当前输入函数参数的索引
 * @param {string} input
 * @param {string} funName
 * @returns {number | null}
 */
export const curInputFunParamIndex = (input: string, funName: string) => {
  const key = `${funName}(`
  // 先将参数中的函数参数去掉
  const str = input.replace(/\([^()]*\)/g, '')
  // 获取目标函数的输入参数结果
  // 取最后一个目的是取最后一个目标函数
  const lastPart = str.split(key).pop()
  if (lastPart) {
    const params = lastPart?.split(',')
    return params.length - 1
  }
  return null
}


/**
 * 依据ReturnType 属性对树结构进行过滤
 * @param data QuickMatchMap
 * @param {string} paramsType
 * @returns {any}
 */
export function filterQuickMatchMapByReturnType(data: QuickMatchMap, paramsType: string | string[]) {
  const map: QuickMatchMap = {};

  const types = typeof paramsType === 'string' ? [paramsType] : paramsType

  function handle (node: any) {
    // 判断当前节点是否满足筛选条件
    if (types.includes(node.returnType)) {
      // 创建新的节点对象，只保留必要的属性
      const filteredNode = { returnType: node.returnType, ...node };

      // 递归处理子节点
      if (node.children && node.children.length > 0) {
        filteredNode.children = node.children
          .map((child: any) => handle(child))
          .filter((child: any) => child !== null);
      }

      return filteredNode;
    }
    return null
  }
  if (types) {
    Object.keys(data).forEach((key: string) => {
      const item = handle(data[key])
      if (item) map[key] = item
      // if (!item.paramsType) {
      //   map[key] = item
      // } else if (item.paramsType === paramsType) {
      //   map[key] = item
      // }
    })
  }
  return map;
}


/**
 * 去除文本中函数的参数
 * @param {string} callString
 * @returns {string}
 */
export function removeFunctionParams(callString: string) {
  let parenthesesCount = 0;
  let result = '';

  for (let i = 0; i < callString.length; i++) {
    const char = callString[i];

    if (char === '(') {
      parenthesesCount++;
      if (parenthesesCount === 1) {
        result += char;
      }
    } else if (char === ')') {
      parenthesesCount--;
      if (parenthesesCount === 0) {
        result += char;
      }
    } else {
      if (parenthesesCount === 0) {
        result += char;
      }
    }
  }

  return result;
}


export const functionNameRegex = /([a-zA-Z_]\w*)\s*\(/g

/**
 * 获取最后一个函数名称
 * @param {string} callString
 * @returns {any}
 */
export function getLastFunctionName(callString: string) {
  const regex = functionNameRegex;
  let match;
  let lastFunctionName = null;

  while ((match = regex.exec(callString)) !== null) {
    lastFunctionName = match[1];
  }

  return lastFunctionName;
}


export function getEventKey (event: KeyboardEvent) {
  let keyCodeList = [];
  const key = event.key
  console.log('event', event, key)
  // if (event.ctrlKey) {
  //   keyCodeList.push(17);
  // }
  // if (event.shiftKey) {
  //   keyCodeList.push(16);
  // }
  // if (event.altKey) {
  //   keyCodeList.push(18);
  // }
  keyCodeList.push(key);
  return keyCodeList;
}
