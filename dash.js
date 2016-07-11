class Task {
  constructor(name, des, depends_on, progress) {
    this.name = name;
    this.des = des;
    this.depends_on = depends_on;
    this.progress = progress;
  }
  setId(id) {
    this.id = id;
  }
  getId() {
    return this.id;
  }
}

var testTask = new Task('Start Task', 'des', null, 0);

// Helpers
var uri_for_tasks = function(uid) {
  return 'users/'+uid+'/tasks';
}


// Firebase interface
var fb_create_new_task = function(task) {
  var user = firebase.auth().currentUser;
  if (user !== null) {
    var newTaskKey = firebase.database().ref(uri_for_tasks(user.uid)).push().key;
    task.setId(newTaskKey);
    var updates = {};
    updates[newTaskKey] = task;
    return firebase.database().ref(uri_for_tasks(user.uid)).update(updates);
  } else {
    // TODO: Warning and quit
    return ;
  }
};

var fb_delete_task = function(id) {
  var user = firebase.auth().currentUser;
  if (user !== null) {
    return firebase.ref(uri_for_tasks+id).remove();
  } else {
    // TODO: Warning and quit
  }
}

// Initialize listeners
var value_listener_on_tasks = function(snapshot) {
  render_DAG(snapshot.val());
}

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var providerData = user.providerData;
      user.getToken().then(function(accessToken) {
        document.getElementById('sign-in-status').textContent = 'Signed in';
        document.getElementById('sign-in').textContent = 'Sign out';
        document.getElementById('account-details').textContent = JSON.stringify({
          displayName: displayName,
          email: email,
          emailVerified: emailVerified,
          photoURL: photoURL,
          uid: uid,
          accessToken: accessToken,
          providerData: providerData
        }, null, '  ');
      });
      firebase.database().ref(uri_for_tasks(uid)).on('value', value_listener_on_tasks);
    } else {
      // User is signed out.
      document.getElementById('sign-in-status').textContent = 'Signed out';
      document.getElementById('sign-in').textContent = 'Sign in';
      document.getElementById('account-details').textContent = 'null';
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp();
});

// Helpers to render in cytoscape
var COLORS = ["#FFB6C1", "#BCD2EE", "#FFD700", "#FF7F00", "#FF6347"]
var color_i = 0;
var get_color = function() {
  var color = COLORS[color_i % COLORS.length];
  color_i += 1;
  return color;
}

var _createNode = function(task, parentColor) {
  node = {
    group: "nodes",
    data: {
      id: task.id,
      des: task.des,
      taskname: task.name,
      progress: 3,
      grabbable: false,
      color: parentColor,
    }
  };
  cy.add(node);
  cy.style()
    .selector('#'+task.id)
    .style({
      'background-color': node.data.color
    }).update();
};

var _createNodeWithParent = function(task, parent) {
  var parent_data = _parent.data();
  var node_id = _createNode(task, parent_data.color);
  cy.add(_createEdge(_parent.id(), node_id));
  var node = cy.getElementById("#"+node_id);
  node.data('parent', parent_data.id);
  return node_id;
};

// DAG operations
var render_DAG = function(snapshot) {
  var dep = {}; // dependency dictionary



  console.log(snapshot);
  for (var task in snapshot) {
    console.log(task);
  }
}
