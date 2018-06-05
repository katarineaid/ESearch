function validationName(name) {
  if (name.indexOf('SHAPE') !== -1) {
    return false
  }
  if (name.indexOf('.') !== -1) {
    return false
  }
  if (name.indexOf('(') !== -1) {
    return false
  }
  if (name.indexOf(')') !== -1) {
    return false
  }
  return true
}
module.exports = validationName;