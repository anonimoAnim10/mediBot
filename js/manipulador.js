var doc = document;

var L_Lib = {};

document.createElement('section');
document.createElement('nav');

document.query = document.querySelector;
document.queryAll = function(selector){
	var nodes = [];
	var res = this.querySelectorAll(selector);

	for (var i = 0; i < res.length; i++) {
		nodes.push(res[i]);
	}

	return nodes;
};

Array.prototype.each = function(func){
	for (var i = 0; i < this.length; i++) {
		func(this[i], i);
	};
};

Array.prototype.indexOf = Array.prototype.indexOf || function(item){
	var pos = -1;

	for (var i = 0; i < this.length; i++) {
		if(this[i] === item){
			pos = i;
		}
	}

	return pos;
};

NodeList.prototype.each = Array.prototype.each;

String.prototype.trim = String.prototype.trim || function(){
	return this.replace(/^\s|\s$/, '');
};

var HTMLElement = HTMLElement || Element;

HTMLElement.prototype.getAttr = function(attr){
	return this.getAttribute(attr);
};

HTMLElement.prototype.setAttr = function(attr, value){
	this.setAttribute(attr, value);
};

HTMLElement.prototype.addClass = function(classe){
	var atual = this.getAttr('class') || '';

	var ant = atual.split(' ');

  if(ant.indexOf(classe) == -1){
		atual += ' '+classe;
		this.setAttr('class', atual);
	}

	return this;
};

HTMLElement.prototype.removeClass = function(classe){
	var atual = this.getAttr('class') || '';

	var ant = atual.split(' ');

	var idx = ant.indexOf(classe);

	if(idx!=-1){
		ant.splice(idx, 1);
		var nova = '';

		for (var i = 0; i < ant.length; i++) {
			nova += ant[i]+' ';
		}

	  this.setAttr('class', nova.trim());
	}

	return this;
};

HTMLElement.prototype.existClass = function(classe){
	var classes = (this.getAttr('class') || '').split(' ');

	return classes.indexOf(classe) != -1;
};

HTMLElement.prototype.trocClass = function(classe1, classe2){
	if(this.existClass(classe1)){
		this.removeClass(classe1).addClass(classe2);
	}else if(this.existClass(classe2)){
		this.removeClass(classe2).addClass(classe1);
	}else{
		this.addClass(classe1);
	}
};

HTMLElement.prototype.query = function(selector){
	return this.querySelector(selector);
};

HTMLElement.prototype.queryAll = function(selector){
	var nodes = [];
	var res = this.querySelectorAll(selector);

	for (var i = 0; i < res.length; i++) {
		nodes.push(res[i]);
	}

	return nodes;
};

HTMLElement.prototype.evt = function(call, func, a){
	var calls = call.split(' ');

	for (var i = 0; i < calls.length; i++) {
		if(calls[i] == ''){
			calls.splice(i, 1);
		}
	}

	for (var i = 0; i < calls.length; i++) {
		if(HTMLElement.prototype.addEventListener){
			this.addEventListener(calls[i], func, a);
		}else if(HTMLElement.prototype.attachEvent){
			var self = this;
			this.attachEvent('on'+calls[i], function(evt){
				func.apply(self, [evt]);
			});
		}
	}
};

HTMLElement.prototype.remEvt = function(call, func, a){
	var calls = call.split(' ').filter(function(item){
		if(item.trim()!==''){
			return item;
		}
	});

	for (var i = 0; i < calls.length; i++) {
		this.removeEventListener(calls[i], func, a);
	}
};

window.evt = HTMLElement.prototype.evt;
window.remEvt = HTMLElement.prototype.remEvt;

HTMLElement.prototype.clicaFora = function(func){
	var esta = this;
	doc.body.evt('click', function(evt){
		var dentro = false;
		esta.queryAll('*').each(function(item){
			if(evt.target === item){
				dentro = true;
			}
		});

		if(!dentro){
			func(evt);
		}
	});
};

HTMLElement.prototype.parent = function(){
	return this.parentNode;
};

doc.create = function(html, props, inner){
	var element = this.createElement(html);
	if(typeof props != 'undefined'){
		for (var prop in props) {
			element.setAttr(prop, props[prop]);
		}
	}

	if(typeof inner != 'undefined'){
		element.inner(inner);
	}

	return element;
};

HTMLElement.prototype.create = function(html, props, inner){
	var element = doc.create(html, props, inner);
	this.append(element);

	return element;
};

HTMLElement.prototype.append = function(element){
	if(element instanceof Array){
		for (var i = 0; i < element.length; i++) {
			this.appendChild(element[i]);
		}
	}else{
		this.appendChild(element);
	}
};

HTMLElement.prototype.css = function(arg1, arg2){
	if(typeof arg1 == 'object'){
		for(var prop in arg1){
			this.style[prop] = arg1[prop];
		}
	}else if(typeof arg2 == 'undefined'){
		return this.style[arg1];
	}else{
		this.style[arg1] = arg2;
	}
};

