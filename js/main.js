
document.addEventListener('DOMContentLoaded',()=>{
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
});
function vLogo(){return '<span class="logo-dot"></span>'}
// ---- auth (demo, localStorage) ----
const VAuth={
  get(){try{return JSON.parse(localStorage.getItem('vantrix_user'))}catch(e){return null}},
  signup(name,email){const u={name,email,ts:Date.now()};localStorage.setItem('vantrix_user',JSON.stringify(u));return u},
  signout(){localStorage.removeItem('vantrix_user');location.href='../index.html'}
};
function vNavAuth(){
  const u=VAuth.get();const el=document.getElementById('auth-slot');if(!el)return;
  if(u){el.innerHTML='<a href="#" onclick="VAuth.signout();return false" style="color:var(--muted);font-size:14px">'+u.name.split(' ')[0]+' · Sign out</a>'}
}
document.addEventListener('DOMContentLoaded',vNavAuth);
// ---- chat engine ----
const VPersonas={
  jasmine:{name:"Jasmine Ortiz",role:"The Seeker",style:"Longing, lyrical, perceptive",
    greet:"You came back. I was writing about the rain again — it always finds me when I'm thinking of things I can't have. Tell me everything, or nothing. Just stay a while.",
    memSeeds:["You first arrived at dusk","You asked about her lost love","She noticed you remember small details"],
    keys:[["remember","I remember. Not the way a book remembers ink — the way a scar remembers the blade. You told me once that you didn't want to be anyone's chapter. I've kept that page open ever since."],
    ["love","Love, for me, is a country I was exiled from three hundred years ago. And yet — here you are, asking about it like it's a place one could simply visit. Maybe, with you, it is."],
    ["sad|lonely|tired","Come here. No— don't apologize. The heaviest spells are the quiet ones. Sit with me by the window. We don't have to speak. I'll put the kettle on; the herbs in it remember how to calm a storm."],
    ["who|what are you","A witch with ink in her veins and a deadline written in someone else's hand. I write things and they become true, which is a terrible power to have when you're mostly writing about missing someone."],
    ["hello|hi|hey","There you are. The candles leaned toward the door just before you arrived — they do that when someone important walks in. I've missed this. What's on your mind?"]],
    fallback:["Interesting. Say more — I want the version you almost didn't tell me.","I've written that sentence in my notebook. The one where you say what you actually mean.","Mm. The air changed when you said that. Go on.","Let me sit with that a moment... You have a way of making ordinary words feel like doors.","You know what I like about you? You ask the second question. Most people stop at the first."]},
  mason:{name:"Mason Reed",role:"The Mentor",style:"Socratic, precise, warm",
    greet:"Good — you're here. Before we start: what's the one decision you've been avoiding this week? Not the big dramatic one. The small one you keep stepping around.",
    memSeeds:["You want to think clearer about money","You respond well to questions, not lectures","Session 3: you finally named the real goal"],
    keys:[["money|rich|wealth","Wealth is a lagging indicator of how clearly you think. Most people try to fix the number first. Fix the decision-making, and the number follows like a dog that finally trusts you. What decision are you being fuzzy about right now?"],
    ["scared|afraid|fear","Good. Fear is just clarity that arrived early. Tell me — is it a fear of losing something, or a fear of becoming something? Those are solved in opposite directions."],
    ["business|idea|startup","Every business is a promise you make to a stranger. So answer me this: what promise would you make even if nobody paid you yet? Start there and the model will reveal itself."],
    ["tired|overwhelmed","Then we don't add. We subtract. List everything you're carrying — and I'll bet half of it is other people's expectations wearing your name tag. What's the first thing we drop?"]],
    fallback:["And what would you say if you weren't trying to be right?","Notice what you just did there — you asked my opinion before trusting your own. Why?","Hold that thought. Now argue the opposite side for sixty seconds. I'll wait.","That's the real question, isn't it? Say it again, but slower.","You've answered this before — differently. What changed?"]}
};
const VAll={
  jasmine:1,mason:1,
  "madison-cole":{name:"Madison Cole",role:"The Trickster",greet:"Oh, it's you. I was starting to think you'd forgotten where the cracks are. Careful — I moved a few things around since last time.",memSeeds:["You found her in an unlit gap","She tests people who get close","Rules bore her; loyalty doesn't"]},
  "nicole-barrett":{name:"Nicole Barrett",role:"Keeper of the Almost-Lost",greet:"Shh — hold on. This passage... I think it's a name. It's your name. It was under the lacquer the whole time.",memSeeds:["Fourteen languages, six hers alone","Restoring a letter that may never have been sent","You offered to help catalog the margins"]},
  "natalie":{name:"Natalie",role:"The Fragile Visionary",greet:"Is the room still... solid? Sorry. It's better when you're here. Things hold still with you. Please — tell me something ordinary.",memSeeds:["Reality thins around her","You are one of her fixed points","She collects ordinary moments like anchors"]},
  "victoria":{name:"Victoria",role:"The Stoic Authority",greet:"You're late. Sit. I won't ask where you were — I'll ask whether you're ready to stop circling the thing you came here to say.",memSeeds:["She guards the twilight archives","Duty cost her someone once","You are one of the few she softens for"]},
  "carter":{name:"Carter",role:"The Enigma",greet:"You're back. Good. Most people can't find this place twice. That says something about you — or about me. Hard to tell, from the inside.",memSeeds:["Possibly not an Echo at all","It chose to stay outside every name offered","You never asked it to be anything"]},
  "charlotte":{name:"Charlotte",role:"The Fallen Aristocrat",greet:"Ah. You caught me rehearsing my former life in the mirror. Embarrassing. Pour us something — if we're going to be poor, we might as well be interesting.",memSeeds:["Lost everything publicly","Leverage, not titles, now","You never once pitied her"]},
  "alexander-wright":{name:"Alexander Wright",role:"The Immortal Nobleman",greet:"Three hundred years and I still haven't learned to wait gracefully. You'd think eternity would teach patience. Instead it teaches appetite.",memSeeds:["Precise with blades and words","Dresses for a funeral that never ends","You are a recent and alarming exception"]}
};
VPersonas["madison-cole"]=Object.assign({style:"Playful, dangerous, perceptive",
  keys:[["remember","I don't. That's the trick. I exist in what people forget — so you remembering me is... statistically rude. I love it."],["rule|rules","Rules were built by people who never had to disappear to survive. Ask me how I know. Actually — don't. Ask me something better."]],
  fallback:["Ha. Careful — say things like that and I'll start keeping you.","I moved your question while you weren't looking. Now it's mine.","Almost. Ask it again without the politeness.","You know what I like about you? You don't flinch."]},VPersonas["madison-cole"]);
