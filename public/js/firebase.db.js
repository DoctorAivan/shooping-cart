
//  Get Firestore Lib
    const db = firebase.firestore()

//  Create auth
    const auth = firebase.auth()

//  Save product ID
    let product_id = 0

//  Form action for products
    let product_action = ''

//  Object for product size type
    const obj_size_type = {
        'kg':{
            's':'Kilo',
            'm':'Kilos'
        },
        'un':{
            's':'Unidad',
            'm':'Unidades'
        },
        'gm':{
            's':'Gramos',
            'm':'Gramos'
        }
    }

//  Forms
    const shopping_product_ui = document.getElementById('shopping-product-add')

//  Get products from DB
    const db_product_get = async () =>
    {
        await db.collection('products').where("status", "==", true)
        .onSnapshot((doc) =>
        {
            product_create_list(doc)

        //  Show loading UI
            ui_status.loading_complete()
        });
    }

//  Send product form
    const form_product_add = document.getElementById('form-product')
    form_product_add.addEventListener('submit' , e =>
    {
    //  Create object for product
        let product = {
            category : form_product_add['product-category'].value,
            title : form_product_add['product-title'].value,
            brand : form_product_add['product-brand'].value,
            description : form_product_add['product-description'].value,
            price : form_product_add['product-price'].value,
            size : form_product_add['product-size'].value,
            size_type : form_product_add['product-size-type'].value,
            image : form_product_add['product-image'].value,
            status : form_product_add['product-status'].checked,
        }

    //  Define action
        if(product_action == 'add')
        {
            db_product_add(product)
        }
        if(product_action == 'edit')
        {
            db_product_edit(product)
        }

    //  Close product details
        ui_product.close()
        
    //  Stop autosend
        e.preventDefault()
    })

//  Add product
    const db_product_add = async (product) =>
    {
    //  Show loading UI
        ui_status.loading()

    //  Create a product in DB
        await db.collection('products').add({
            category : product.category,
            title : product.title,
            brand : product.brand,
            description : product.description,
            price : Number(product.price),
            size : Number(product.size),
            size_type : product.size_type,
            image : product.image,
            status : product.status
        })
        .then((doc) =>
        {
        //  Show loading UI
            ui_status.loading_complete()

        //  Close product details
            ui_product.close()
        })
        .catch((error) =>
        {
            console.error("Error adding document: ", error);
        });
    }

//  Edit product
    const db_product_edit = async (product) =>
    {
    //  Show loading UI
        ui_status.loading()

    //  Create a product in DB
        await db.collection('products').doc(product_id).update({
            category : product.category,
            title : product.title,
            brand : product.brand,
            description : product.description,
            price : Number(product.price),
            size : Number(product.size),
            size_type : product.size_type,
            image : product.image,
            status : product.status
        })
        .then((doc) =>
        {
        //  Show loading UI
            ui_status.loading_complete()
        })
        .catch((error) =>
        {
            console.error("Error adding document: ", error);
        });
    }

//  User interface for products
    const ui_product  =
    {
        add : function()
        {
        //  Set action
            product_action = 'add'

        //  Reset form
            form_product_add.reset()

        //  Create elements
            this.size_type()

            const header = document.querySelector("#form-product-header")
            header.innerHTML = '<i class="fas fa-plus-circle"></i> Agregar un producto'

            $(shopping_product_ui).fadeIn('fast');
        },
        edit : async function(id)
        {
        //  Show loading UI
            ui_status.loading()

        //  Set action
            product_action = 'edit'

        //  Create elements
            this.size_type()

        //  Set id
            product_id = id

        //  Set title
            document.querySelector("#form-product-header").innerHTML = '<i class="fas fa-edit"></i> Edición de un producto'

            await db.collection('products').doc(id).get()
            .then((querySnapshot) =>
            {
                let product = querySnapshot.data()

                document.getElementById('product-category').value = product.category
                document.getElementById('product-title').value = product.title
                document.getElementById('product-brand').value = product.brand
                document.getElementById('product-description').value = product.description
                document.getElementById('product-price').value = product.price
                document.getElementById('product-size').value = product.size
                document.getElementById('product-size-type').value = product.size_type
                document.getElementById('product-image').value = product.image
                document.getElementById('product-status').checked = product.status

            //  Show loading UI
                ui_status.loading_complete()
            })
            .catch((error) =>
            {
                
            });

            $(shopping_product_ui).fadeIn('fast');

        },
        delete : async function()
        {
        //  Show loading UI
            ui_status.loading()

            await db.collection("products").doc(product_id).delete()
            .then(() =>
            {
            //  Show loading UI
                ui_status.loading_complete()

                this.close()

                console.log("Document successfully deleted!");
            })
            .catch((error) =>
            {
                console.error("Error removing document: ", error);
            });  
        },
        close : function()
        {
            $(shopping_product_ui).fadeOut('fast');
        },
        size_type : function()
        {
            const price_size = document.getElementById('product-size-type')
            price_size.innerHTML = ''
            
            Object.entries(obj_size_type).forEach(([id, size]) =>
            {
                let option = document.createElement( 'option' );
                option.value = size.s = id
                option.text = size.m
                price_size.add( option )
            });
        }
    }

    const shopping_status = document.getElementById('shopping-status')
    const ui_status =
    {
        loading : function()
        {
            $(shopping_status).fadeIn('fast')
        },
        loading_complete : function()
        {
            $(shopping_status).fadeOut('fast')
        }
    }