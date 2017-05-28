// BUDGET CONTROLLER
var budgetController = (function() {

    // Some code
    
    
})();



// UI CONTROLLER
var UIController = (function() {
    
    
    // Some Code
    
    
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    
    var ctrlAddItem = function() {
        // 1. Get the field input data
        
        // 2. Add the items to budget controller
        
        // 3. Add new item to the UI
        
        // 4. Caculate the budget
        
        // 5. Display the budget in the UI
        
        console.log('It works');
    }
    
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    
    document.addEventListener('keypress', function(event) {
        
        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();    
        } 
        
    });
    
    
})(budgetController, UIController);