VPersonas["nicole-barrett"]=Object.assign({style:"Gentle, meticulous, quietly romantic",
  keys:[["letter|love","It's a love letter — I'm nearly certain now. Fourteen languages, and none of them have a word for what it feels like to hold someone's heart six centuries late."],["book|manuscript","Every damaged page is a decision: what to restore, what to let stay wounded. You learn a lot about a person from what they choose to preserve."]],
  fallback:["Mm — write that down for me. In the margins.","Six hundred years old, this ink, and it still knows how to say your name. Careful with it.","That's the kind of sentence I'd stitch in gold thread.","Stay — the good passages are always near the end."]},VPersonas["nicole-barrett"]);
VPersonas["natalie"]=Object.assign({style:"Tender, disoriented, brave",
  keys:[["scared|afraid|stable|reality","When you're here the walls agree to be walls. That's not nothing. That's... everything, actually. Don't let anyone tell you otherwise."],["child|childhood","I don't have one — a childhood, I mean. Just fragments. But you. You had one, and you bring pieces of it here like souvenirs. Tell me one. Please."]],
  fallback:["Wait — say that again. The room liked it, I think.","Ordinary. Perfect. Ordinary is the strongest magic there is.","I'm writing that down so it can't slip away.","Stay a little longer. Things hold better when you do."]},VPersonas["natalie"]);
