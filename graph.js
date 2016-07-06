// TODO we need a DS to traverse and render
//

var COLORS = ["#FFB6C1", "#BCD2EE", "#FFD700", "#FF7F00", "#FF6347"]
var color_i = 0;
var getColor = function() {
  var color = COLORS[color_i % COLORS.length];
  color_i += 1;
  return color;
}

$('#progress').progress();

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

var setProgress = function(p) {
  if (current_selected_node === null) {
    return ;
  }
  current_selected_node.data('progress', p);
}

var displayProgress = function(p) {
  var progressBar = $("#progress");
  var data = current_selected_node.data();
  var current_id = data.id;
  switch (p) {
  case -1: // hide progress bar
    progressBar.css("display", "none");
    break;
  case 0: // set block
    progressBar.css("display", "block");
    progressBar.removeClass("green");
    progressBar.removeClass("orange");
    progressBar.progress({percent: 50});
    progressBar.removeClass("success");
    progressBar.addClass("red");
    break;
  case 1: // set working
    progressBar.css("display", "block");
    progressBar.removeClass("green");
    progressBar.removeClass("red");
    progressBar.progress({percent: 50});
    progressBar.removeClass("success");
    progressBar.addClass("orange");
    break;
  case 2: // set finished
    progressBar.css("display", "block");
    progressBar.removeClass("red");
    progressBar.removeClass("orange");
    progressBar.progress({percent: 100});
    cy.style()
      .selector('#'+current_id)
      .style({
	"border-color": "#7CFC00",
	"border-width": "2px"	
      }).update();    

    break;
  case 3: // nothing
    progressBar.removeClass("red");
    progressBar.removeClass("orange");
    progressBar.removeClass("green");
    progressBar.progress({percent: 0});
  }  
}

var setAndDisplayProgress = function(p) {
  setProgress(p);
  displayProgress(p);
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
var current_id = 1;
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
    var id = _createNode(name, des);
    cy.layout(options);
    clearBoard2();
    return ;
  }
  var node_id = _createNodeWithParent(name, des, current_selected_node);
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
var _createNode = function(_taskname, _des, parentColor = null) {
  var _id = current_id.toString();
  current_id += 1;
  var node;
  if (parentColor) {
    node = {
      group: "nodes",
      data: {
	id: _id,
	des: _des,
	taskname: _taskname,
	progress: 3,
	grabbable: false,
	color: parentColor,
      }
    };
  } else {
    var c = getColor();
    node = {
      group: "nodes",
      data: {
	id: _id,
	des: _des,
	taskname: _taskname,
	progress: 3,
	grabbable: false,
	color: c,
      }
    };
  }
  cy.add(node);
  cy.style()
    .selector('#'+_id)
    .style({
      'background-color': node.data.color
    }).update();
  return _id;
}

var _createNodeWithParent = function(_taskname, _des, _parent) {
  var parent_data = _parent.data();
  var node_id = _createNode(_taskname, _des, parent_data.color);
  cy.add(_createEdge(_parent.id(), node_id));
  var node = cy.getElementById("#"+node_id);
  node.data('parent', parent_data.id);
  return node_id;
}

var enableBoard1 = function() {
  $("#progress").removeClass("disabled");
  $("#blockedbutton").removeClass("disabled");
  $("#workingbutton").removeClass("disabled");
  $("#finishedbutton").removeClass("disabled");
}

var disableBoard1 = function() {
  $("#progress").addClass("disabled");
  $("#blockedbutton").addClass("disabled");
  $("#workingbutton").addClass("disabled");
  $("#finishedbutton").addClass("disabled");
}

// callback function when tapping on a node
var onNodeTap = function(evt) {
  var node = evt.cyTarget;
  var data = node.data();
  if (current_selected_node === null) {
    switchBoard2();
    enableBoard1();
  }
  current_selected_node = node;
  displayProgress(data.progress);
  updateBoardOnTap(node.id());
};

var _createEdge = function(sid, tid) {
  current_id += 1;
  return {
    group: "edges",
    data: {
      id: sid+tid,
      source: sid,
      target: tid,
    }
  }
}

var cy = cytoscape({
  container: document.getElementById('cy'), // container to render in
  elements: [],
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
      selector: '#1',
      style: {
	"background-color": "blue",
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

var getMyFBTasks = function() {
  var aid = _createNode('Ship D3499719', 'Ship this diff once all tests pass');
  var a = cy.getElementById(aid);
  var bid = _createNodeWithParent('Impl. new header', 'Create a new header to allow Android-side rendering for notification stories', a);
  var b = cy.getElementById(bid);
  var cid = _createNode('Discuss NN with Min', 'Discuss more details about t8898728');
  var did = _createNode('Test new model', 'Test the new model is working with canary and SLOG');
  var d = cy.getElementById(did);
  var eid = _createNodeWithParent('Publish new model', 'Publish the new model and check metrics', d);
  var e = cy.getElementById(eid);
  var fid = _createNode('Debug CC', 'Test CC inv. count fix');
  var gid = _createNodeWithParent('Modify pipeline', 'Modify a python pipeline to use the new model', e);
  var e = cy.getElementById(eid);
}

var onBackgroundTap = function(evt) {
  if (evt.cyTarget === cy) {
    clearBoard1();
    if (current_selected_node != null) {
      disableBoard1();
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
getMyFBTasks();
cy.layout( options );
disableBoard1();
