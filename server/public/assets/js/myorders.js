let myOrder = ''
let myEmail = sessionStorage.getItem('eMail');
// console.log('myEmail', myEmail)

axios.get(`/customers/myorders/${myEmail}`)
  .then(result=>{
    if (result.data.success == true){
     result.data.result.map((data, oerder_key)=>{
      let myDateString = data.orderNo.substring(3,11);
      let myYear = myDateString.substring(0, 4);
      let myMonth = myDateString.substring(4, 6);
      let myDate = myDateString.substring(6, 8);
      let order_date = myYear + '/' + myMonth + '/' + myDate;
      // console.log(oerder_key)
      // console.log(data)
      myOrder += `
        <table class="table table-bordered table_list">
          <thead class="table-secondary">
            <tr>
              <th class="text-center" scope="col">訂單編號</th>
              <th class="text-center" scope="col">日期</th>
              <th class="text-center" scope="col">名稱</th>
              <th class="text-center" scope="col">總價</th>
            </tr>
          </thead>
          <tbody id="order_list">
            <tr>
              <th class="text-center" scope="row">${data.orderNo}</th>
              <td class="text-center">${order_date}</td>
              <td class="text-center">${data.description}</td>
              <td class="text-center">NT$ ${data.amt}</td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample${oerder_key}" aria-expanded="false" aria-controls="collapseExample${oerder_key}">
          明細
        </button>
        <div class="collapse" id="collapseExample${oerder_key}">
            <div class="shop_array_order">
              <table id="myShopArray" class="table table-bordered table-hover table-dark">
                <thead>
                  <tr>
                    <th class="text-center" scope="col">商品編號</th>
                    <th class="text-center" scope="col">商品名稱</th>
                    <th class="text-center" scope="col">數量</th>
                    <th class="text-center" scope="col">價格</th>
                  </tr>
                </thead>
                <tbody id="shop_list">
      `
      data.shopArray.map((shop_data)=>{
        myOrder += `
          <tr>
            <td class="text-center">${shop_data.no}</td>
            <td class="text-center">${shop_data.name}</td>
            <td class="text-center">${shop_data.qty}件</td>
            <td class="text-center">NT$ ${shop_data.total}</td>
          </tr>
        `
      })
      myOrder += `
              </tbody>
            </table>
          </div>
        </div>
      `
      $('#myorders').html(myOrder);
     })
    } else {
      console.log('查無資料');
    }
  })
  .catch(err =>{
    console.log(err.message);
  })