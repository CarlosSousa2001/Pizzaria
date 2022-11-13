//Atalhos---------------------------------
function l(con) {
    console.log(con)
}
const c = (e) => document.querySelector(e)
const cs = (e) => document.querySelectorAll(e)
//-----------------Variveis Carrinho--------------------
let cart = []
let modalQt = 1
let modalKey = 0; // salvando a key dentro de map
//---------------------
//closest() procura o elemento mais proximo que contenha class pizza-item, 
//ele procura tanto dentro da div quando pra fora
// cloneNode() ele vai no elemento e clona tudo que tem dentro dele.
pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true)

    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
     pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault()

        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        l(key)
        let modalQt = 1
        modalKey = key
        // Parte do modal
        c('.pizzaWindowArea img').src = pizzaJson[key].img
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        c('.pizzaInfo--size.selected').classList.remove('selected')
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {

            if (sizeIndex == 2) {
                size.classList.add('selected')
            }
            // c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[sizeIndex]}`
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        c('.pizzaInfo--qt').innerHTML = modalQt

        c('.pizzaWindowArea').style.opacity = 0
        c('.pizzaWindowArea').style.display = 'flex'
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1
        }, 200)
    })

    c('.pizza-area').append(pizzaItem)
})
// funções

const closeModal = () => {
    c('.pizzaWindowArea').style.opacity = 1
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none'
    }, 200)
    c('.pizzaWindowArea').style.opacity = 0
}


// eventos

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal)
})

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--
    }
    c('.pizzaInfo--qt').innerHTML = modalQt

})
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++
    c('.pizzaInfo--qt').innerHTML = modalQt
})
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
        // c('.pizzaInfo--actualPrice').innerHTML = pizzaJson[modalKey].price[sizeIndex]
    })
})

c('.pizzaInfo--addButton').addEventListener('click', (e) => {
    let size = c('.pizzaInfo--size.selected').getAttribute('data-key')
    // l("tamanho "+size)
    //  l('Quantidade '+ modalQt)

    let identifier = pizzaJson[modalKey].id + '@' + size

    let key = cart.findIndex((item) => {
        return item.identifier === identifier
    })
    if (key > -1) {
        cart[key].qt += modalQt
    } else {
        cart.push(
            { identifier, id: pizzaJson[modalKey].id, size: size, qt: modalQt }
        )
    }
    //   l(identifier)

    closeModal()
    updateCart()
})
c('.menu-openner').addEventListener('click', (e)=>{
    if(cart.length){
        c('aside').style.left = 0
    }   

})
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw'
})
function updateCart() {

    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = ''

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id === cart[i].id)
            subtotal += pizzaItem.price * cart[i].qt
            
            let cartItem = c('.models .cart--item').cloneNode(true)

            let pizzaSizeName;
            if (cart[i].size == 0) {
                pizzaSizeName = 'P'
            } else if (cart[i].size == 1) {
                pizzaSizeName = 'M'
            } else if (cart[i].size == 2) {
                pizzaSizeName = 'G'
            }

            let pizzName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            c('.cart').append(cartItem)

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                }
                updateCart()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart()
            })
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
    } else {
        c('aside').classList.remove('show')
    }
}
