var budgetController = (function () {

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  let calculateTotal = function (type) {
    let sum = 0;

    data.allItems[type].forEach((current) => {
      sum = sum + current.value;
    });
    data.totals[type] = sum;
  }

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
    percentage: -1,

  }



  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      if (data.allItems[type].length === 0)
        ID = 0
      else
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      data.allItems[type].push(newItem);
      return newItem;

    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },
    calculateBudget: function () {
      console.log("data " + " " + calculateTotal('exp'));
      console.log(calculateTotal('inc'));

      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0)
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      else
        data.percentage = -1;

    },
    testing: function () {
      console.log(data);
    }
  };

})();



var UIController = (function () {
  var constDOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputAddButtom: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLable: '.budget__value',
    expenseLable: '.budget__expenses--value',
    incomeLable: '.budget__income--value',
    percentageLable: '.budget__expenses--percentage'
  }

  var getDocumnetValue = function (name) {
    return document.querySelector(name).value;
  }

  var setDocumentTextContent = function (name, text) {
    document.querySelector(name).textContent = text;
  }

  var setDocumentTextContentExtra = function (name, text, extra) {
    document.querySelector(name).textContent = text + extra;
  }
  return {
    getInput: function () {
      return {
        type: getDocumnetValue(constDOMStrings.inputType),
        description: getDocumnetValue(constDOMStrings.inputDescription),
        value: parseFloat(getDocumnetValue(constDOMStrings.inputValue))
      }
    },
    addListItem: function (obj, type) {
      var html, elemetId, element;

      if (type === "inc") {
        element = constDOMStrings.incomeContainer;
        html = `<div class="item clearfix" id="income-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${obj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
      } else if (type === "exp") {
        element = constDOMStrings.expenseContainer;
        html = `<div class="item clearfix" id="expense-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${obj.value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
      } else {
        console.log("something went wrong");
      }

      console.log(element);
      console.log(type);
      console.log(html);

      document.querySelector(element).insertAdjacentHTML('beforeend', html);
    },

    clearFields: function () {
      var fields, fieldsArray;
      fields = document.querySelectorAll(constDOMStrings.inputDescription + ", " + constDOMStrings.inputValue);

      fieldsArray = Array.prototype.slice.call(fields)

      fieldsArray.forEach((element, index, array) => {
        element.value = "";
        console.log(index);
        console.log(array);
      });
      fieldsArray[0].focus();

    },
    getDOMString: function () {
      return constDOMStrings;
    },
    displayBudget: function (object) {

      setDocumentTextContent(constDOMStrings.budgetLable, object.budget);
      setDocumentTextContent(constDOMStrings.incomeLable, object.totalInc);
      setDocumentTextContent(constDOMStrings.expenseLable, object.totalExp);

      if (object.percentage > 0)
      setDocumentTextContentExtra(constDOMStrings.percentageLable, object.percentage, '%');
        else 
        setDocumentTextContent(constDOMStrings.percentageLable, '-');
    }
  }

})();



var controller = (function (budgetCtrl, UICtrl) {

  var setEventListeners = function () {
    var constDOMStrings = UICtrl.getDOMString();

    document.querySelector(constDOMStrings.inputAddButtom).addEventListener("click", ctrlAddItem);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        console.log("enter pressed");
        ctrlAddItem();
      }

    });
  }

  var updateBudget = function () {
    budgetCtrl.calculateBudget();
    let budget = budgetCtrl.getBudget();
    UICtrl.displayBudget(budget);

  }

  var showSnakBar = function (msg) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = msg;
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 3000);
  }
  var ctrlAddItem = function () {
    var input, newItem;

    input = UICtrl.getInput();

    console.log(input);
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      showSnakBar('Item Added');
      newItem = budgetController.addItem(input.type, input.description, input.value);
      UICtrl.addListItem(newItem, input.type);
      UICtrl.clearFields();
      updateBudget();
    } else {
      showSnakBar('please fill the fields');

    }
  }

  return {
    init: function () {
      console.log("app started");
      setEventListeners();
    }
  }

})(budgetController, UIController);



controller.init();