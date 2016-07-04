// layout
var options = {
  name: 'breadthfirst',
};

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
    alert('no selected');
    return ;
  }
  console.log(name);
  var node = _createNode(current_id, name, des);
  var edge = _createEdge(current_selected_node.id(),
                         current_id);
  console.log(node);
  console.log(edge);
  current_id += 1;
  node.data["parent"] = current_selected_node;

  cy.add(node);
  cy.add(edge);
  cy.layout( options );
};

// API supported
var updateBoardOnTap = function(id) {
  // update content on dashboard
  var node = cy.$('#'+id);
  var data = node.data();
  var nameDisplay = document.getElementById('taskname');
  nameDisplay.innerHTML = data.info.taskname;
  var desDisplay = document.getElementById('taskdes');
  desDisplay.innerHTML = data.info.des;
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
      info: {
        taskname: _taskname,
        des: _des
      },
      grabbable: false
    }
  };
}

// callback function when tapping on a node
var nodeOnTap = function(evt) {
  var node = evt.cyTarget;
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
        'label': 'data(id)'
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

cy.on('tap', 'node', nodeOnTap);
cy.layout( options );