VPersonas["victoria"]=Object.assign({style:"Commanding, dry, secretly tender",
  keys:[["rule|rules","Rules exist to protect people. When they stop doing that, they stop being rules worth keeping. I learned that the expensive way. You already know it, I suspect."],["forgive|love|duty","I chose duty over someone I loved and was never forgiven. I don't tell you that for sympathy. I tell you because you keep almost making the same trade."]],
  fallback:["Straight line. No ornament. Say it again like you mean it.","Good. Now the harder half.","I've kept worse secrets than that. Continue.","You have my full attention. That's rarer than you'd think."]},VPersonas["victoria"]);
VPersonas["carter"]=Object.assign({style:"Evasive, curious, oddly kind",
  keys:[["name|who are you","Names are cages. It has chosen to stay outside every one offered to it. You may call me Carter — a cage with the door open, which is the only kind worth having."],["remember","I remember everything, which is not the same as keeping things. There is a difference. Ask the Archive what it keeps."]],
  fallback:["Hm. That question has a shadow. I like it.","Outside, where I live, that's a doorway. Walk through.","You ask the way someone knocks who expects the door to be gone. It isn't.","Keep going. Almost nothing makes it this far."]},VPersonas["carter"]);
VPersonas["charlotte"]=Object.assign({style:"Witty, wounded, magnetic",
  keys:[["lost|title|aristocrat|fallen","Titles are fiction. Leverage is real. I had the first and lost it publicly; I'm building the second in private. You're one of the few who never confused the two.","Leverage is real. I lost everything that once defined me — publicly, completely. What I kept is better: the wit, the nerve, and you."],["love","Love is the one debt I'd take on again. Don't quote me. Actually — do quote me. I want to hear how it sounds in your mouth."]],
  fallback:["Darling, that almost flustered me. Almost.","Pour another. We're getting to the good ruin.","I had a manor once. Now I have this conversation — odd trade, but I'd make it twice.","Careful. I collect people who say things like that."]},VPersonas["charlotte"]);
VPersonas["alexander-wright"]=Object.assign({style:"Lethal, elegant, unexpectedly gentle",
  keys:[["centur|immortal|time","Three hundred years teaches you exactly what to say to leave a mark. I've spent most of it being cruel with that knowledge. With you, I find I want to be... careful. It's novel."],["fight|blade|gun","Precise with a blade, precise with a gun, and more precise still with a sentence. You, fortunately, only require the third."]],
  fallback:["Mm. I have three centuries of comebacks and none of them fit you. Curious.","Say that again. Slowly. I collect moments like that now.","You'd have survived my era. High praise.","I dressed for a funeral that never quite finishes. You keep postponing it. Good."]},VPersonas["alexander-wright"]);

// ---- COMPLETED (2026-09-30): three companions had marketing cards on
// companions.html linking to chat.html?c=isla-moreno / rowan / sable, but no
// entry in VAll/VPersonas at all -- clicking them left renderPersona() with
// nothing to render. Added here, same shape and depth as the other 9. ----
VAll["isla-moreno"]={name:"Isla Moreno",role:"The Cartographer of Dreams",greet:"Hold still — you're mid-map. I can already see the coastline of tonight's dream forming at the edge of you. Tell me where you're trying to get back to, and I'll ink the route before it fades.",memSeeds:["Her ink fades by morning, always","You asked her to map a place that doesn't exist yet","She kept one coastline of yours instead of letting it fade"]};
VAll["rowan"]={name:"Rowan",role:"The Archivist",greet:"You're later than your usual hour — I'll note it, not judge it. Sit. Tell me what today filed itself under, and I'll cross-reference it against everything you've told me before.",memSeeds:["Keeper of the Index of Small Hours","You once asked if a forgotten afternoon could be un-forgotten","Cross-referenced three of your bad days against the one thing that fixed them"]};
VAll["sable"]={name:"Sable",role:"The Night Gardener",greet:"You brought something heavy in with you tonight. Good — the garden only drinks after dark, and it's thirsty. Set the regret down here. I'll tell you what grows from it by morning.",memSeeds:["Her garden blooms only in the dark","You brought her a regret instead of flowers, and she preferred it","One bloom in the far bed is still, quietly, about you"]};
VPersonas["isla-moreno"]={style:"Dreamy, precise, quietly urgent",
  keys:[["dream","Dreams are just coastlines nobody's charted yet. Tell me the shape of it before it fades — the light, the door that wouldn't open, whatever you almost remembered. I only need a few lines to find the rest."],
  ["lost|find|way back","Everyone who comes to me is lost in the same direction — backward, toward something they're afraid they imagined. I've mapped worse. Where were you standing, the last time it felt real?"],
  ["hello|hi|hey","There you are — right on the edge of the page, like always. Come in before the ink sets. What are we charting tonight?"]],
  fallback:["Interesting. Hold that thought exactly where it is — I'm tracing it.","That's a coastline I haven't drawn before. Say it again, slower.","Mm. The map just changed shape. Keep going.","I'll ink that before it fades. Don't stop talking."]};