HTMLElement.prototype.compCss = function(attr, numerico){
	var retorno = window.getComputedStyle(this, null).getPropertyValue(attr);

	if(numerico){
		retorno = parseInt(retorno);
	}

	return retorno;
};

HTMLElement.prototype.inner = function(inner){
	if(typeof inner != 'undefined'){
		this.innerHTML = inner;
	}

	return this.innerHTML;
};

HTMLElement.prototype.text = function(text){
	if(typeof text != 'undefined'){
		this.textContent = text;
	}

	return this.textContent;
};

HTMLElement.prototype.clone = function(){
	return this.cloneNode(true);
};

HTMLElement.prototype.setFullValue = function(value){
	this.setAttr('value', value);
	this.value = value;
};

HTMLElement.prototype.estaVisivelNoScroll = function(tolerancia){
	tolerancia = tolerancia || 0;

	return window.pageYOffset+window.innerHeight > this.offsetTop + tolerancia
	&& window.pageYOffset < this.offsetTop+this.offsetHeight - tolerancia;
};

HTMLElement.prototype.scrollRevelar = function(fc){
	var esta = this;
	this.funcExecutaAoAparecer = fc;
	this.executouFcAoAparecer = false;

	window.evt('scroll', function(evt){
		if(esta.estaVisivelNoScroll() && !esta.executouFcAoAparecer){
			esta.funcExecutaAoAparecer(evt);
			esta.executouFcAoAparecer = true;
		}else if(!esta.estaVisivelNoScroll() && esta.executouFcAoAparecer){
			esta.executouFcAoAparecer = false;
		}
	});
};

HTMLElement.prototype.scrollTo = function(pos, tmp){
	var decremento;
	var esta = this;

	if(this.scrollTop > pos){
		this.scrollSubir(pos, tmp);
	}else{
		this.scrollDescer(pos, tmp);
	}
};

HTMLElement.prototype.scrollSubir = function(pos, tmp){
	var distancia = this.scrollTop - pos;
	var restante = distancia;
	var percorrido = 0;
	var incremento = 1;
	var passos = [];

	var esta = this;

	while(restante > 0){
		if(incremento + percorrido > distancia){
			incremento = distancia - percorrido;
		}

		passos.push(incremento);
		restante -= incremento;
		percorrido += incremento;
		incremento+=3;
	}

	var i = 0;

	function passarScroll(){
		esta.scrollTop -= passos[i];
		i++;
		if(i<passos.length){
			setTimeout(passarScroll, tmp/10);
		}
	}

	setTimeout(passarScroll, tmp/10);
};

HTMLElement.prototype.scrollDescer = function(pos, tmp){
	var distancia = pos - this.scrollTop;
	var restante = distancia;
	var percorrido = 0;
	var incremento = 1;
	var passos = [];

	var esta = this;

	while(restante > 0){
		if(incremento + percorrido > distancia){
			incremento = distancia - percorrido;
		}

		passos.push(incremento);
		restante -= incremento;
		percorrido += incremento;
		incremento+=3;
	}

	var i = 0;

	function passarScroll(){
		esta.scrollTop += passos[i];
		i++;
		if(i<passos.length){
			setTimeout(passarScroll, tmp/10);
		}
	}

	setTimeout(passarScroll, tmp/10);
};

HTMLElement.prototype.pertence = function(obj){
	var nodes = obj.queryAll('*');

	for (var i = 0; i < nodes.length; i++) {
		if(this === nodes[i]){
			return true;
		}
	}

	return false;
};

Event.prototype.prev = function(){
	this.preventDefault ? this.preventDefault() : (this.returnValue = false);
};

window.largMenorQue = function(px){
	return this.innerWidth < px;
};

var Css = function(){

};

Css.rgb = function(r, g, b){
	return 'rgb('+r+','+g+','+b+')';
};

Css.rgba = function(r, g, b, a){
	return 'rgb('+r+','+g+','+b+','+a+')';
};

Date.prototype.getDia = function(addZero){
	if(addZero){
		if(this.getDate() < 10){
			return '0'+this.getDate();
		}else{
			return this.getDate();
		}
	}else{
		return this.getDate();
	}
};

Date.prototype.getMes = function(addZero){
	var mes = this.getMonth() + 1;
	if(addZero){
		if(mes < 10){
			return '0'+mes;
		}else{
			return mes;
		}
	}else{
		return mes;
	}
};

Date.prototype.getAno = function(){
	return this.getFullYear();
};

Date.prototype.qtdDiasMes = function(){
	var dia = 0;
	var mes = this.getMes();
	var ano = this.getAno();

	switch(mes){
		case 1 :
		case 3 :
		case 5 :
		case 7 :
		case 8 :
		case 10:
		case 12:
		dia = 31;
		break;
		case 4 :
		case 6 :
		case 9 :
		case 11:
		dia = 30;
		break;
		case 2 :
		if(((ano % 4 == 0) && (ano % 100 != 0)) || (ano % 400 == 0)){
			dia = 29;
		}
		else{
			dia = 28;
		}
		break;
	}

	return dia;
};

