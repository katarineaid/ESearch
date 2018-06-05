function getType(url) {
  let type;
  let arr = url.split('LE/');
  let re = /[/]/gi;
  console.log('arr', arr)

  if (arr.length === 1) {
    type = arr[0].replace(re, '_').toLowerCase();
  } else {
    type = arr[1].replace(re, '_').toLowerCase();
  }
  console.log('type', type)
  return type
}
module.exports = getType;