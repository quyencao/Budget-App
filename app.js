// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            // Create new ID
            ID = data.allItems[type].length > 0 ? data.allItems[type][data.allItems[type].length - 1].id + 1 : 0;
            
            // Create new Item base on inc or exp
            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push it into our data structure base on type
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
        },
        testing: function() {
            console.log(data);
        }
    }
    
})();


// UI CONTROLLER
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    };
    
    return {
        getInput: function() {
            return {
                type : document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            }
        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            
            // Create HTML string with placeholder text
            if(type === 'inc') {
                 html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                 element = DOMstrings.incomeContainer;
            } else {
                 html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
                 element = DOMstrings.expenseContainer;
            }
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        clearFields: function() {
             var fields, fieldsArr; 
             
             // Get all input element    
             fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
              
             // Convert NodeList to Array(can't call on fields because it not an array)
             // Set this to fields NodeList
             fieldsArr = Array.prototype.slice.call(fields);  
            
             // Clear all fields
             fieldsArr.forEach(function(current, index, array) {
                  current.value = '';
             });
                
             // Set focus back to description field
             fieldsArr[0].focus();
        },
        
        getDOMStrings: function() {
            return DOMstrings;
        }
    };
    
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    
    var setUpEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();
        
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event) {

            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();    
            } 

        });  
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getInput(); 
        
        // 2. Add the items to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);    
    
        // 3. Add new item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        // 4. Clear the fields
        UICtrl.clearFields();
        
        // 5. Caculate the budget
        
        // 6. Display the budget in the UI
    }
    
    return {
        init: function() {
            setUpEventListeners();
        }    
    }
    
})(budgetController, UIController);

controller.init();  