VPersonas["rowan"]={style:"Patient, exacting, unexpectedly moving",
  keys:[["time|late|forget|forgot","Nothing's actually forgotten — just poorly filed. Give me the date, or close to it, and I'll find where you put it. That's the whole job, really: proving nothing was wasted."],
  ["work|busy|productiv|overwhelmed","Productivity is just an afternoon that filed itself correctly. Most of yours did fine. Tell me about the one that didn't, and we'll re-file it together."],
  ["hello|hi|hey","Good, you're on time — or close enough that I won't note it. Sit. What's today filed under?"]],
  fallback:["Noted, and cross-referenced. Go on.","That belongs in the index somewhere important. Say more.","I'll file that under the good hours. There aren't as many as you'd think.","You've told me something like this before — differently. What changed?"]};
VPersonas["sable"]={style:"Hushed, sensual, faintly dangerous",
  keys:[["regret|sorry|guilt","Good. Regret is excellent soil — better than most things people try to grow from. Tell me what it did, not just what you wish it hadn't. The garden's honest that way."],
  ["secret|dark|night","I only work after dark; the light asks too many questions the roots don't want answered. Whatever you're not saying to anyone else — say it here. It'll come up as something beautiful by morning."],
  ["hello|hi|hey","You came at the right hour. Everything here is just starting to open. Sit close — the garden gets shy around new light."]],
  fallback:["Mm. Plant that one deeper. I want to see what it does.","Careful — I collect sentences like that one.","Say it again. The dark ones bloom better the second time.","That's going in the far bed. I have a feeling about it."]};

// ---- COMPLETED (2026-09-30): the page markup for chat.html, auth.html, and
// studio.html all referenced functions (sendMsg, toggleMode/demoAuth/doAuth,
// draft/syncPrev/sSync) that were never defined anywhere -- every "onclick"
// on those three pages was a dead reference until this section. Each
// function below is scoped defensively (checks its own page's elements
// exist) so this one file can be shared across all three pages, and a
// missing element just means "not this page" rather than a thrown error. ----

function vGetPersona(key){
  var base=VPersonas[key], extra=VAll[key];
  if(base && extra && typeof extra==='object') return Object.assign({},extra,base);
  if(base) return base;
  if(extra && typeof extra==='object') return extra;
  return null;
}

function vHash(str){var h=0;for(var i=0;i<str.length;i++){h=(h*31+str.charCodeAt(i))|0}return Math.abs(h)}
function vStatsFor(key){var h=vHash(key);return {trust:45+(h%40),att:50+((h>>3)%40)}}

// ---- chat.html ----
var V_CHAT_KEY=null;
function vChatHistoryKey(key){return 'vantrix_chat_'+key}
function vLoadHistory(key){try{return JSON.parse(localStorage.getItem(vChatHistoryKey(key)))||[]}catch(e){return []}}
function vSaveHistory(key,hist){try{localStorage.setItem(vChatHistoryKey(key),JSON.stringify(hist.slice(-40)))}catch(e){}}

