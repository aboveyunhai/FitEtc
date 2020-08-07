type isArrayEqualType = (number|boolean)[];

export const isArrayEqual = (arr1: isArrayEqualType, arr2: isArrayEqualType) => {
  if (arr1.length !== arr2.length) return false;
  for(let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

export const isArrayOfObjectDiff = (arr1: { [key:string]: any }[], arr2: { [key:string]: any }[]) => {
  if(arr1.length !== arr2.length) return true;
  // if((arr1 === undefined && arr2 !== undefined) || (arr1 === undefined && arr2 !== undefined)) return true;
  // if((arr1 === undefined && arr2 === undefined)) return false;

  const large = (arr1.length < arr2.length) ? arr2 : arr1;
  const small = (arr1.length < arr2.length) ? arr1 : arr2;
  var res = large.filter(item1 =>
  !small.some(item2 => (item2['date'] === item1['date'] && item2['value'] === item1['value'])));
  if(res.length > 0) {
    return true
  }
  return false;
}

export const sum = (arr1: number[]) => {
  if(arr1 !== null && arr1.length <=0) {
    return 0;
  }
  return arr1.reduce((v, total)=>v+total,0);
}

export const piePath = (radius: number, value: number) => {
  const x = radius - Math.cos((2 * Math.PI) / (100 / value)) * radius;
  const y = radius + Math.sin((2 * Math.PI) / (100 / value)) * radius;
  const long = (value <= 50) ? 0 : 1
  const d = `M${radius},${radius} L${radius},${0}, A${radius},${radius} 0 ${long},1 ${y},${x} Z`
  return d;
}

export const findMaxMin = (arr: number[]) => {
  let max = arr[0], min = arr[0], maxIdx = 0, minIdx = 0;
  for(let i =0; i < arr.length; i++) {
    if( arr[i] > max ){
      max = arr[i];
      maxIdx = i;
    }
    if( arr[i] < min ){
      min = arr[i];
      minIdx = i;
    }
  }
  return { max, min, maxIdx, minIdx };
}

const HelperFunction = {
  isArrayEqual,
  isArrayOfObjectDiff,
  sum,
  piePath,
  findMaxMin,
};
export default HelperFunction;
