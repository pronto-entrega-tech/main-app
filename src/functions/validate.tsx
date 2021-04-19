export default function(value: any[]) {
  let valid = true;

  for (let i = 0; i < value.length ; i++) {
    if (typeof value[i] === 'undefined')
      valid = false
  }
  
  return valid
}