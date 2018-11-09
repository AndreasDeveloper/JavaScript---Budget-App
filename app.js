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
 
})();

// -------------------------------------------------------------------------------------------------------------------------------------

/// UI FILLED MODULE | UI CONTROLLER
var UIController = (function() {

    // Private Variables | DOM Manipulation
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    // Stores Item Structure (Type, Description and Value)
    return {    // Makes this method/object global
        getInput: function() {  // Method
            return {
                type: document.querySelector(DOMStrings.inputType).value,  // Either inc or exp (income or expenses)
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
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

        // Event Listener 2 | When 'enter' is pressed | Global Event
        document.addEventListener('keypress', function(event) {
            
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            } 
        });
    };

    // FUNCTION | - Adding Item Function
    var ctrlAddItem = function() {
        // Get input data
        var input = UICtrl.getInput();

        // Add item to the budget controller


        // Add item to the UI


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