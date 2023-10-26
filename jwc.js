function loadHTMLjwc(myDivId, url) {
    var xmlhttp;
    if (window.XMLHttpRequest) 
    {
        xmlhttp = new XMLHttpRequest();
    } 
    else 
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() 
    {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) 
        {
           if(xmlhttp.status == 200){
              setInnerHtmljwc(myDivId, xmlhttp.response)
           }
           else {
               console.log('error loading component '+xmlhttp.status)
               setInnerHtmljwc(myDivId, '<div style="display:block; text-align:center;">Erro 404 Not Found</div>');
           }
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

var setInnerHtmljwc = function(selector, html) {
  var element = document.querySelector(selector);
  
  if (element) {
    element.innerHTML = html;

    var scripts = element.getElementsByTagName("script");
    var scriptsClone = [];

    for (var i = 0; i < scripts.length; i++) {
      scriptsClone.push(scripts[i]);
    }

    for (var i = 0; i < scriptsClone.length; i++) {
      var currentScript = scriptsClone[i];
      var s = document.createElement("script");

      // Copiar todos os atributos do script
      for (var j = 0; j < currentScript.attributes.length; j++) {
        var a = currentScript.attributes[j];
        s.setAttribute(a.name, a.value);
      }

      s.appendChild(document.createTextNode(currentScript.innerHTML));
      currentScript.parentNode.replaceChild(s, currentScript);
    }
  }
}

function jwcUidCache(){
            var today=new Date();
            var  h =today.getHours();
            var  m =today.getMinutes();
            var  s =today.getSeconds();
            var dia  = today.getDate().toString().padStart(2, '0')
            var mes  = (today.getMonth()+1).toString().padStart(2, '0')
            var ano  = today.getFullYear();
            return h+m+s+dia+mes+ano;
}


var jwc = {
    myElement: function(e){
        this.result = e
        return this
    },
    component: function(e){
        loadHTMLjwc(this.result, e+'?v='+jwcUidCache());
    },
    route(e, patch, pgname){

      try{  

          if (window.location.pathname === '/') {
            // console.log("Está na página 'home'.");
            window.location.href = '/#/';
          }else{
            var baseUrl = window.location.href.split('/#/')[0];
            if(window.location.href.endsWith('/')){
              window.location.href = baseUrl +'#/';
            }else{
              window.location.href = baseUrl +'/#/';
            }
            
            // console.log("Está na página 'subditetorio'.");
          }

           
            var baseUrl = window.location.href.split('/#/')[0];
            var novoNome = pgname;

        
            if (window.location.href.indexOf('/#/') !== -1) {

              var currentHash = window.location.hash.replace(/\/\//g, '/');
            
              var currentPageName = currentHash.split('/')[1];

              var newHash = currentHash.replace('/' + currentPageName, '/' + novoNome);

              window.location.href = baseUrl +'/' +newHash;

            } else {
              
              if (window.location.href.endsWith('/')) {
                window.location.href = baseUrl.slice(0, -1) + '/#/' + novoNome;
              } else {
                window.location.href = baseUrl + '/#/' + novoNome;
              }

            }

            var url = window.location.href;
            var start = url.split('/#/')[1];
            var stop = start.split('/')[0];
            
            var divpai = e.parentNode;

            window.localStorage.setItem('jwcRoutePatch', patch);
            window.localStorage.setItem('jwcRouteElement', this.result);
            jwc.myElement(this.result).component(patch+'/'+stop+'.html');


            var elementosDentroDoPai = divpai.querySelectorAll('.jwc_active');
            elementosDentroDoPai.forEach(function(elemento) {
                elemento.classList.remove('jwc_active');
                
            });
            e.classList.add('jwc_active');
            


          }catch(e){
            console.log("Route error", e.message);
          }

    },
    state(e, pgActive){


        try{

            var url = window.location.href;

            const urlWithoutHtmlFile = url.replace(/\/[^/]+\.html/, '');

            var start = urlWithoutHtmlFile.split('/#/')[1];
            var stop = start.split('/')[0];


            var baseUrl = urlWithoutHtmlFile.split('/#/')[0];

            window.location.href = baseUrl+'/#/'+stop;

            var patchCache = window.localStorage.getItem('jwcRoutePatch');
            var elementCache = window.localStorage.getItem('jwcRouteElement');

            var patch = '';
            var element = '';

            if(patchCache == undefined || patchCache == '' || patchCache == null){
              patch = '';
            }else{
              patch = patchCache
            }

            if(elementCache == undefined || elementCache == '' || elementCache == null){
              element = '';
            }else{
              element = elementCache;
            }

            jwc.myElement(element).component(patch+'/'+stop+'.html');


        }catch(e){
            console.log('State error:'+e.message)
        }


        try{
          if (window.location.pathname === '/' || window.location.href.endsWith('/')) {
              var x = window.location.href.split('/#/');
              var urlx = window.location.href;
              if(x[0] == urlx){
                document.querySelector('.jwc_'+pgActive).classList.add(e);
              }else{
                document.querySelector('.jwc_'+stop).classList.add(e);
              }
          }else{
              document.querySelector('.jwc_'+stop).classList.add(e);
          }
        }catch(e){
           console.log('State error Class:', e.message);
        }


        try{
            if (window.location.pathname === '/' || window.location.href.endsWith('/')) {
                var x = window.location.href.split('/#/');
                var urlx = window.location.href;
                if(x[0] == urlx){
                  document.querySelector('#jwc_'+pgActive).classList.add(e);
                }else{
                  document.querySelector('#jwc_'+stop).classList.add(e);
                }
            }else{
                document.querySelector('#jwc_'+stop).classList.add(e);
            }
        }catch(e){
           console.log('State error Class:', e.message);
        }

    }
   
}

const jwcbuttons = document.querySelectorAll(".jwc_click");
    jwcbuttons.forEach(jwcbutton => {

         var component = jwcbutton.getAttribute('component');
         var pg = jwcbutton.getAttribute('pg');
         jwcbutton.classList.add('jwc_'+pg);

        jwcbutton.addEventListener("click", function() {
            // console.log("Botão clicado:", jwcbutton.textContent);
            var component = jwcbutton.getAttribute('component');
            var pg = jwcbutton.getAttribute('pg');
            var el = jwcbutton.getAttribute('content');
            jwc.myElement(el).route(jwcbutton,component, pg);
        });
});
