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

const HelperFunction = {
  isArrayEqual,
  isArrayOfObjectDiff
};
export default HelperFunction;
