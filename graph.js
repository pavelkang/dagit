// layout
var options = {
  name: 'breadthfirst',
};
var TASK_NAME = "Current task";
var TASK_DES  = "Task description...";
var ADD_ROOT_TASK = "Add new root task";
var ADD_CHILD_TASK = "Add new child task";

var clearBoard1 = function() {
  $("#taskname").text(TASK_NAME);
  $("#taskdes").text(TASK_DES);
}

var clearBoard2 = function() {
  $("#newtaskname").val("");
  $("#newtaskdes").val("");
}


// Initialize Firebase
// var config = {
//   apiKey: "AIzaSyDaVKhrr2-Wn0GWYS2RTUtJRoXqhPyte9k",
//   authDomain: "project-8886141641362818091.firebaseapp.com",
//   databaseURL: "https://project-8886141641362818091.firebaseio.com",
//   storageBucket: "project-8886141641362818091.appspot.com",
// };
// firebase.initializeApp(config);
// var db = firebase.database();

// globals
var current_selected_node = null;
var current_id = 3;
clearBoard1();
$("#newtasklabel").text(ADD_ROOT_TASK);

var switchBoard2 = function() {
  clearBoard2();
  if (current_selected_node === null) {
    // now: add new root task
    // new: add new child task
    $("#newtasklabel").text(ADD_CHILD_TASK);
  } else {
    // now: add new child task
    // new: add new root task
    $("#newtasklabel").text(ADD_ROOT_TASK);
  }
}

var addChildButtonOnClick = function() {
  var name = $("#newtaskname").val();
  var des = $("#newtaskdes").val();
  if (name === "" || name === null) {
    alert('no name');
    return ;
  }
  if (des === "") {
    alert('no des');
    return ;
  }
  if (current_selected_node === null) {
    // add root node
    var node = _createNode(current_id, name, des);
    current_id += 1;
    cy.add(node);
    cy.layout(options);
    clearBoard2();
    return ;
  }
  console.log(name);
  var node = _createNode(current_id, name, des);
  var edge = _createEdge(current_selected_node.id(),
                         current_id);
  current_id += 1;
  node.data["parent"] = current_selected_node;

  // add elements then re-layout
  cy.add(node);
  cy.add(edge);
  cy.layout( options );

  clearBoard1();
  clearBoard2();
};

// API supported
var updateBoardOnTap = function(id) {
  // update content on dashboard
  var node = cy.$('#'+id);
  var data = node.data();
  var nameDisplay = document.getElementById('taskname');
  nameDisplay.innerHTML = data.taskname;
  var desDisplay = document.getElementById('taskdes');
  desDisplay.innerHTML = data.des;
}

var addChild = function(node) {
  // add a child to current selected node
}

var deleteNode = function() {
  // delete current node
}

// helper functions
// create a node
var _createNode = function(_id, _taskname, _des) {
  return {
    group: "nodes",
    data: {
      id: _id,
      des: _des,
      taskname: _taskname,
      progress: 0,
      grabbable: false
    }
  };
}

// var setProgress(p) {
//   // if (p == -1) {

//   // } else if
// }

// callback function when tapping on a node
var onNodeTap = function(evt) {
  var node = evt.cyTarget;
  if (current_selected_node === null) {
    switchBoard2();
  }
  current_selected_node = node;
  updateBoardOnTap(node.id());
};

var _createEdge = function(sid, tid) {
  return {
    data: {
      id: sid+tid,
      source: sid,
      target: tid,
    }
  }
}

var cy = cytoscape({
  container: document.getElementById('cy'), // container to render in
  elements: [ // list of graph elements to start with
    _createNode('1', 'Intern ramp-up', 'Get familiar with internal tools'),
    _createNode('2', 'Hard task', 'A slightly harder task. You can do it!'),
    { // edge ab
      data: { id: '12', source: '1', target: '2' }
    }
  ],
  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(taskname)',
        'font-family': ['Lato']
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 4,
        'target-arrow-shape': 'triangle',
        'opacity': 0.5,
        'curve-style': 'bezier',
        'line-color': '#ccc',
      }
    }
  ],
});

var onBackgroundTap = function(evt) {
  if (evt.cyTarget === cy) {
    clearBoard1();
    if (current_selected_node != null) {
      switchBoard2();
    }
    current_selected_node = null;
  }
}

$("#yesbutton").on('click', function(evt) {
  $('#firstevent').addClass('animated fadeOutLeft');
  //$('#firstevent').remove();
});

cy.on('tap', 'node', onNodeTap);
cy.on('tap', onBackgroundTap);
cy.layout( options );
