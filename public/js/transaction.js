var Transactions = [];

/**
 * Request data from the server and if refreshGrid is true,
 * render it in the grid.
 * @param  {boolean} [refreshGrid=false] - If true, render the data in the grid.
 */
function getAllTransactions(refreshGrid = false) {
    $.ajax({
        url: "/getTransactions",
        type: "GET",
        processData: false,
        contentType: false,
        headers: {
            "Content-Type": "application/json",
        },
        success: function (items) {
            for (var trans of items) {
                Transactions.push(
                    new transaction(
                        trans.date,
                        trans.type,
                        trans.description,
                        trans.quantity,
                        trans.sellingPrice,
                        trans.transactedBy
                    )
                );
            }
            if (refreshGrid) {
                w2ui["itemGrid"].records = Transactions;
                w2ui["itemGrid"].refresh();
            }
        },
    });
}

function transaction( date, type, desc,
                    quantity, sellingPrice, transactedBy) 
{
    return {
        recid: Transactions.length + 1,
        date: date,
        type: type,
        description: desc,
        quantity: quantity,
        sellingPrice: sellingPrice,
        transactedBy: transactedBy
    };
}

// On document ready
$(function () {
    getAllTransactions(true);

    $("#itemGrid").w2grid({
        name: "itemGrid",
        show: {
            footer: true,
            lineNumbers: true,
        },
        method: "GET",
        limit: 50,
        recordHeight: 120,
        columns: [
            { field: "date",         text: "Date",          size: "7%", sortable: true },
            { field: "type",         text: "Type",          size: "5%", sortable: true },
            { field: "description",  text: "Description",   size: "40%", sortable: true },
            { field: "quantity",     text: "Quantity",      size: "3%", sortable: true },
            { field: "sellingPrice", text: "Selling Price", size: "6%", sortable: true},
            { field: "transactedBy", text: "Transacted By", size: "7%", sortable: true },
        ],
        records: Transactions,
        onDblClick: function(recid) {
            // Redirects to item page

            var record = w2ui["itemGrid"].get(recid.recid);
            
            // Grabs the last string in description. This is the code.
            var code = record.description.split(" ").pop()

            window.location.href = "/item/"+code;
        },
    });

});

$(window).resize(function () {
    console.log("refresh/resize");
    w2ui["itemGrid"].refresh();
});