var Filter = new function() {
  var $ = jQuery;
  var $this = this;

  this.bind = function(input) {
    $(input).bind('keyup'  ,function(e) { onkeyup(e, filter); } )
  };

  var onkeyup = function(e, filter) {
    switch(e.keyCode) {
      case 37: //Event.KEY_LEFT:
      case 38: //Event.KEY_UP:
      case 39: //Event.KEY_RIGHT:
      case 40: //Event.KEY_DOWN:
      case 9:  //Event.KEY_TAB:
      case 91: //meta
      case 16: //shift
      case 17: //ctrl
      case 18: //alt
      case 19: //ctrl
        if (e.charCode == 0) { return; }
    }

    $this.current = e.target.value;
    $this.matches = [];
    if ($this.z) clearTimeout($this.z);
    $this.z = setTimeout(function() { filter(e.target.value) }, 10)
  }

  var filter = function(match) {
    if (match == null || match == '' || match.lenght == 0) {
      $('#all_scripts').removeClass('none')
        $('#search_results').addClass('none')
    } else {
      $('#all_scripts').addClass('none')
        $('#search_results').removeClass('none')
        $('#search_results').html('')

        if ($this.z) clearTimeout($this.z);
      $this.z = setTimeout(function() { filterer(match, 0); }, 10);
    }

    var filterer = function(match, pos) {
      var count = pos;
      var m = [];
      while(true) {
        if (pos >= vim_scripts.length) break;
        if ($this.current != match) break;
        if ($this.matches.length >= 15) break;
        var s = vim_scripts[pos];
        if (s.n && s.n.toLowerCase().indexOf(match.toLowerCase()) >= 0) {
          $this.matches.push(s);
          m.push(s);
        }
        pos++;
        if (pos - count >= 200) { 
          if ($this.z) clearTimeout($this.z);
          $this.z = setTimeout(function() { filterer(match, pos) }, 10);
          break;
        }
      }
      $('#search_results').append(Table(m.reverse()));
    }
  }
};

var Table = function(data) {
  var html = '';
  for(var i = 0; i < data.length; i++ ) {
    var s = data[ data.length - i - 1 ];
    html += '' +
      '<tr id="' + s.n + '">' +
      '<td>'+  s.t + '</td>' +
      '<td class="name">' + '<a href="http://github.com/vim-scripts/' + s.n + '">' + s.n + '</a></td>' +
      '<td>' + s.s + '</td>'
      '</tr>'
  }
  return html;
}

var vim_scripts = [];

jQuery(function($) {

  $.ajax({
    type: "GET",
    url: "/api/scripts_recent.json",
    dataType: "json",
    success: function(data) { 
      vim_scripts = data; 
      Filter.bind(jQuery('#filter'));
      $('#filter').attr('value', window.location.search.replace('?',''))
      $('#filter').trigger('keyup');
      $('#filter').focus();
      setTimeout(function() {$('#all_scripts').html(Table(vim_scripts))}, 10);
    }
  });
});
