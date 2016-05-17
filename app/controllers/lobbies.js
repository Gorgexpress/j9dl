module.exports =  function(req, res, next){
  var lst = [];
  lst.push("APEM pros only");
  lst.push("ARDM"); 
  res.send(JSON.stringify(lst));
}