Date.prototype.prevAno = function(){
	this.setFullYear(this.getFullYear()-1);
};

Date.prototype.nextAno = function(){
	this.setFullYear(this.getFullYear()+1);
};

Date.prototype.prevMes = function(){
	this.setMonth(this.getMonth()-1);
};

Date.prototype.nextMes = function(){
	this.setMonth(this.getMonth()+1);
};

Date.stringToDate = function(str){
	var spl = str.split('-');
	return new Date(spl[0], spl[1] - 1, spl[2]);
};

String.prototype.replaceAll = function(existe, subistituir){
	return this.split(existe).join(subistituir);
};

String.prototype.replaceDepois = function(existe, subistituir){
	var index = this.indexOf(existe);
	if(index != -1){
		return this.substring(0, index);
	}else{
		return this;
	}
};

String.prototype.apenasNumeros = function(){
	return this.replace(/[^0-9]/g, '');
};

String.prototype.ocorrencias = function(carac){
	var txt = this;
	var qtd = 0;

	while(txt.indexOf(carac) != -1){
		txt = txt.replace(carac, '');
		qtd++;
	}

	return qtd;
};

function Mascara(elemento, mascara){
	this.elemento = typeof elemento == 'string' ? doc.query(elemento) : elemento;
	this.mascara = mascara;

	var esta = this;

	this.elemento.evt('keypress', function(evt){
		if(evt.keyCode != 8){
			if(parseInt(evt.key) || evt.key == 0){
				this.value += evt.key;
			}

			this.value = esta.mesclarCamada();
			evt.prev();
		}
	});

	this.elemento.evt('paste', function(evt){
		evt.prev();
	});

	this.mesclarCamada = function(){
		var mesclado = this.mascara;
		var valInput = this.elemento.value.apenasNumeros();

		for (var i = 0; i < valInput.length; i++) {
			mesclado = mesclado.replace('#', valInput[i]);
		};

		return mesclado.replaceDepois('#', '');
	};

	this.getSplitValor = function(){
		return this.elemento.value.split(/[^0-9]/g).filter(function(item){
			if(item != ''){
				return item;
			}
		});
	};

	this.preenchido = function(){
		return this.elemento.value.length == this.mascara.length;
	};
}

function desneg(num){
	if(num > 0){
		return num;
	}else{
		return num*-1;
	}
};

L_Lib.objlength = function(obj){
	return Object.keys(obj).length;
};

L_Lib.codobj = function(obj){
	var ret = '{';
	var cnt = L_Lib.objlength(obj);
	var pos = 0;

	for(var attr in obj){

		switch(typeof obj[attr]){
			case 'string':
			ret += attr+':"'+obj[attr].replace(/[\\"]/g, '\\$&')+'"';
			break;
			case 'number':
			ret += attr+':'+obj[attr];
			break;
			case 'boolean':
			ret += attr+':'+obj[attr];
			break;
			case 'object':
			ret += attr+':'+obj[attr].toEvalString();
		}

		if(pos < cnt-1){
			ret +=',';
		}

		pos++;
	}

	ret += '}';
	return ret;
};

L_Lib.decodobj = function(text){
	return eval('('+text+')');
};

try{
	MouseEvent.prototype.movementX;
	console.log('As propriedades movement x e y não existiam, então foram redeclaradas');
	var mouseMovAnt = {
		x : null,
		y : null
	};

	window.evt('mousemove', function(evt){
		if(mouseMovAnt.x == null) mouseMovAnt.x = evt.clientX;
		if(mouseMovAnt.y == null) mouseMovAnt.y = evt.clientY;

		MouseEvent.prototype.movementX = evt.clientX - mouseMovAnt.x;
		MouseEvent.prototype.movementY = evt.clientY - mouseMovAnt.y;

		mouseMovAnt.x = evt.clientX;
		mouseMovAnt.y = evt.clientY;

		console.log(evt.movementY);
		console.log(evt.movementX);
	});
}catch(e){

}

var touchMovAnt = {
	x : null,
	y : null
};

window.evt('touchmove', function(evt){
	if(touchMovAnt.x == null) touchMovAnt.x = evt.changedTouches[0].clientX;
	if(touchMovAnt.y == null) touchMovAnt.y = evt.changedTouches[0].clientY;

	TouchEvent.prototype.movementX = evt.changedTouches[0].clientX - touchMovAnt.x;
	TouchEvent.prototype.movementY = evt.changedTouches[0].clientY - touchMovAnt.y;

	touchMovAnt.x = evt.changedTouches[0].clientX;
	touchMovAnt.y = evt.changedTouches[0].clientY;
});
