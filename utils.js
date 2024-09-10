function addAlert(textoAlerta) {
    $alert = $("#alert");
    $(document.createElement("div")).text(textoAlerta).appendTo($alert);
    $alert.stop().animate({ scrollTop: $alert.prop("scrollHeight") }, 1000);
  }