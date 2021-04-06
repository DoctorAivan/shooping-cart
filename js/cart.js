
//  Create cart product list
    let cart_product_list = Object();

//  Header navegation menu status
    let header_menu_status = 0;

//  Header navegation user status
    let header_user_status = 0;

//  Shopping buy status
    let shopping_buy_status = 0;

//  -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       

//  App div content
    const shopping = document.getElementById('shopping')

//  DOM Load complete Completeted
    document.addEventListener('DOMContentLoaded' , () =>
    {
    //  Create product list
        product_get_list()

    //  Get save cart product list
        if(localStorage.getItem('cart'))
        {
        //  Set products to cart list
            cart_product_list = JSON.parse(localStorage.getItem('cart'))

        //  Create cart details
            cart_details()
        }
    })

//  Get product list contente
    const shopping_cart_product_list = document.getElementById('shopping-cart-product-list-items')

//  Get cart product list contente
    const template_cart_product_list_item = document.getElementById('template-cart-product-list').content
    const fragment_cart_product_list = document.createDocumentFragment()

//  Get product list contente
    const shopping_product_list = document.getElementById('shopping-product-list')

//  Create Templates from HTML
    const template_product_list_item = document.getElementById('template-product-list-item').content
    const fragment_product_list = document.createDocumentFragment()

//  Create product list
    const product_get_list = async () =>
    {
        try
        {
            const res = await fetch('js/products.json')
            const data = await res.json()
            product_create_list(data)
        }
        catch (error){}
    }

//  Create product list
    const product_create_list = (data) =>
    {
    //  Create product template
        data.forEach(product =>
        {
            template_product_list_item.querySelector('.title').textContent = product.title
            template_product_list_item.querySelector('.total > span').textContent = number_format_clp.format(product.price)
            template_product_list_item.querySelector('.total').dataset.price = product.price
            template_product_list_item.querySelector('.total').dataset.cant = 1
            template_product_list_item.querySelector('.total').dataset.id = product.id
            template_product_list_item.querySelector('.size').textContent = product.size
            template_product_list_item.querySelector('img').setAttribute('src',product.img)

        //  Confirm if product is added to cart list
            if(cart_product_list.hasOwnProperty(product.id))
            {
            //  Icon of product in list
                template_product_list_item.querySelector('.fas').classList.add('fa-check-circle')
                template_product_list_item.querySelector('.fas').classList.remove('fa-plus-circle')
            }
            else
            {
            //  Icon of product in list
                template_product_list_item.querySelector('.fas').classList.add('fa-plus-circle')
                template_product_list_item.querySelector('.fas').classList.remove('fa-check-circle')
            }

        //  Add to product list
            const clone_product_list = template_product_list_item.cloneNode(true)
            fragment_product_list.appendChild(clone_product_list)

        });

    //  Add product to list
        shopping_product_list.appendChild(fragment_product_list)
    }

//  -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       

//  Display main menu
    const shopping_header_menu = document.getElementById('shopping-header-menu')
    shopping_header_menu.addEventListener('click' , e => 
    {
        const shopping_header_menu_categories = document.getElementById('shopping-header-menu-categories')

        if(header_menu_status === 0)
        {
            shopping_header_menu.querySelector('i').classList.remove('fa-bars')
            shopping_header_menu.querySelector('i').classList.add('fa-times')

            $(shopping_header_menu_categories).fadeIn('fast');

            header_menu_status = 1;
        }
        else
        {
            shopping_header_menu.querySelector('i').classList.remove('fa-times');
            shopping_header_menu.querySelector('i').classList.add('fa-bars');

            $(shopping_header_menu_categories).fadeOut('fast');

            header_menu_status = 0;
        }
    })

//  -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       

//  Display menu
    const shopping_header_user = document.getElementById('shopping-header-user')
    shopping_header_user.addEventListener('click' , e => 
    {
        const shopping_cart_product_list = document.getElementById('shopping-cart-product-list')

        if(header_user_status === 0)
        {
            shopping_header_user.querySelector('i').classList.remove('fa-user')
            shopping_header_user.querySelector('i').classList.add('fa-times')

            $(shopping_cart_product_list).fadeIn('fast');

            header_user_status = 1;
        }
        else
        {
            shopping_header_user.querySelector('i').classList.remove('fa-times');
            shopping_header_user.querySelector('i').classList.add('fa-user');

            $(shopping_cart_product_list).fadeOut('fast');

            header_user_status = 0;
        }
    })

//  -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       

//  Display  menu
    const shopping_buy = document.getElementById('shopping-buy')
    shopping_buy.addEventListener('click' , e => 
    {
        const shopping_cart_product_list = document.getElementById('shopping-cart-product-list')

        if(shopping_buy_status === 0)
        {
            $(shopping_cart_product_list).fadeIn('fast');

            shopping_buy_status = 1;
        }
        else
        {
            $(shopping_cart_product_list).fadeOut('fast');

            shopping_buy_status = 0;
        }
    })

