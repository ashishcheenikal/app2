exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/);
};

exports.validateLength = (text,min,max)=>{
    if(text.length>max||text.length<min){
        return false;
    }
    return true;
}