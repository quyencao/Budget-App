// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);  
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;  
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var caculateTotal = function(type) {
        var sum = 0;
        
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        
        data.totals[type] = sum;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        
        deleteItem: function(type, id) {
            var IDs, index;
            
            IDs = data.allItems[type].map(function(current, index) {
                return current.id;
            });
            
            index = IDs.indexOf(id);
            
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        
        caculateBudget: function() {
            
            // Caculate total incomes and expenses
            caculateTotal('exp');
            caculateTotal('inc');
            
            // Caculate the budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;
            
            // Caculate the percentage of income that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        
        caculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });  
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        getPercentages: function() {
            var allPercentages;
            allPercentages = data.allItems.exp.map(function(current) {
               return current.getPercentage();
            });
            
            return allPercentages;
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
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };
    
    return {
        getInput: function() {
            return {
                type : document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            
            // Create HTML string with placeholder text
            if(type === 'inc') {
                 html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                 element = DOMstrings.incomeContainer;
            } else {
                 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
                 element = DOMstrings.expenseContainer;
            }
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function(selectorId) {
              var element = document.getElementById(selectorId);
                
              element.parentNode.removeChild(element);
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
        
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget >= 0 ? '+ ' + obj.budget : '- ' + obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = '+ ' + obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = '- ' + obj.totalExp;
            
            
            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
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
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    
    var updateBudget = function() {
        // 1. Caculate the budget
        budgetCtrl.caculateBudget();  
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        
        // 3. Display the budget in the UI
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentages = function() {
        // 1. Caculate percentages
        budgetCtrl.caculatePercentages();
        
        // 2. Get the percentages
        var percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with new percentages
        console.log(percentages);
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getInput(); 
        
        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add the items to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);    

            // 3. Add new item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Caculate and update budget
            updateBudget();
            
            // 6. Caculate and update percentages
            updatePercentages();
        }
    }
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
            
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. Delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. Delete item from UI
            UICtrl.deleteListItem(itemID);
            // 3. Update and show new budget
            updateBudget();
            // 4. Caculate and update percentages
            updatePercentages();
        }
        
    };
    
    return {
        init: function() {
            setUpEventListeners();
            // Reset all label to zero
            UICtrl.displayBudget(budgetCtrl.getBudget());
        }    
    }
    
})(budgetController, UIController);

controller.init();  