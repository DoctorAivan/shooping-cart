//  Cart Object
    let cart = {}

//  DOM Completeted
    document.addEventListener('DOMContentLoaded' , () => {
        product_list()
        if(localStorage.getItem('cart'))
        {
            cart = JSON.parse(localStorage.getItem('cart'))
            cart_product_create_list()
        }
    })

//  Product Actions
    const content_products = document.getElementById('cart-products')
    content_products.addEventListener('click' , e => {
        cart_add_product(e)
    })

//  Cart Product Actions
    const content_cart_products = document.getElementById('cart-product-added')
    content_cart_products.addEventListener('click' , e => {
        cart_products_list_actions(e.target)
    })

//  Create Templates from HTML
    const template_cart_product = document.getElementById('template-cart-product').content
    const template_product_item = document.getElementById('template-product-div').content

//  Create Fragment
    const fragment = document.createDocumentFragment()

//  Create Product List
    const product_list = async () => {
        try
        {
            const res = await fetch('js/data.json')
            const data = await res.json()

            product_list_create(data)
        }
        catch (error){}
    }

//  Create Product List Item
    const product_list_create = (data) => {
        data.forEach(product => {
            template_product_item.querySelector('h2').textContent = product.title
            template_product_item.querySelector('h3').textContent = product.price
            template_product_item.querySelector('img').setAttribute('src',product.img)
            template_product_item.querySelector('.button').dataset.id = product.id

            const clone = template_product_item.cloneNode(true)
            fragment.appendChild(clone)
        });
        content_products.appendChild(fragment)
    }

//  Add Product to Cart
    const cart_add_product = (e) => {
        if(e.target.classList.contains('button'))
        {
            cart_add_product_confirm(e.target.parentElement.parentElement)
        }
        e.stopPropagation()
    }

//  Cart Product list Actions
    const cart_products_list_actions = (e) => {
        if(e.classList.contains('fa-plus-circle'))
        {
            const product = cart[e.dataset.id]
            product.cant++
            cart[e.dataset.id] = {...product}
            cart_product_create_list()
        }
        if(e.classList.contains('fa-minus-circle'))
        {
            const product = cart[e.dataset.id]
            product.cant--
            cart[e.dataset.id] = {...product}
            if(product.cant === 0)
            {
                delete cart[e.dataset.id]
            }
            cart_product_create_list()
        }
        if(e.classList.contains('delete-item'))
        {
            delete cart[e.dataset.id]
            cart_product_create_list()
        }
    }

//  Add Product to Cart Confirm
    const cart_add_product_confirm = object => {
        const product = {
            id: Number(object.querySelector('.button').dataset.id),
            title: object.querySelector('h2').textContent,
            price: Number(object.querySelector('h3').textContent),
            cant: 1
        }

        if(cart.hasOwnProperty(product.id))
        {
            product.cant = cart[product.id].cant + 1
        }

        cart[product.id] = {...product}

        cart_product_create_list()
    }

//  Create Product List Added
    const cart_product_create_list = () =>
    {
        content_cart_products.innerHTML = ''

        let i = 1

        Object.values(cart).forEach(product =>
        {
            template_cart_product.querySelector('.id').textContent = i
            template_cart_product.querySelector('.fa-plus-circle').dataset.id = product.id
            template_cart_product.querySelector('.fa-minus-circle').dataset.id = product.id
            template_cart_product.querySelector('.title').textContent = product.title
            template_cart_product.querySelector('.price').textContent = product.price * product.cant
            template_cart_product.querySelector('.cant').textContent = product.cant
            template_cart_product.querySelector('.delete-item').dataset.id = product.id
            
            const clone = template_cart_product.cloneNode(true)
            fragment.appendChild(clone)

            i++
        })
        content_cart_products.appendChild(fragment)

        localStorage.setItem('cart' , JSON.stringify(cart))

        const cart_total_cant = Object.values(cart).reduce((t, {cant}) => t + cant , 0)
        const cart_total_price = Object.values(cart).reduce((t, {cant , price}) => t + cant * price , 0)

        document.getElementsByClassName('cant-total')[0].innerHTML = cart_total_cant
        document.getElementsByClassName('price-total')[0].innerHTML = cart_total_price

        const button_empty_cart = document.getElementById('cart-empty-button')
        button_empty_cart.addEventListener('click', e => {
            cart = {}
            cart_product_create_list()
        })
    }