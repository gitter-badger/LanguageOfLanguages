// events
window.onbeforeunload = function() {
  /* TODO: track changes and determine if a message needs to popup
  if (dirty === false) {
    return;
  }
  */
  return "By leaving this page, any unsaved changes will be lost.";
}

//functions
function setupPage() { 
  // TODO: load Getting Started as general project
  loadGettingStarted();
}

function addRemoveLanguage(id) {
  // TODO: add and/or remove languages to/from language ribbon
  alert("add and/or remove languages to/from language ribbon");  
}

function openProject(id) {
  // TODO: open existing or create new project
  alert("Open Existing Project or Create New Project");
}

function saveProject(id) {
  // TODO: save current project
  alert("Save Current Project");
}

function refreshAll(id) {
  // TODO: refresh all the views in the current project
  alert("Refresh All Views in Project");
}

function indexToPosition(doc, index) {
  var lines = doc.getAllLines(),
    newLineLen = doc.getNewLineCharacter().length,
    column = index;
  for (var row = 0; column >= lines[row].length + newLineLen; row ++) {
    column -= lines[row].length + newLineLen;
  }
  return {row:row, column:column};
}

function insertMessage(editor, index, message) {
  var doc = editor.getSession().getDocument(),
    pos = indexToPosition(doc, index);
  doc.insert(pos, message);
  editor.find(message, {backwards:true}, false);
  editor.focus();
}
  
function showOrHide(id, button) {
  var style = document.getElementById(id).style;
  if (style.visibility === "hidden") {
  	style.display = "block";
  	style.visibility = "visible";
  	button.title = "collapse";
  	button.value = "-";
  } else {
  	style.display = "none";
  	style.visibility = "hidden";
  	button.title = "expand";
  	button.value = "+";
  }
}

function openView(id) {
  // TODO: open a copy of this view
  alert("Open a Copy of This View");
}
function createView(name,lang,gutter,readOnly,value,height,source) {
  var e, view, id=genLocalId(name);
  document.getElementById("ProjectArea").insertAdjacentHTML("beforeend",
	'<div class="LoLsView">' +
	'	<div class="LoLsViewTitle">' +
	'	  <input id ="'+ id +'Button" type="button" title="collapse" value="-" ' +
	'		onClick="showOrHide(\''+ id +'\',this)">' +
	'	  <scan>'+ name +' </scan><i>view</i>' +
	'	  <button type="button" title="open view" onClick="openView(this)">' +
	'		<img src="open-view.png" alt="Open View">' +
	'	  </button>' +
	'	  <button type="button" title="close view" onClick="closeView(this)">' +
	'		<img src="close.gif" alt="Close View">' +
	'	  </button>' +
	'	  <button type="button" title="refresh" onClick="refreshView(\''+name+'\')">'+
	'		<img src="refresh.png" alt="Refresh View">' +
	'	  </button>' +
	'	</div>' +
	'	<div id="'+ id +'" class="LoLsViewEditor">' +
	'	</div>' +
	'</div>'); 
	e=document.getElementById(id);
	e.style.position="relative"; 
	e.style.height=height;
  view=ace.edit(id);
  view.getSession().setMode('ace/mode/textmate');
  view.renderer.setShowGutter(gutter);
  view.setValue(value);
  view.setReadOnly(readOnly);
  view.clearSelection();
  e.editor=view;
  LoLs.views[name]={
    id: id,
    lang: lang,
    updating: false,
    changed: true,
    result: undefined,
    source: source};
  return view;  
}

function closeView(id) {
  // TODO: close this view in current project
  alert("Close This View");
}

function refreshView(viewName) {
  var lolsView, editor, source;
  try {
    lolsView=LoLs.views[viewName];
// TODO: mark changed views and avoid unneeded refresh, check is source or language changed
/*  if (not lolsView.changed)
  	  return lolsView.result; */
// TODO: detect dependence and order refreshes
    if (lolsView.updating)
  	  return lolsView.result;
    lolsView.updating=true;
    editor=document.getElementById(lolsView.id).editor;
    if (lolsView.source == undefined) {
      source=editor.getValue();
    } else {
      source=refreshView(lolsView.source);
    };
    lolsView.result=applyLanguage(LoLs.languages[lolsView.lang],source);
    lolsView.updating=false;
    lolsView.changed=false;
    if (lolsView.source !== undefined) {
      editor.setValue("" + lolsView.result);
    }
	  return lolsView.result;
  } catch (e) {
    if (e.errorPos != undefined) {
	    insertMessage(editor, e.errorPos, " Unknown-->");
	  } else {
      alert("" + viewName + " error at unknown position\n\n" + e);
	  }
    lolsView.updating=false;
    return lolsView.result;
  }
}