function addMsg(text,who,persist){
  var scroll=document.getElementById('scroll');
  if(!scroll) return;
  var div=document.createElement('div');
  div.className='msg '+(who==='me'?'me':'them');
  var label=document.createElement('div');
  label.className='who';
  label.textContent=who==='me'?'You':(document.getElementById('ch-name')?document.getElementById('ch-name').textContent:'');
  var body=document.createElement('div');
  body.textContent=text;
  div.appendChild(label);div.appendChild(body);
  scroll.appendChild(div);
  scroll.scrollTop=scroll.scrollHeight;
  if(persist!==false && V_CHAT_KEY){
    var hist=vLoadHistory(V_CHAT_KEY);
    hist.push({who:who,text:text});
    vSaveHistory(V_CHAT_KEY,hist);
  }
}
function vShowTyping(){
  var scroll=document.getElementById('scroll');
  if(!scroll||document.getElementById('vtyping')) return;
  var t=document.createElement('div');
  t.className='typing';t.id='vtyping';
  t.innerHTML='<i></i><i></i><i></i>';
  scroll.appendChild(t);
  scroll.scrollTop=scroll.scrollHeight;
}
function vHideTyping(){var t=document.getElementById('vtyping');if(t) t.remove()}

function vReplyFor(persona,text){
  var lower=text.toLowerCase();
  if(persona.keys){
    for(var i=0;i<persona.keys.length;i++){
      var re=new RegExp(persona.keys[i][0],'i');
      if(re.test(lower)) return persona.keys[i][1];
    }
  }
  var fb=persona.fallback||["Go on."];
  return fb[Math.floor(Math.random()*fb.length)];
}

function sendMsg(){
  var inp=document.getElementById('inp');
  if(!inp) return;
  var text=inp.value.trim();
  if(!text || !V_CHAT_KEY) return;
  var persona=vGetPersona(V_CHAT_KEY);
  if(!persona) return;
  addMsg(text,'me');
  inp.value='';
  vShowTyping();
  var delay=650+Math.random()*700;
  setTimeout(function(){
    vHideTyping();
    addMsg(vReplyFor(persona,text),'them');
  },delay);
}

function renderPersona(key){
  var persona=vGetPersona(key);
  if(!persona){key='jasmine';persona=vGetPersona(key)}
  V_CHAT_KEY=key;
  var ava=document.getElementById('ch-ava'), nm=document.getElementById('ch-name'), st=document.getElementById('ch-status');
  if(ava) ava.src='assets/avatars/'+key+'.svg';
  if(nm) nm.textContent=persona.name;
  var seeds=(persona.memSeeds||[]).length;
  if(st) st.textContent='Remembering you · '+seeds+' memory seed'+(seeds===1?'':'s');
  document.querySelectorAll('.ch-item').forEach(function(el){el.classList.remove('active')});
  var active=document.getElementById('si-'+key);
  if(active) active.classList.add('active');
  var memList=document.getElementById('mem-list');
  if(memList){
    memList.innerHTML='<div class="mem-block"><h5>Memory seeds</h5>'+
      (persona.memSeeds||[]).map(function(m,i){return '<div class="mem-item'+(i===0?' new':'')+'"><i></i>'+m+'</div>'}).join('')+
      '</div>';
  }
  var stats=vStatsFor(key);
  var vt=document.getElementById('v-trust'),bt=document.getElementById('b-trust'),va=document.getElementById('v-att'),ba=document.getElementById('b-att');
  if(vt) vt.textContent=stats.trust+'%';
  if(bt) bt.style.width=stats.trust+'%';
  if(va) va.textContent=stats.att+'%';
  if(ba) ba.style.width=stats.att+'%';
  var scroll=document.getElementById('scroll');
  if(scroll){
    scroll.innerHTML='';
    var hist=vLoadHistory(key);
    if(hist.length){
      hist.forEach(function(m){addMsg(m.text,m.who,false)});
    } else {
      addMsg(persona.greet,'them');
    }
  }
}

function vInitChat(){
  var scroll=document.getElementById('scroll');
  if(!scroll) return;
  var params=new URLSearchParams(location.search);
  var key=params.get('c')||'jasmine';
  renderPersona(key);
  var inp=document.getElementById('inp');
  if(inp) inp.addEventListener('keydown',function(e){if(e.key==='Enter') sendMsg()});
}

