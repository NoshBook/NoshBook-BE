
module.exports = function dblog(any) {
  if(process.env.NO_DB_LOG !== 'true') 
    console.log(any);
};
