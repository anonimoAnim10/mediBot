var menuTopoDrop = doc.query('#menu-topo .menu-opcoes');
var menuTopoSubms = menuTopoDrop.queryAll('.submenu');
var botAbreMenu = doc.query('#botao-abre-menu');
var sessPrin = doc.query('#sessao-inicio');
var barLateral = doc.query('#barra-lateral');
var menuAb = null;

function fechaMenuAberto(){
  menuAb.parent().removeClass('aberto').addClass('fechado');
}

botAbreMenu.evt('click', function(){
  menuTopoDrop.trocClass('aberto', 'fechado');
});

for (var i = 0; i < menuTopoSubms.length; i++) {
  var opcao = menuTopoSubms[i];
  var clickLnk = opcao.parent().query('a');

  clickLnk.evt('click', function(evt){

    if(menuAb!=null && menuAb!=this) fechaMenuAberto();

    this.parent().trocClass('aberto', 'fechado');
    menuAb = this;

    evt.prev();
  });
}

window.evt('click', function fechar(evt){
  if(menuAb != null && !evt.target.pertence(menuAb.parent())){
    fechaMenuAberto();
  }
});

window.evt('scroll', function fechar(evt){
  if(window.pageYOffset >= sessPrin.offsetHeight){
    barLateral.addClass('aberto').removeClass('fechado');
  }else{
    barLateral.addClass('fechado').removeClass('aberto');
  }
});
