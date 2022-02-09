let myNo = 'ECx20220207153113000';
let myNo2 = myNo.substring(3,11)
console.log(myNo);
console.log(myNo2);
let myYear = myNo2.substring(0, 4)
let myMonth = myNo2.substring(4, 6)
let myDate = myNo2.substring(6, 8)
let order_date = myYear + '/' + myMonth + '/' + myDate
console.log(order_date)

console.log(myNo.substr(3,8).substr(0,4));
console.log(myNo.substr(3,8).substr(4,2));
console.log(myNo.substr(3,8).substr(6,2));

let order_date_str = myNo.substr(3,8).substr(0,4) + '/' + myNo.substr(3,8).substr(4,2) + '/' + myNo.substr(3,8).substr(6,2)
console.log(order_date_str)