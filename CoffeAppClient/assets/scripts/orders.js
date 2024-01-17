let delOrderID;
let editOrderID;
const editModalSelector = "#editModal #orderForm #submitBtn";

/*
class Order{
    constructor(_id, _fullName, _email, _description){

        if(arguments.length != 4)
        {
            throw new Error("Please, provide 4 properties")
        }

        this.id = _id;
        this.fullName = _fullName;
        this.email = _email;
        this.description = _description;
    }
}
*/

var orders = [];

console.log('Orders (before request) = ', orders);

//GET REQUEST
const getSettings = {
    async: true,
    crossDomain: true,
    url: 'http://localhost/CoffeAppAPI/api.php',
    method: 'GET',
    headers: {
        'content-type': 'application/json'
    }
};

$.ajax(getSettings).done(function (response) {
    console.log(response);

    orders = JSON.parse(response);

    console.log('Orders (after request response) = ', orders);

    populateTable();
});

//RENDER
const ordersTableBody = $("#ordersTbl tbody");
ordersTableBody.empty();

function populateTable(){
    $.each(orders, function(index, order){

        console.log(`Index = ${index}. Order = ${order}`);

        const newRowHtml = `<tr>
            <td>${order.orders_name}</td>
            <td>${order.orders_email}</td>
            <td onclick="detectTextLanguage('${order.orders_description}')">${order.orders_description}</td>
            <td>
                <button id="editBtn" data-order-id="${order.orders_id}">Edit</button>
                <button id="removeBtn" data-order-id="${order.orders_id}">Remove</button>
            </td>
        </tr>`;

        ordersTableBody.append(newRowHtml);
    });
}

$(ordersTableBody).on('click', "#removeBtn", function(){
    const orderId = $(this).data('order-id');
    delOrderID = orderId;
    $("#removeModal").show();
});


$("#cancelRemoveBtn").click(function(){
    $("#removeModal").hide();
});


$("#confirmBtn").click(function () {
    const deleteSettings = {
        async: true,
        crossDomain: true,
        url: 'http://localhost/CoffeAppAPI/api.php',
        method: 'DELETE',
        contentType: 'application/json', 
        data: JSON.stringify({ id: delOrderID }), 
    };

    $.ajax(deleteSettings)
        .done(function (response) {
            console.log(response + " Deletion complete");
            window.location.reload();
        });
});

//EDIT

$(ordersTableBody).on('click', "#editBtn", function () {
    const orderId = $(this).data('order-id');
    editOrderID = orderId;
    $("#editModal").show();
});

$("#closeEditModalSpn").click(function () {
    $("#editModal").hide();
});

$(editModalSelector).on('click', validateAndSubmit);

function validateAndSubmit(event) {
    event.preventDefault();
    var isValidated = true;

    $(`${editModalSelector} #fullNameSpn`).text("");
    $(`${editModalSelector} #emailSpn`).text("");
    $(`${editModalSelector} #descriptionSpn`).text("");

    const fullName = $("#fullName").val();
    if(fullName.length < 3){
        $("#fullNameSpn").html("Full name must be min 3 chars");
        isValidated = false;
    }

    const email = $("#email").val();
    if(email.endsWith("@epoka.edu.al")){
    } else {
        $("#emailSpn").html("This is not a valid Epoka email");
        isValidated = false;
    }

    const description = $("#description").val();
    if(description.length < 16){
        $("#descriptionSpn").html("Description must be min 16 chars");
        isValidated = false;
    }

    if(isValidated == false)
    {
        return
    }

    handleSubmit(editOrderID,fullName, email, description);
}

function handleSubmit(editOrderID,_fullName,_email,_description) {
    var newOrder = {
        id: editOrderID,
        fullName: _fullName,
        email: _email,
        description: _description
    };
    
    console.log('newOrder Object = ', newOrder);
    
    const editSettings = {
        async: true,
        crossDomain: true,
        url: `http://localhost/CoffeAppAPI/api.php`, 
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(newOrder), 
    };
    
    $.ajax(editSettings)
        .done(function (response) {
            console.log(response + " Update complete");
            window.location.reload();
        });
    
}