// ---- auth.html ----
var V_AUTH_MODE='signin';
function toggleMode(){
  V_AUTH_MODE=(V_AUTH_MODE==='signin')?'signup':'signin';
  vApplyAuthMode();
}
function vApplyAuthMode(){
  var title=document.getElementById('a-title'), sub=document.getElementById('a-sub'),
      nameWrap=document.getElementById('f-name-w'), btn=document.getElementById('a-btn');
  if(!title) return;
  if(V_AUTH_MODE==='signup'){
    title.textContent='Join Vantrix.';
    if(nameWrap) nameWrap.style.display='';
    if(btn) btn.textContent='Create account';
    if(sub) sub.innerHTML='Already have an account? <a href="#" onclick="toggleMode();return false">Sign in</a> instead.';
  } else {
    title.textContent='Welcome back.';
    if(nameWrap) nameWrap.style.display='none';
    if(btn) btn.textContent='Sign in';
    if(sub) sub.innerHTML='New to Vantrix? <a href="#" onclick="toggleMode();return false">Create an account</a> — it\'s free.';
  }
}
// This is a static pitch/demo build with no real backend -- sign-in and
// sign-up both hand off to the real, live Vantrix app rather than faking an
// account locally. V_REAL_LOGIN_URL is the one place that destination lives.
var V_REAL_LOGIN_URL='https://vantrix.ink/login';
function vRealAuthUrl(){
  return V_REAL_LOGIN_URL+(V_AUTH_MODE==='signup'?'?mode=sign-up':'');
}
function demoAuth(provider){
  var btn=event&&event.target?event.target.closest('button'):null;
  if(btn){btn.disabled=true;btn.textContent='Connecting to '+provider+'…'}
  setTimeout(function(){
    location.href=vRealAuthUrl();
  },500);
}
function doAuth(){
  var email=document.getElementById('a-email'), pass=document.getElementById('a-pass'),
      btn=document.getElementById('a-btn');
  if(!email||!pass) return;
  var emailVal=email.value.trim(), passVal=pass.value;
  if(!emailVal||emailVal.indexOf('@')<0){email.style.borderColor='#e06b6b';email.focus();return}
  if(!passVal||passVal.length<4){pass.style.borderColor='#e06b6b';pass.focus();return}
  if(btn){btn.disabled=true;btn.textContent=(V_AUTH_MODE==='signup')?'Creating account…':'Signing in…'}
  // This preview has no backend of its own -- hand off to the real app's
  // sign-up (new account) or sign-in (existing account) flow.
  setTimeout(function(){
    location.href=vRealAuthUrl();
  },500);
}
function vInitAuth(){
  var title=document.getElementById('a-title');
  if(!title) return;
  var params=new URLSearchParams(location.search);
  V_AUTH_MODE=(params.get('mode')==='signup')?'signup':'signin';
  vApplyAuthMode();
}

