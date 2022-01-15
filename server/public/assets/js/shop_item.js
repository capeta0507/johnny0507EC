// 獲取網址參數
var urlNo = window.location.search;

urlNo = urlNo.split('=');
var itemNo = urlNo[1];

let shopItem = ''

let itemStar = ''

console.log('url', urlNo);

shop_item(itemNo)

function shop_item(no){
  axios.get(`/products/item/${no}`)
  .then(result=>{
    if (result.data.success == true){
      console.log(result.data.result[0].star)
      shopItem = `
        <div class="row">
          <div id="myImg" class="col-lg-5 mt-5">
            <div class="card mb-3">
              <img class="card-img img-fluid" src="shop/product/${result.data.result[0].photo}" alt="Card image cap" id="product-detail">
            </div>
          </div>
          <!-- col end -->
          <div class="col-lg-7 mt-5">
            <div class="card">
              <div class="card-body">
                <h1 class="h2">${result.data.result[0].name}</h1>
                <p class="h3 py-2">NT$ ${result.data.result[0].price}</p>
                <p id="itemStar" class="py-2">
                  <i class="fa fa-star text-warning"></i>
                  <i class="fa fa-star text-warning"></i>
                  <i class="fa fa-star text-warning"></i>
                  <i class="fa fa-star text-warning"></i>
                  <i class="fa fa-star text-secondary"></i>
                </p>
                <ul class="list-inline">
                  <li class="list-inline-item">
                    <h6>分類:</h6>
                  </li>
                  <li class="list-inline-item">
                    <p class="text-muted"><strong>玩具/模型</strong></p>
                  </li>
                </ul>

                <h6>Description:</h6>
                <p>${result.data.result[0].name} ${result.data.result[0].description}</p>

                <h6>Specification:</h6>
                <ul class="list-unstyled pb-3">
                  <li>${result.data.result[0].name}</li>
                  <li>${result.data.result[0].description}</li>
                </ul>

                <form action="" method="GET">
                  <div class="row pb-3">
                    <div class="col d-grid">
                      <button type="submit" class="btn btn-success btn-lg" name="submit" value="buy">Buy</button>
                    </div>
                    <div class="col d-grid">
                      <button type="submit" class="btn btn-success btn-lg" name="submit" value="addtocard">Add To Cart</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      `
      document.getElementById('myItem').innerHTML = shopItem;
    } else {
      console.log('查無資料');
    }
  })
  .catch(err =>{
    console.log(err.message);
  })
}