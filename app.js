/// DATA FILLED MODULE | DATA CONTROLLER
var budgetController = (function() {

    // Function Constructor | Expenses
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Function Constructor | Incomes
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    // Data Structure | - Holding Item Expenses and Incomes
    var data = {
        // Obj 1
        allItems: {
            exp: [],
            inc: []
        }, 
        // Obj 2
        totals: {
            exp: 0,
            inc: 0
        }
    };

    // Public Object and Method | - Allows other modules to add a new item into our data structure
    return {
        addItem: function(type, des, val) { // Type, Description and Value
            var newItem, ID;

            // Creates an unique ID for new item
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Creates new item based on inc or exp type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Determines if type is either Exp or Inc from allItems inner object and push it inside specified type
            data.allItems[type].push(newItem);
            // Returns newItem with specified type
            return newItem;
        },

        testing: function() {
            console.log(data);
        }
    };
 
})();

// -------------------------------------------------------------------------------------------------------------------------------------

/// UI FILLED MODULE | UI CONTROLLER
var UIController = (function() {

    // Private Variables | DOM Manipulation
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    // Stores Item Structure (Type, Description and Value)
    return {    // Makes this methods/objects global
        getInput: function() {  // Method
            return {
                type: document.querySelector(DOMStrings.inputType).value,  // Either inc or exp (income or expenses)
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        // Adds New Item
        addListItem: function(obj, type) {
            // Declaring Variables
            var html, newHtml, element;

            // Creates HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        // Clearing the input fields
        clearFields: function() {
            var fields, fieldsArr;

            // Selecting which input fields to clear
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            // Converting fields LIST to an ARRAY
            fieldsArr = Array.prototype.slice.call(fields);

            // Clears current elements (input Description and input Value)
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            }); 
            fieldsArr[0].focus();
        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    }

})();  

// -------------------------------------------------------------------------------------------------------------------------------------

/// LINKER MODULE | APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    // FUNCTION | - Where all event listeners are stored 
    var setupEventListeners = function() {

        // Get Strings Var's from UI Controller Method
        var DOM = UICtrl.getDOMStrings();

        // Event Listener 1 | When add button is clicked
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Event Listener 2 | When 'enter' (13) is pressed | Global Event
        document.addEventListener('keypress', function(event) {
            
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            } 
        });
    };

    // FUNCTION | - Adding Item Function - When hitting input button
    var ctrlAddItem = function() {

        // Declaring new variables
        var input, newItem;

        // Get input data
        input = UICtrl.getInput();

        // Add item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // Add item to the UI
        UICtrl.addListItem(newItem, input.type);

        // Clear the fields
        UICtrl.clearFields();

        // Calculate the budget


        // Display the Budget on the UI

    };

    // INITIALIZATION FUNCTION | - Public Function
    return {
        init: function() {
            console.log('Testing');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

// -------------------------------------------------------------------------------------------------------------------------------------

// Calling INIT Function (MANDATORY)
controller.init();