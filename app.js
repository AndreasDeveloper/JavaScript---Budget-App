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

    // Function | - Calculates total summary
    var calculateTotal = function(type) {
        var sum = 0;    // sum = Summary

        data.allItems[type].forEach(function(cur) {
            sum += cur.value;   // Same as: sum = sum + cur.value
        });
        data.totals[type] = sum;
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
        },
        budget: 0,  // Summary of Totals
        percentage: -1 // Percentage value (-1 = means that it doesn't exist at the moment)
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

        // Public Object and Method | - Allows other modules to delete new item from UI and data structure
        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            // If index is different to -1, delete item
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        // Function | Calculates sum of all of the incomes and expenses
        calculateBudget: function() {

            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget | (Income - Expenses)
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that was spent | Conditional statement checks if data total income is above 0, if its not (if we only have exp), percentage will be -1
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        // Function Method | Returns budget (Total income and expense and percentage) so it can be stored and used later
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    // Stores Item Structure (Type, Description and Value)
    return {    // Makes this methods/objects global
        getInput: function() {  // Method
            return {
                type: document.querySelector(DOMStrings.inputType).value,  // Either inc or exp (income or expenses)
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)  // Parse float converts strings to numbers
            };
        },

        // Adds New Item
        addListItem: function(obj, type) {
            // Declaring Variables
            var html, newHtml, element;

            // Creates HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        // Clearing the input fields - Using array trick
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

        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {
        // Calculate the budget
        budgetCtrl.calculateBudget();

        // Return the Budget
        var budget = budgetCtrl.getBudget();

        // Display the Budget on the UI
        UICtrl.displayBudget(budget);
    };

    // FUNCTION | - Adding Item Function - When hitting input button
    var ctrlAddItem = function() {

        // Declaring new variables
        var input, newItem;

        // Get input data
        input = UICtrl.getInput();

        // Tests if description is not empty, if value is not NaN and value is not 0. Then executes following code.
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // Add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // Add item to the UI
            UICtrl.addListItem(newItem, input.type);

            // Clear the fields
            UICtrl.clearFields();

            // Calculate and update budget (call Function)
            updateBudget();
        }
    };

    // FUNCTION | - Delete Item Function | - Deletes items on click of a delete button
    var ctrlDeleteItem = function(event) {  // We need event argument to know what the target element is
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;  // parentNode bubbles up parent element by one | DOM Manipulation

        if (itemID) {
            splitID = itemID.split('-'); // Split ID method for the strings. Splits the strings from '-'
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // Delete the item from the UI

            // Update and show new totals/budget
        }
    };

    // INITIALIZATION FUNCTION | - Public Function
    return {
        init: function() {
            console.log('Application has started . . ');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1 
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

// -------------------------------------------------------------------------------------------------------------------------------------

// Calling INIT Function (MANDATORY)
controller.init();