//  -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       -       

//  Add actions to product
    const product = document.querySelector('#shopping-main > section.list.grid.col-2')
    product.addEventListener('click' , e =>
    {
    //  Add product to cart
        cart_add_product(e)
    })

//  Add product to cart
    const cart_add_product = (e) =>
    {
    //  Validate add to shopping cart
        if(e.target.classList.contains('fa-plus-circle') || e.target.classList.contains('fa-check-circle') )
        {
            const image_fly = document.getElementById('shopping-image-fly')

        //  Get data from object
            let product = e.target.parentElement.parentElement.parentElement
            let id = product.querySelector('.total').dataset.id
            let title = product.querySelector('.title').textContent
            let price = product.querySelector('.total').dataset.price
            let size = product.querySelector('.size').textContent
            let image = product.querySelector('img')
            let image_src = image.getAttribute('src')

        //  Save temporal object
            let object = {
                id : id,
                title : title,
                price : price,
                size : size,
                cant : 1,
                image : image_src
            }

        //  Validate if the product is in the cart list
            if(cart_product_list.hasOwnProperty(id))
            {
            //  Delete from cart list
                delete cart_product_list[id]

            //  Icon of product in list
                e.target.classList.add('fa-plus-circle')
                e.target.classList.remove('fa-check-circle')
            }
            else
            {
            //  Add to cart list
                cart_product_list[id] = object

            //  Icon of product in list
                e.target.classList.add('fa-check-circle')
                e.target.classList.remove('fa-plus-circle')

                let image_position = offset(image);

                image_fly.querySelector('img').setAttribute('src',image_src)
                image_fly.style.width = image.clientWidth + 'px'
                image_fly.style.height = image.clientHeight + 'px'
                image_fly.style.left = image_position.left + 'px'
                image_fly.style.top = image_position.top + 'px'

                $("#shopping-image-fly").fadeIn(0)
                $("#shopping-image-fly").animate(
                {
                    'top': ( document.scrollingElement.scrollTop + window.screen.height - 40),
                    'left': 20,
                    'width': 35,
                    'height': 35
                }, 1000, 'easeInOutExpo' , function()
                {
                    $("#shopping-image-fly").fadeOut('fast')
                });
            }

        //  Create cart details
            cart_details()
        }
        e.stopPropagation()
    }

	function offset(el) {
        var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

//  Create cart details
    const cart_details = () =>
    {
    //  Clear cart product list
        shopping_cart_product_list.innerHTML = ''

        console.log(cart_product_list);

    //  Create product template
        Object.values(cart_product_list).forEach(product =>
        {
            template_cart_product_list_item.querySelector('.details-title').textContent = product.title
            template_cart_product_list_item.querySelector('.details-price > span').textContent = number_format_clp.format(product.price)
            template_cart_product_list_item.querySelector('.details-size').textContent = product.size
            template_cart_product_list_item.querySelector('.details-cant').textContent = product.cant
            template_cart_product_list_item.querySelector('.cant').dataset.id = product.id
            template_cart_product_list_item.querySelector('img').setAttribute('src',product.image)

        //  Add to product list
            const clone_cart_product_list = template_cart_product_list_item.cloneNode(true)
            fragment_cart_product_list.appendChild(clone_cart_product_list)
        });

    //  Add product to list
        shopping_cart_product_list.appendChild(fragment_cart_product_list)

    //  Create total values for cart detailes
        const cart_total_cant = Object.values(cart_product_list).reduce((t, {cant}) => t + cant , 0)
        const cart_total_price = Object.values(cart_product_list).reduce((t, {cant , price}) => t + cant * price , 0)

        let number_products = ''

        if(cart_total_cant === 1)
        {
            number_products = ' Producto'
        }
        else
        {
            number_products = ' Productos'
        }

    //  Set values to UI
        document.querySelector("#shopping-footer > div.products").innerHTML = cart_total_cant + number_products
        document.querySelector("#shopping-footer > div.total > span").innerHTML = number_format_clp.format(cart_total_price)

    //  Save cart product list
        localStorage.setItem('cart' , JSON.stringify(cart_product_list))
    }

    //  Add actions to product
    shopping_cart_product_list.addEventListener('click' , e =>
    {
        if(e.target.classList.contains('fa-minus'))
        {
        //  Get id from product
            let id = e.target.parentElement.parentElement.dataset.id;

            const product = cart_product_list[id]
            if(product.cant !== 1)
            {
                product.cant--
            }

        //  Create cart details
            cart_details()
        }
        if(e.target.classList.contains('fa-plus'))
        {
        //  Get id from product
            let id = e.target.parentElement.parentElement.dataset.id;

            const product = cart_product_list[id]
            product.cant++

        //  Create cart details
            cart_details()
        }
    })

//  Number Format
    const number_format_clp = new Intl.NumberFormat('de-DE',
    {
        currency: 'EUR',
        minimumFractionDigits: 0
    })