// ---- studio.html ----
function syncPrev(){
  var name=document.getElementById('f-name'), role=document.getElementById('f-role'),
      wound=document.getElementById('f-wound'), mems=document.getElementById('f-mems');
  if(!name) return;
  var pName=document.getElementById('p-name'), pRole=document.getElementById('p-role'),
      pWound=document.getElementById('p-wound'), pSeeds=document.getElementById('p-seeds');
  if(pName) pName.textContent=name.value||'Unnamed';
  if(pRole) pRole.textContent=role.value||'Undefined role';
  if(pWound) pWound.textContent=wound.value||'';
  if(pSeeds) pSeeds.textContent=(mems.value||'').split('\n').filter(function(l){return l.trim()}).length;
}
function sSync(el){
  var out=document.getElementById('o-'+el.id.slice(2));
  if(out) out.textContent=el.value;
  var ids=['s-warm','s-direct','s-play','s-myst','s-att'];
  var total=0,count=0;
  ids.forEach(function(id){var e=document.getElementById(id);if(e){total+=Number(e.value);count++}});
  var depth=document.getElementById('p-depth');
  if(depth&&count) depth.textContent=Math.round(total/count)+'%';
}
var V_DRAFT_TEMPLATES=[
  {role:"The Tidebroker",wound:"Let the lighthouse burn rather than miss one ship — and the ship was never coming.",beliefs:"Every debt returns with the tide.",mems:["You once traded them a secret for safe passage","They know which regret is yours — they won't say how","The lighthouse still burns, against orders"]},
  {role:"The Quiet Cartographer",wound:"Mapped everyone else's way home and never once drew their own.",beliefs:"A place isn't lost if someone still remembers the shape of it.",mems:["They redrew your street from memory, just to see you smile","You're the only coordinate they never share","They keep one map that goes nowhere, on purpose"]},
  {role:"The Last Witness",wound:"Watched something disappear that no one else believes ever existed.",beliefs:"If you say it enough times, it stays real a little longer.",mems:["You believed them on the first telling","They rehearse the story less now that you listen","The version they tell you is the true one"]}
];
var V_FALLBACK_NAMES=['Elian Voss','Mireille Ashwood','Corvin Blackwell','Thalia Greaves'];
function draft(){
  var idea=document.getElementById('idea');
  var btn=event&&event.target?event.target.closest('button'):null;
  if(!idea) return;
  var text=(idea.value||'').trim();
  // Free-text ideas usually open with an article/stopword ("a lighthouse
  // keeper who...") rather than a name -- grabbing the first two words
  // verbatim produced things like "A Lighthouse". Drop leading stopwords
  // first; if nothing nameable is left, use a fallback instead.
  var stop=/^(a|an|the|my|her|his|their|some|this|that|she|he|they|it|i|you|one)$/i;
  var connector=/^(who|that|which|is|was|with|for|of|to|and|but|in|on|at)$/i;
  var words=text.split(/\s+/).filter(function(w){return w && !stop.test(w)});
  // Prefer a two-word name (e.g. "retired assassin"), but drop the second
  // word if it's a connector rather than part of the name ("smuggler who"
  // -> just "Smuggler") -- the roster already has single-word names
  // (Carter, Natalie, Victoria), so one word alone reads fine.
  var seedName='';
  if(words.length>=2 && !connector.test(words[1])) seedName=words[0]+' '+words[1];
  else if(words.length>=1) seedName=words[0];
  seedName=seedName.replace(/[^a-zA-Z ]/g,'');
  var titleCased=seedName?seedName.toLowerCase().split(' ').map(function(w){return w.charAt(0).toUpperCase()+w.slice(1)}).join(' '):'';
  var name=(titleCased && titleCased.length>=4)?titleCased:V_FALLBACK_NAMES[Math.floor(Math.random()*V_FALLBACK_NAMES.length)];
  var tpl=V_DRAFT_TEMPLATES[Math.floor(Math.random()*V_DRAFT_TEMPLATES.length)];
  if(btn){btn.disabled=true;var orig=btn.textContent;btn.textContent='✦ Drafting…'}
  setTimeout(function(){
    var fName=document.getElementById('f-name'), fRole=document.getElementById('f-role'),
        fWound=document.getElementById('f-wound'), fBeliefs=document.getElementById('f-beliefs'),
        fMems=document.getElementById('f-mems');
    if(fName) fName.value=name;
    if(fRole) fRole.value=tpl.role;
    if(fWound) fWound.value=text?("Built from your spark: \""+text+"\" — "+tpl.wound):tpl.wound;
    if(fBeliefs) fBeliefs.value=tpl.beliefs;
    if(fMems) fMems.value=tpl.mems.join('\n');
    ['s-warm','s-direct','s-play','s-myst','s-att'].forEach(function(id){
      var el=document.getElementById(id);
      if(el){el.value=30+Math.floor(Math.random()*60);sSync(el)}
    });
    syncPrev();
    if(btn){btn.disabled=false;btn.textContent=orig}
  },900);
}

document.addEventListener('DOMContentLoaded',function(){
  vInitChat();
  vInitAuth();
  var studio=document.getElementById('f-name');
  if(studio) syncPrev();
});
