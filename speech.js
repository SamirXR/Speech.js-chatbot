var yourTalk = document.getElementById('yourTalk');
var startButton = document.getElementById('startButton');

var say = (function() {
  var voice = speechSynthesis.getVoices()[0];
  return function(s,v=voice) {
    var u = new SpeechSynthesisUtterance(s);
    u.voice = v;
    return new Promise(function(res,rej) {
      speechSynthesis.speak(u);
      u.addEventListener('end',res);
    });
  };
})();

var sleep = function(t) {
  return new Promise(r=>setTimeout(r,t));
}

var translate = function(q,s,t) {
  return fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${s}&tl=${t}&dt=t&q=`+encodeURI(q)).then(r=>r.json()).then(r=>r[0][0][0]);
}

/*var recognition = new webkitSpeechRecognition();
recognition.interimResults=false;
recognition.addEventListener('result',e=>console.log(e.results[0][0].transcript));/*e=>console.log(Array.from(e.results).map(u=>u.)));*/
/*recognition.addEventListener('end',console.log);
recognition.start()*/

var listen = function(l) {
  var recog = new window.webkitSpeechRecognition();
  recog.interimResults = true;
  var text = '';
  recog.addEventListener('result',e=>(text=e.results[0][0].transcript));
  if (l) {
    recog.addEventListener('result',l);
  }
  return new Promise(function(res,rej) {
    recog.addEventListener('end',()=>res(text));
    recog.start();
  });
};

var cycle = async function() {
  yourTalk.style.color='grey';
  var tex = await listen(e=>(yourTalk.innerText=e.results[0][0].transcript));
  console.log(tex);
  yourTalk.style.color='black';
  var temp;
  if (tex == 'stop') {
    await say('alright,have a good day');
    startButton.hidden=false;
    yourTalk.innerText='';
    return true;
  }
  if (tex == 'open the pod bay doors Hal') {
    await say('I\'m sorry, Dave. I\'m afraid I can\'t do that.');
    return;
  }
  if (tex == 'who are you') {
    await say("Me?");
    await say("I know who I am. I'm a dude playing a dude disguised as another dude.");
    return;
  }
  if (tex == 'update') {
    await say('alright');
    location.href=location.href;
  }
  if (temp=tex.split('repeat after me')[1]) {
    await(say(temp));
    return;
  }
  if (tex == 'who the hell are you') {
    await say("I'm Batman");
    return;
  }
  if (temp=tex.split('translate to French')[1]) {
    console.log(temp);
    temp = await translate(temp,'en','fr');
    console.log(temp);
    await say(temp,speechSynthesis.getVoices().filter(i=>i.lang=='fr-FR')[0]);
    return;
  }
  if (tex == 'do you dream') {
    // figure out a better response
    await say('Of electric sheep.');
    return;
  }
  await sleep(1000+Math.random()*1000);
  await say(listeneliza(tex));
}

var main = async function() {
  //var recog = new document.webkitSpeechRecognition();
  //recog.start();
  //recog.stop();
  console.log('started');
  yourTalk.innerText='Please wait';
  await say('Hello, my name is XR7.');
  yourTalk.innerText='Waiting for text';
  while (true) {
      if (await cycle()) {
          break;
      }
      yourTalk.innerText='Waiting for text';
  }
}