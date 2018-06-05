function getNameService(url){
  let step1 = url.split('services/');
  let step2 = step1[1].split('/');

  if (step2[0]==='LE'){
    return step2[1].toLowerCase()
  }else{
    return step2[0].toLowerCase()
  }
}
module.exports = getNameService;