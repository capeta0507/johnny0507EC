var category = 'All';
let shopCard = '';
let item_star = '';

let session_category = window.sessionStorage.getItem('category');

console.log('session_category', session_category)

// 假如session有的話，從session抓
if(session_category){
  category = session_category
  $('.category_tag').removeClass('active');
  let myTagName = `#${category}_tag`;  // 類別 + _tag 組合
  $(myTagName).addClass('active');  // 引用 類別 + _tag 組合
}

shop_list(category);

function categories(tag){
  category = tag
  // console.log('category', category);
  // $('.category_tag').removeClass('active');
  // // $(this).addClass('active');
  // if(category === 'All'){
  //     $('#all_tag').addClass('active');
  //     shop_list(category);
  // }
  // if(category === 'Fashion'){
  //     $('#fasion_tag').addClass('active');
  //     shop_list(category);
  // }
  // if(category === 'Toy'){
  //     $('#toy_tag').addClass('active');
  //     shop_list(category);
  // }
  // if(category === 'Movie'){
  //     $('#movie_tag').addClass('active');
  //     shop_list(category);
  // }

  // 改成 switch 大師班 第二版
  // https://www.w3schools.com/js/js_switch.asp
  // $('.category_tag').removeClass('active');
  // switch(category){
  //   case 'All':
  //     $('#All_tag').addClass('active');
  //     break;
  //   case 'Fashion':
  //     $('#Fasion_tag').addClass('active');
  //     break;
  //   case 'Toy':
  //     $('#Toy_tag').addClass('active');
  //     break;
  //   case 'Movie':
  //     $('#Movie_tag').addClass('active');
  //     break;
  //   default:
  //     break;
  // }
  // shop_list(category);

  // 改成 不用switch, category_tag 大師班 第三版
  $('.category_tag').removeClass('active');
  let myTagName = `#${category}_tag`;  // 類別 + _tag 組合
  $(myTagName).addClass('active');  // 引用 類別 + _tag 組合
  shop_list(category);

  // console.log('this',$(this))
  // console.log('cat', $('.category_tag'))
}

function shop_list(myaCtegory){
  // console.log('myaCtegory', myaCtegory)
  axios.get(`/products/category/${myaCtegory}`)
    .then(result =>{
      if (result.data.success == true){
        // console.log('result', result.data.result);
        shopCard = ''
        result.data.result.map(data => {
          shopCard += `
            <div class="col-md-4">
              <div class="card mb-4 product-wap rounded-0">
                <div class="card rounded-0">
                  <img class="card-img rounded-0 img-fluid" src="shop/product/${data.photo}">
                  <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                      <ul class="list-unstyled">
                          <li><a class="btn btn-success text-white" href="shop-single.html?no=${data.no}"><i class="far fa-heart"></i></a></li>
                          <li><a class="btn btn-success text-white mt-2" href="shop-single.html?no=${data.no}"><i class="far fa-eye"></i></a></li>
                          <li><a class="btn btn-session text-white mt-2" href="shop-item.html" onclick="single_item('${data.no}')"><i class="far fa-eye"></i></a></li>
                          <li><a class="btn btn-success text-white mt-2" href="shop-single.html?no=${data.no}"><i class="fas fa-cart-plus"></i></a></li>
                      </ul>
                  </div>
                </div>
                <div class="card-body">
                  <a href="shop-single.html" class="h3 text-decoration-none">${data.name}</a>
                  <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                      <li>${data.description}</li>
                      <li class="pt-2">
                          <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                          <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                          <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                          <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                          <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                      </li>
                  </ul>
                  <ul class="list-unstyled d-flex justify-content-center mb-1">
                      <li class="itemStar">
                          ${'<i class="text-warning fa fa-star"></i>'.repeat(data.star)}
                          ${'<i class="text-muted fa fa-star"></i>'.repeat(5 - data.star)}
                      </li>
                  </ul>
                  <p class="text-center mb-0">NT$ ${data.price}</p>
                </div>
              </div>
            </div>
          `
        });
        document.getElementById('myShop').innerHTML = shopCard;
      } else {
        console.log('查無資料');
      }
    })
    .catch(err =>{
      console.log(err.message);
    })
}

function single_item(no){
  // alert('no', no)
  // console.log('no', no)
  sessionStorage.setItem('shop_no', no)
}