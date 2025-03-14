type Mergeable = Record<string, any> | any[];

// 判断是否为纯对象（排除数组、null 和特殊对象）
const isPlainObject = (value: any): value is Record<string, any> => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

// 判断是否为可合并类型
const isMergeable = (value: any): value is Mergeable => {
  return isPlainObject(value) || Array.isArray(value);
};

// 核心合并函数
function merge<T extends Mergeable, U extends Mergeable>(target: T, source: U): T & U;
function merge<T extends Mergeable>(target: T, ...sources: Mergeable[]): T;
function merge(target: any, ...sources: any[]): any {
  for (const source of sources) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const srcVal = source[key];
        const tarVal = target[key];

        if (isMergeable(srcVal) && isMergeable(tarVal)) {
          // 递归处理可合并对象
          target[key] = merge(tarVal, srcVal);
        } else {
          // 直接赋值（包含覆盖逻辑）
          target[key] = isMergeable(srcVal)
            ? (Array.isArray(srcVal) ? [...srcVal] : { ...srcVal })
            : srcVal;
        }
      }
    }
  }
  return target;
}

export { merge };
